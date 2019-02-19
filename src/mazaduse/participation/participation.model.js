import mongoose from 'mongoose'
/**
 * Here is the our participation schema which will be used to
 * validate the data sent to our database.
 */
const participationSchema = new mongoose.Schema({
         
         
          key_id:{
            type: String,
          },
          category_key:{
            type: String,
          },
          client_id:{
            type: String
          },
          auction_id:{
            type: String
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
 * are set on the participation when we use it.
 */
participationSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 *//*
userSchema.method('toGraph', function toGraph(e) {
  return JSON.parse(JSON.stringify(e));
});
*/

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Participation', participationSchema);
