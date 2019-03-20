import Slider  from './slider.model';

import jwt from 'jsonwebtoken';
import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const SliderTypeDefs = `
 
  type Slider {
    id: ID!
    slide: String
    logo: String
    title: String
    slogan: String
    desc: String
    link_title: String
    link_url: String
    status: Int
    created_at: String
  }

  input SliderFilterInput {
    limit: Int
    skip: Int
  }

  input SliderFilterField {
    status : Int
    archived: Boolean
  }
  # Extending the root Query type.
  extend type Query {
    sliders(filterflied:SliderFilterField, filter: SliderFilterInput): [Slider]
    slider(id: String!): Slider
    countSliders(filterflied:SliderFilterField): Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addSlider" and "editSlider" methods.
  input SliderInput {
    slide: String
    logo: String
    title: String
    slogan: String
    desc: String
    link_title: String
    link_url: String
    status: Int
}
  # Extending the root Mutation type.
  extend type Mutation {
    addSlider(input: SliderInput!): Slider
    editSlider(id: String!, input: SliderInput!): Slider
    deleteSlider(id: String!): Slider
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const sliderResolvers = {
  Query: {
    sliders: async (_, { filterflied= {},filter = {} }, context) => {
      const sliders = await Slider.find(filterflied, null, filter);
      // notice that I have ": any[]" after the "Sliders" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return sliders;
    },
    slider: async (_, { id }) => {
      if(objectID.isValid(id)){
        const slider  = await Slider.findById(id);
        return slider;
      }else 
       return null
      
    },
    countSliders: async (_, { filterflied= {}}, context) => {
      const count = await Slider.countDocuments(filterflied);
      return count
    }
  },
  Mutation: {
    addSlider: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new Slider. can\'t get the jwt object');
        }
        const slider  = await Slider.create(input);
        return slider;
    },
    editSlider: async (_, { id, input }) => {
      const slider  = await Slider.findByIdAndUpdate(id, input);
      return slider;
    },
    deleteSlider: async (_, { id }) => {
      const res = await Slider.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    },
    Slider: {
       
       }
  }
  
