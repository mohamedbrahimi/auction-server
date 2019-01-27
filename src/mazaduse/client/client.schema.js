import Client from './client.model';
// import config
import config from '../../../settings/config';
import { sendMail } from '../../../settings/mailling';
import { errorName } from '../../../settings/errors';
// import dependencies
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
/**
 * Export a string which contains our GraphQL type definitions.
 */

 const objectID = mongoose.Types.ObjectId;
export const ClientTypeDefs = `
 
  type Client {
    id: ID!
    username: String!
    mail: String!
    password: String!
    status: Int
    confirmed: Int
    created_at: String
    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input ClientFilterInput {
    limit: Int
    skip: Int
  }

  input ClientFilterField { 
    status : Int
    archived: Boolean
  }
  # Extending the root Query type.
  extend type Query {
    clients(filterfield:ClientFilterField, filter: ClientFilterInput): [Client]
    client(id: String!): Client
    countClients(filterfield:ClientFilterField,): Int
    currentClient: Client

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addClient" and "editClient" methods.
  input ClientInput {
    username: String
    mail: String
    password: String
    status: Int
    confirmed: Int
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addClient(input: ClientInput!): Client
    editClient(id: String!, input: ClientInput!): Client
    deleteClient(id: String!): Client
    loginClient(username: String!, password: String!): String
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const clientResolvers = {
  Query: {
    clients: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const clients = await Client.find(filterfield, null, filter);
        
        return clients;
      }catch(err){
        return null
      }
     
    },
    client: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const client  = await Client.findById(id);
        return client?client:null;
      }{
        return null
      }
      
    },
    countClients: async (_, { filterfield= {}}, context) => {
      const count = await Client.countDocuments(filterfield);
    },
    currentClient: async (_,{},context) => {
      try{
        const token      = context.headers.authorization;
        const decoded    = jwt.verify(token, config.token.secret_client);
        const client  = await Client.findById(decoded.id);
        return client?client:null;

      }catch(err){
        return null
      }
    }
  },
  Mutation: {
    addClient: async (_, { input }, context) => {
      input.username   = input.username.trim().toLowerCase();
      
      const exist_username = await Client.findOne({username: input.username});
      const exist_mail = await Client.findOne({mail: input.mail});
      if(exist_username){
        throw new Error(errorName.TRYCREATECLIENT_DUPLICATEUSERNAME);
      }
      if(exist_mail){
        throw new Error(errorName.TRYCREATECLIENT_DUPLICATEMAIL);
      }
      const client  = await Client.create(input);
      sendMail(input)
      return client;
     
      
    },
    editClient: async (_, { id, input }) => {
      const old          = await Client.findById(id);
      input.username   = input.username.trim().toLowerCase();
      if(old.password != input.password)
        input.password   = Client.hashPassword(input.password);
      
      if(old && old.username != input.username)
      {
        const exist = await Client.findOne({username: input.username});
        if(exist){
          throw new Error(errorName.TRYCREATECLIENT_DUPLICATEUSERNAME);
        }else{
          const client  = await Client.findByIdAndUpdate(id, input);
          return client;
        }
      }else{
        const client  = await Client.findByIdAndUpdate(id, input);
        return client;
      }
      
      
    },
    deleteClient: async (_, { id }) => {
      let client =  await Client.findOne({_id: id, archived: false});
      if(client){
        let archived_name = client.username;
        let archived_time = new Date();
        let archived_username = `archived_${archived_name}_${archived_time}`;
        
        const res = await Client.findByIdAndUpdate(id, { archived: true, status: false, username: archived_username});
        return res ? res : null;
        
      }else{
        return null;
      }
    },
    loginClient: async (_, { username, password }) => {
      let mail     = username;
      username     = username.toLowerCase();
      const client    = await Client.findOne({ username:username, status: 1, confirmed: 1,archived: false });
      const client1   = await Client.findOne({ mail:mail, status: 1, confirmed: 1,archived: false });
      
      if(client || client1){
        const match = await ((client)?client:client1).comparePassword(((client)?client:client1), password);
        if (match) {
          return jwt.sign({ id: ((client)?client:client1)._id }, config.token.secret_client, {expiresIn: '12h'});
        }else {throw new Error(errorName.UNAUTHORIZEDPASSWORD);}
      }else{
        throw new Error(errorName.UNAUTHORIZEDUSERNAME);
      }
      
},
    }
  }
  
