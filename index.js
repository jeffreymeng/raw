const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const regex = require("regex");

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

function sendRawFirepad(response, path) {
   
   var Firepad = require('firepad');
   var firebase = require('firebase');
   var id = path.split("/")[3];
   
   // Initialize Firebase.

   var config = {
      apiKey: "AIzaSyBQ2E4ISQoIcRsDxfPxzDjbJwmD-r98JYw",
      authDomain: "techedit-63e7f.firebaseapp.com",
      databaseURL: "https://techedit-63e7f.firebaseio.com",
      projectId: "techedit-63e7f",
      storageBucket: "techedit-63e7f.appspot.com",
      messagingSenderId: "609280907475"
   };
   //firebase.initializeApp(config);

   //var rootRef = firebase.database().ref();
   //var firepadRef = rootRef.ref("/f/" + id + "/");
   
   //console.log(id);
   //console.log(path);
   
   //var headless = new Firepad.Headless(firepadRef);
   
   //headless.getText(function(text) {
      //console.log("Contents of firepad retrieved: " + text);
      
      response.writeHead(200, {
         "Content-type": "text/html"
      });
      response.end("Techedit Raw File Path<br>Path: " + path + "<br>Id: " + id + "<br>text here soon");
   //});
   //headless.dispose();
   

}

function sendPage(response, filePath, fileContents) {
   response.writeHead(200, {
      "Content-type": mime.lookup(path.basename(filePath))
   });
   response.end(fileContents);
}

function serverWorking(response, absPath) {
   //techedit
   console.log("CHECKPOINT LOG");
   //console.log(absPath);
   console.log(absPath.substring(0,18));
   if (absPath.substring(0,18) === "./public/techedit/") {
      sendRawFirepad(response, absPath);
   }
   else {
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
