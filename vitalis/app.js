
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose'); 

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
  app.use(function(req,res){
    res.send(404,"Page not Found"); 
  });
});


//CODE FOR INITIALIZING THE DATABASE: 

//----------------------------------------------------------
mongoose.connect('mongodb://localhost/vitalis'); 
var db = mongoose.connection ; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("Connected to DB Vitalis"); 
});

//----------------------------------------------------------





//Creating the login Schema in the DB
//----------------------------------------------------------
var loginSchema = new mongoose.Schema({
  username: String, 
  password: String
}); 


//Compiling this Schema into a Model: 

var loginInfo = mongoose.model('loginInfo', loginSchema); 

//----------------------------------------------------------





//----------------------------------------------------------
//need a way to populate the DB


app.get('/',function(req,res){
  res.redirect('/login'); 
}); 


app.get('/login', function(req,res){
  res.render('users/login'); 
}); 

app.get('/users/new', function(req,res){
  res.render('users/new');//from here post request adds doctor.  
});

app.get('/users/:username', function(req,res){
  console.log("Display paitents for Dr. " + req.params.username ); 
  res.render('comingsoon'); 
}); 
//the login buttong creates a POST request for /login 

app.post('/login',function(req,res){
  var b = req.body ; 
  loginInfo.find({username: b.username},function(err,user){ 
      if(user[0].username != b.username || user[0].password != b.password || err) {
        console.log("DBusername = " + user[0].username + "Requsername = " + b.username); 
        console.log("DBpass = " + user[0].password + "Reqpassword = " + b.password); 
        
        res.redirect('/login');
      }
      //try again. 
      else{

        res.redirect("/users/" + user.username); 
          } 
    } ); 
}); 



//The signup button generates a POST request for /users. 



app.post('/users', function(req,res){
  var b = req.body ; 
  //save new user to database. 
  new loginInfo({
      username: b.username,
      password: b.password
    }).save(function(err,user){
      //saving the user to the DB
      if(err) {res.redirect('/users/new');}
      else{

      console.log(user.username);
      console.log(user.password);
      console.log(user.id); 
      res.redirect('/login'); 
    }
    }); 
}); 


app.get('users/:username', function(req,res){
  res.render('users/showpatients', {user: req.params.username}); 
});



//app.post('/')

//STARTING THE SERVER UP .
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
