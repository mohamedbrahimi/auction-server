import mongoose from 'mongoose'

/**
 * Here is the our profile schema which will be used to
 * validate the data sent to our database.
 */
const profileSchema = new mongoose.Schema({
         
          client_id:{
            type: String,
          },
          firstname: {
            type: String,
          },
          lastname: {
            type: String,
          },
          phone_1: {
            type: String,
          },
          phone_2: {
            type: String,
          },
          address:{
            type: String
          },
          wilaya:{
            type: String
          },
          commune: {
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
          archived:{
              type: Boolean,
              default: false
          }

});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the profile when we use it.
 */
profileSchema.set('toObject', { virtuals: true });

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
export default mongoose.model('profile', profileSchema);
