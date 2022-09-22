import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        unique: false
      },
    last_name: {
        type: String,
        unique: false
      },
    full_name: {
        type: String,
        unique: false
      },
    user_name: {
        type: String,
        unique: true,
        required: true,
      },
    building_number: {
        type: String,
        unique: false
      },
    street: {
        type: String,
        unique: false
      },
    district: {
        type: String,
        unique: false
      },
    city: {
        type: String,
        unique: false
      },
    country: {
        type: String,
        unique: false
      },
    mobile_number: {
        type: String,
        unique: false
      },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true, },
    counted_articles: { type: Number, default:0, }

});

userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
      user_name: login,
    });
   
    if (!user) {
      user = await this.findOne({ email: login });
    }
  


    return user;
  };



userSchema.pre('remove', function(next) {
    this.model('Session').deleteMany({ user: this._id }, next);
});
   

const User = mongoose.model('User', userSchema);
export default User;
