import { makeExecutableSchema } from 'graphql-tools';
import _ from 'lodash';

// sytem
import { userResolvers, userTypeDefs} from '../src/user/user.schema';
import { roleResolvers, RoleTypeDefs } from '../src/role/role.schema';
// catalog
import { brandResolvers, BrandTypeDefs  } from '../src/catalog/brand/brand.schema';
import { categoryResolvers, CategoryTypeDefs } from '../src/catalog/category/category.schema';
import { articleResolvers, ArticleTypeDefs } from '../src/catalog/article/article.schema';
import { galleryResolvers, GalleryTypeDefs } from '../src/catalog/gallery/gallery.schema';
import { dataSheetResolvers, DataSheetTypeDefs } from '../src/catalog/datasheet/datasheet.schema';
import { categorykeyResolvers, CategorykeyTypeDefs } from '../src/catalog/category-key/category-key.schema';
import { keyResolvers, KeyTypeDefs } from '../src/catalog/key/key.schema';
import { auctionResolvers, AuctionTypeDefs } from '../src/catalog/auction/auction.schema';
// mazaduse
import { clientResolvers, ClientTypeDefs } from '../src/mazaduse/client/client.schema';
const rootTypeDefs = `
        type Query
        type Mutation
            schema {
                query: Query
                mutation: Mutation
            }
`


export default makeExecutableSchema ({
    typeDefs: [
               rootTypeDefs, 
               userTypeDefs,     RoleTypeDefs,    BrandTypeDefs, 
               CategoryTypeDefs, ArticleTypeDefs, GalleryTypeDefs,
               DataSheetTypeDefs, CategorykeyTypeDefs, KeyTypeDefs,
               ClientTypeDefs, AuctionTypeDefs
              ],

    resolvers: _.merge(
                       userResolvers,     roleResolvers,    brandResolvers,
                       categoryResolvers, articleResolvers, galleryResolvers,
                       dataSheetResolvers, categorykeyResolvers, keyResolvers,
                       clientResolvers, auctionResolvers
                      )
})
    

