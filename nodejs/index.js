var Netcat = require('node-netcat');
var http = require('http');
var os = require('os');
var dirty = require('dirty');
var db = dirty('presets.db');

var clientModule = require('./lib/clientModule');
var socketModule = require('./lib/socketModule');

var id;
var pin;
var ifaces = os.networkInterfaces();

var dataCallback = function (data) {
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

var clients = [
  Netcat.client(23, '192.168.1.126'),
  Netcat.client(23, '192.168.1.165')
];

socketModule.clients = clients;

var connectCallback = function () {
  clientModule.getBrightness(clients[1], 7);
};

clientModule.setup(clients, dataCallback);

var url = require('url');
var fs = require('fs');
var path = require('path');
var sys = require('sys');

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
  if ('IPv4' !== iface.family || iface.internal !== false) {
    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    return;
  }

  if (alias >= 1) {
    // this single interface has multiple ipv4 addresses
    console.log(ifname + ':' + alias, iface.address);
  } else {
    // this interface has only one ipv4 adress
    console.log(ifname, iface.address);
    ip = iface.address;
  }
  ++alias;
  });
});

db.on('load', function() {
  console.log('Loading values from key-value store');
  });

  db.forEach(function(key, val) {
  console.log('Found key: %s, val: %j', key, val);
  });

db.on('drain', function() {
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
           res.write(err + "\n");
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

socketModule.start(connectCallback);

http.createServer(handler).listen(3000, function(err){
  if(err){
  console.log('Error starting http server');
  } else {
  console.log("Server running at http://localhost:3000/");
  };
});
