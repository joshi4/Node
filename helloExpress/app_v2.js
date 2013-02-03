
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

  app.use(express.static(__dirname + '/public'));


  

}); 

//keep trac of how many times the hello.txt has been accessed.

var count = 0 

app.get("/hello.txt", function(req,res,next){
  count = count + 1 ; 
  next(); //so tht it goes to the static dir. 
});

app.get("/count", function(req,res){
  res.send(" "+ count + " Views\n"); 
});



var guestnames = [ {name : "shantanu"}, 
            {name : "shreyeas"}, 
            {name : "shrikant"}, 
            {name: "jyotsna"}]; 


/*app.param('userId', function(req,res,next,userId){
  req.user = guestnames[parseInt(userId,10)];  
  next(); 
});*/

function locateUser(req,res,next)
{
  req.user = guestnames[parseInt(req.params.userId, 10)]; 
  next(); 
}


app.get('/guests/:userId',locateUser, function(req,res){
  res.json(req.user);  
});

//route preconditioning - something that is common to many routes. 
app.param('from', function(req,res,next,from)
  {
    //add a property to req

    req.from = parseInt(from, 10); 
    next(); //v imp to call this so that it goes further down. 
  });


app.param('to', function(req,res,next,to)
  {
    //add a property to req

    req.to = parseInt(to, 10); 
    next(); //v imp to call this so that it goes further down. 
  });


//Writing your own routes. 
var users = [ 'joshi', 'shantanu', 'shreyas', 'jyotsna', 'shrikant']; 


app.get('/users/:from-:to', function(req,res){
  res.json(users.slice(req.from, req.to + 1)); 


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
