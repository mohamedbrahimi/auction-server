exports.errorName = {
   UNAUTHORIZED: 'UNAUTHORIZED',

   UNAUTHORIZED_DATA: 'UNAUTHORIZED_DATA',
   TRYDELETESHAREDROLE: 'TRYDELETESHAREDROLE',
   TRYCREATEUSER_DUPLICATEUSERNAME: 'TRYCREATEUSER_DUPLICATEUSERNAME',
   TRYCREATEUSER_DUPLICATEMAIL: 'TRYCREATEUSER_DUPLICATEMAIL',
   UNAUTHORIZEDUSERNAME: 'UNAUTHORIZEDUSERNAME',
   UNAUTHORIZEDPASSWORD: 'UNAUTHORIZEDPASSWORD',
   UNAUTHORIZEDCLIENT: 'UNAUTHORIZEDCLIENT',
   TRYCREATEROLE_DUPLICATELABEL: 'TRYCREATEROLE_DUPLICATELABEL',
   TRYCREATECLIENT_DUPLICATEUSERNAME: 'TRYCREATECLIENT_DUPLICATEUSERNAME',
   TRYCREATECLIENT_DUPLICATEMAIL: 'TRYCREATECLIENT_DUPLICATEMAIL',
   TRYCREATECLIENT_DUPLICATEPHONE: 'TRYCREATECLIENT_DUPLICATEPHONE',
   TRYCREATEAUCTION_DUPLICATEARTICLE: 'TRYCREATEAUCTION_DUPLICATEARTICLE',
    

   TRYADDNEWORDER_NOTHAVEAKEY: 'TRYADDNEWORDER_NOTHAVEAKEY',
   TRYADDNEWORDER_INSUFFICIENTQUANTITY: 'TRYADDNEWORDER_INSUFFICIENTQUANTITY',
   TRYADDPARTICIPATION_NOTHAVEAKEY: 'TRYADDPARTICIPATION_NOTHAVEAKEY',
   TRYADDPARTICIPATION_EXISTSONE: 'TRYADDPARTICIPATION_EXISTSONE',

   TRYADD_ACTIONOFAUCTION: 'TRYADD_ACTIONOFAUCTION',
   TRYADD_BID_OVERTAKING: 'TRYADD_BID_OVERTAKING',
   TRYADD_BID_INSUFFICIENT_NUMBER_OF_PARTICIPANTS: 'TRYADD_BID_INSUFFICIENT_NUMBER_OF_PARTICIPANTS',



   ERRORSYSTEME: 'ERRORSYSTEM'

}

exports.errorType = {
    ERRORSYSTEME: {
        message: 'ERROR System!!!',
        statusCode: 505,
    },
    UNAUTHORIZED: {
        message: 'Authentication is needed to get requested response.',
        statusCode: 401,
    },
    UNAUTHORIZED_DATA: {
        message: 'Unauthoried parameters!',
        statusCode: 402,
    },
    TRYDELETESHAREDROLE: {
        message: 'Can\'t delete a shared role!, ',
        statusCode: 401,
    },
    TRYCREATEUSER_DUPLICATEUSERNAME: {
        message: 'Can\'t duplicate the username! try to change it.',
        statusCode: 501,
    },
    TRYCREATEUSER_DUPLICATEMAIL: {
        message: 'Can\'t duplicate the mail! try to change it.',
        statusCode: 502,
    },
    UNAUTHORIZEDUSERNAME: {
        message: 'Your username is not exists! ',
        statusCode: 401,
    },
    UNAUTHORIZEDPASSWORD: {
        message: 'Your username or password is incorrect!',
        statusCode: 401,
    },
    UNAUTHORIZEDCLIENT: {
        message: 'Your account in not confirmed!',
        statusCode: 402,
    },
    TRYCREATEROLE_DUPLICATELABEL: {
        message: 'Can\'t duplicate the label! try to change it.',
        statusCode: 501,
    },
    TRYCREATECLIENT_DUPLICATEUSERNAME: {
        message: 'Can\'t duplicate the username! try to change it.',
        statusCode: 500,
    },
    TRYCREATECLIENT_DUPLICATEMAIL: {
        message: 'Can\'t duplicate the e-mail! try to change it.',
        statusCode: 501,
    },
    TRYCREATECLIENT_DUPLICATEPHONE: {
        message: 'Can\'t duplicate the phone! try to change it.',
        statusCode: 502,
    },

    TRYCREATEAUCTION_DUPLICATEARTICLE: {
        message: 'Can\'t duplicate the auction with existing article id.',
        statusCode: 501, 
    }

    ,
    TRYADDNEWORDER_NOTHAVEAKEY: {
        message: 'Can\'t add new order, you don\'t have a key with the same category.',
        statusCode: 402, 
    },
    TRYADDPARTICIPATION_NOTHAVEAKEY: {
        message: 'Can\'t participate to this auction, don\'t have a kay with the same category.',
        statusCode: 403, 
    },
    TRYADDPARTICIPATION_EXISTSONE:{
        message: 'Can\'t participate to this auction, don\'t have a kay with the same category.',
        statusCode: 502, 
    },
    TRYADDNEWORDER_INSUFFICIENTQUANTITY: {
        message: 'Can\'t add new order, insufficient quantity',
        statusCode: 404,  
    },
    TRYADD_ACTIONOFAUCTION: {
        message: 'Can\'t add new action',
        statusCode: 405,  
    },
    TRYADD_BID_OVERTAKING:{
        message: 'Can\'t add new action, overtaking!',
        statusCode: 406,  
    },
    TRYADD_BID_INSUFFICIENT_NUMBER_OF_PARTICIPANTS:{
        message: 'Can\'t add new action, INSUFFICIENT NUMBER OF PARTICIPANTS!',
        statusCode: 407, 
    }
    
 }