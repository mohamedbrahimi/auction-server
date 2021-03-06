import Auction   from './auction.model';
import Article   from '../article/article.model';
import Category  from '../category/category.model';
import Categorykey   from '../category-key/category-key.model';
import Client from '../../mazaduse/client/client.model';
import Bid from '../../mazaduse/bid/bid.model';
import Order from '../../mazaduse/order/order.model';
import Participation from '../../mazaduse/participation/participation.model';
import __ from 'lodash'
import jwt from 'jsonwebtoken';
import config from '../../../settings/config';
import { errorName } from '../../../settings/errors';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const AuctionTypeDefs = `

  type Auction {
    id: ID!
    model_id: String
    client_id: String
    model: Article
    bids: [Bid]
    client: Client
    bid: Bid
    category_key: String
    category: Categorykey
    priceStart: String
    amountAdded: String
    currentPrice: String
    startDate: String
    endDate: String
    minNumberParticipants: Int
    countParticipations: Int
    status: Int
    archived: Boolean
    closed: Int
    created_at: String
    updated_at: String
  }

  input AuctionFilterInput {
    limit: Int
    skip: Int
  }

  input AuctionFilterField {
    category_key: String
    status: Int
    archived: Boolean
    closed: Int
  }


  # Extending the root Query type.
  extend type Query {
    auctions(filterflied:AuctionFilterField, filter: AuctionFilterInput): [Auction]
    auction(id: String!): Auction
    countAuctions(filterflied:AuctionFilterField): Int

    auctionsFront(filterflied:AuctionFilterField, filterfront: ArticleFilterField, filter: AuctionFilterInput): [Auction]
    countAuctionsFront(filterflied:AuctionFilterField, filterfront: ArticleFilterField): Int
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addAuction" and "editAuction" methods.
  input AuctionInput {
    model_id: String
    category_key: String
    priceStart: String
    amountAdded: String
    currentPrice: String
    startDate: String
    endDate: String
    status: Int
    minNumberParticipants: Int
    bid_id: String  
}
  # Extending the root Mutation type.
  extend type Mutation {
    addAuction(input: AuctionInput!): Auction
    editAuction(id: String!, input: AuctionInput!): Auction
    confirmOffer(id: String!, input: AuctionInput!): Auction
    deleteAuction(id: String!): Auction
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const auctionResolvers = {
  Query: {
    auctions: async (_, { filterflied= {}, filter = {} }, context) => {
      const auctions = await Auction.find(filterflied, null, filter);
      // notice that I have ": any[]" after the "Auctions" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript

      return auctions;
    },
    auction: async (_, { id }) => {
      if(objectID.isValid(id)){
        const auction  = await Auction.findById(id);
        return auction;
      }else
       return null

    },
    countAuctions: async (_, { filterflied= {}}, context) => {
      const count = await Auction.countDocuments(filterflied);
      return count
    },

    auctionsFront: async (_, { filterflied= {}, filterfront= {}, filter = {} }, context) => {
      filterflied.endDate =  { $gt : new Date() };
      if(filterflied.closed && filterflied.closed == 1){
        delete filterflied.endDate
      }
      const auctions = await Auction.find(filterflied);

      // Check if we have a mother category 
      const category = await Category.findById(filterfront.category_id);
      if(category && category.category_mother_id === "---"){
        const category_array = await Category.distinct("_id", {category_mother_id: filterfront.category_id});
        delete filterfront.category_id;
        filterfront = Object.assign(filterfront, { category_id : { $in : category_array } });
      }
      const articles = await Article.find(filterfront);

      

      let array = [];
      await __.forEach(articles, async function(value) {
            let index = await __.findIndex(auctions, { 'model_id': value.id });
            if(index >= 0 ) array.push(auctions[index])
          });
         if(filter.limit && filter.skip)
            return array.slice(filter.skip).slice(0, filter.limit);
            else if(filter.limit)
                    return array.slice(0,filter.limit);
                    else if(filter.skip)
                         return array.slice(filter.skip);
                         else return array;
    },

    countAuctionsFront: async (_, { filterflied= {}, filterfront= {}}, context) => {
      filterflied.endDate =  { $gt : new Date() }
      if(filterflied.closed && filterflied.closed == 1){
        delete filterflied.endDate
      }
      const auctions = await Auction.find(filterflied);

      // Check if we have a mother category 
      const category = await Category.findById(filterfront.category_id);
      if(category && category.category_mother_id === "---"){
        const category_array = await Category.distinct("_id", {category_mother_id: filterfront.category_id});
        delete filterfront.category_id;
        filterfront = Object.assign(filterfront, { category_id : { $in : category_array } });
      }
      
      const articles = await Article.find(filterfront);

      let array = [];
      await __.forEach(articles, async function(value) {
            let index = await __.findIndex(auctions, { 'model_id': value.id });
            if(index >= 0 ) array.push(auctions[index])
          });
      return array.length;
    },


  },
  Mutation: {
    addAuction: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new Auction. can\'t get the jwt object');
        }
        const exist    = await Auction.findOne({ model_id: input.model_id, archived: false, endDate: { $gt : new Date() } });
        if(exist){
          throw new Error(errorName.TRYCREATEAUCTION_DUPLICATEARTICLE);
        }

        const auction  = await Auction.create(input);
        return auction;
    },
    editAuction: async (_, { id, input }) => {
      const exist    = await Auction.findOne({ model_id: input.model_id, archived: false, endDate: { $gt : new Date() } });

       if(exist && exist._id != id){ //
          throw new Error(errorName.TRYCREATEAUCTION_DUPLICATEARTICLE);
        }
      const auction  = await Auction.findByIdAndUpdate(id, Object.assign(input, { closed: 0 }));
      return auction;
    },
    confirmOffer: async (_, { id, input }) => {
    
      const bid           = await Bid.findById(input.bid_id);
      if(bid){
         const participation = await Participation.findById(bid.participation_id);
         if(participation){
           const auction       = await Auction.findOneAndUpdate({ _id: id, closed: 0 }, { bid_id: bid._id, client_id: participation.client_id, closed: 1 });
           if(auction){
            const article       = await Article.findByIdAndUpdate(auction.model_id, { $inc: { quantity: -1 } });
            // PUSH AN ORDER 
 
            const inputOrder = { 
                 type : "AUC",
                 key_id: participation.key_id,
                 category_key: auction.category_key,
                 status: 1,
                 client_id: participation.client_id,
                 article_id: auction.model_id,
                 auction_id: auction._id,
                 unitprice: article.sellingPrice,
                 price: bid.price
             }
           
           const order = await Order.create(inputOrder);
           return auction;
           }else{
            throw new Error(errorName.ERRORSYSTEME);
           }
          
         }else {
          throw new Error(errorName.ERRORSYSTEME);
         }
         
      }else{
        throw new Error(errorName.ERRORSYSTEME);
      }
     
    },
    deleteAuction: async (_, { id }) => {
      const res = await Auction.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },

  },
    Auction: {

     category: async(auction) => {
        if (auction.category_key && objectID.isValid(auction.category_key)) {
            const  c = await Categorykey.findById(auction.category_key);
            return c?c:null
          }
          return null;
     },
     model: async(auction) => {
        if (auction.model_id && objectID.isValid(auction.model_id)) {
            const  c = await Article.findById(auction.model_id);
            return c?c:null
          }
          return null;
     },
     bids: async(auction) => {
      if (auction.id && objectID.isValid(auction.id)) {
          const  bids = await Bid.find({ auction_id: auction.id }, null, { limit: 3}).sort({created_at:-1});
          return bids?bids:null
        }
        return null;
   },
   bid: async(auction) => {
    if (auction.bid_id && objectID.isValid(auction.bid_id)) {
        const  bid = await Bid.findById(auction.bid_id);
        return bid?bid:null
      }
      return null;
  },
  countParticipations:async(auction) => {
    if (auction.id && objectID.isValid(auction.id)) {
        const  count = await Participation.countDocuments({auction_id: auction.id});
        return count
      }else{
        return 0;
      }
  },
   client: async(auction) => {
    if (auction.client_id && objectID.isValid(auction.client_id)) {
        const  client = await Client.findById(auction.client_id);
        return client?client:null
      }
      return null;
 },


       }
  }
