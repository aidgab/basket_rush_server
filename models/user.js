/**
 * User Mongo model
 * User: Aidar
 * Date: 05.10.13
 * Time: 16:14
 */
var mongoose = require('mongoose'),
    utils = require('./../helpers/utils'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    secretkey: String,
    push_id: String,
    gender: String,
    partner_login: String,
    _partner: {
        type: String,
        ref: 'User'
    }
});

UserSchema.statics.getOpponent = function (condition, callback) {
    var User=this.model('User');
    var ShoppingList=this.model('ShoppingList');
    User.findOne(condition, function (err, user){
        if (err || !user){
            return console.log('Can not find user '+condtion);
        }
        //continue - search shopping list
        ShoppingList.findOne({owners: user._id}, function(err, list){
            var opponent_id;
            console.log('List owners: ');
            console.log(list.owners);
            var owners= list.owners.map(function( ingredient ) {
                return mongoose.Types.ObjectId(ingredient);
            });

            for (var i in owners){
                if (owners[i]!=user._id){
                    opponent_id=owners[i];
                }
                //Get opponent by id
            }
            User.findOne({_id: opponent_id}, function (err, opponent){
                if (err){
                    console.log(err);
                    return console.log('Error while fetching opponent');
                }
                callback(err, user);
            });
        });
    });
};

UserSchema.statics.findOrCreate = function (condition, data, callback) {
    //return this.model('Animal').find({ type: this.type }, cb);
    var User=this.model('User'),
        ShoppingList=this.model('ShoppingList');

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
            user.secretkey=utils.randomString(32);

            User.findOne({login: user.partner_login}, function (err, partner){
                if (err || !partner){
                    user.save(function(err) {
                        callback(err, user);
                    });
                }
                else {
                    //Партнёр найден - будем вязать
                    user._partner=partner._id;
                    user.save(function(err) {
                        //перевязываем листы
                        ShoppingList.findOne({owners: partner._id}, function(err, list){
                            if (list){
                                list.owners.push(user._id);
                                list.save(function (err){
                                    return callback(err, user);
                                })
                            }
                            else {
                                callback(err, user);
                            }
                        });

                    });

                }
            });
        }
    });

};

var User = module.exports=mongoose.model('User', UserSchema);