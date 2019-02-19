import mongoose from 'mongoose'
/**
 * Here is the our bid schema which will be used to
 * validate the data sent to our database.
 */
const bidSchema = new mongoose.Schema({
         
         
          participation_id:{
            type: String,
          },
          auction_id:{
            type: String,
          },
          price:{
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
 * are set on the bid when we use it.
 */
bidSchema.set('toObject', { virtuals: true });

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
export default mongoose.model('Bid', bidSchema);
