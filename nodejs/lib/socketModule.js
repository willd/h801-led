io = require('socket.io').listen(3001);

module.exports = {
  socket: null,
  clients: [],
  start: function (connectCallback) {
    var self = this;
    io.sockets.on('connection', function (socket) {

      if (self.socket === null) {
        self.socket = socket;
      }

      connectCallback();

      // receive changed value of slider send by client
      socket.on('slider', function (data) {
      	var brightness = data.value;
      	var pin = data.pin;

      	if (data.id === 2) {
      		self.clients[1].send('fade('+brightness+','+pin+')' + '\n', false);
      	}
      	else {
      		self.clients[0].send('fade('+brightness+','+pin+')' + '\n', false);
      	}
        //  client.send('pwm.setduty('+pin+','+brightness+')' + '\n', false);
    	 console.log("Pin "+ pin + ", Slider Value: " + brightness);
      });

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
    		self.clients[1].send('fade('+preset.value+','+preset.pin+')' + '\n', false);
    	}
    	else {
    		self.clients[0].send('fade('+preset.value+','+preset.pin+')' + '\n', false);
    	}
    	});

    });
  }
};
