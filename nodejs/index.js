var Netcat = require('node-netcat');
var http = require("http");
var os = require('os');
var ifaces = os.networkInterfaces();

var client = Netcat.client(23, '192.168.1.126');
var client2 = Netcat.client(23, '192.168.1.165');
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

function handler(req, res){

  var form = '';

    form = '<!doctype html> \
	<html lang="en"> \
	<head> \
        <meta charset="UTF-8">  \
	<script src="https://cdn.socket.io/socket.io-1.4.4.js"></script> \
	<script> \
	var socket = io.connect(\'http://'+ip+':3001\'); \
	function updateOutput(no,val) { \
		socket.emit("slider", {pin: no, value: val}); \
	} \
	</script> \
	<style> \
	h1 { \
	  font-family: "Arial"; \
	} \
	body { \
	  color: #404040; \
	  display: flex; \
	  width: 100%; \
	  flex-direction: column; \
	  justify-content: space-around; \
	  align-items: center; \
	  padding: 50px; \
	} \
	input { \
	  display: block; \
	} \
	div { \
	  border-radius: 25px; \
	  border: 2px solid #a0a0a0; \
	  padding: 20px; \
	} \
	</style> \
    <title>NodeJS Slider</title> \
</head> \
<body> \
	<h1>Desk light</h1> \
	<div> \
	<input type="range" min="0" max="1023" step="1" oninput="updateOutput(5,value)"> \
	<br> \
	<input type="range" min="0" max="1023" step="1" oninput="updateOutput(2,value)"> \
	</div> \
	<h1>Computer light </h1> \
	<div> \
	<input type="range" min="0" max="1023" step="1" oninput="updateOutput(7,value)"> \
	</div> \
</body> \
</html>';

  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end(form);
};

io = require('socket.io').listen(3001);
io.sockets.on('connection', function(socket) {

// receive changed value of slider send by client
socket.on('slider', function(data){
	var brightness = data.value ;
	var pin = data.pin;
	if(pin == 7) {
		client2.send('fade('+brightness+','+pin+')' + '\n', false);
	}
	else {
		client.send('fade('+brightness+','+pin+')' + '\n', false);
	}
//  client.send('pwm.setduty('+pin+','+brightness+')' + '\n', false);
	console.log("Pin "+ pin + ", Slider Value: " + brightness);    });
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
