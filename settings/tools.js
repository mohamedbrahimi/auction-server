import Article   from '../src/catalog/article/article.model';
import Gallery   from '../src/catalog/gallery/gallery.model';
import base64Img from 'base64-img';
import sharp     from 'sharp'; 
import fs        from 'fs';

import config    from './config';


export function generateStyleImage(base64,root_path,imageName, path = 'logo') {
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

                        return false;
                    }
                }
                return false;
              }
            }
            
        }}) 
  }

  export function removeOldImage(id_obj, path_root, path){
   
    getModel(path).findById(id_obj)  
      .exec()
      .then((article) => {

        let file_path   = article[getModelFieldImageName(path)]; 
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

  



function getModel(path){
    switch(path){
        case "slide": return Gallery; break;
        case "logo" : return Article; break;
    }
}

function getModelFieldImageName(path){
    switch(path){
        case "slide": return 'path'; break;
        case "logo" : return 'image'; break;
    }
}

