import Bid        from './bid.model';
import Auction       from '../../catalog/auction/auction.model';
import Article       from '../../catalog/article/article.model';
import Participation       from '../participation/participation.model';
// import config
import config from '../../../settings/config';
import { sendMail } from '../../../settings/mailling';
import { errorName } from '../../../settings/errors';
import { tryAddBid } from '../methods/order.method';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const BidTypeDefs = `

  type Bid {
    id: ID!
    auction_id: String
    price: String
    auction: Auction
    participation_id: String
    participation: Participation
    created_at: String
    # Last name is not a required field so it
    # does not need a "!" at the end.
  }
  input BidFilterInput {
    limit: Int
    skip: Int
  }

  input BidFilterField {
    archived: Boolean
    auction_id: String
  }
  # Extending the root Query type.
  extend type Query {
    bids(filterfield:BidFilterField, filter: BidFilterInput): [Bid]
    bid(id: String!): Bid
    countBids(filterfield:BidFilterField,): Int

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addBid" and "editBid" methods.
  input BidInput {
    auction_id: String
    price: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addBid(input: BidInput!): Bid
    editBid(id: String!, input: BidInput!): Bid
    deleteBid(id: String!): Bid
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const bidResolvers = {
  Query: {
    bids: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const bids = await Bid.find(filterfield, null, filter).sort({created_at:-1});

        return bids;
      }catch(err){
        return null
      }

    },
    bid: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const bid  = await Bid.findById(id);
        return bid?bid:null;
      }{
        return null
      }

    },
    countBids: async (_, { filterfield= {}}, context) => {
      const count = await Bid.countDocuments(filterfield);
      return count;
    },
  },
  Mutation: {
    addBid: async (_, { input }, context) => {
      let token ;
      let decoded;

      try {
          token       = context.headers.authorization;
          decoded     = jwt.verify(token, config.token.secret_client);
      } catch (error) {
        throw new Error(errorName.UNAUTHORIZED);
      }
        const participation       = await tryAddBid(decoded.id, input.auction_id);
        const countParticipations = await Participation.countDocuments({auction_id: input.auction_id, archived: false});

         
        if(participation){
            let auction      = await Auction.findOne({_id: input.auction_id, startDate: { $lt : new Date() } ,endDate : { $gt : new Date() }});
            if(auction){
               
                // CHECK IF NUMBER OF PARTICIPANTS IS SUFFICIENT
                if(auction.minNumberParticipants > countParticipations)
                    throw new Error(errorName.TRYADD_BID_INSUFFICIENT_NUMBER_OF_PARTICIPANTS);

                const article    = await Article.findById(auction.model_id);
                let currentPrice = (!auction.currentPrice ||  isNaN(auction.currentPrice))?0:parseFloat(auction.currentPrice);
                let priceStart   = (!auction.priceStart ||  isNaN(auction.priceStart))?0:parseFloat(auction.priceStart);
                    currentPrice = ( currentPrice == 0 )?priceStart:currentPrice;
                let amountAdded  = (!auction.amountAdded ||  isNaN(auction.amountAdded))?0:parseFloat(auction.amountAdded);
                
                 if( article && (currentPrice+amountAdded) < parseFloat(article.sellingPrice) ){
                      auction.currentPrice = `${currentPrice+amountAdded}`;
                      auction.client_id    =  decoded.id;
                      auction.updated_at   = new Date();
                      // NEED TO INJECT A PUSH NOTIFICATION
                      await auction.save();
                      //
                      const bid = await Bid.create({ 
                                                    participation_id: participation._id,
                                                    auction_id: input.auction_id,  
                                                    price: auction.currentPrice
                                                  });
                return bid;
                 }else{
                     throw new Error(errorName.TRYADD_BID_OVERTAKING);
                 }
                
            }else{
                throw new Error(errorName.UNAUTHORIZED);
            }
            
        }else{
            throw new Error(errorName.TRYADD_ACTIONOFAUCTION);
        }
    },
    editBid: async (_, { id, input }, context) => {

          return null;
    },
    deleteBid: async (_, { id }) => {

        const res = await Bid.findByIdAndUpdate(id, { archived: true});
        return res ? res : null;
    },
},
Bid: {
  participation: async(bid) => {
    if (bid.participation_id && objectID.isValid(bid.participation_id)) {
      const  participation = await Participation.findById(bid.participation_id);
      return participation?participation:null
    }
    return null;
  }
}
}
