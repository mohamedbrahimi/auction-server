
import config from './config'
/**
 * Replace these variables with environment variables
 * so that it reduces friction.
 */
const def_role_read = {
    auth: {
        type: "read"
    },
}
 const def_role_client = {
    auth: {
        type: "client"
    },
}
const def_role_system = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.systemmanagement.ticket
}
const def_role_article = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.articlesmanagement.ticket
}
const def_role_auction = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.auctionsmanagement.ticket
}
const def_role_key = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.Keysmanagement.ticket
}
const def_role_order = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.salesmanagement.ticket
}
const def_role_message = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.messagingmanagement.ticket
}
const def_role_client_admin = {
    auth: {
        type: "admin"
    },
    permission: config.permissions.clientsmanagement.ticket
}
const def_role_auth = {  
    auth: {
        type: null
    }
}
export default {
    login: def_role_auth,
    loginClient: def_role_auth,
    currentUser: def_role_auth,

    auctions: def_role_auction,
    auction: def_role_read,
    countAuctions: def_role_read,
    auctionsFront: def_role_read,
    countAuctionsFront: def_role_read,
    addAuction: def_role_auction,
    editAuction: def_role_auction,
    confirmOffer: def_role_auction,
    deleteAuction: def_role_auction,

    articles: def_role_article,
    article: def_role_read,
    countArticles: def_role_read,
    addArticle: def_role_article,
    editArticle: def_role_article,
    deleteArticle: def_role_article,

    categories: def_role_read,
    category: def_role_read,
    countCategories: def_role_read,
    addCategory: def_role_article,
    editCategory: def_role_article,
    deleteCategory: def_role_article,

    brands: def_role_read,
    brand: def_role_read,
    countBrands: def_role_read,
    addBrand: def_role_article,
    editBrand: def_role_article,
    deleteBrand: def_role_article,

    keys: def_role_key,
    key: def_role_key,
    countKeys: def_role_key,
    keysfront: def_role_client,
    countKeysfront: def_role_client,
    addKey: def_role_key,
    editKey: def_role_key,
    deleteKey: def_role_key,

    categorieskey: def_role_read,
    categorykey: def_role_read,
    countCategorieskey: def_role_read,
    addCategorykey: def_role_key,
    editCategorykey: def_role_key,
    deleteCategorykey: def_role_key,
 
    dataSheets: def_role_read,
    dataSheet: def_role_read,
    countDataSheets: def_role_read,
    addDataSheet: def_role_article,
    editDataSheet: def_role_article,
    deleteDataSheet: def_role_article,

    galleries: def_role_read,
    gallery: def_role_read,
    countGalleries: def_role_read,
    addGallery: def_role_article,
    editGallery: def_role_article,
    deleteGallery: def_role_article,

    bids: def_role_read,
    bid: def_role_read,
    countBids: def_role_read,
    addBid: def_role_client,
    editBid: def_role_system,
    deleteBid: def_role_system,

    participations: def_role_read,
    participation: def_role_read,
    countParticipations: def_role_read,
    addParticipation: def_role_client,
    editParticipation: def_role_system,
    deleteParticipation: def_role_system,

    orders: def_role_order,
    order: def_role_order,
    countOrders: def_role_read,
    addOrder: def_role_order,
    editOrder: def_role_order,
    printOrders: def_role_order,
    upgradeOrders: def_role_order,
    deleteOrder: def_role_order,

    orders_front: def_role_client,
    countOrders_front: def_role_client,


    messages: def_role_message,
    message: def_role_message,
    countMessages: def_role_message,
    addMessage: def_role_client,
    editMessage: def_role_message,
    deleteMessage: def_role_message,

    clients: def_role_client_admin,
    client: def_role_client_admin,
    countClients: def_role_client_admin,
    currentClient: def_role_client,
    addClient: def_role_read,
    editClient: def_role_client_admin,
    editSelfClient: def_role_client, 
    deleteClient: def_role_client_admin,

    profiles: def_role_client_admin,
    profile: def_role_read,
    countProfiles: def_role_client_admin,
    addProfile: def_role_client,
    deleteProfile: def_role_client,

    users: def_role_system,
    user: def_role_system,
    addUser:     def_role_system,
    editUser:    def_role_system,
    countusers:  def_role_system,
    deleteUser:  def_role_system,

    roles:       def_role_system,
    role: def_role_system,
    addRole:     def_role_system,
    editRole:    def_role_system,
    countroles:  def_role_system,
    deleteRole:  def_role_system
  };