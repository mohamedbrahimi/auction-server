import Role from './role.model';
import User from '../user/user.model';

import { errorName } from '../../settings/errors';
/**
 * Export a string which contains our GraphQL type definitions.
 */
import mongoose from 'mongoose';

const objectID = mongoose.Types.ObjectId;

export const RoleTypeDefs = `
 
  type Role {
    id: ID!
    label: String!
    permissions: [String]
    created_by: User
    users: [User]
    status: Int
    created_at: String
  }

  input RoleFilterInput {
    limit: Int
    skip: Int
  }
  # Extending the root Query type.
  extend type Query {
    roles(filter: RoleFilterInput): [Role]
    role(id: String!): Role
    countroles: Int
    
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addRole" and "editRole" methods.
  input RoleInput {
    label: String
    permissions: [String]
    status: Int
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addRole(input: RoleInput!): Role
    editRole(id: String!, input: RoleInput!): Role
    deleteRole(id: String!): Role
    updatePermission(id: String!, array: [String]!): Role
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const roleResolvers = {
  Query: {
    roles: async (_, { filter = {} }, context) => {
      const roles = await Role.find({}, null, filter);
      // notice that I have ": any[]" after the "Roles" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      
      return roles;
    },
    role: async (_, { id }) => {
      if(objectID.isValid(id)){
        const role  = await Role.findById(id);
        return role;
      }else 
       return null
      
    },
    countroles: async () => {
      const count = await Role.countDocuments();
      return count
    }
  },
  Mutation: {
    addRole: async (_, { input }) => {
      const exist = await Role.findOne({label : input.label});
      if(exist){
        throw new Error(errorName.TRYCREATEROLE_DUPLICATELABEL);
      }else{
        const role  = await Role.create(input);
        return role;
      }
     
    },
    editRole: async (_, { id, input }) => {
      const role  = await Role.findByIdAndUpdate(id, input);
      return role;
    },
    deleteRole: async (_, { id }) => {
      const shared = await User.findOne({role_id: id});
      if(shared){
        throw new Error(errorName.TRYDELETESHAREDROLE);
      }else{
        const role   = await Role.findByIdAndRemove(id);
        return role ? role : null;
      }
      
    },
    updatePermission: async (_, {id, array}) => {
      const role  = await Role.findByIdAndUpdate(id, { permissions: array });
      return role; 
    }

    }
  }
  
