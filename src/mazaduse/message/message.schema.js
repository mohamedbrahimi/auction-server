import Message      from './message.model';
import Client       from '../client/client.model';
import Key          from '../../catalog/key/key.model';
import Categorykey  from '../../catalog/category-key/category-key.model';
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
export const MessageTypeDefs = `
 
  type Message {
    id: ID!
    type: String
    desc: String
    attached_file: String
    treated: Int
    keynumber: Int
    category_key: String
    created_at: String
    last_update: String
    treated_by: String
    client_id: String
    client: Client
    note: String
    status: Int
    category: Categorykey

    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input MessageFilterInput {
    limit: Int
    skip: Int
  }

  input MessageFilterField { 
    type: String
    treated : Int
    archived: Boolean
    category_key: String
    status: Int
    client_id: String
  }
  # Extending the root Query type.
  extend type Query {
    messages(filterfield:MessageFilterField, filter: MessageFilterInput): [Message]
    message(id: String!): Message
    countMessages(filterfield:MessageFilterField,): Int


    messages_front(filterfield:MessageFilterField, filter: MessageFilterInput): [Message]
    countMessages_front(filterfield:MessageFilterField,): Int

  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addMessage" and "editMessage" methods.
  input MessageInput {
    type: String
    desc: String
    attached_file: String
    treated: Int
    keynumber: Int
    category_key: String
    note: String
    status: Int
    op: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addMessage(input: MessageInput!): Message
    editMessage(id: String!, input: MessageInput!): Message
    deleteMessage(id: String!): Message
  }
`;


/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const messageResolvers = {
  Query: {
    messages: async (_, { filterfield= {}, filter = {} },context) => {
      try{

        const messages = await Message.find(filterfield, null, filter).sort({created_at:-1});
        
        return messages;
      }catch(err){
        return null
      }
     
    },
    message: async (_, { id }) => {
      if(objectID.isValid(id))
      {
        const message  = await Message.findById(id);
        return message?message:null;
      }{
        return null
      }
      
    },
    countMessages: async (_, { filterfield= {}}, context) => {
      const count = await Message.countDocuments(filterfield);
      return count;
    },
    
    messages_front: async (_, { filterfield= {}, filter = {} },context) => {
      try{
        
        const token           = context.headers.authorization;
        const decoded         = jwt.verify(token, config.token.secret_client);
        filterfield.client_id = decoded.id;
        const messages = await Message.find(filterfield, null, filter).sort({created_at:-1});
        
        return messages;
      }catch(err){
        return null
      }
     
    },
    countMessages_front: async (_, { filterfield= {}}, context) => {
      const token           = context.headers.authorization;
      const decoded         = jwt.verify(token, config.token.secret_client);
      filterfield.client_id = decoded.id;

      const count = await Message.countDocuments(filterfield);
      return count;
    },

   
  },
  Mutation: {
    addMessage: async (_, { input }, context) => {
      
      const token      = context.headers.authorization;
      const decoded    = jwt.verify(token, config.token.secret_client);
      const client     = await Client.findById(decoded.id);
      input.client_id  = (client)?client._id:'';
      const message  = await Message.create(input);
      if(client)
      sendMail(client,"demandecredit");
      return message;
     
      
    },
    editMessage: async (_, { id, input }, context) => {

          let op = input.op;
                   delete input.op;
          switch(op){
             case "101" : // CANCEL
             {
              const token      = context.headers.authorization;
              const decoded    = jwt.verify(token, config.token.secret);
              
              const message  = await Message.findByIdAndUpdate(id, { treated:1, note: input.note, treated_by:decoded.id, last_update: new Date(), status: 0 });
              // SEND MAIL WITH NOTE TEXT
              const client     = await Client.findById(message.client_id);
              sendMail(client, "demandecancel");
              return message;
             }
             break; 
             case "105" : // CONFIRM
             {
              let msg  = await Message.findById(id);

              for(let i= 0; i< msg.keynumber; i++){
                 let key = await Key.create({ client_id: msg.client_id, category_key: msg.category_key });
              }
              const token      = context.headers.authorization;
              const decoded    = jwt.verify(token, config.token.secret);

              const message  = await Message.findByIdAndUpdate(id, { treated:1, treated_by:decoded.id, last_update: new Date() });
              // SEND MAIL
              const client     = await Client.findById(message.client_id);
              sendMail(client, "demandeconfirm");
              return message;
             }
             break; 
          } 
          
    },
    deleteMessage: async (_, { id }) => {
        
        const res = await Message.findByIdAndUpdate(id, { archived: true});
        return res ? res : null;
    },
}, 
Message: {
  client: async (message) => {
    if(message && message.client_id){
      const client = await Client.findById(message.client_id);
      return client;
    }else{
      return null
    }
  },
  category: async(message) => {
    if(message && message.category_key){
      const cat = await Categorykey.findById(message.category_key);
      return cat;
    }else{
      return null
    }
  }
}
}
  
