import User from './user.model';
// import config
import config from '../../settings/config';
// import dependencies
import jwt from 'jsonwebtoken'
/**
 * Export a string which contains our GraphQL type definitions.
 */
export const userTypeDefs = `
 
  type User {
    id: ID!
    username: String!
    password: String!

    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input UserFilterInput {
    limit: Int
  }
  # Extending the root Query type.
  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addUser" and "editUser" methods.
  input UserInput {
    username: String
    password: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addUser(input: UserInput!): User
    editUser(id: String!, input: UserInput!): User
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
    users: async (_, { filter = {} }) => {
      const users = await User.find({}, null, filter);
      // notice that I have ": any[]" after the "users" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      return users;
    },
    user: async (_, { id }) => {
      const user  = await User.findById(id);
      return user;
    },
  },
  Mutation: {
    addUser: async (_, { input }) => {
      input.password = User.hashPassword(input.password)
      const user = await User.create(input);
      return user;
    },
    editUser: async (_, { id, input }) => {
      const user  = await User.findByIdAndUpdate(id, input);
      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndRemove(id);
      return user ? user : null;
    },
    login: async (_, { username, password }) => {
      const user  = await User.findOne({ username });
      if(user){
        const match = await user.comparePassword(user, password);
        if (match) {
          return jwt.sign({ id: user._id }, config.token.secret);
        }
        throw new Error('User not exist!.');
      }else{
        throw new Error('Not Authorised.');
      }
      
},
    }
  }
  
