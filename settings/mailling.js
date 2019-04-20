
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config    from './config';




export function sendMail(data, type="confirmation", options = [])
{
            let link  = getToken(data, type);;   
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
                let mailOptions; 
                switch(type){
                    case "confirmation" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Confirmez votre compte ✔', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Nous avons le plaisir de vous confirmer que votre  inscription sur mazadus.dz a bien été 
                            prise en compte.</p>
                            <p>Plus qu'une étape pour acceder au site.</p>
                            <p>Veuillez cliquer sur le lien ci-dessous afin de confirmer votre adresse mail : </p>
                            ${link}
                            <br>
                            <b>Ce lien expirera dans 60 minutes et ne peut être utilisé qu’une seule fois.</b>
                            <br>
                            <a href="${link}">
                            Si le lien n'apparaître pas bien, Veuillez cliquer ici.
                            </a>
                            
                            
                            <p>Merci,</p>
                            <b>L’équipe de gestion des comptes mazadus.</b>` // html body
                        };
                    }; break;
                    case "demandecredit" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Rechargement 💳', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Nous avons le plaisir de vous confirmer que votre  demande a bien été 
                            enregistrée.</p>
                            <p>Votre message va bientôt prise en compte par l'équipe de gestion des clés mazadus</b>
                            
                            
                            <p>Merci,</p>
                            <b>L’équipe de gestion des clés mazadus.</b>` // html body
                        };
                    }; break;
                    case "demandeconfirm" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Rechargement 💳', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Nous avons le plaisir de vous confirmer que votre commande d'achat des clés à bien été confirmée,</p>
                            <p> vous pouver vérifier ça à travers votre compte sur mazadus.</p>
                            
                            
                            <p>Merci,</p>
                            <b>L’équipe de gestion des clés mazadus.</b>` // html body
                        };
                    }; break;
                    case "demandecancel" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Rechargement 😶', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Votre de demande de rechargement à été refusée pour des raisons réglementaire</p>,
                            <p>veuillez vérifier et corriger votre demande sur votre compte sinon vous pouvez contacter le service client.</p>
                            
                            
                            <p>Merci,</p>
                            <b>L’équipe de gestion des clés mazadus.</b>` // html body
                        };
                    }; break;
                    case "addorder" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Commander un article 👌', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Nous avons le plaisir de vous informer que votre commande a été bien enregistré,</p>
                            <p>vous pouvez constater regulièrement l'etat de votre commande à travers votre compte mazadus. </p>
                            <p>Merci,</p>
                            <b>L’équipe de gestion des commandes mazadus.</b>` // html body
                        };
                    }; break;
                    case "addparticipation" : {
                        mailOptions = {
                            from: '"mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Participer à l\'enchère 🤚', // Subject line
                            html: `<h3>Salut ${username},</h3>
                            <p>Nous avons le plaisir de vous confirmer que votre participation à l'enchère à été enregistré.</p>
                            <p>vous aurez une notification dès la fin de l'enchère si vous etez le gagnant. </p>
                            <p>Merci,</p>
                            <b>L’équipe de gestion des enchères mazadus.</b>` // html body
                        };
                    }; break;

                    case "restpassword" : {
                        mailOptions        = {
                            from: '"Mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Mot de passe oublié ✔👻😱', // Subject line
                            html: `<b>Qualqu'un a demandé la réinitialisation du mot de passe pour le compte : ${username}.</b>
                                
                                <p> Pour renouveler votre mot de passe cliquer sur le lien suivant : 
                                    ${link}</p>
                                <p> Ce lien expirera dans 45 minutes et ne peut être utilisé qu’une seule fois.</p>
                                <br>
                                <a href="${link}">
                                Si le lien n'apparaître pas bien, Veuillez cliquer ici.

                                    <p>
                                    Si vous ne souhaitez pas modifier votre mot de passe ou n’êtes pas à l’origine de cette demande,
                                    ignorez ce message et supprimez-le.
                                    Merci,</p>
                                    <b> L’équipe de gestion des comptes mazadus.</b>` // html body
                        };
                    }break;

                    case "restpassworduser" : {
                        mailOptions        = {
                            from: '"Mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Mot de passe oublié ✔👻😱', // Subject line
                            html: `<b>Qualqu'un a demandé la réinitialisation du mot de passe pour le compte : ${username}.</b>
                                
                                <p> Pour renouveler votre mot de passe cliquer sur le lien suivant : 
                                    ${link}</p>
                                <p> Ce lien expirera dans 45 minutes et ne peut être utilisé qu’une seule fois.</p>
                                <br>
                                <a href="${link}">
                                Si le lien n'apparaître pas bien, Veuillez cliquer ici.  
                                    <p>
                                    Si vous ne souhaitez pas modifier votre mot de passe ou n’êtes pas à l’origine de cette demande,
                                    ignorez ce message et supprimez-le.
                                    Merci,</p>
                                    <b> L’équipe de gestion des comptes Mazadus.</b>` // html body
                        };
                    }break;

                    case "timingparticipation" : {
                        mailOptions        = {
                            from: '"Mazadus" <'+config.mailling.username+'>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: 'Participation à l\'enchère ✔ ⏳', // Subject line
                            html: `<b> Salut : ${username}.</b>
                                
                                <p> Nous avons le plaisir de vous rappeller que vous avez participé à l'enchère : 
                                    ${options.article.label }</p>
                                <p> Et pour ce la vous êtes invité à l'enchère sur le site 
                                  <a href="${config.client.site}/product-detail/${options.auction._id}"> www.Mazadus.com </a> 
                                   à ${ new Date(options.auction.startDate)}</p>
                                <b> L’équipe de gestion des enchères mazadus.</b>` // html body
                        };
                    }break;
                }
        

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        //res.status(501).send('send error!');
                        //console.log(error);
                        return error;
                    }
                    else if(info)
                    {
                        //console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                        return info
                        //res.status(200).json({'send':'200!'});
                    }else {
                        //res.status(401).send('send error!, empty info');
                        return null
                    }
                 
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }); 
}



export function sendMailContact(data)
{
             let username = data.username; 
             let mail     = data.mail;
             let subject  = data.subject;
             let body     = data.message;

             let contact  = config.mailling.contact.mail;

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
                let mailOptions; 
               
                        mailOptions = {
                            from:  username+'<'+config.mailling.username+'>', // sender address
                            to: `${contact}`, // list of receivers
                            subject: subject, // Subject line
                            html: `
                            From : <b>${username}</b>
                            <b> ${mail} </b>
                            <p>${body}</p>
                            ` // html body
                        };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return error;
                    }
                    else if(info)
                    {
                        return info
                    }else {
                        //res.status(401).send('send error!, empty info');
                        return null
                    }
                });
            }); 
}
function getToken(data, type){
     
    switch(type){
       case "confirmation": {
         let token =    jwt.sign({
            username:data.username,
            },config.token.secret_client_confirm, {expiresIn : '1h'});

           return `${config.client.site}/confirm/${token}`;
    };
       case "restpassword": {
        let token = jwt.sign({
            username:data.username,
            },config.token.secret_passwordreset_client, {expiresIn : '1h'});

           return `${config.client.site}/login/resetpassword/${token}`;
       };

       case "restpassworduser": {
        let token = jwt.sign({
            username:data.username,
            },config.token.secret_passwordreset_user, {expiresIn : '45m'});
            token = `${config.client.admin}/resetpassword/${token}`
            return token;
       };

       default: return ""; break;
    }
}




