import jwt    from 'jsonwebtoken';
import config from '../settings/config'

module.exports = (req, res, next) => {
    try {
          
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, config.token.secret_client_confirm);
        req.userData = decoded;
        next();
    } catch (error) {  
        return res.status(401).json({ 
            message: 'confirm failed'
        });
    } 
};