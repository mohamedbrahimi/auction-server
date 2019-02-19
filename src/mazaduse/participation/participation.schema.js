import Participation        from './participation.model';
import Client       from '../client/client.model';
import Auction       from '../../catalog/auction/auction.model';
import Categorykey   from '../../catalog/category-key/category-key.model'
import Key          from '../../catalog/key/key.model';
// import config
import config from '../../../settings/config';
import { sendMail } from '../../../settings/mailling';
import { errorName } from '../../../settings/errors';
import { tryaddParticipation } from '../methods/order.method';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const ParticipationTypeDefs = `

  type Participation {
    id: ID!
    key_id: String,
    category_key: String
    client_id:  String
    auction_id: String
    created_at: String
    client: Client
    key: Key
    auction: Auction
    category: Categorykey

    # Last name is not a required field so it
    # does not need a "!" at the end.
  }
  input ParticipationFilterInput {
    limit: Int
    skip: Int
  }

  input ParticipationFilterField {
    archived: Boolean
    category_key: String
    client_id: String
    auction_id: String
  }
  # Extending the root Query type.
  extend type Query {
    participations(filterfield:ParticipationFilterField, filter: ParticipationFilterInput): [Participation]
    participation(id: String!): Participation
    countParticipations(filterfield:ParticipationFilterField,): Int

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addparticipation" and "editparticipation" methods.
  input ParticipationInput {
    key_id: String,
    category_key: String
    client_id:  String
    auction_id: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addParticipation(input: ParticipationInput!): Participation
    editParticipation(id: String!, input: ParticipationInput!): Participation
    deleteParticipation(id: String!): Participation
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const participationResolvers = {
  Query: {
    participations: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const participations = await Participation.find(filterfield, null, filter).sort({created_at:-1});

        return participations;
      }catch(err){
        return null
      }

    },
    participation: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const participation  = await Participation.findById(id);
        return participation?participation:null;
      }{
        return null
      }

    },
    countParticipations: async (_, { filterfield= {}}, context) => {
      const count = await Participation.countDocuments(filterfield);
      return count;
    },
  },
  Mutation: {
    addParticipation: async (_, { input }, context) => {
      let token ;
      let decoded;

      try {
          token       = context.headers.authorization;
          decoded     = jwt.verify(token, config.token.secret_client);
      } catch (error) {
        throw new Error(errorName.UNAUTHORIZED);
      }
        let key = await tryaddParticipation(decoded.id, input.category_key, input.auction_id);
        switch(key){
          case 0  : { throw new Error(errorName.ERRORSYSTEME); }break;
          case -1 : { throw new Error(errorName.TRYADDPARTICIPATION_NOTHAVEAKEY); }break;
          case -2 : { throw new Error(errorName.TRYADDPARTICIPATION_EXISTSONE); }break;
          default: {

            

            input.client_id  = key.client_id;
            input.key_id     = key._id;

            // CREATE AN PARTICIPATION
            const participation  = await Participation.create(input);
            key.consumed    = 1;
            key.consumed_at = Date.now();

            // CHANGE KEY
            await key.save();
            // SEND MESSAGE TO THE PARTICIPANT
            const client = await Client.findById(decoded.id);
            if(client)
            sendMail(client,"addparticipation");
            return participation;
          }break;
        }




    },
    editParticipation: async (_, { id, input }, context) => {

          return null;
    },
    deleteParticipation: async (_, { id }) => {

        const res = await Participation.findByIdAndUpdate(id, { archived: true});
        return res ? res : null;
    },
},
Participation: {
  client: async (participation) => {
    if(participation && participation.client_id){
      const client = await Client.findById(participation.client_id);
      return client;
    }else{
      return null
    }
  },
  category: async(participation) => {

    if(participation && participation.category_key){
      const cat = await Categorykey.findById(participation.category_key);
      return cat;
    }else{
      return null
    }
  }
}
}
