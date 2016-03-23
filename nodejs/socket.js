var data;
var cid;
var presetvalue;
var pin;
var socket = io();
var host;
var element;
var self = this;

socket.on('presets', function (presets, data) {
	select = document.getElementById('choosePreset');
	names = [];
	for (var i in presets) {
		select.options[select.options.length] = new Option(presets[i].shortname, [presets[i].value+":"+presets[i].element]);
	}
	var body = document.getElementsByTagName("body")[0];
	var inputs = data.map(function (b) {
		var input = document.createElement("input");
		names.push(b.shortname);
		input.id=b.host+":"+b.pin;
		input.type="range";
		input.min="0";
		input.max="1023";
		input.step="1";
		input.value=b.value;
		input.setAttribute("oninput","updateOutput(this,"+b.cid+","+b.id+","+b.pin+",value)");
		return input;

	})
		var cells = [[],[]];
		var names = [];

		for(var j in data) {
			//console.log(data[j]);

			var h1 = document.createElement("h1");
			var text = document.createTextNode(data[j].shortname);
			h1.appendChild(text);
			var id = data[j].cid;
			var objects = inputs[j];
			if(names.length === 0) {
				names.push(h1);
			}
			else {
				for(var i in names) {
					if(names[i].innerHTML === h1.innerHTML) {
						console.log("Don't add secondaries");
					}
					else {
						names.push(h1);
					}
				}
				}

			cells[id].push(inputs[j]);
			//console.log(cells[0][1]);
			}

		//console.log(names);
		for (var i in cells) {
			var cell = document.createElement("div");
			cell.className = "cell";
			cell.id = data[i].cid;
			for (var j in cells[i]) {
				cell.appendChild(cells[i][j]);
			}

			body.appendChild(names[i]);
			body.appendChild(cell);
		}

});
socket.on('brightness', function (b) {
  console.log('brightness: '+b.host+':'+b.pin);

  document.getElementById(b.host+':'+b.pin).value = parseInt(b.brightness);
});

function updateOutput(element,cid,id, no, val) {
	var host = element.id.substr(0, element.id.indexOf(':'));

	socket.emit('slider', {id: id, cid: cid, shortname: document.getElementsByTagName("h1")[cid+1].innerHTML, host: host, pin: no, value: val});
	//self.element = element;
	self.presetvalue = val;
	self.pin = no;

}

function savePreset(id) {
	var host = element.substr(0, element.indexOf(':'));
	shortname = document.getElementById("input").value;
	//console.log(id+" "+shortname+" "+element);
	if(id.length != 0) {
		socket.emit('savebutton', {id: id, element: element, shortname: shortname, value: presetvalue});
	}
}
function setPreset() {
	socket.emit('setbutton', data);
}
function choosePreset() {
	var e = document.getElementById("choosePreset");
	var val = e.options[e.selectedIndex].value;
	//console.log(val);
	data = val;
}
function fetchPresets() {
	socket.emit('fetchpresets');
}
var newCell = function (data) {

	var input = document.createElement("input");

	input.id=data.host+":"+data.pin;
	input.type="range";
	input.min="0";
	input.max="1023";
	input.step="1";
	input.value=data.value;
	input.setAttribute("oninput","updateOutput(this,"+data.cid+","+data.id+","+data.pin+",value)");
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
	input.oninput="updateOutput(this,"+data.cid+","+data.id+","+data.pin+",value)";
	cell.appendChild(input);
	return cell;

}

var contains = function (a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

var filter = function(data ) {
	var value = data.substr(0, data.indexOf(':'));
	var host = data.substring(data.indexOf(':')+1,data.lastIndexOf(':'));
	var pin = data.substr(data.lastIndexOf(':'));
	pin = pin.replace(':','');

	return {value: value, host: host,pin: pin};
}
