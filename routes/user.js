
/*
 * GET users listing.
 */
var mongoose = require('mongoose'),
    User = require('./../models/user'),
    ShoppingList  = require('./../models/shopping_list'),
    ListItems = require('./../models/list_items'),
    gcm = require('node-gcm');

var pushSender = new gcm.Sender('AIzaSyCMlwvZkdVDIKqexsH3qeG2MwCzPbtdpX4');
//todo refactor here. HARDCODE WARNING!

exports.create = function(req, res){
    var partner_login=req.body.partner_login.replace(/[ \-()]/g,''),
        login=req.body.login.replace(/[ \-()]/g,'');

    console.log('registering user: ');
    console.log(req.body);
    User.findOrCreate({login: login}, {
        login: login,
        partner_login: partner_login,
        gender: req.body.gender
    }, function (err, user){
        if (err){
            res.status(500).send({
                error: 'Server error occured'
            });
            return;
        }

        console.log('User registered:');
        console.log(user);
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
                    res.send({items: items});
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

                    //Оповестить оппонента
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

                    console.log('Opponent id:  '+opponent_id);
                    User.findOne({_id: opponent_id}, function (err, opponent){
                        if (err){
                            console.log(err);
                            return console.log('Error while notifying opponent');
                        }
                        sendPushMessage({
                            action: 'item_added',
                            message: 'Список пополнен',
                            item: listItem
                        }, [opponent.push_id]);
                    });


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

//Я поехал
exports.started_trip = function(req, res){
    var msg={
        action: 'started_trip',
        message: 'Я поехал в магазин!'
    };
    res.send(msg);

    loadUser(req.body.login, req.body.secretkey, function (err, user){
        var opponent_id;
        loadListByUser(req.body.login, req.body.secretkey,function (err, list){
            if (err){
                return console.log('Error fetching opponent\'s id');
            }
            var owners= list.owners.map(function( ingredient ) {
                return mongoose.Types.ObjectId(ingredient);
            });

            for (var i in owners){
                if (owners[i]!=user._id){
                    opponent_id=owners[i];
                }
                //Get opponent by id
                User.findOne({_id: opponent_id}, function (err, opponent){
                    sendPushMessage(msg, [opponent.push_id]);
                });
            }
        });
    });
}

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

var sendPushMessage = function(data, recipients){
    var message = new gcm.Message({
        collapseKey: 'Посмотреть',
        data: data
    });

    // At least one required
    //registrationIds.push(user.push_id);

    pushSender.send(message, recipients, 4, function (err, result) {
        console.log(result);
    });
};