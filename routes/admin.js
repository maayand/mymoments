var my_models = require('./../models/Photos');
var photoModel = my_models.Photo;
var albumModel = my_models.Album;
var userModel = my_models.User;
var fs = require('fs');
var _path = require('path');
var join = _path.join;

exports.get_uploadalbum_form = function (req, res, next) {
  res.render('uploadalbum', {
    title: 'Upload album',
    user: req.user,
    page_name: 'upload'
  });
};

exports.post_uploadalbum_form = function (req, res, next) {
  var photoIds = [];
  var photoPaths = [];
  var albumsIds = [];
  for (var i = 0; i < req.files.length; i++) {
    var file = req.files[i];
    var fileName = file.filename;
    var originalname = file.originalname;
    var path = './public/uploads/' + fileName;
    fs.rename(
      path,
      join(__dirname, '/../public/images/' + originalname),
      function (err) {
        if (err)
          console.error(err);
      }
    );
    var newPhoto = new photoModel({
      name: originalname,
      path: '/images/' + originalname,
      originalname: originalname
    })
    newPhoto.save();
    photoIds.push(newPhoto._id); 
    photoPaths.push(newPhoto.path);
  }
  var albumName = req.body.name;
  var album = new albumModel({
    name: albumName,
    cover: photoPaths[0],
    photos: photoIds
  })
  album.save();
  var albumId = album._id;
  var userId = req.user._id;
  userModel.findById(userId, function (err, user) {
    if (err) {
      console.error(err);
    }
    user.albums.push(albumId);
    user.save();
    res.redirect('/');
  });
};


exports.get_upload_photos_to_album_form = function (req, res, next) {
  res.render('upload', {
    title: 'Upload Photo',
    user: req.user,
    page_name: 'upload-photos',
    albumId: req.params.albumId
  });
};

exports.post_upload_photos_to_album_form = function (req, res, next) {
  var photoIds = [];
  for (var i = 0; i < req.files.length; i++) {
    var file = req.files[i];
    var fileName = file.filename;
    var originalname = file.originalname;
    var path = './public/uploads/' + fileName;
    fs.rename(
      path,
      join(__dirname, '/../public/images/' + originalname),
      function (err) {
        if (err)
          console.error(err);
      }
    );
     var newPhoto = new photoModel({
      name: originalname,
      path: '/images/' + originalname,
      originalname: originalname
    })
    newPhoto.save();
    photoIds.push(newPhoto._id);
  }
  var albumId = req.params.albumId;

  albumModel.findById(albumId , function(err,album){
    for(var i = 0 ; i<photoIds.length; i++){
      album.photos.push(photoIds[i]);
    }
    album.save();
    res.redirect('/albums_photos/' + albumId +'/'); 
  })
};

exports.download = function(req, res, next) {
  var id = req.params.id;

  photoModel.findById(id, function (err, photo) {
    if (err) {
      return next(err);
    }

    var path = join(__dirname, '/../public/' + photo.path);
    res.download(path, photo.name + '.jpg');
  });
}

exports.remove = function (req, res, next) {
  var photoId = req.params.photoId;
  var albumId = req.params.albumId;

  photoModel.remove({
    _id: photoId
  }, function (err, photo) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/admin/' + albumId);
    }
  });
};

exports.admin = function (req, res, next) {
  var album_id = req.params.albumId;
  albumModel.find({
    _id: album_id
  }, function (error, albums) {
    var photoIds = albums[0].photos;
    photoModel.find({
      _id: photoIds
    }, function (err, photos) {
      if (err) {
        console.error("error on fetching photos");
        console.error(error);
      }
      res.render('admin', {
        title: 'admin',
        photos: photos,
        page_name: 'admin',
        albumId: album_id,
        user: req.user
      });
    });
  })
};
