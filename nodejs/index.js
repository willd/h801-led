var Netcat = require('node-netcat');
var http = require('http');
var os = require('os');
var dirty = require('dirty');
var db = dirty('presets.db');
var presetvalue;
var id;
var pin;
var ifaces = os.networkInterfaces();

var client = Netcat.client(23, '192.168.1.126');
var client2 = Netcat.client(23, '192.168.1.165');

url = require('url'),
fs = require('fs');
path = require('path');
var sys = require('sys');
client.start();
client2.start();

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

io = require('socket.io').listen(3001);
io.sockets.on('connection', function(socket) {

// receive changed value of slider send by client
socket.on('slider', function(data){
	var brightness = data.value ;
	var pin = data.pin;

	if(data.id == 2) {
		client2.send('fade('+brightness+','+pin+')' + '\n', false);
	}
	else {
		client.send('fade('+brightness+','+pin+')' + '\n', false);
	}
//  client.send('pwm.setduty('+pin+','+brightness+')' + '\n', false);
	console.log("Pin "+ pin + ", Slider Value: " + brightness);    });

socket.on('savebutton', function(data){
	id = data.id;
	value = data.value ;
	pin = data.pin;
	console.log("Preset, id: "+id+", value: "+value+", pin: "+pin);
	if(db.get(id) == '') {
		db.rm(id);
	}
	db.set(id, {value: value, pin: pin}); });
socket.on('setbutton', function(data){
	console.log("Preset data: "+ data);
	preset = db.get(data.id);
	console.log("Setting preset: "+preset.value);
	if(data.id == 2) {
		client2.send('fade('+preset.value+','+preset.pin+')' + '\n', false);
	}
	else {
		client.send('fade('+preset.value+','+preset.pin+')' + '\n', false);
	}
	});

});


http.createServer(handler).listen(3000, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://localhost:3000/");
  };
});

client.on('open', function () {
  console.log('connect');
});

client.on('data', function (data) {
  console.log(data.toString('ascii'));
});

client.on('error', function (err) {
  console.log(err);
  this.start();
});

client2.on('close', function () {
  console.log('close');
});

client2.on('open', function () {
  console.log('connect');
});

client2.on('data', function (data) {
  console.log(data.toString('ascii'));
});

client2.on('error', function (err) {
  console.log(err);
  this.start();
});

client2.on('close', function () {
  console.log('close');
});
