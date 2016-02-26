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
function fetchPresets() {
	socket.emit('fetchpresets');
}
socket.on('presets', function (presets, data) {
	select = document.getElementById('choosePreset');

	for (var i in presets) {
		select.options[select.options.length] = new Option(presets[i].shortname, [presets[i].value+":"+presets[i].element]);
	}
	var body = document.getElementsByTagName("body")[0];

	for(var i in data) {
		console.log(i+" "+data[i].shortname);
		var cell;
		if (i == 0) {

			cell = newCell(data[i]);
			cell.className="cell";
			var h1 = document.createElement("h1");
			var text = document.createTextNode(data[i].shortname);
			h1.appendChild(text);

			body.appendChild(h1);
		}
		else {
			if(data[i-1].cid == data[i].cid) {
					cell = appendCell(cell,data[i])
			}
			else {
				cell = newCell(data[i]);
				cell.className="cell";
				var h1 = document.createElement("h1");
				var text = document.createTextNode(data[i].shortname);
				h1.appendChild(text);

				body.appendChild(h1);
			}
		}


		body.appendChild(cell);
	}
});
var newCell = function (data) {
	var cell = document.createElement("div");
	var input = document.createElement("input");

	input.id=data.host+":"+data.pin;
	input.type="range";
	input.min="0";
	input.max="1023";
	input.step="1";
	input.value=data.value;
	input.setAttribute("oninput","updateOutput(this.id,"+data.cid+","+data.id+","+data.pin+",value)");
	cell.appendChild(input);
	return cell;
}
var appendCell = function (cell, data) {
	input = document.createElement("input");

	input.id=data.host+":"+data.pin;
	input.type="range";
	input.min="0";
	input.max="1023";
	input.step="1";
	input.value=data.value;
	input.oninput="updateOutput(this.id,"+data.cid+","+data.id+","+data.pin+",value)";
	cell.appendChild(input);
	return cell;

}
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
