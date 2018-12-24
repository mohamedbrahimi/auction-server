import mongoose from 'mongoose'
/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */
const articleSchema = new mongoose.Schema({
         
          label: {
            type: String,
            required: true,
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




/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Article', articleSchema);
