import mongoose from 'mongoose'
/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */
const auctionSchema = new mongoose.Schema({

          model_id: {
            type: String,
          },
          client_id:{
            type: String,
          },
          bid_id:{
            type: String,
          },
          category_key: {
            type: String,
          },
          priceStart: {
            type: String,
          },
          amountAdded: {
            type: String,
          },
          currentPrice: {
            type: String,
          },
          startDate: {
            type: Date,
          },
          endDate: {
            type: Date,
          },
          minNumberParticipants:{
            type: Number,
            default: 0
          },
          status:{
            type: Number,
            default: 1
          },
          closed: {
            type: Number,
            default: 0
          },
          archived: {
           type: Boolean,
           default: false
          },
          created_at: {
            type: Date,
            default: Date.now
          },
          updated_at: {
              type: Date,
              default: Date.now
          },
          created_by: {
            type: String,
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
auctionSchema.set('toObject', { virtuals: true });




/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Auction', auctionSchema);
