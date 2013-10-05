
/*
 * GET users listing.
 */
var User = require('./../models/user'),
    ShoppingList  = require('./../models/shopping_list'),
    ListItems = require('./../models/list_items'),
    PushNotificator=require('./../helpers/push_notificator')('AIzaSyCMlwvZkdVDIKqexsH3qeG2MwCzPbtdpX4');
//todo refactor here. HARDCODE WARNING!

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.create = function(req, res){
    User.findOrCreate({login: req.body.login}, req.body, function (err, user){
        if (err){
            res.status(500).send({
                error: 'Server error occured'
            });
            return;
        }

        res.send(user);
    });
}

exports.list = function(req, res){
    loadUser(req.body.login,req.body.secret,
        function(err, user){
            if (err || !user){
                return res.status(403).send({error: 'Access denied'});
            }
            ShoppingList.findOrCreate({owners: user._id}, {owners: [user._id]}, function(err, list){
                if (err || !list){
                    return res.status(404).send({error: 'List not found'});
                }
                ListItems.find({_list: list._id}, function (err, items){
                    if (err){
                        return res.status(500).send({error: 'Error fetching list items'});
                    }
                    res.send(items);
                    PushNotificator.send({d: 1, test: 2});
                });
            })
    });
};

exports.addItem = function(req, res){
    loadUser(req.body.login,req.body.secret,function(err, user){
        if (err || !user){
            return res.status(403).send({error: 'Access denied'});
        }


        ShoppingList.findOne({owners: user._id}, {owners: [user._id]}, function(err, list){
            if (err || !list){
                return res.status(404).send({error: 'List not found'});
            }
            var listItem=new ListItems({
                title: req.body.data.title,
                count: req.body.data.count,
                photo: req.body.data.photo,
                _list: list._id
            });
            listItem.save(function (err){
                    if (err){
                        return res.status(500).send({error: 'Error fetching list items'});
                    }
                    res.send(listItem);
                });
        });
    });
};


exports.remove_item = function (req, res){
    //todo Проверить принадлежность пользователю
    ListItems.remove({_id: req.body.item_id}, function(err){
        if (err){
            return res.status(500).send({error: 'Error during removing id'})
        }

        res.send({status: 'Ok. deleted'});
    });
}

exports.set_push_id=function(req, res){
    loadUser(req.body.login,req.body.secret,function(err, user){
        if (err || !user){
            return res.status(403).send({error: 'Access denied'});
        }
        user.push_id=req.body.push_id;
        user.save(function (err){
            if (err){
                return res.status(500).send({error: 'Error setting push_id of user #'+user._id})
            }
            res.send(user);
        });
    })
};

var loadUser=function(login, secret, callback){
    User.findOne({
        login: login,
        secretkey: secret
    }, callback);
};

var loadListByUser = function(login, secret, callback){
    loadUser(req.body.login,req.body.secret,function(err, user){
        if (err || !user){
            return callback(err, null);
        }

        ShoppingList.findOne({owners: user._id}, {owners: [user._id]}, callback);
    });
};