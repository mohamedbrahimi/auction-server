import Article   from './article.model';
import Brand     from '../brand/brand.model';
import Category  from '../category/category.model';
import Gallery   from '../gallery/gallery.model';
import DataSheet   from '../datasheet/datasheet.model';

import { getSearchText } from '../../../settings/tools';
import jwt from 'jsonwebtoken';
import config from '../../../settings/config';

//import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const ArticleTypeDefs = `
 
  type Article {
    id: ID!
    image: String
    label: String!
    ref: String
    code: String
    manufacturingCountry: String!
    buyingPrice: String!
    sellingPrice: String!
    quantity: Int!
    guarantee: String
    articleStatus: String
    brand_id: String!
    category_id: String!
    status: Int
    created_by: User
    brand: Brand
    gallery: [Gallery]
    dashsheet: [DataSheet]
    category: Category
    created_at: String


  }

  input ArticleFilterInput {
    limit: Int
    skip: Int
  }

  input ArticleFilterField {
    status : Int
    category_id: String
    brand_id: String
    archived: Boolean
    text: String
    manufacturingCountry: String
  }
  # Extending the root Query type.
  extend type Query {
    articles(filterflied:ArticleFilterField, filter: ArticleFilterInput): [Article]
    article(id: String!): Article
    countArticles(filterflied:ArticleFilterField): Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addArticle" and "editArticle" methods.
  input ArticleInput {
    image: String
    label: String!
    ref: String
    code: String
    manufacturingCountry: String!
    buyingPrice: String!
    sellingPrice: String!
    quantity: Int!
    guarantee: String
    articleStatus: String
    brand_id: String!
    category_id: String!
    status: Int
}
  # Extending the root Mutation type.
  extend type Mutation {
    addArticle(input: ArticleInput!): Article
    editArticle(id: String!, input: ArticleInput!): Article
    deleteArticle(id: String!): Article
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const articleResolvers = {
  Query: {
    articles: async (_, { filterflied= {},filter = {} }, context) => {
      filterflied = getSearchText(filterflied);
      const articles = await Article.find(filterflied, null, filter);
      // notice that I have ": any[]" after the "Articles" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return articles;
    },
    article: async (_, { id }) => {
      if(objectID.isValid(id)){
        const article  = await Article.findById(id);
        return article;
      }else 
       return null
      
    },
    countArticles: async (_, { filterflied= {}}, context) => {
      filterflied = getSearchText(filterflied);
      const count = await Article.countDocuments(filterflied);
      return count
    }
  },
  Mutation: {
    addArticle: async (_, { input }, context) => {
        const token      = context.headers.authorization;
        try{
          const decoded    = jwt.verify(token, config.token.secret);
          input.created_by = decoded.id;
        }catch(e){
          console.log('error: create a new article. can\'t get the jwt object');
        }
        const article  = await Article.create(input);
        return article;
    },
    editArticle: async (_, { id, input }) => {
      const article  = await Article.findByIdAndUpdate(id, input);
      return article;
    },
    deleteArticle: async (_, { id }) => {
      const res = await Article.findByIdAndUpdate(id, { archived: true });
      return res ? res : null;
    },
    },
    Article: {
        async brand(article) {
          if (article.brand_id && objectID.isValid(article.brand_id)) {
            const brand = await Brand.findById(article.brand_id);
            return brand?brand:null;
          }
          return null;
       },
       async category(article) {
        if (article.category_id && objectID.isValid(article.category_id)) {
            const category = await Category.findById(article.category_id);
            return category?category:null;
          }
          return null;
     },
       async gallery(article) {
        if (article.id) {
          const gallery = await Gallery.find({model_id: article.id, archived: false});
          return gallery
        }
        return [];
       },

       async dashsheet(article) {
        if (article.id) {
          const dataSheet = await DataSheet.find({model_id: article.id, archived: false});
          return dataSheet
        }
        return [];
       }
    
       }
  }
  
