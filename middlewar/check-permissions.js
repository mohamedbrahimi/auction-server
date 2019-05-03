import jwt    from 'jsonwebtoken';
import config from '../settings/config'
import permissions from '../settings/permissions';

import User from '../src/user/user.model';
import Role from '../src/role/role.model';

module.exports = async(req, res, next) => {
    try {
          
        const ticket   = req.body.query.split('{')[1].split('}')[0].split('(')[0].trim();
        const required = permissions[ticket];
       // console.log(required)
       // console.log(req.body.query.split('{')[1].split('}')[0].split('(')[0].trim())
       
        switch(required.auth.type){
           case "client": {
            try {
          
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, config.token.secret_client);
                next();
            } catch (error) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
           }; break;
           case "admin": {

            try {
          
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, config.token.secret);
                const user = await User.findById(decoded.id);
                if(user){
                    const role        = await Role.findById(user.role_id);
                    const permissions = role.permissions;
                    const permission  = required.permission;
                    

                if( permissions.indexOf(permission) >= 0){
                        next();
                    }else{
                        return res.status(401).json({ 
                            message: 'Auth failed'
                        });
                    } 
                }else{
                    return res.status(401).json({ 
                        message: 'Auth failed'
                    });
                }
           }catch (error) {  
                return res.status(401).json({ 
                    message: 'Auth failed'
                });
            }
           }; break;
           case "read": {next();}; break;
           case "write": {
            try {
          
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, config.token.secret);
            }catch(err){
                return res.status(401).json({ 
                    message: 'Auth failed'
                });
            }
           }
           case null: {next();}; break;
           default: {
            return res.status(401).json({ 
                message: 'Auth failed'
            });
           }break;
        }
    } catch (error) {  
        console.log(error)
        return res.status(401).json({ 
            message: 'Auth failed'
        });
    } 
};