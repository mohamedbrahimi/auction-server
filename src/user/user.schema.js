import User from './user.model';
import Role from '../role/role.model';
// import config
import config from '../../settings/config';
import { errorName } from '../../settings/errors';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const userTypeDefs = `
 
  type User {
    id: ID!
    mail: String
    username: String!
    password: String!
    status: Int
    role_id: String!
    role: Role
    created_by: String
    created_by_user: User
    created_at: String
    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input UserFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
    countusers: Int
    currentUser: User

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addUser" and "editUser" methods.
  input UserInput {
    username: String
    mail: String
    password: String
    role_id: String
    status: Int
    created_by: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addUser(input: UserInput!): User
    editUser(id: String!, input: UserInput!): User
    editSelf(input: UserInput!): User
    deleteUser(id: String!): User
    login(username: String!, password: String!): String
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const userResolvers = {
  Query: {
    users: async (_, { filter = {} },context) => {
      try{
        
        const token      = context.headers.authorization;
        const decoded    = jwt.verify(token, config.token.secret);

        const users = await User.find({_id: { $ne : decoded.id },archived:false}, null, filter);
        
        return users;
      }catch(err){
        return null
      }
     
    },
    user: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const user  = await User.findById(id);
        return user?user:null;
      }{
        return null
      }
      
    },
    countusers: async () => {
      const count = await User.countDocuments({archived: false});
      return count
    },
    currentUser: async (_,{},context) => {
      try{
        const token      = context.headers.authorization;
        const decoded    = jwt.verify(token, config.token.secret);
        const user  = await User.findById(decoded.id);
        return user?user:null;

      }catch(err){
        return null
      }
    }
  },
  Mutation: {
    addUser: async (_, { input }, context) => {
      input.username   = input.username.trim().toLowerCase();
      const token      = context.headers.authorization;
      try{
        const decoded    = jwt.verify(token, config.token.secret);
        input.created_by = decoded.id;
      }catch(e){
        console.log('error: create a new user. can\'t get the jwt object');
      }
      
      
      const exist = await User.findOne({username: input.username});
      if(exist){
        throw new Error(errorName.TRYCREATEUSER_DUPLICATEUSERNAME);
      }
      const user  = await User.create(input);
      return user;
     
      
    },
    editSelf: async (_, { input }, context) => {
      const token      = context.headers.authorization;
      const decoded    = jwt.verify(token, config.token.secret);
      const id = decoded.id;
      const old        = await User.findById(id);
      input.username   = input.username.trim().toLowerCase();
      input.mail       = input.mail.trim().toLowerCase();

      if(old.password != input.password)
        input.password   = User.hashPassword(input.password);
      
      
      if(old && old.username != input.username)
      {
        const exist = await User.findOne({username: input.username});
        if(exist){
          throw new Error(errorName.TRYCREATEUSER_DUPLICATEUSERNAME);
        }
      } 

      if(old && old.mail != input.mail)
      {
        const exist = await User.findOne({mail: input.mail});
        if(exist){
          throw new Error(errorName.TRYCREATEUSER_DUPLICATEMAIL);
        }
      }

       const user  = await User.findByIdAndUpdate(id, input);
       return user;
      
    },
    editUser: async (_, { id, input }) => {
      const old        = await User.findById(id);
      input.username   = input.username.trim().toLowerCase();
      if(old.password != input.password)
        input.password   = User.hashPassword(input.password);
      
      if(old && old.username != input.username)
      {
        const exist = await User.findOne({username: input.username});
        if(exist){
          throw new Error(errorName.TRYCREATEUSER_DUPLICATEUSERNAME);
        }else{
          const user  = await User.findByIdAndUpdate(id, input);
          return user;
        }
      }else{
        const user  = await User.findByIdAndUpdate(id, input);
        return user;
      }
      
      
    },
    deleteUser: async (_, { id }) => {
      let user =  await User.findOne({_id: id, archived: false});
      if(user){
        let archived_name = user.username;
        let archived_time = new Date();
        let archived_username = `archived_${archived_name}_${archived_time}`;
        
        const res = await User.findByIdAndUpdate(id, { archived: true, status: 0, username: archived_username});
        return res ? res : null;
        
      }else{
        return null;
      }
    },
    login: async (_, { username, password }) => {
      username = username.toLowerCase();
      const user   = await User.findOne({ username:username, status: 1, archived: false });
      if(user){
        const match = await user.comparePassword(user, password);
        if (match) {
          return jwt.sign({ id: user._id }, config.token.secret, {expiresIn: '12h'});
        }else {throw new Error(errorName.UNAUTHORIZEDPASSWORD);}
      }else{
        throw new Error(errorName.UNAUTHORIZEDUSERNAME);
      }
      
},
    }, 
   User: {
    async role(user) {
      if (user.role_id) {
        const role = await Role.findById(user.role_id);
        return role?role:null;
      }
      return null;
   },
   async created_by_user(user) {
     let created_by = user.created_by
     if(created_by)
     {
      const  u = await User.findById(created_by);
      return u?u:null
     }
     return null
 },

   }
  }
  
