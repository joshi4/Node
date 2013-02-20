
/**
 * Module dependencies.
 */


/**
 * Module dependencies.
 */

var  express = require('express')
  , http = require('http'),
    mongoose = require('mongoose'); 
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
  //static folder for our CSS stylesheets. 
  app.use(app.router); //search for the appropriate route before dropping further. 

  app.use(express.static(__dirname + '/public'));
  app.use(function(req,res){
    console.log(req.body); 
    res.send(404,"Page not found")
  }); 


  app.use(function(err,req,res,next) {
    res.status(err.status || 404 ); 
    res.send(err.message); 
  })

}); 


//layer of middleware. 


mongoose.connect('mongodb://localhost/helloexpress'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("Connected to DB"); 
});



var UserSchema = new mongoose.Schema({ 
  name: String,
  email: String,
  age: Number
}) ; 

var Users = mongoose.model('Users', UserSchema); 



//PARAM call

app.param('name', function(req,res,next,name){
  Users.find({name: name}, function(err,docs){
    req.user = docs[0] ; 
    next() ; 
  }); 
}); 

//Display newly created user


//Update Route

app.put('/users/:name', function(req,res){
  console.log("Entered update") ;
  var b = req.body ; 
  Users.update(
  { name: req.params.name }, 
  { name: b.name, age: b.age, email: b.email }, 
  function(err){ console.log(b.name); res.redirect("/users/" + b.name); }

  ); 
});




app.get('/charts',function(req,res){
  res.render('users/charts', {scripts: ['javascripts/jscharts.js']}); 
});

//VIEW USERS
app.get('/users', function(req,res){
  Users.find({},function (err,docs){
    res.render('users/index',{users: docs} ); 
  }); 
}); 


//NEW USER
app.get('/users/newb', function(req,res){
  res.redirect('/users/new');  
}); 

app.get('/users/new', function(req,res){
  res.render("users/new") ; 
}); 

// CREATE 

app.post('/users',function(req,res){
  var b = req.body ; 
  new Users({
    name: req.body.name,
    email: b.email,
    age: b.age

  }).save(function(err,user){
      if(err) res.json(err); 
      res.redirect('/users/' + user.name) ; 
    });  
}); 





//EDIT user. 

app.get('/users/:name/edit', function(req,res){
  res.render('users/edit', {user: req.user}); 

});


/*app.get('/users/:name', function(req,res){
  console.log("Entered show users") ;
  res.render('users/show', {user: req.user}); 
}); */



// we have now done CRU and just need to DELETE users. 

app.delete('/users/:name', function(req,res) {
  Users.remove({name: req.params.name}, function(err){
    res.redirect('/users'); 
  }); 

}) ; 

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
