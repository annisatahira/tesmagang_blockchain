var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var balance_router = require('./routes/balance');
//var token_router = require('./routes/token');
var base_url = "/v1";
const bodyParser = require('body-parser');
const cors = require('cors');

const web3_setting = require('./utils/web3_setting');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
 extended: true
}));
app.use(bodyParser.json());

//routes that user can access
app.use(base_url, balance_router);

// error handler
app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
 res.status(err.status || 500);
 res.render('error');
});

//set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//home route
app.get('/', function (req, res) {
 res.send('Good, nodejs is works....')
})

app.listen(port, function () {
 console.log('Server running on port ' + port);
})

module.exports = app;