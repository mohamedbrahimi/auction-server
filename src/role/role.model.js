import mongoose from 'mongoose'
/**
 * Here is the our schema which will be used to
 * validate the data sent to our database.
 */
const roleSchema = new mongoose.Schema({

          label: {
            type: String,
            required: true,
            unique: true,
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
          permissions: {
              type : [String],
              default: []
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
roleSchema.set('toObject', { virtuals: true });




/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Role', roleSchema);
