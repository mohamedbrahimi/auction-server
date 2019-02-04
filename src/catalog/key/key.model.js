import mongoose from 'mongoose';
import { createKeyCode } from '../../../settings/tools';
/**
 * Here is the our schema which will be used to
 * validate the data sent to our database.
 */
const keySchema = new mongoose.Schema({
         
          code: {
            type: String,
          },
          category_key: {
            type: String
          },
          client_id: {
            type: String
          },
          auction_id:{
            type: String
          },
          consumed:{
            type: Number,
            default: 0 
          },
          status:{
             type: Number,
             default: 1 
          },
          consumed_at: {
            type: Date
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
keySchema.set('toObject', { virtuals: true });

keySchema.pre('save', function(next) {
  createKeyCode(this.category_key).then(
    (res) => {
      this.code = res;
      next();
    }
  ).catch(()=> next())
  
  });


/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Key', keySchema);
