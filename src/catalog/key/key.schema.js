import Key from './key.model';
import Categorykey from '../category-key/category-key.model';
import jwt from 'jsonwebtoken';

import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const KeyTypeDefs = `
 
  type Key {
    id: ID!
    code: String
    category_key: String
    client_id: String
    auction_id: String
    consumed: Int
    status: Int
    created_by: User
    created_at: String
    consumed_at: String
    category: Categorykey
  }

  input KeyFilterInput {
    limit: Int
    skip: Int
  }
  input KeyFilterField {
    client_id: String
    status: Int
    consumed: Int
    archived: Boolean 
    category_key: String
  }
  # Extending the root Query type.
  extend type Query {
    keys(filterfield: KeyFilterField ,filter: KeyFilterInput): [Key]
    key(id: String!): Key
    countKeys(filterfield: KeyFilterField): Int

    keysfront(filterfield: KeyFilterField ,filter: KeyFilterInput): [Key]
    countKeysfront(filterfield: KeyFilterField): Int

    }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addKey" and "editKey" methods.
  input KeyInput {
    category_key: String
    client_id: String
    auction_id: String
    consumed: Int
    status: Int
}
  # Extending the root Mutation type.
  extend type Mutation {
    addKey(input: KeyInput!): Key
    editKey(id: String!, input: KeyInput!): Key
    deleteKey(id: String!): Key
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const keyResolvers = {
  Query: {
    keys: async (_, {filterfield = {}, filter = {} }, context) => {
      const keys = await Key.find(filterfield, null, filter);
      // notice that I have ": any[]" after the "Keys" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return keys;
    },
    key: async (_, { id }) => {
      if(objectID.isValid(id)){
        const key  = await Key.findById(id);
        return key;
      }else 
       return null
      
    },
    countKeys: async (_, {filterfield= {}}) => {
      const count = await Key.countDocuments(filterfield);
      return count
    },

    keysfront: async (_, {filterfield = {}, filter = {} }, context) => {
      const token      = context.headers.authorization;
      try{
        const decoded    = jwt.verify(token, config.token.secret_client);
        const keys = await Key.find(Object.assign({client_id: decoded.id}, filterfield), null, filter);
        return keys;
      }catch(e){
        return [];
      }
      
    },
    countKeysfront: async (_, {filterfield= {}}, context) => {
      const token      = context.headers.authorization;
      try{
        const decoded  = jwt.verify(token, config.token.secret_client);
        const count    = await Key.countDocuments(Object.assign({client_id: decoded.id}, filterfield));
        return count
      }catch(e){
        return 0;
      }

      
    },
  },
  Mutation: {
    addKey: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new Key. can\'t get the jwt object');
        }
        
        const key  = await Key.create(input);
        return key;
    },
    editKey: async (_, { id, input }) => {
      const key  = await Key.findByIdAndUpdate(id, input);
      return key;
    },
    deleteKey: async (_, { id }) => {
      const res = await Key.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    },
    Key: {
      category: async(key) => {
        const  c = await Categorykey.findById(key.category_key);
        return c?c:null
      }
    }
  } 
  
