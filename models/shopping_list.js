var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppingListSchema = new Schema({
    owners: [String],
    createdAt: { type: Date, default: Date.now }
});

ShoppingListSchema.statics.findOrCreate = function (condition, data, callback) {
    var ShoppingList=this.model('ShoppingList');
    ShoppingList.findOne(condition, function (err, item){
        if (err){
            callback(err, item);
            return;
        }
        if (item){
            callback(err, item); //Ok Item found.
        }
        else {
            //Ok, but no such item - should create
            item=new ShoppingList(data);

            item.save(function(err) {
                callback(err, item);
            });
        }
    });

};

var ShoppingList = module.exports=mongoose.model('ShoppingList', ShoppingListSchema);