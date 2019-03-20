import mongoose  from 'mongoose';
import { generateStyleImage, removeOldImage } from '../../../settings/tools';

/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */

const sliderSchema = new mongoose.Schema({
         
          slide: {
            type: String
          },
          logo: {
            type: String
          },
          title: {
            type: String,
          },
          slogan: {
            type: String
          },
          desc: {
            type: String
          },
          link_title : {
            type: String
          },
          link_url: {
            type: String
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
          status: {
            type: Number,
            default: 1
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
sliderSchema.set('toObject', { virtuals: true });



sliderSchema.pre('save', async function(next) {
  let currentDate = Date.now();
  let imageName   = `${this._id}_${currentDate}`;
  await generateStyleImage(this.slide, 'slider', imageName, 'slide');
  this.slide = `/assets/image/slider/slide/original/${imageName}.png`;
  
  await generateStyleImage(this.logo, 'slider', imageName);
  this.logo = `/assets/image/slider/logo/original/${imageName}.png`;
  
  next();

});

sliderSchema.pre('findOneAndUpdate', async function(next) {
  // Yes, this works, findOneAndUpdate is called with
  // 'runValidators: true' and 'context: 'query''
  let doc_id  = this.getQuery();
  let doc  = this.getUpdate(); 
  let slide  = doc.slide; 
  let logo  = doc.logo;

  let bool  = ((slide && slide.indexOf('data:image/png;base64,') >= 0)?true:false);
  let bool1 = ((logo && logo.indexOf('data:image/png;base64,') >= 0)?true:false);
 
  if(!bool){
    delete doc.slide;
    //next();
  }else{
    let currentDate = Date.now();
    let imageName   = `${doc_id._id}_${currentDate}`;
    
    removeOldImage(doc_id._id, 'slider','slide');
    await generateStyleImage(slide, 'slider', imageName, 'slide');
    this.getUpdate().slide = `/assets/image/slider/slide/original/${imageName}.png`;
    //next();
  }

  if(!bool1){
    delete doc.logo;
    //next();
  }else{
    let currentDate = Date.now();
    let imageName   = `${doc_id._id}_${currentDate}`;
    
    removeOldImage(doc_id._id, 'slider','logo');
    await generateStyleImage(logo, 'slider', imageName);
    
    this.getUpdate().logo = `/assets/image/slider/logo/original/${imageName}.png`;
    //next();
  }


  next();
   
  
});

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Slider', sliderSchema);
