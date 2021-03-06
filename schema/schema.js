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

import { sliderResolvers, SliderTypeDefs } from '../src/catalog/slider/slider.schema';
// mazaduse
import { clientResolvers, ClientTypeDefs } from '../src/mazaduse/client/client.schema';
import { profileResolvers, ProfileTypeDefs } from '../src/mazaduse/client/profile.schema';
import { messageResolvers, MessageTypeDefs } from '../src/mazaduse/message/message.schema';
import { orderResolvers, OrderTypeDefs } from '../src/mazaduse/order/order.schema';
import { participationResolvers, ParticipationTypeDefs } from '../src/mazaduse/participation/participation.schema';
import { bidResolvers, BidTypeDefs } from '../src/mazaduse/bid/bid.shcema';
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
               ClientTypeDefs, AuctionTypeDefs, MessageTypeDefs,
               OrderTypeDefs, ParticipationTypeDefs, BidTypeDefs,
               ProfileTypeDefs, SliderTypeDefs
              ],

    resolvers: _.merge(
                       userResolvers,     roleResolvers,    brandResolvers,
                       categoryResolvers, articleResolvers, galleryResolvers,
                       dataSheetResolvers, categorykeyResolvers, keyResolvers,
                       clientResolvers, auctionResolvers, messageResolvers,
                       orderResolvers, participationResolvers, bidResolvers,
                       profileResolvers, sliderResolvers,

                      )
})
    

