import jwt    from 'jsonwebtoken';
import config from '../settings/config'

module.exports = (req, res, next) => {
    try {
          
        console.log(req.body.operationName)
        next();
    } catch (error) {  
        return res.status(401).json({ 
            message: 'Auth failed'
        });
    } 
};