
/**
 * Replace these variables with environment variables
 * so that it reduces friction.
 */
export default {
    mongodb: {
      uri: 'mongodb://127.0.0.1:27017/e-auction',
    },
    token: {
      secret: 'e-auction-mazaduse',
    },
    debug: {
       mode: "dev",
       chackpermission: false
    },
    permissions: {
      login: { 
        ticket: '',
       },
      usersmanagement: {
        ticket: 'usermanagement',
        auth: true
      },
      Keysmanagement: {
        ticket: 'keymanagement',
        auth: true
      },
      articlesmanagement: {
        ticket: 'articlesmanagemt',
        auth: true
      },
      auctionsmanagement: {
        ticket: 'auctionsmanagemt',
        auth: true
      },
      salesmanagement: {
        ticket: 'salesmanagement',
        auth: true
      },
      messagingmanagement: {
        ticket: 'messagingmanagement',
        auth: true
      },
      stockmanagement: {
        ticket: 'stockmanagement',
        auth: true
      },
      accountingmanagement: {
        ticket: 'accountingmanagement',
        auth: true
      },
      addressmanagement: {
        ticket: 'addressmanagement',
        auth: true
      },
      addressmanagement: {
        ticket: 'addressmanagement',
        auth: true
      },
      advertisingmanagement: {
        ticket: 'advertisingmanagement',
        auth: true
      },
      transportmanagement: {
        ticket: 'transportmanagement',
        auth: true
      },
      parrainagemanagement: {
        ticket: 'parrainagemanagement',
        auth: true
      },
      alertsmanagement: {
        ticket: 'alertsmanagement',
        auth: true
      },
    }
  };