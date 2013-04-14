
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

//Creating the Patient Schema: 

var patientSchema = new mongoose.Schema({
  name: String,
  doctor: String,
  gender: String,
  patientId: String,
  pulse: [Number],
  oxygen: [Number],
  temp: [Number],
  fall: Number,
  Alarm: Number});  

  /*Explanation:
    1. name,gender: Self explanatory
    2. Unique patient ID for each patient with which we can search DB
    3. Pulse,oxygen,temp - Strings so that we can have multiple values and thus use them in 
       plotting graphs this may change later. 
    4.fall and alarm are basically zero or one values. */ 


//compiling the Schema to a module:

var patientInfo = mongoose.model('patientInfo',patientSchema); 




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
  //search all the patients: 
  patientInfo.find({doctor: req.params.username}, function(err,docs){
      res.render('users/patientlist', {patients: docs}); 
    }); 
 // res.render('comingsoon'); 
}); 

app.get('/new/patient', function(req,res){
    res.render('users/addpatient'); 
  });


app.get('/:username/patient/:patientname',function(req,res){
  patientInfo.find({
    doctor: req.params.username, 
    name: req.params.patientname
  }, function(err,docs){
    console.log(docs); 
    res.render('patients/patientinfo', {patients: docs[0], 
                                        scripts: ['../../javascripts/smoothie.js']}); 
    // also make post requests, based on unique id. 
  });
});


//POST REQUEST TO CREATE A NEW PATIENT. 
app.post('/new/patient/?', function(req,res){
  var b = req.body 
  new patientInfo({
  name: b.name,
  doctor: b.doctor,
  gender: b.gender,
  patientId: b.patientId,
  pulse: [0],
  oxygen: [0],
  temp: [0],
  fall: 0,
  Alarm: 0}).save(function(err,patient){
    if(err) res.json(err); 
    res.redirect('/users/' + b.doctor); 
  });
});


//the login buttong creates a POST request for /login 

app.post('/login',function(req,res){
  var b = req.body ; 
  loginInfo.find({username: b.username},function(err,user){ 
      console.log(user);
      if (err){
        res.redirect('/login'); 
      } 
      else if (user === [{}]) {
        res.redirect('/login'); 
        //return handleError(err); 
      }
      else if(user[0].username != b.username || user[0].password != b.password || err) {
        console.log("DBusername = " + user[0].username + "Requsername = " + b.username); 
        console.log("DBpass = " + user[0].password + "Reqpassword = " + b.password); 
        
        res.redirect('/login');
      }
      //try again. 
      else{

        res.redirect("/users/" + b.username); 
          } 
    } ); 
}); 

 
app.get('/updatepatient', function(req,res){
  res.render('users/simulate_wifi'); 
});

app.get('/patientupdate', function(req,res){
  var string_to_parse = req.query.data;
  //console.log(string_to_parse);
  console.log(string_to_parse);
  var pulse_data = string_to_parse.split(","); //array of pulse_data
  var spo2_data = pulse_data.pop().split(";"); //array of spo2_data
  var temp_data = spo2_data.pop().split(":");  //array of temp data
  var alarm_flag = temp_data.pop().split("$"); //array of alarm flags. 
  console.log(pulse_data); 
  console.log(spo2_data); 
  console.log(temp_data);
  console.log(alarm_flag); 



  // update the fall and alarm flags: 

    patientInfo.update(
{
  patientId: "demo"
}, 
{
  $set:
  {
    fall: alarm_flag[0],
    Alarm: alarm_flag[1]
    

  }
},{upsert: true},  function(err, data)
{
  console.log(data); 
  //res.redirect('/updatepatient'); 
  
}
);
  


  //update the pulse readings.
  for (i = 0 ; i < pulse_data.length; i++)
  {

    patientInfo.update(
{
  patientId: "demo"
}, 
{
  $push:
  {
    pulse: pulse_data[i]
    

  }
},{upsert: true},  function(err, data)
{
  console.log(data); 
  //res.redirect('/updatepatient'); 
  
}
);
  } //end of for loop
  
 

//update the o2 readings. 

for (i = 0 ; i < spo2_data.length; i++)
  {

    patientInfo.update(
{
  patientId: "demo"
}, 
{
  $push:
  {
    oxygen: spo2_data[i]
    

  }
},{upsert: true},  function(err, data)
{
  console.log(data); 
  //res.redirect('/updatepatient'); 
  
}
);
  } //end of for loop

 // update the temp readings: 

for (i = 0 ; i < temp_data.length; i++)
  {

    patientInfo.update(
{
  patientId: "demo"
}, 
{
  $push:
  {
    temp: temp_data[i]
    

  }
},{upsert: true},  function(err, data)
{
  console.log(data); 
  //res.redirect('/updatepatient'); 
  
}
);
  } //end of for loop

  res.send(200); //, req.query.value+";"+req.query.p2);  
})

app.put('/updatepatient', function(req,res){
var b = req.body ; 
//console.log(req); 
console.log(b.fall);
console.log(b.alarm); 
patientInfo.update(
{
  patientId: b.patientID
}, 
{
  $push:
  {
    pulse: b.pulse,
    oxygen: b.oxygen,
    temp: b.temperature

  }
},{upsert: true},  function(err, data)
{
  console.log(data); 
  res.redirect('/updatepatient'); 
  
}
);
}); 



/*Message.update({_id: '5064aae4154cb34d14000001' },
         {$push: { 'sent-messages' : delivered }},{upsert:true}, function(err, data) { 
});*/


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


/*app.get('users/:username', function(req,res){
  res.render('users/showpatients', {user: req.params.username}); 
});*/



//app.post('/')

//STARTING THE SERVER UP .
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
