var my_models = require('./../models/Photos');
var photoModel = my_models.Photo;
var albumModel = my_models.Album;
var userModel = my_models.User;
var fs = require('fs');
var _path = require('path');
var join = _path.join;

exports.get_album_list = function async (req, res, next) {
    var user_conditions;
    if (req.user) {
      user_conditions = {
        username: req.user.username
      };
    } else {
      user_conditions = {
        username: 'sample'
      };
    }
    userModel.findOne(user_conditions, function(err, user){
      var albumIds = user.albums;
      
      albumModel.find({
        _id: albumIds
      }, function (err, albums) {
        if (err) {
          console.error("error on fetching albums");
          console.error(error);
        }
        res.render('albums', {
          title: 'Albums list',
          page_name: 'home',
          albums: albums,
          user: req.user,
        });
    });
  })
};

exports.get_album_photos_list = function (req, res, next) {
    var album_id = req.params.id;
    albumModel.find({
      _id: album_id
    }, function (error, albums) {
      var albumName = albums[0].name;
      var photoIds = albums[0].photos;
      photoModel.find({
        _id: photoIds
      }, function (err, photos) {
        if (err) {
          console.error("error on fetching photos");
          console.error(error);
        }
        res.render('photos', {
          title: albumName,
          page_name: 'photos-of-album',
          photos: photos,
          albumId: album_id,
          user: req.user
        });
      });
    })
};
  
  