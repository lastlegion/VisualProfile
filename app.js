var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();
 

var request = require('superagent'); 

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
var apiGate=  "https://api.github.com"
var out = {"name": "repos", "children": []}
var stars = []

app.get("/repos", function(req, resp){
var out = {"name": "repos", "children": []}
var stars = []

    function getAllRepos(url){
        console.log(apiGate+url)
        request.get(apiGate+url)
            .set("Authorization", "token "+process.env["GITHUB_TOKEN"])
        .end(function(err, res){
            var headers = res.headers
            var body = res.body
            //console.log(body)
            console.log(headers)
            var repos = body
            for(var i in repos){
                var repo = repos[i];
                //console.log(repo)
                if(repo.stargazers_count > 0){
                    var r = {}
                    r.stargazers_count = repo.stargazers_count
                    r.description = repo.description;
                    r.name = repo.name
                    console.log(r.name)
                    r.url = repo.html_url
                    stars.push(r)
                }
                
            }
            if(headers){
                console.log(headers.link)    
                link = headers.link
                //console.log(nl)
                hasnext = (/rel=\"next\"/i).test(link)
                hasprev = (/rel=\"next\"/).test(link)
                console.log(hasnext)
                if(hasnext){
                var link = headers['link']
                var nl = link.split(";")[0]
                nl = nl.split(",")[0].substr(apiGate.length+1,nl.length-apiGate.length-2)
                    getAllRepos(nl)
                } else{     
                       out.children = stars
                       resp.send(out)
                }   
            }
        })


    }
    console.log("running...")
    var url ="/users/lastlegion/repos"
    getAllRepos(url)

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

