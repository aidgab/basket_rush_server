var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListItemSchema = new Schema({
    title: String,
    count: String,
    photo: String,
    createdAt: { type: Date, default: Date.now },
    _list: {
        type: String,
        ref: 'ShoppingList'
    }

});

var ListItem = module.exports=mongoose.model('ListItem', ListItemSchema);