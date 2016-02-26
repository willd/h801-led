var data;
var cid;
var presetvalue;
var pin;
var socket = io();
var host;
var element;
var localPresets = [];

var self = this;


function updateOutput(element,cid,id, no, val) {
	var host = element.substr(0, element.indexOf(':'));
	//console.log("Slider: "+	host+' '+id+' '+no+' '+val);
	socket.emit('slider', {id: id, cid: cid, host: host, pin: no, value: val});
	self.element = element;
	self.presetvalue = val;
	self.pin = no;

}

function savePreset(id) {
	var host = element.substr(0, element.indexOf(':'));
	shortname = document.getElementById("input").value;
	console.log(id+" "+shortname+" "+element);
	if(id.length != 0) {
		socket.emit('savebutton', {id: id, element: element, shortname: shortname, value: presetvalue});
	}
}
function setPreset(val) {
	socket.emit('setbutton', val);
}
function choosePreset() {
	var e = document.getElementById("choosePreset");
	var val = e.options[e.selectedIndex].value;
	console.log(val);
	data = val;
}
function getValue(val) {

}
function fetchPresets() {
	socket.emit('fetchpresets');
}
socket.on('presets', function (presets, data) {
	select = document.getElementById('choosePreset');
	console.log("Values: "+data);
	var sliders = data.map(function(slider) {
		console.log(slider.host+":"+slider.pin)
		return document.getElementById(slider.host+":"+slider.pin)
	});
	for(var i in data) {
		console.log("Setting value for slider:"+data[i].host+":"+data[i].pin)
		if(sliders[i].id === data[i].host+":"+data[i].pin) {

			sliders[i].value = data[i].value;
		}
	}

	for (var i in presets) {
		select.options[select.options.length] = new Option(presets[i].shortname, [presets[i].value+":"+presets[i].element]);

	}
});
socket.on('brightness', function (b) {
  console.log('brightness: '+b.host+':'+b.pin);

  document.getElementById(b.host+':'+b.pin).value = parseInt(b.brightness);
});
var filter = function(data ) {
	var value = data.substr(0, data.indexOf(':'));
	var host = data.substring(data.indexOf(':')+1,data.lastIndexOf(':'));
	var pin = data.substr(data.lastIndexOf(':'));
	pin = pin.replace(':','');

	return {value: value, host: host,pin: pin};
}
