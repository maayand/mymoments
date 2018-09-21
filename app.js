var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = require('./routes/users');
var albumsRouter = require('./routes/albums');
var adminRouter = require('./routes/admin');
var model = require('./models/Photos');
var User = model.User;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'weissdaester',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(multer({dest: './public/uploads/'}).any('photos'));

app.get('/:albumId/download/:id/', adminRouter.download);
app.get('/:albumId/remove/:photoId/', adminRouter.remove);
app.get('/upload/:albumId/', adminRouter.get_upload_photos_to_album_form);
app.post('/createphoto/:albumId/', adminRouter.post_upload_photos_to_album_form);
app.get('/admin/:albumId/', adminRouter.admin);
app.get('/uploadalbum', adminRouter.get_uploadalbum_form);
app.post('/createalbum/',adminRouter.post_uploadalbum_form);

app.get('/', albumsRouter.get_album_list);
app.get('/albums_photos/:id/',albumsRouter.get_album_photos_list);

app.get('/register', users.register);
app.post('/register', users.doRegister);
app.get('/login', users.login);
app.post('/login', users.doLogin);
app.get('/logout', users.logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
