import DataSheet from './datasheet.model';

import jwt from 'jsonwebtoken';

import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const DataSheetTypeDefs = `
 
  type DataSheet {
    id: ID!
    label: String!
    value: String
    model_id: String
    created_by: User
    created_at: String
  }

  input DataSheetFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    dataSheets(model_id: String!, filter: DataSheetFilterInput): [DataSheet]
    dataSheet(id: String!): DataSheet
    countDataSheets(model_id: String): Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addDataSheet" and "editDataSheet" methods.
  input DataSheetInput {
    label: String
    value: String
    model_id: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addDataSheet(input: DataSheetInput!): DataSheet
    editDataSheet(id: String!, input: DataSheetInput!): DataSheet
    deleteDataSheet(id: String!): DataSheet
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const dataSheetResolvers = {
  Query: {
    dataSheets: async (_, { model_id, filter = {} }, context) => {
      const datasheets = await DataSheet.find({model_id: model_id, archived: false}, null, filter);
      // notice that I have ": any[]" after the "DataSheets" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return datasheets;
    },
    dataSheet: async (_, { id }) => {
      if(objectID.isValid(id)){
        const datasheet  = await DataSheet.findById(id);
        return datasheet;
      }else 
       return null
      
    },
    countDataSheets: async (_, { model_id }, context) => {
      const count = await DataSheet.countDocuments({model_id: model_id, archived: false});
      return count
    }
  },
  Mutation: {
    addDataSheet: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new DataSheet. can\'t get the jwt object');
        }
        
        const datasheet  = await DataSheet.create(input);
        return datasheet; 
    },
    editDataSheet: async (_, { id, input }) => {
      const datasheet  = await DataSheet.findByIdAndUpdate(id, input);
      return datasheet;
    },
    deleteDataSheet: async (_, { id }) => {
      const res = await DataSheet.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    }
  }
  
