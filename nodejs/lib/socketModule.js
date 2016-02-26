var _ = require("underscore");
module.exports = {
  socket: null,
  clients: [],
  presets: [],
  values: [],
  start: function (db, http, connectCallback) {
    var self = this;

    io = require('socket.io').listen(http);
    io.sockets.on('connection', function (socket) {

      if (self.socket === null) {
        self.socket = socket;
      }
      // receive altered value of slider send by client
      socket.on('slider', function (data) {
      	var value = data.value;
      	var pin = data.pin; // Output pin
        var id = data.id; // Output id
        var host = data.host; // Unit ip
        var cid = data.cid; // Unit id
        var shortname = data.shortname;
        var object = {id: id, cid: cid, shortname: shortname, value: value, host: host, pin: pin};
        var ids = self.values.map(function(value) {
                    return value.id;
        });
        if(self.values.length !== 0) {
          console.log("Starting matching with id: "+id)

          console.log(ids);
          if (!contains.call(ids, object.id)) {
              console.log("New value");
              self.values.push(object);
            }
          else {
            console.log("Overwriting old value");
            self.values = _.reject(self.values, function (value) { return (value.id == object.id)})
            self.values.push(object);
          }
          console.log(object);
        }
        else {
          self.values.push(object);
        }


        console.log("Host "+host+", Pin "+ pin + ", Slider Value: " + value);

    		self.clients[cid].client.send('fade('+value+','+pin+')' + '\n', false);

        connectCallback(cid, pin);
        //  client.send('pwm.setduty('+pin+','+brightness+')' + '\n', false); // Directly set brightness
    	});

    socket.on('savebutton', function(data){
    	id = data.id;
    	console.log("Preset, id: "+id+", value: "+data.value+", shortname: "+data.shortname+", element: "+data.element);
    	if(db.get(id) == '') {
    		db.rm(id);
    	}
    	db.set(id, {element: data.element, shortname: data.shortname, value: data.value});
    });
    socket.on('setbutton', function(data){
      console.log('setbutton: '+data);

      var object = filter(data);

      for(id in self.clients) {
        console.log(id+" "+self.clients[id].client._host);
        if(self.clients[id].client._host == object.host) {
          self.clients[id].client.send('fade('+object.value+','+object.pin+')' + '\n', false);
        }
      }
    	});
      socket.on('fetchpresets', function (data){
        console.log("Fetching and returning presets");
        db.forEach(function(key, val) {
          //console.log('Found presets with key: %s, val: %j', key, val);
          if (_.findWhere(self.presets, val) == null) {
            self.presets.push(val);
          }
        });
        console.log(self.values);
        socket.emit('presets', self.presets, self.values);
      });

    });
    var contains = function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    var item = this[i];

                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    };
    // Deconstruct "array", since objects aren't supported as values in html options.
    var filter = function(data ) {
      var value = data.substr(0, data.indexOf(':'));
      var host = data.substring(data.indexOf(':')+1,data.lastIndexOf(':'));
      var pin = data.substr(data.lastIndexOf(':'));
      pin = pin.replace(':','');

      return {value: value, host: host,pin: pin};
    }
  }
};
