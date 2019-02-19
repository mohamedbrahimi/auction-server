import mongoose from 'mongoose'
/**
 * Here is the our order schema which will be used to
 * validate the data sent to our database.
 */
const orderSchema = new mongoose.Schema({
         
          type: {
            type: String,
            required: true,
          },
          key_id:{
            type: String,
          },
          category_key:{
            type: String,
          },
          status: {
            type: Number,
            default: 0
          },
          client_id:{
            type: String
          },
          article_id:{
            type: String
          },
          auction_id:{
            type: String
          },
          quantity: {
            type: Number
          },
          unitprice: {
            type: String
          },
          address_id:{
            type: String
          },
          note:{
            type: String
          },
          price:{
            type: String
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
 * are set on the order when we use it.
 */
orderSchema.set('toObject', { virtuals: true });

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
export default mongoose.model('Order', orderSchema);
