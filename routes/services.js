import express         from 'express';
import checkauth       from '../middlewar/check-auth';
import checkauthclient from '../middlewar/check-auth-client';
import checkclientconfirm from '../middlewar/check-client-confirm';

import jwt from 'jsonwebtoken';

import config from '../settings/config';
import Client from '../src/mazaduse/client/client.model';
const router = express.Router();

/* GET home page. */
router.get('/check-auth',checkauth, function(req, res) {
     return res.status(200).json({"auth":"success"})
  });

router.get('/check-auth-client',checkauthclient, function(req, res) {
    return res.status(200).json({"auth":"success"})
 });

// confirm an account
router.get('/confirm-account',checkclientconfirm, async function(req, res) {

   const token = req.headers.authorization;
   const decoded = jwt.verify(token, config.token.secret_client_confirm);

   const client  = await Client.findOne({ username: decoded.username, confirmed: 0})
   if(client){
      
      client.confirmed = 1;
      client.save().then(()  => { return res.status(200).json({"confirm":"success"}) })
                   .catch(() => { return res.status(401).json({ message: 'confirm failed' }) })
      
   }else{
      return res.status(401).json({ 
         message: 'confirm failed'
     });
   }
   
});
export default router; 