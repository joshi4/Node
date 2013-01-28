var http = require("http");
var url = require("url"); 
/*http.createServer( function(request, response)
{
response.writeHead(200, {"Content-Type": "text/plain"}); 
response.write("HelloWorld!"); 
response.end(); 
}).listen(8888); */ 

// let's make this more readable: 


/*function foo (request, response)
{
console.log("server requested"); 
var pathname = url.parse(request.url).pathname; 
console.log("Request for url: " + pathname + " received") ; 



response.writeHead(200, {"Content-Type": "text/plain"}); 
response.write("HelloWorld!"); 
response.end(); 

}

*/


function start (route) { 

var server = http.createServer(function (request, response) {

console.log("server requested"); 
var pathname = url.parse(request.url).pathname; 
console.log("Request for url: " + pathname + " received") ; 

//call to the router.js

route(pathname) ; 

response.writeHead(200, {"Content-Type": "text/plain"}); 
response.write("HelloWorld!"); 
response.end(); 

});
 
server.listen(8888) ; 

console.log("server has started"); 

} // encapsulating server code within function start. 

// now exporting the function start. 

exports.start = start ;  

