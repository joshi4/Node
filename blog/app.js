
/**
 * Module dependencies.
 */

var express = require('express'); 
/*  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');*/

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

app.configure(function(){
 // app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static((__dirname+ '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var articleProvider= new ArticleProvider();


app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', {
            title: 'Blog',
            articles:docs
            }
        );
    })
})


app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', {
        title: 'New Post'
    }
    );
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});



/*app.get('/', function(req,res){
  articleProvider.findAll(function(error,docs){

    res.send(docs); 
  }); 
  })*/


app.listen(3000) ; 













//app.get('/users', user.list);










/*http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});*/
