import { makeExecutableSchema } from 'graphql-tools'

import { userResolvers, userTypeDefs} from '../src/user/user.schema';

const rootTypeDefs = `
        type Query
        type Mutation
            schema {
                query: Query
                mutation: Mutation
            }
`


export default makeExecutableSchema ({
    typeDefs: [rootTypeDefs, userTypeDefs],
    resolvers: userResolvers
})
    

