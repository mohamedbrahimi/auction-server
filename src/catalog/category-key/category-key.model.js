import mongoose from 'mongoose'
/**
 * Here is the our schema which will be used to
 * validate the data sent to our database.
 */
const categorykeySchema = new mongoose.Schema({
         
          label: {
            type: String,
            required: true,
          },
          price: {
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
categorykeySchema.set('toObject', { virtuals: true });




/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Categorykey', categorykeySchema);
