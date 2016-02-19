var Netcat = require('node-netcat');
var http = require('http');

var os = require('os');
var dirty = require('dirty');
var db = dirty('presets.db');
var clientdb = dirty('clients.db')
var clients = [
//  Netcat.client(8001,'localhost'),
  //Netcat.client(23,'192.168.1.126'),
  //Netcat.client(23, '192.168.1.165')
];
var clientModule = require('./lib/clientModule');
var socketModule = require('./lib/socketModule');
var initializationModule = require('./lib/initializationModule');
var self = this;
clientModule.closed = false;

var clientCallback = function(data) {
  console.log("Back in clientCallback");
  clients.push (data);
  //clientModule.closed = false;

}

if (clients.length === 0) {
  console.log("init");
initializationModule.start(clientdb,clientCallback);
}

var id;
var pin;

var dataCallback = function (client,data) {
  console.log(data.indexOf('brightness'));

  if (data.indexOf('brightness:') > -1) {

    var brightness = data.replace('brightness:', '');

    console.log('Got brightness data', brightness, socketModule.socket !== null);

    if (socketModule.socket !== null) {
      console.log('emitting...');
      socketModule.socket.emit('brightness', { 'brightness': brightness });
    }
  }
};



socketModule.clients = clients;

clientModule.start(clients, dataCallback);

var connectCallback = function () {
  //clientModule.getBrightness(clients[1], 7);

};

var url = require('url');
var fs = require('fs');
var path = require('path');


db.on('load', function() {
  console.log('Loading values from key-value store');
  });

  db.forEach(function(key, val) {
  console.log('Found key: %s, val: %j', key, val);
  });

db.on('drain', function() {
  console.log('All records are saved on disk now.');
});
clientdb.on('load', function() {
  console.log('Loading clients from key-value store');
  });

clientdb.forEach(function(key, val) {
  console.log('Found key: %s, val: %j', key, val);
  });

clientdb.on('drain', function() {
  console.log('All records are saved on disk now.');
});

function handler(req, res){

  var form = '';
  var my_path = url.parse(req.url).pathname;
  var full_path = path.join(process.cwd(),my_path);
  fs.exists(full_path,function(exists){
    if(!exists){
      res.writeHeader(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
    }
    else{
      fs.readFile(full_path, "binary", function(err, file) {
         if(err) {
           res.writeHeader(500, {"Content-Type": "text/plain"});
           console.log(full_path+" ends up here")
           res.write(err + "\n" );
           res.end();

         }
          else{
          res.writeHeader(200);
          res.write(file, "binary");
          res.end();
        }

      });
    }
  });
};
var listener = http.createServer(handler).listen(3000, function(err){
  if(err){
  console.log('Error starting http server');
  } else {
  console.log("Server running at http://localhost:3000/");
  };
});
socketModule.start(listener, connectCallback);
