var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var github = require("octonode");

var client = github.client();

console.log("running")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


var client = github.client("<your_key>");
var ghme = client.me();
app.get("/repos", function(req, res){
    ghme.repos(1,100, function(err, body, headers){
        //console.log(body)
        console.log(headers)
        var repos = body;
        var out = {"name": "repos", "children": []}
        var stars = []
        for(i in repos){
            var repo = repos[i];
            if(repo.stargazers_count > 0){
                var r = {}
                r.stargazers_count = repo.stargazers_count
                r.description = repo.description;
                r.name = repo.name
                r.url = repo.html_url
                stars.push(r)
            }
            
        }
        console.log(body)
     
        out.children = stars
        res.send(out)
    })
})
app.use('/users', users);

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

app.set('port', process.env.PORT || 1337);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

