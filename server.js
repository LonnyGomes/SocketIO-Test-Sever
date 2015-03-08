/*************************************
//
// socketioserver app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var runningPortNumber = process.env.PORT || 7777;


// I need to access everything in '/public' directly
app.use(express.static(__dirname + '/public'));

//set the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// logs every request
app.use(function(req, res, next){
    // output every request in the array
    console.log({method:req.method, url: req.url, device: req.device});

    // goes onto the next function in line
    next();
});

app.get("/", function(req, res){
    res.render('index', {});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// socket io code
io.sockets.on('connection', function (socket) {
    io.sockets.emit('blast', {
        timeStamp: Date.now(),
        msg: "<span style=\"color:red !important\">someone connected</span>"
    });

    socket.on('blast', function(data, fn){
        console.log(data);
        io.sockets.emit('blast', {
            timeStamp: Date.now(),
            msg: data.msg
        });

        fn();//call the client back to clear out the field
    });
});


server.listen(runningPortNumber, function() {
    console.log("Running server on port " + runningPortNumber);
});

