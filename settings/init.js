import User     from '../src/user/user.model';
import Role     from '../src/role/role.model';

import Auction       from '../src/catalog/auction/auction.model';
import Article       from '../src/catalog/article/article.model';
import Participation from '../src/mazaduse/participation/participation.model';
import Client        from '../src/mazaduse/client/client.model';

import { sendMail } from '../settings/mailling';

import config    from './config';
import fs        from 'fs';

export function init() {
  
    user_init();
    folder_init();
    notify_participants_init();
}

async function user_init(){
  const count_user = await User.countDocuments();

  if(count_user == 0){
      // init role
      await Role.deleteMany({});
      // get permissions 
      let permissions       = config.permissions;
      let array_permissions = [];


      for(let permission of Object.values(permissions)){
          if(permission.auth)
            array_permissions.push(permission.ticket)
      }
      const role = await Role.create({
          label: "role_admin",
          permissions: array_permissions,
      });

      const user = await User.create({
          username: "admin",
          password: "22091993",
          role_id: role._id
      })
  }
}

async function folder_init(){
    let prepare_dir = config.styleImage;
    let root_path   = `./public/assets/image`;

    for(let item of prepare_dir){
        let super_dir = item.path;
        if (!fs.existsSync(`${root_path}/${super_dir}`)){
            fs.mkdirSync(`${root_path}/${super_dir}`);
        }
        for(let itm of item.data_path){
            let second_dir = itm.path;
            if (!fs.existsSync(`${root_path}/${super_dir}/${second_dir}`)){
                fs.mkdirSync(`${root_path}/${super_dir}/${second_dir}`);
            }
            for(let im of itm.data_path){
                let third_dir = `${root_path}/${super_dir}/${second_dir}/${im.path}`;
                if (!fs.existsSync(third_dir)){
                    fs.mkdirSync(third_dir); 
                }
            }
        }
    }
    
}


function notify_participants_init(){

    setInterval( async () => {
        
         console.log('+1')
         const auctions = await Auction.find({archived: false, endDate: { $gt : new Date() }});
         for(let item of auctions){
             
            const article        = await Article.findById( item.model_id);
            const participations = await Participation.find({ auction_id : item._id });
            for(let itm of participations){

                const client = await Client.findById(itm.client_id);
                sendMail(client, "timingparticipation", {
                    auction: item,
                    article: article
                })
            }
         }
  
    },24 * 60 * 60000)
}


