var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var plantDetailsApiRouter = require('./routes/plantdetails');
var plantDetailsRouter = require('./fe-routes/plantdetails');



const PORT = process.env.PORT || 5000;

const mongoDB = 'mongodb+srv://faiqiqbal37:plant1234@plant-recognition.abudcv7.mongodb.net/';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

var app = express();
app.use(cors());


app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(express.static('server'));

app.use('/', indexRouter);
app.use('/plantdetails', plantDetailsRouter);
app.use('/users', usersRouter);
app.use('/api/plantdetails', plantDetailsApiRouter);



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



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
