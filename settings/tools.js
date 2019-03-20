import Article     from '../src/catalog/article/article.model';
import Slider      from '../src/catalog/slider/slider.model';
import Gallery     from '../src/catalog/gallery/gallery.model';
import Message     from '../src/mazaduse/message/message.model';
import Categorykey from '../src/catalog/category-key/category-key.model';
import Key         from '../src/catalog/key/key.model';
import base64Img   from 'base64-img';
import sharp       from 'sharp'; 
import fs          from 'fs';

import config    from './config';


export function generateStyleImage(base64,root_path,imageName, path = 'logo') {
    return new Promise(resolve => {
        base64Img.img(base64, `./public/assets/image/${root_path}/${path}/original`, imageName , function(err, filepath) {
            if(!err)
            { 
    
                let array_style_path = config.styleImage;
                for(let item of array_style_path){
                  if(item.path == root_path){
                    
                    for(let im of item.data_path){
                        if(im.path == path){
                            
                            for(let itm of im.data_path){
                                sharp(filepath)
                                .resize(itm.size[0], itm.size[1])
                                .flatten({
                                    background: 'white'
                                    })
                                .toFile(`public/assets/image/${root_path}/${path}/${itm.path}/${imageName + '.png'}`);
                            }
    
                            resolve(1);
                        }
                    }
                    resolve(0);
                  }
                }
                
            }}) 
    })

  }

  export function removeOldImage(id_obj, path_root, path){
   
    getModel(path_root, path).findById(id_obj)  
      .exec()
      .then((article) => {

        let file_path   = article[getModelFieldImageName(path_root ,path)]; 
        let original    = `public${file_path}`;
        try{
            if(fs.existsSync(original))fs.unlinkSync(original);
        }catch(e){
            console.log('can\'t remove original file');
        }

        let array_style_path = config.styleImage;
        for(let item of array_style_path){
          if(item.path == path_root){
            
            for(let im of item.data_path){
                if(im.path == path){
                    
                    for(let itm of im.data_path){
                        let filesize1xsize2   = `public${file_path.replace('original',itm.path)}`;  
                        try{
                            if(fs.existsSync(filesize1xsize2))fs.unlinkSync(filesize1xsize2);
                        }catch(e){
                           console.log(`can't remove ${itm.path} file`);
                        }   
                    }

                    return false;
                }
            }
            return false;
          }
        }
      })
      .catch((e) => { console.log(e);console.log('module file management: can\'t load the doc!') })
     
    }


export async function createKeyCode(_idcat){
   let category ;
   let count   = await Key.countDocuments();
   try{
      category = await Categorykey.findById(_idcat);
   }catch(err){
       console.log("Err: can't create a code Key!")
   }
   
   
   count++;
   let number      = constructFullNumber(6, `${count}`);
   let datey       = new Date().getFullYear().toString().substr(2,2);
   let random      = constructFullNumber(8, `${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
   let prefix      = (category)?category.label.toString().substr(0,6).toUpperCase():"NNN";
   
   return `${prefix} ${random}${number} ${datey}`; 
}
 
    
/**
 * THIS FUNCTION WILL HELP US TO ADD ZERO'S TO A NUMBER.
 * EX : IF WE HAVE 45 AND WE WANT TO DISPLAY THE NUMBER LIKE 0045 !
 * WE JUST CALL constructFullNumber(4, '45')
 */
export function constructFullNumber(length, data)
{
   if(data.length < length) { 
       data = `0${data}`;
       return constructFullNumber(length, data);
    }
    else return data;
}


function getModel(path_root, path){
    switch(path_root){
        case "article": {
            switch(path){
                case "slide": return Gallery; break;
                case "logo" : return Article; break;
            }
        } break;
       
        case "messages": return Message; break;
        case "slider": return Slider; break;
    }
}

function getModelFieldImageName(path_root ,path){
    
    switch(path_root){
       case "article" : {
            switch(path){
                case "slide": return 'path'; break;
                case "logo" : return 'image'; break;
            }
       } break;

       case "slider" : {
        switch(path){
            case "slide": return 'slide'; break;
            case "logo" : return 'logo'; break;
        }
       }
    }
    
   
}

export function removeParticularImage(field, path, id_obj){
    getModel('messages', path).findById(id_obj)  
    .exec()
    .then((article) => {

      let file_path   = article[field]; 
      let original    = `public${file_path}`;
      try{
          if(fs.existsSync(original))fs.unlinkSync(original);
      }catch(e){
          console.log('can\'t remove original file');
      }
})
}

export function getSearchText(filterfield){
    if(filterfield.text && filterfield.text.trim() != ""){
      const text  = filterfield.text;
      const query = { $text: { $search : text } };
      delete filterfield.text;
      filterfield = Object.assign( query ,filterfield);
      return filterfield;
    }else{
      return filterfield;
    }
  }
export function searchByCode(filterfield){
    return new Promise( async resolve => {
        console.log(filterfield)
        if(filterfield.text && filterfield.text.trim() != ""){
            const text  = filterfield.text;
            const query = { $text: { $search : text } };
            const keys  = await Key.find(query);
            var key_ids = [];
            for(let key of keys){
                key_ids.push(key._id);
            }
            const qr = { key_id : { $in : key_ids}}
            delete filterfield.text;
            filterfield = Object.assign( qr ,filterfield);
            resolve(filterfield);
          }else{
            resolve(filterfield);
          }
    })
    
}
 



