import Profile from './profile.model';
// import config
import config from '../../../settings/config';
import { errorName } from '../../../settings/errors';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const ProfileTypeDefs = `
 
  type Profile {
    id: ID!
    firstname: String
    lastname: String
    phone_1: String
    phone_2: String
    address: String
    wilaya: String
    commune: String
    status: Int
    created_at: String
    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input ProfileFilterInput {
    limit: Int
    skip: Int
  }

  input ProfileFilterField { 
    status : Int
    client_id: Int
    archived: Boolean
  }
  # Extending the root Query type.
  extend type Query {
    profiles(filterfield:ProfileFilterField, filter: ProfileFilterInput): [Profile]
    profile(id: String!): Profile
    countProfiles(filterfield:ProfileFilterField,): Int

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addProfile" and "editProfile" methods.
  input ProfileInput {
    firstname: String
    lastname: String
    phone_1: String
    phone_2: String
    address: String
    wilaya: String
    commune: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addProfile(input: ProfileInput!): Profile
    deleteProfile(id: String!): Profile
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const profileResolvers = {
  Query: {
    profiles: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const profiles = await Profile.find(filterfield, null, filter);
        
        return profiles;
      }catch(err){
        return null
      }
     
    },
    profile: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const profile  = await Profile.findById(id);
        return profile?profile:null;
      }{
        return null
      }
      
    },
    countProfiles: async (_, { filterfield= {}}, context) => {
      const count = await Profile.countDocuments(filterfield);
      return count
    },
  },
  Mutation: {
    addProfile: async (_, { input }, context) => {
      try{
        const token      = context.headers.authorization;
        const decoded    = jwt.verify(token, config.token.secret_client);
        input.client_id = decoded.id;
        const exists = await Profile.findOne({client_id: decoded.id});
        if(exists){
          const profile  = await Profile.findOneAndUpdate({client_id: decoded.id}, input);
          return profile;
        }else{
          const profile  = await Profile.create(input);
          return profile;
        }
        
      }catch(err){
        throw new Error(errorName.UNAUTHORIZED);
      }
    },
    deleteProfile: async (_, { id }, context) => {
    
        const res = await Profile.findByIdAndUpdate(id, { archived: true, status: 0});
        return res ? res : null;
      
    },
}, 
Profile: {
}
  }
  
