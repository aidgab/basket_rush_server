/**
 * generates random string of a give length
 * @param len
 * @returns {*}
 */
exports.randomString=function(len)
{
    if (len<0){
        return null;
    }

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var l=possible.length;
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * l));

    return text;
}
