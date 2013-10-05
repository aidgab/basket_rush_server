/**
 * Push notification services
 * @type {*}
 */
var https=require('https');

module.exports=function(appkey){
    return {
        send: function (data) {
            var options = {
                hostname: 'android.googleapis.com',
                port: 443,
                path: '/gcm/send',
                method: 'POST',
                headers: {
                    'Authorization': appkey,
                    'Content-Type': 'application/json'
                }
            };

            var req = https.request(options, function(res) {
                console.log("statusCode: ", res.statusCode);
                console.log("headers: ", res.headers);

                res.on('data', function(d) {
                    process.stdout.write(d);
                });
            });
            req.write(data.toString());
            req.end();

            req.on('error', function(e) {
                console.error(e);
            });
        }
    };
};