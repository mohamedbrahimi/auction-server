import mongoose from 'mongoose'
import bcrypt   from 'bcrypt'
import { networkInterfaces } from 'os';

/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */
const userSchema = new mongoose.Schema({
         
          username: {
            type: String,
            required: true,
            unique: true,
          },
          password: {
            type: String,
            required: true,
          },
          role_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Role',
            required: true
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
            default: null
          },
          archived:{
              type: Boolean,
              default: false
          }

});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the user when we use it.
 */
userSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 *//*
userSchema.method('toGraph', function toGraph(e) {
  return JSON.parse(JSON.stringify(e));
});
*/
userSchema.statics.hashPassword = function hashPassword(password){
  return bcrypt.hashSync(password,10);
}

userSchema.method('comparePassword', function comparePassword(
  user,
  candidate
) {
  if (!user.password) {
    throw new Error('User has not been configured with a password.');
  }
  if (!candidate) {
    return false;
  }
  return bcrypt.compare(candidate, this.password);
});

userSchema.pre('save', function(next) {
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
export default mongoose.model('User', userSchema);
