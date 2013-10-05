
/*
 * GET users listing.
 */
var User = require('./../models/user');

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