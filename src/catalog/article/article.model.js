import mongoose  from 'mongoose';
import { generateStyleImage, removeOldImage } from '../../../settings/tools';

/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */

const articleSchema = new mongoose.Schema({
         
          image: {
            type: String
          },
          label: {
            type: String,
            required: true,
          },
          ref: {
            type: String
          },
          code: {
            type: String
          },
          manufacturingCountry: {
            type: String
          },
          buyingPrice: {
            type: String
          },
          sellingPrice: {
            type: String
          },
          quantity: {
            type: Number,
            default: 0
          },
          guarantee: {
            type: String
          },
          articleStatus: {
              type: String,
              default: '10/10'
          },
          brand_id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Brand',
          },
          category_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category',
          },
          status: {
            type: Number,
            default: 1
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
articleSchema.set('toObject', { virtuals: true });



articleSchema.pre('save', function(next) {
  let currentDate = Date.now();
  let imageName   = `${this._id}_${currentDate}`;
  generateStyleImage(this.image, 'article', imageName);
  this.image = `/assets/image/article/logo/original/${imageName}.png`;
   next();

});

articleSchema.pre('findOneAndUpdate', function(next) {
  // Yes, this works, findOneAndUpdate is called with
  // 'runValidators: true' and 'context: 'query''
  let doc_id  = this.getQuery();
  let doc  = this.getUpdate(); 
  let img  = doc.image;
  let bool = ((img.indexOf('data:image/png;base64,') >= 0)?true:false);
  if(!bool){
    delete doc.image;
    next();
  }else{
    let currentDate = Date.now();
    let imageName   = `${doc_id._id}_${currentDate}`;
    
    removeOldImage(doc_id._id, 'article','logo');
    generateStyleImage(doc.image, 'article', imageName);
    this.getUpdate().image = `/assets/image/article/logo/original/${imageName}.png`;
    next();
  }
   
  
});

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Article', articleSchema);
