
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config    from './config';




export function sendMail(data)
{
    
    
            let token = jwt.sign({
                username:data.username,
                },config.token.secret_client_confirm, {expiresIn : '900000'});
             
                
            let link  = `${config.client.site}/confirm/${token}`;   
        // GET EMAIL
            
           
             let username = data.username; 
             let mail     = data.mail;
             // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: config.mailling.username,
                        pass: config.mailling.password
                    }
                }); 

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Mazaduse" <'+config.mailling.username+'>', // sender address
                    to: `${mail}`, // list of receivers
                    subject: 'Confirmez votre compte ✔', // Subject line
                    text: `Salut ${username},
                        Nous avons le plaisir de vous confirmer que votre  inscription sur mazaduse.dz a bien été 
                        prise en compte.
                        Plus qu'une étape pour acceder au site.
                        Veuillez cliquer sur le lien ci-dessous afin de confirmer votre adresse mail :
                        ${link}
                        Ce lien expirera dans 15 minutes et ne peut être utilisé qu’une seule fois.
                        
                        Merci,
                        L’équipe de gestion des comptes Mazaduse. 
                        `, // plain text body
                    html: `<h1>Salut ${username},</h1>
                    <p>Nous avons le plaisir de vous confirmer que votre  inscription sur mazaduse.dz a bien été 
                    prise en compte.</p>
                    <p>Plus qu'une étape pour acceder au site.</p>
                    <p>Veuillez cliquer sur le lien ci-dessous afin de confirmer votre adresse mail : </p>
                    ${link}
                    <br>
                    <b>Ce lien expirera dans 15 minutes et ne peut être utilisé qu’une seule fois.</b>
                    
                    
                    <p>Merci,</p>
                    <b>L’équipe de gestion des comptes Mazaduse.</b>` // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(501).send('send error!');
                        //console.log(error);
                        return console.log(error);
                    }
                    else if(info)
                    {
                        //console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
          
                        res.status(200).json({'send':'200!'});
                    }else {
                        res.status(401).send('send error!, empty info');
                    }
                
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }); 

          
    



}




