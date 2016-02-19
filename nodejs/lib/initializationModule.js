module.exports = {
  start: function (db, clientCallback) {
  var self = this;
  var async = require('async');
  var Netcat = require('node-netcat');

  var scanner = require ('node-netcat').portscan ();
  //var clientModule = require('./clientModule');
  var range = [];
  var clients = [];
  var addresses = [];

  for (i = 0; i <= 255; i++) {
    range[i]='192.168.1.'+i;
  }

    var workers = range.map( function (_host) {
      var save = function (err, result) {
        if (!err) {
          //console.log ("Output: " + result);
          addresses.push (_host);
        }
      };

      return function (signal) {

        scanner.run (_host, '23', save, signal);
      }
    });

  async.parallel (workers, function () {
    console.log("done with everything");
    console.log (addresses);
    var clients = addresses.map(function(address) {
      return Netcat.client(23,address);
    });
    var cb = clients.map(function(client) {
      clientCallback(client);
    });

  });


  var dataCallback = function (client,data) {
    console.log(client._host+" "+data);
    if(data === "Welcome to NodeMCU world.") {
      console.log("Client entry");
      db.set({address: client._host,pin: 2});
    }
    clientCallback(client);
    return  0;
  }
}
}
