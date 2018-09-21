var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var mongoDB = 'mongodb://127.0.0.1/photos';
mongoose.connect(mongoDB);
var Schema = mongoose.Schema;

var photoSchema = new Schema({
    name: String,
    path: String,
    originalname: String
});

var albumSchema = new Schema({
    name: {
        type: String,
        defult : ""
    },
    cover: {
        type: String,
        defult : ""
    },
    photos: [{
        type: Schema.Types.ObjectId,  //REFERENCING :D
        ref: 'Photo'
    }]
});

var userSchema = new Schema({
    username: {
        type: String,
        unique : true
    },
    name: {
        type: String
    },
    password :{
        type: String,
        defult: ""
    },
    albums: [{
        type: Schema.Types.ObjectId, 
        ref: 'Album' 
    }]
});
userSchema.plugin(passportLocalMongoose);

var Album = mongoose.model('Album', albumSchema);
var Photo = mongoose.model('Photo', photoSchema);
var User = mongoose.model('User', userSchema);

exports.Album = Album;
exports.Photo = Photo;
exports.User = User;