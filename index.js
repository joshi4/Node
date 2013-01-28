// import modules. 
var server = require("./server"); 
var router = require("./router"); 

//call the server. 

//we have now extended the server and are passing in a 
// function as a parameter. 

// corresponding change is reflected in the start function in 
// server.js
server.start(router.route)
