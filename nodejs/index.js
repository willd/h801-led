var Netcat = require('node-netcat');
var http = require('http');

var os = require('os');
var dirty = require('dirty');
var db = dirty(__dirname+'/'+'presets.db');
var clientdb = dirty(__dirname+'/'+'clients.db');

var clients = [
//  Netcat.client(8001,'localhost'),
  //Netcat.client(23,'192.168.1.126'),
  //Netcat.client(23, '192.168.1.165')
];
var clientModule = require('./lib/clientModule');
var socketModule = require('./lib/socketModule');
var initializationModule = require('./lib/initializationModule');
var self = this;
var pushClient = function(data) {
  clients.push (data);
}
var startClients = function() {
  socketModule.clients = clients;
  clientModule.start(clients, dataCallback);
}
var startInit = function() {
  initializationModule.start(clientdb, pushClient, startClients);
}
var id;
var pin;
var bridge;

var dataCallback = function (container,data) {
  console.log(data);

  if (data.indexOf('brightness:') > -1) {

    var brightness = data.replace('brightness:', '');

    console.log('Got brightness data', brightness, socketModule.socket !== null);

    if (socketModule.socket !== null) {
      console.log('emitting...'+container.client._host);
      socketModule.socket.emit('brightness', {'pin': bridge, 'host': container.client._host, 'brightness': brightness });
    }
  }
};
var connectCallback = function (id, pin) {
  console.log("connectCallback: "+id+" "+pin)
  clientModule.getBrightness(clients[id].client, pin);
  bridge = pin;

};

var url = require('url');
var fs = require('fs');
var path = require('path');


db.on('load', function() {
  console.log('Loading values from key-value store');

  db.forEach(function(key, val) {
    console.log('Found key: %s, val: %j', key, val);
  });
});
db.on('drain', function() {
  console.log('All records are saved on disk now.');
});
clientdb.on('load', function() {
  console.log('Loading clients from key-value store');
  var id = 0;
    clientdb.forEach(function(key, val) {
      console.log('Found key: %s, val: %j', key, val);
      for (i in val.pins) {
        var object = {id: id, cid: key, shortname: val.shortname, value: 0, host: val.host, pin: val.pins[i]};
        console.log();
        socketModule.values.push(object);
        id = id + 1;
      }

      clients.push({key: key, client: Netcat.client(11112,val.host)})

    });
    if(clients.length !== 0) {
      startClients();
    }
    else {
      startInit();
    }
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
           if(full_path === __dirname+"/") {
             fs.readFile(full_path+"/index.html", "binary", function(err, file) {
               res.writeHeader(200);
               res.write(file, "binary");
               res.end();
             });
           }
           else {
             res.writeHeader(500, {"Content-Type": "text/plain"});
             console.log(full_path+" ends up here")
             res.write(err + "\n" );
             res.end();
           }
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
socketModule.start(db, listener, connectCallback);
