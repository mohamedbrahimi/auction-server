import Order        from './order.model';
import Client       from '../client/client.model';
import Article       from '../../catalog/article/article.model';
import Auction       from '../../catalog/auction/auction.model';
import Categorykey   from '../../catalog/category-key/category-key.model'
import Key          from '../../catalog/key/key.model';
// import config
import config from '../../../settings/config';
import { sendMail } from '../../../settings/mailling';
import { errorName } from '../../../settings/errors';
import { tryaddorder, tryTuUpgradeStatusOrder } from '../methods/order.method';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const OrderTypeDefs = `
 
  type Order {
    id: ID!
    type: String
    key_id: String,
    category_key: String
    status: Int
    client_id:  String
    auction_id: String
    article_id: String
    address_id: String
    note: String
    price: String
    unitprice: String
    quantity: Int
    last_update: String
    created_at: String
    client: Client
    key: Key
    article: Article
    auction: Auction
    category: Categorykey

    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input OrderFilterInput {
    limit: Int
    skip: Int
  }

  input OrderFilterField { 
    type: String
    archived: Boolean
    category_key: String
    status: Int
    client_id: String
    orders_ids: [String],
    upgrade: Boolean
  }
  # Extending the root Query type.
  extend type Query {
    orders(filterfield:OrderFilterField, filter: OrderFilterInput): [Order]
    order(id: String!): Order
    countOrders(filterfield:OrderFilterField,): Int
    

    orders_front(filterfield:OrderFilterField, filter: OrderFilterInput): [Order]
    countOrders_front(filterfield:OrderFilterField,): Int

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addOrder" and "editOrder" methods.
  input OrderInput {
    type: String
    key_id: String,
    category_key: String
    status: Int
    client_id:  String
    auction_id: String
    article_id: String
    address_id: String
    unitprice: String
    quantity: Int
    note: String
    price: String
    last_update: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addOrder(input: OrderInput!): Order
    editOrder(id: String!, input: OrderInput!): Order
    printOrders(filterfield: OrderFilterField): [Order]
    upgradeOrders(filterfield: OrderFilterField): [Order]
    deleteOrder(id: String!): Order
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const orderResolvers = {
  Query: {
    orders: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const orders = await Order.find(filterfield, null, filter).sort({created_at:-1});
        
        return orders;
      }catch(err){
        return null
      }
     
    },
    order: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const order  = await Order.findById(id);
        return order?order:null;
      }{
        return null
      }
      
    },
    countOrders: async (_, { filterfield= {}}, context) => {
      const count = await Order.countDocuments(filterfield);
      return count;
    },

    orders_front: async (_, { filterfield= {}, filter = {} },context) => {
      try{
        const token       = context.headers.authorization;
        const decoded     = jwt.verify(token, config.token.secret_client);
        const orders = await Order.find(Object.assign({client_id: decoded.id, archived: false},filterfield) , null, filter).sort({created_at:-1});
        
        return orders;
      }catch(err){
        console.log(err)
        return null
    } 
  },
    countOrders_front: async (_, { filterfield= {}}, context) => {
      try {
        const token       = context.headers.authorization;
        const decoded     = jwt.verify(token, config.token.secret_client);
        const count = await Order.countDocuments(Object.assign({client_id: decoded.id, archived: false},filterfield));
        return count;
      } catch (error) {
        return 0;
      }
      
    },
  },
  Mutation: {
    addOrder: async (_, { input }, context) => {
    
      let token ;
      let decoded;
      try {
          token       = context.headers.authorization;
          decoded     = jwt.verify(token, config.token.secret_client);
      } catch (error) {
        throw new Error(errorName.UNAUTHORIZED);
      }
     
      let key = await tryaddorder(decoded.id, input.category_key, input.article_id, input.quantity);
      switch(key){
        case 0  : { throw new Error(errorName.ERRORSYSTEME); }break;
        case -1 : { throw new Error(errorName.TRYADDNEWORDER_NOTHAVEAKEY); }break;
        case -2 : { throw new Error(errorName.TRYADDNEWORDER_INSUFFICIENTQUANTITY); };break;
        default: {
          let article   = await Article.findById(input.article_id);  
          input.type       = "BUY"; 
          input.client_id  = key.client_id;
          input.unitprice  = article.sellingPrice;
          input.price      = article.sellingPrice * input.quantity;
          input.key_id     = key._id;
          const order     = await Order.create(input);
            key.consumed    = 1;
            key.consumed_at = Date.now();
          await key.save();
          
              let qty = article.quantity - input.quantity;
          await Article.findByIdAndUpdate(article._id, { quantity: qty });
          const client = await Client.findById(decoded.id);
          if(client)
          sendMail(client,"addorder");
          return order;
        }break;
      }
       
    },
    editOrder: async (_, { id, input }, context) => {
          // WE CAN EDIT STATUS | QUANTITY
          const order    = await Order.findById(id);
          const quantity = order.quantity - input.quantity;
          const article  = await Article.findById(order.article_id);
          if(article.quantity < (input.quantity - order.quantity) + 1){
            throw new Error(errorName.TRYADDNEWORDER_INSUFFICIENTQUANTITY);
          }else{
                switch(input.status){
                    case -1   : {
                      if (order.status != -1 && order.status != 3){
                          await Article.findByIdAndUpdate(order.article_id, { $inc: { quantity: order.quantity } });
                        if(order.status == 0){
                          await Key.findByIdAndUpdate(order.key_id, { consumed: 0 });
                        }
                        const odr = await Order.findByIdAndUpdate(order._id, { status: -1 });
                        return odr;
                      }else if( order.status == 3){
                        const odr = await Order.findByIdAndUpdate(order._id, { status: -501 });
                        return odr;
                      }
                    } break;
                    case -701 : {
                      if (order.status != -701){
                          await Article.findByIdAndUpdate(order.article_id, { $inc: { quantity: order.quantity } });
                          const odr = await Order.findByIdAndUpdate(order._id, { status: -701 });
                          return odr;
                      }
                    } break;
                    default   : {
                      const status_arr = await tryTuUpgradeStatusOrder(order.status);
                      if(status_arr && input.status != 90){
                        const odr      = await Order.findByIdAndUpdate(order._id, { status: status_arr, quantity: input.quantity });
                        await Article.findByIdAndUpdate(order.article_id, { $inc: { quantity: quantity } });
                        return odr;
                      }
                        else{
                          await Article.findByIdAndUpdate(order.article_id, { $inc: { quantity: quantity } });
                          const odr      = await Order.findByIdAndUpdate(order._id, { quantity: input.quantity });
                          return odr;
                        }
                          
                    } break;
                }
          }
    
          return null;
    },
    printOrders: async(_, { filterfield= {}}, context) => {
         const orderIds = filterfield.orders_ids;
               delete filterfield.orders_ids;
         const upgrade  = filterfield.upgrade;
               delete filterfield.upgrade;
         if(filterfield.status == 1 && upgrade){
          const orders = await Order.find( Object.assign({ _id: { $in : orderIds } }, filterfield) );
          await Order.updateMany(Object.assign({ _id: { $in : orderIds } }, filterfield),     { $set: { status : 2 } });
          return orders;
         }else{
          const orders = await Order.find( Object.assign({ _id: { $in : orderIds } }, filterfield) );
          return orders;
         }
         
    },
    upgradeOrders: async(_, { filterfield= {}}, context) => {
      
      const orderIds = filterfield.orders_ids;
            delete filterfield.orders_ids;
      const status  = await tryTuUpgradeStatusOrder(filterfield.status);
      if(status){
        await Order.updateMany(Object.assign({ _id: { $in : orderIds } }, filterfield),     { $set: { status : status } });
        filterfield.status = status;
        const orders = await Order.find(Object.assign({ _id: { $in : orderIds } }, filterfield))
      if(status == -701 && orders){
        for(let item of orders){
          let article = await Article.findByIdAndUpdate(item.article_id, { $inc: { quantity: item.quantity } })
        }
        return orders;
      }else{
        return orders;
      }
      }else{
        return [];
      }
      
      
      
      
      
      
 },
    deleteOrder: async (_, { id }) => {
        
        const res = await Order.findByIdAndUpdate(id, { archived: true});
        return res ? res : null;
    },
}, 
Order: {
  client: async (order) => {
    if(order && order.client_id){
      const client = await Client.findById(order.client_id);
      return client;
    }else{
      return null
    }
  },
  category: async(order) => {

    if(order && order.category_key){
      const cat = await Categorykey.findById(order.category_key);
      return cat;
    }else{
      return null
    }
  },
  article: async(order) => {

    if(order && order.article_id){
      const article = await Article.findById(order.article_id);
      return article;
    }else{
      return null
    }
  },
  key: async(order) => {

    if(order && order.key_id){
      const key = await Key.findById(order.key_id);
      return key;
    }else{
      return null
    }
  },
}
}
  
