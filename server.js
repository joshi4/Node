var http = require("http");

/*http.createServer( function(request, response)
{
response.writeHead(200, {"Content-Type": "text/plain"}); 
response.write("HelloWorld!"); 
response.end(); 
}).listen(8888); */ 

// let's make this more readable: 


function foo (request, response)
{

response.writeHead(200, {"Content-Type": "text/plain"}); 
response.write("HelloWorld!"); 
response.end(); 

}



var server = http.createServer(foo); 
server.listen(8888) ; 

