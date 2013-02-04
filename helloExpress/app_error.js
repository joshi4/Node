
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
 /* , routes = require('./routes')
  , user = require('./routes/user')
  
  , path = require('path'); */

var app = express(); 





app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //for setting properties that have true or false values. 
  //express allows for a function called app.enable("prop.")
  // 1. view cache
  // 2. case sennsitive routes. 
  // 3. strict routing -- traling \ has a significance. 
  app.use(express.bodyParser());
  //express.bodyParser() is middleware. 

  //browsers can only make get ( Read ) and Post (Create) request
  //they can't make put ( Update) and delete( Delete) req. 
  // we overcome this by adding a hidden _method field in the 
  //form being sent and based on this we can call relvant func.
  //server side. 

  //need to have the body parsed to actually use 
  //method override on this. 

  app.use(express.methodOverride()); 
  app.use(express.cookieParser()); 
  app.use(express.session({secret: 'raaz'})); 
  //static folder for our CSS stylesheets. 
  app.use(app.router); //search for the appropriate route before dropping further. 

  app.use(express.static(__dirname + '/public'));
  app.use(function(req,res){
    res.send(404,"Page not found")
  }); 


  app.use(function(err,req,res,next) {
    res.status(err.status || 404 ); 
    res.send(err.message); 
  })

}); 


//layer of middleware. 

app.param('username', function (req,res,next,username) {
  // body...
  if ( username !== 'shantanu'){
    req.user = username ; 
    next(); 
  }
  else
  {
    next(new Error("User does not exist")); 
  }
}); 

app.get('/users/:username', function(req,res,next) {
  
  res.send(req.user + "'s Profile Page"); 
}); 




app.get('/', function(req,res){
  res.send("Index"); 
})


app.post("/users", function(req,res)
   {
      res.send("Creating new user with the name " + req.body.username + ".\n"); 

   }//end of callback 
   );//end of post



 /*app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list); */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
