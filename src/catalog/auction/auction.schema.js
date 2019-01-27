import Auction   from './auction.model';
import Article   from '../article/article.model';
import Categorykey   from '../category-key/category-key.model';

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
    model: Article
    category_key: String
    category: Categorykey
    priceStart: String
    amountAdded: String
    currentPrice: String
    startDate: String
    endDate: String
    minNumberParticipants: Int
    status: Int
    closed: Int
    created_at: String
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
}
  # Extending the root Mutation type.
  extend type Mutation {
    addAuction(input: AuctionInput!): Auction
    editAuction(id: String!, input: AuctionInput!): Auction
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
      filterflied.endDate =  { $gt : new Date() } 
      const auctions = await Auction.find(filterflied);
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
      const auctions = await Auction.find(filterflied);
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
      const auction  = await Auction.findByIdAndUpdate(id, input);
      return auction;
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
     
    
       }
  }
  
