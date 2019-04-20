import mongoose from 'mongoose'
import base64Img   from 'base64-img';
import { removeParticularImage } from '../../../settings/tools';
/**
 * Here is the our message schema which will be used to
 * validate the data sent to our database.
 */
const messageSchema = new mongoose.Schema({
         
          type: {
            type: String,
            required: true,
          },
          desc: {
            type: String,
          },
          order_id: {
            type: String,
          },
          keynumber: {
            type: Number,
          },
          attached_file:{
            type: String,
          },
          category_key:{
            type: String,
          },
          treated: {
            type: Number,
            default: 0
          },
          client_id:{
            type: String
          },
          treated_by:{
            type: String
          },
          note:{
            type: String
          },
          status:{
            type: Number,
            default: 1
          },
          last_update:{
            type: Date,
            default: Date.now
          },
          created_at: {
            type: Date,
            default: Date.now
          },
          archived:{
              type: Boolean,
              default: false
          }

});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the message when we use it.
 */
messageSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 *//*
userSchema.method('toGraph', function toGraph(e) {
  return JSON.parse(JSON.stringify(e));
});
*/
messageSchema.pre('save', function(next) {
    let currentDate = Date.now();
    let imageName   = `${this._id}_${currentDate}`;
    base64Img.img(this.attached_file, `./public/assets/image/messages/attached_file`, imageName , function(err, filepath) {
     // lines of code
    });
    this.attached_file = `/assets/image/messages/attached_file/${imageName}.png`;
    next();
  });

  messageSchema.pre('findOneAndUpdate', function(next) {
    // Yes, this works, findOneAndUpdate is called with
    // 'runValidators: true' and 'context: 'query''
    let doc_id  = this.getQuery();
    let doc  = this.getUpdate(); 
    let img  = doc.attached_file;
    let bool = ((img && img.indexOf('data:image/png;base64,') >= 0)?true:false);
    if(!bool){
      delete doc.attached_file;
      next();
    }else{
      let currentDate = Date.now();
      let imageName   = `${doc_id._id}_${currentDate}`;
      removeParticularImage('attached_file', 'attached_file', doc_id._id);
      base64Img.img(doc.attached_file, `./public/assets/image/messages/attached_file`, imageName , function(err, filepath) {
        next();
    });
    this.getUpdate().attached_file = `/assets/image/messages/attached_file/${imageName}.png`;

     
    }
     
    
  });
/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Message', messageSchema);
