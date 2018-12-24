import Brand from './brand.model';

import jwt from 'jsonwebtoken';
import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const BrandTypeDefs = `
 
  type Brand {
    id: ID!
    label: String!
    created_by: User
    created_at: String
  }

  input BrandFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    brands(filter: BrandFilterInput): [Brand]
    brand(id: String!): Brand
    countBrands: Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addBrand" and "editBrand" methods.
  input BrandInput {
    label: String!

}
  # Extending the root Mutation type.
  extend type Mutation {
    addBrand(input: BrandInput!): Brand
    editBrand(id: String!, input: BrandInput!): Brand
    deleteBrand(id: String!): Brand
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const brandResolvers = {
  Query: {
    brands: async (_, { filter = {} }, context) => {
      const Brands = await Brand.find({archived: false}, null, filter);
      // notice that I have ": any[]" after the "Brands" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return Brands;
    },
    brand: async (_, { id }) => {
      if(objectID.isValid(id)){
        const brand  = await Brand.findById(id);
        return brand;
      }else 
       return null
      
    },
    countBrands: async () => {
      const count = await Brand.countDocuments({archived: false});
      return count
    }
  },
  Mutation: {
    addBrand: async (_, { input }, context) => {
      const token      = context.headers.authorization;
      try{
        const decoded    = jwt.verify(token, config.token.secret);
        input.created_by = decoded.id;
      }catch(e){
        console.log('error: create a new brand. can\'t get the jwt object');
      }
      
        const brand  = await Brand.create(input);
        return brand;
    },
    editBrand: async (_, { id, input }) => {
      const brand  = await Brand.findByIdAndUpdate(id, input);
      return brand;
    },
    deleteBrand: async (_, { id }) => {
      const res = await Brand.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    }
  }
  
