import Key from '../../catalog/key/key.model';
import Article from '../../catalog/article/article.model';
import Participation from '../participation/participation.model';
import mongoose from 'mongoose';
const objectID = mongoose.Types.ObjectId;

export let tryaddorder = async (client_id, category_id, article_id = null, quantity = null) => {
   return new Promise(async (resolve) => {
      
    if(objectID.isValid(client_id) && objectID.isValid(category_id)){
      let key = await Key.findOne({client_id: client_id, category_key: category_id, archived: false, status: 1, consumed: 0 });
      if(key){
           
           if(article_id && quantity){
             const article = await Article.findById(article_id);
             if(article){
                if(article.quantity >= (quantity + 1)){
                  resolve(key);
                }else{
                  resolve(-2);
                }
             }else{
              resolve(0);
             } 
              
           }else{
             resolve(key);
           }
           
      }else{
          resolve(-1);
      }
    }else{
      resolve(0);
    }
   })
}

export let tryaddParticipation = async (client_id, category_id, auction_id) => {
  return new Promise(async (resolve) => {
     
   if(objectID.isValid(client_id) && objectID.isValid(category_id) && objectID.isValid(auction_id) && objectID.isValid(auction_id)){

      const participation = await Participation.findOne({client_id: client_id, auction_id: auction_id});
      if(participation){
        resolve(-2);
      }else{
        const key = await Key.findOne({client_id: client_id, category_key: category_id, archived: false, status: 1, consumed: 0 });
        if(key){
            resolve(key);
        }else{
            resolve(-1);
        }
      }
     }
     else{
      resolve(0);
    }
     
  })
}


export const tryToUpgradeStatusOrder = async (status) => {
   return new Promise(resolve => {
     switch(status){
       case 0 :  resolve(1);break;
       case 1 :  resolve(2);break;
       case 2 :  resolve(3);break;
       case 3 :  resolve(4);break;
       case 4 :  resolve(5);break;
       case 5 :  resolve(6);break;
       case -501 : resolve(-601);break;
       case -601 : resolve(-701);break;
       default : {
         resolve(null);
       }; break;
     }
   })
}

export const tryAddBid = async (client_id, auction_id) => {
  return new Promise(async(resolve) => {
      const participation = await Participation.findOne({ client_id: client_id, auction_id: auction_id });
      resolve(participation);
  })
}


