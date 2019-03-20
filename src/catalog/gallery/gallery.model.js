import mongoose from 'mongoose';
import { generateStyleImage, removeOldImage } from '../../../settings/tools';
/**
 * Here is the our schema which will be used to
 * validate the data sent to our database.
 */
const gallerySchema = new mongoose.Schema({
         
          alt: {
            type: String,
          },
          path:{
            type: String,
          },
          model_id:{
            type: String
          },
          created_at: {
            type: Date,
            default: Date.now
          },
          created_by: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
          },
          archived:{
              type: Boolean,
              default: false
          }

});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the role when we use it.
 */
gallerySchema.set('toObject', { virtuals: true });


gallerySchema.pre('save', async function(next) {
  let currentDate = Date.now();
  let imageName   = `${this._id}_${currentDate}`;
  await generateStyleImage(this.path, 'article', imageName, 'slide');
  this.path = `/assets/image/article/slide/original/${imageName}.png`;
  next();
  
});

gallerySchema.pre('findOneAndUpdate', async function(next) {
  // Yes, this works, findOneAndUpdate is called with
  // 'runValidators: true' and 'context: 'query''
  let doc_id  = this.getQuery();
  let doc  = this.getUpdate(); 
  let bool = doc.archived;
  if(!bool){
    next();
  }else{
    
    removeOldImage(doc_id._id, 'article','slide');
    next();
  }
   
  
});


/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Gallery', gallerySchema);
