
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.create = function(req, res){
    res.send({
        login: 'test user',
        secretkey: 'keyboardcat'
    });
}