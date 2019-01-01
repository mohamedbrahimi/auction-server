import Categorykey from './category-key.model';

import jwt from 'jsonwebtoken';

import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const CategorykeyTypeDefs = `
 
  type Categorykey {
    id: ID!
    label: String!
    price: String!
    created_by: User
    created_at: String
  }

  input CategorykeyFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    categorieskey(filter: CategorykeyFilterInput): [Categorykey]
    categorykey(id: String!): Categorykey
    countCategorieskey: Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addcategorykey" and "editcategorykey" methods.
  input CategorykeyInput {
    label: String
    price: String

}
  # Extending the root Mutation type.
  extend type Mutation {
    addCategorykey(input: CategorykeyInput!): Categorykey
    editCategorykey(id: String!, input: CategorykeyInput!): Categorykey
    deleteCategorykey(id: String!): Categorykey
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const categorykeyResolvers = {
  Query: {
    categorieskey: async (_, { filter = {} }, context) => {
      const categories = await Categorykey.find({archived: false}, null, filter);
      // notice that I have ": any[]" after the "categorykeys" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return categories;
    },
    categorykey: async (_, { id }) => {
      if(objectID.isValid(id)){
        const categorykey  = await Categorykey.findById(id);
        return categorykey;
      }else 
       return null
      
    },
    countCategorieskey: async () => {
      const count = await Categorykey.countDocuments({archived: false});
      return count
    }
  },
  Mutation: {
    addCategorykey: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new categorykey. can\'t get the jwt object');
        }
        
        const categorykey  = await Categorykey.create(input);
        return categorykey;
    },
    editCategorykey: async (_, { id, input }) => {
      const categorykey  = await Categorykey.findByIdAndUpdate(id, input);
      return categorykey;
    },
    deleteCategorykey: async (_, { id }) => {
      const res = await Categorykey.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    }
  }
  
