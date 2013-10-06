var easyimg = require('easyimage');

exports.upload = function (req, res){
    console.log(req.files);
    res.send({message: 'Ok. uploaded'});
    var fileNames=Object.keys(req.files);
    easyimg.thumbnail({
        src: req.files[fileNames[0]].path,
        dst: '48x_'+fileNames[0],
        width: 48,
        height: 48
    },
        function (err, image){});
}