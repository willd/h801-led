var gid=0;
var presetvalue;
var pin;
var socket = io.connect('http://192.168.1.151:3001');

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

