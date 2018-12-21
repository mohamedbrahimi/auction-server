import { makeExecutableSchema } from 'graphql-tools';
import _ from 'lodash';

import { userResolvers, userTypeDefs} from '../src/user/user.schema';
import { roleResolvers, RoleTypeDefs } from '../src/role/role.schema';

const rootTypeDefs = `
        type Query
        type Mutation
            schema {
                query: Query
                mutation: Mutation
            }
`


export default makeExecutableSchema ({
    typeDefs: [rootTypeDefs, userTypeDefs, RoleTypeDefs],
    resolvers: _.merge(userResolvers, roleResolvers)
})
    

