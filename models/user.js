/**
 * User Mongo model
 * User: Aidar
 * Date: 05.10.13
 * Time: 16:14
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: String,
    secretkey: String,
    gender: String,
    partner: {
        type: String,
        ref: 'User'
    }
});

UserSchema.statics.findOrCreate = function (condition, data, callback) {
    //return this.model('Animal').find({ type: this.type }, cb);
    var User=this.model('User');
    User.findOne(condition, function (err, user){
        if (err){
            callback(err, user);
            return;
        }
        if (user){
            callback(err, user); //Ok User found.
        }
        else {
            //Ok, but no such user - should create
            user=new User(data);
            user.save(function(err) {
                callback(err, user);
            });
        }
    });

};

var User = module.exports=mongoose.model('User', UserSchema);