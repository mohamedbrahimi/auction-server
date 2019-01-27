
/**
 * Replace these variables with environment variables
 * so that it reduces friction.
 */

export default {
    mongodb: {
      uri: 'mongodb://127.0.0.1:27017/e-auction'
    },
    server: {
      url: 'localhost',
      port: 4400
    },
    client:{
      admin:  'http://localhost:4220',
      site: 'http://localhost:4550' 
    },
    token: {
      secret: 'e-auction-mazaduse',
      secret_client: 'e-auction-mazaduse-client',
      secret_client_confirm: 'e-auction-mazaduse-client-confirm'
    },
    mailling:{
      username: "mazadusecpt@gmail.com",
      password: "mazaduse2209"
    },
    debug: {
       mode: "dev",
       chackpermission: false
    },
    styleImage:[
       {
        path: "article",
        data_path: [
          {
            path: "logo",
            data_path: [
              {
                size: [50,50],
                path: "50x50"
              },
              {
                size: [100,100],
                path: "100x100"
              },
              {
                size: [250,250],
                path: "250x250"
              },
              {
                size: [500,400],
                path: "500x400"
              },
              {
                size: [600,400],
                path: "600x400"
              },
            ],
          },
          {
            path: "slide",
            data_path: [
              
              {
                size: [100,100],
                path: "100x100"
              },
              {
                size: [150,150],
                path: "150x150"
              },
              {
                size: [350,350],
                path: "350x350"
              },
              {
                size: [500,400],
                path: "500x400"
              },
              {
                size: [600,400],
                path: "600x400"
              },
            ],
          }
          
        ]
        
      }
    ],
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