var gid=0;
var presetvalue;
var pin;
var socket = io.connect('http://192.168.1.151:3001');

var brightnesses = [];

brightnesses[0] = 0;
brightnesses[1] = 0;
brightnesses[2] = 0;

function updateOutput(id, no, val) {
	socket.emit("slider", {id: id, pin: no, value: val});
	presetvalue = val;
	pin = no;
	gid = id;
}
function savePreset(id, no, val) {
	socket.emit("savebutton", {id: id ,pin: no, value: val});
}
function setPreset(id, no, val) {
	socket.emit("setbutton", {id: id ,pin: no, value: val});
}
function choosePreset(val) {
	gid=val;
}

function setValue(id) {
  return brightnesses[id];
}

socket.on('brightness', function (b) {
  console.log(b);
  brightnesses[2] = parseInt(b.brightness);
  document.getElementById("strip2").value = brightnesses[2];
});
