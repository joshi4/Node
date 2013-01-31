var http = require('http'); 
var url = require('url'); 

function renderNewPostForm( request, response)
{

	response.writeHead('200', 
	{ 

		'Content-type' : 'text/plain'

	}); 

	//response.write("HelloWorld"); 

	response.end("Hello World"); 


} ; 


function render404page(request, response)
{

	response.writeHead(404); //send back error code in the header. 
	

	//response.write("HelloWorld"); 

	response.end("Error! 404 Page not found."); 


}


var server = http.createServer(function (request, response) {

var newPostFormRegExp = new RegExp('^/posts/new/?$'); 
var pathname = url.parse(request.url).pathname; 

//now we test to see whether the new post url has been requested.

//this part should probably go in the router. 

if (newPostFormRegExp.test(pathname)) 
	{
		renderNewPostForm(request, response); 
	} 
else
	{
		render404page(request, response); 
	}



}); 

server.listen(8888); 

console.log("listening to http://127.0.0.1 on port 8888"); 


