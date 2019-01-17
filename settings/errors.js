exports.errorName = {
   UNAUTHORIZED: 'UNAUTHORIZED',
   UNAUTHORIZED_DATA: 'UNAUTHORIZED_DATA',
   TRYDELETESHAREDROLE: 'TRYDELETESHAREDROLE',
   TRYCREATEUSER_DUPLICATEUSERNAME: 'TRYCREATEUSER_DUPLICATEUSERNAME',
   UNAUTHORIZEDUSERNAME: 'UNAUTHORIZEDUSERNAME',
   UNAUTHORIZEDPASSWORD: 'UNAUTHORIZEDPASSWORD',
   TRYCREATEROLE_DUPLICATELABEL: 'TRYCREATEROLE_DUPLICATELABEL',
   TRYCREATECLIENT_DUPLICATEUSERNAME: 'TRYCREATECLIENT_DUPLICATEUSERNAME',
   TRYCREATECLIENT_DUPLICATEMAIL: 'TRYCREATECLIENT_DUPLICATEMAIL'
}

exports.errorType = {
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
    UNAUTHORIZEDUSERNAME: {
        message: 'Your username is not exists! ',
        statusCode: 401,
    },
    UNAUTHORIZEDPASSWORD: {
        message: 'Your username or password is incorrect!',
        statusCode: 401,
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
    
 }