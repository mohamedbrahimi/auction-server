import mongoose from 'mongoose'
import bcrypt   from 'bcrypt'
import { networkInterfaces } from 'os';

/**
 * Here is the our client schema which will be used to
 * validate the data sent to our database.
 */
const clientSchema = new mongoose.Schema({
         
          username: {
            type: String,
            required: true,
            unique: true,
          },
          mail: {
            type: String,
            required: true,
            unique: true,
          },
          password: {
            type: String,
            required: true,
          },
          status: {
            type: Number,
            default: 1
          },
          confirmed: {
            type: Number,
            default: 0
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
 * are set on the client when we use it.
 */
clientSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 *//*
userSchema.method('toGraph', function toGraph(e) {
  return JSON.parse(JSON.stringify(e));
});
*/
clientSchema.statics.hashPassword = function hashPassword(password){
  return bcrypt.hashSync(password,10);
}

clientSchema.method('comparePassword', function comparePassword(
  client,
  candidate
) {
  if (!client.password) {
    throw new Error('Client has not been configured with a password.');
  }
  if (!candidate) {
    return false;
  }
  return bcrypt.compare(candidate, this.password);
});

clientSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(this.password, salt))
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(next);
}
});


/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Client', clientSchema);
