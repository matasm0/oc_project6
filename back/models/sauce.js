const mongoose = require('mongoose');
require('../client');

const sauceSchema = mongoose.Schema({
    userId : {type : String, required : true},
    name : {type : String, required : true},
    manufacturer : {type : String, required : true},
    description : {type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String, required : false},
    heat : {type : String, required : true},
    likes : {type : Number, required : true},
    dislikes : {type : Number, required : true},
    usersLiked : {type : Array, required : false},
    usersDisliked : {type : Array, required : false}
});

module.exports = mongoose.model("Sauce", sauceSchema, collection = "sauces");