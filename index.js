const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

//plaintext 404 or 404 html page.
const html404 = true;
//if 404 html page, this is path to 404 html page. for plaintext 404, set to null
const html404path = "errorPages/404.html";

function send404(response) {
   if (!html404) {
      //plaintext 404
      response.writeHead(404, {
         "Content-type": "text/plain"
      });
      response.write("Error 404: resource not found");
      response.end();
   }
   else {
      fs.readFile(html404path, function(err, data) {
         if (err) {
            // 404 page does not exist. write plaintext 404 page instead
            response.writeHead(404, {
               "Content-type": "text/plain"
            });
            response.write("Error 404: resource not found.");
            response.end();
         }
         else {

            response.writeHead(404, {
               "Content-type": mime.lookup(path.basename(html404path))
            });
            response.end(data);
         }
      });
   }
}

function sendPage(response, filePath, fileContents) {
   response.writeHead(200, {
      "Content-type": mime.lookup(path.basename(filePath))
   });
   response.end(fileContents);
}

function serverWorking(response, absPath) {
   fs.exists(absPath, function(exists) {
      if (exists) {
         fs.readFile(absPath, function(err, data) {
            if (err) {
               send404(response);
            }
            else {
               sendPage(response, absPath, data);
            }
         });
      }
      else {
         send404(response);
      }
   });
}
var server = http.createServer(function(request, response) {
   var filePath = false;

   if (request.url == '/') {
      filePath = "public/index.html";
   }
   else {
      filePath = "public" + request.url;
   }

   var absPath = "./" + filePath;
   serverWorking(response, absPath);
});

/* const portNumber = */
server.listen(process.env.PORT || 3000);
