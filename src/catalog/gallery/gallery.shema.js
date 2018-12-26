import Gallery from './gallery.model';

import jwt from 'jsonwebtoken';

import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const GalleryTypeDefs = `
 
  type Gallery {
    id: ID!
    alt: String
    path: String
    model_id: String
    created_by: User
    created_at: String
  }

  input GalleryFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    galleries(model_id: String,filter: GalleryFilterInput): [Gallery]
    gallery(id: String!): Gallery
    countGalleries(model_id: String!): Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addGallery" and "editGallery" methods.
  input GalleryInput {
    alt: String
    path: String
    model_id: String
}
  # Extending the root Mutation type.
  extend type Mutation {
    addGallery(input: GalleryInput!): Gallery
    editGallery(id: String!, input: GalleryInput!): Gallery
    deleteGallery(id: String!): Gallery
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const galleryResolvers = {
  Query: {
    galleries: async (_, { model_id,filter = {} }, context) => {
      const galleries = await Gallery.find({model_id: model_id, archived: false}, null, filter);
      // notice that I have ": any[]" after the "Gallerys" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return galleries;
    },
    gallery: async (_, { id }) => {
      if(objectID.isValid(id)){
        const gallery  = await Gallery.findById(id);
        return gallery;
      }else 
       return null
      
    },
    countGalleries: async (_, { model_id }) => {
      const count = await Gallery.countDocuments({model_id: model_id, archived: false});
      return count
    }
  },
  Mutation: {
    addGallery: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new Gallery. can\'t get the jwt object');
        }
        
        const gallery  = await Gallery.create(input);
        return gallery;
    },
    editGallery: async (_, { id, input }) => {
      const gallery  = await Gallery.findByIdAndUpdate(id, input);
      return gallery;
    },
    deleteGallery: async (_, { id }) => {
      const res = await Gallery.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    }
  }
  
