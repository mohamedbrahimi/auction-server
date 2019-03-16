import express         from 'express';
import checkauth       from '../middlewar/check-auth';
import checkauthclient from '../middlewar/check-auth-client';
import checkclientconfirm from '../middlewar/check-client-confirm';
import checkresetpassword from '../middlewar/check-restpassword-client';
import checkresetpassworduser from '../middlewar/check-reset-password-user';

import jwt from 'jsonwebtoken';

import config from '../settings/config';
import { sendMail } from '../settings/mailling';
import User from '../src/user/user.model';
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

// reste password 
router.get('/check-passwordrest-user', checkresetpassworduser, async function(req, res) {

   const token = req.headers.authorization;
   const decoded = jwt.verify(token, config.token.secret_passwordreset_user);

   const user  = await User.findOne({ username: decoded.username});
   if(user){
         return res.status(200).json(user);
   }else{
      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});
router.get('/check-passwordrest-client', checkresetpassword, async function(req, res) {

   const token = req.headers.authorization;
   const decoded = jwt.verify(token, config.token.secret_passwordreset_client);

   const client  = await Client.findOne({ username: decoded.username})
   if(client){
         return res.status(200).json(client);
   }else{
      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});
// try reset password

router.post('/try-passwordrest-user', async function(req, res) {

  
   let mail = req.body.mail;
   let user  = await User.findOne({ mail: mail})
   if(user){
         // send mail
        

         sendMail(user, "restpassworduser")
         return res.status(200).json(user);
   }else{

      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});
router.post('/try-passwordrest-client', async function(req, res) {

  
   let mail = req.body.mail;
   let client  = await Client.findOne({ mail: mail})
   if(client){
         // send mail
         client = {
            
            username: client.username,
            mail : client.mail
         }

         sendMail(client, "restpassword")
         return res.status(200).json(client);
   }else{

      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});

// reste password last step
router.post('/passwordrest-user', checkresetpassworduser, async function(req, res) {
   const token = req.headers.authorization;
   const decoded = jwt.verify(token, config.token.secret_passwordreset_user);

   let user  = await User.findOne({ username: decoded.username})
   if(user){
         user.password = req.body.password;
         user.save()
         .then(() => {
            return res.status(200).json({'success':'doc was modified!'})
          })
         .catch(() => {
            return res.status(402).json({ 
               message: 'can\'t save modification!'
           });
          })
   }else{
      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});
router.post('/passwordrest-client', checkresetpassword, async function(req, res) {
   const token = req.headers.authorization;
   const decoded = jwt.verify(token, config.token.secret_passwordreset_client);

   let client  = await Client.findOne({ username: decoded.username})
   if(client){
         client.password = req.body.password;
         client.save()
         .then(() => {
            return res.status(200).json({'success':'doc was modified!'})
          })
         .catch(() => {
            return res.status(402).json({ 
               message: 'can\'t save modification!'
           });
          })
   }else{
      return res.status(401).json({ 
         message: 'failed operation'
     });
   }
   
});
export default router; 