import Category from './category.model';

import jwt from 'jsonwebtoken';

import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const CategoryTypeDefs = `
 
  type Category {
    id: ID!
    label: String!
    category_mother_id: String
    category_mother: Category
    created_by: User
    created_at: String
  }

  input CategoryFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    categories(filter: CategoryFilterInput): [Category]
    category(id: String!): Category
    countCategories: Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addCategory" and "editCategory" methods.
  input CategoryInput {
    label: String
    category_mother_id: String
}
  # Extending the root Mutation type.
  extend type Mutation {
    addCategory(input: CategoryInput!): Category
    editCategory(id: String!, input: CategoryInput!): Category
    deleteCategory(id: String!): Category
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const categoryResolvers = {
  Query: {
    categories: async (_, { filter = {} }, context) => {
      const categories = await Category.find({archived: false}, null, filter);
      // notice that I have ": any[]" after the "Categorys" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return categories;
    },
    category: async (_, { id }) => {
      if(objectID.isValid(id)){
        const category  = await Category.findById(id);
        return category;
      }else 
       return null
      
    },
    countCategories: async () => {
      const count = await Category.countDocuments({archived: false});
      return count
    }
  },
  Mutation: {
    addCategory: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new category. can\'t get the jwt object');
        }
        
        const category  = await Category.create(input);
        return category;
    },
    editCategory: async (_, { id, input }) => {
      const category  = await Category.findByIdAndUpdate(id, input);
      return category;
    },
    deleteCategory: async (_, { id }) => {
      const res = await Category.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    },
  Category: {
    async category_mother(category) {
      if (objectID.isValid(category.category_mother_id)) {
        const cat = await Category.findById(category.category_mother_id);
        return cat;
      }
      return null;
   },
  }
  }
  
