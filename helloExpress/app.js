
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

  //static folder for our CSS stylesheets. 
  app.use(app.router); //search for the appropriate route before dropping further. 

  app.use(express.static(__dirname + 'public'));


  

}); 


//Writing your own routes. 

app.get("/", function(req,res)
  {
    res.render("home.jade" ,{ title: "Building webApps in node with Express"}); 
    //res.send("Hello, Express!")
  }

  );



app.get("/other", function(req,res)
{
  res.send("You are viewing the other page.  "); 
});

//using a regex for a route. .

app.get(/\/users\/(\d*)\/?(edit)?/ , function a(req,res)

{
  var message = "User #" + req.params[0] +" 's profile"; 

  if (req.params[1] == 'edit') {message = "Editing " + message; } 
    else{ message = "Viewing " + message ; }

res.send(message)

}//end of callback.

  );//end of get request



app.get("/users/:userId", function (req,res) {

  //a(req,res); 
  res.send("<h1>Hello! user: " + req.params.userId); 
});




//making a post request. 

//for a post request the relevant info is in the body of the req 
//message. 

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
