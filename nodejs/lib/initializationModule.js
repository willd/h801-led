module.exports = {
  start: function (db, pushClient, next) {
  var self = this;
  var async = require('async');
  var Netcat = require('node-netcat');

  var scanner = require ('node-netcat').portscan ();
  var clientModule = require('./clientModule');
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
    console.log("Finished scanning range");
    console.log (addresses);
    var id = 0
    var clients = addresses.map(function(address) {
      return Netcat.client(23,address);
    });
    //clientModule.start(clients,dataCallback);
    var cb = clients.map(function(client) {
      pushClient(client);
      db.set(id,{address: client._host,pins: [2,5,7]});
      id=id+1;
    });
    next ();

  });


  var dataCallback = function (client,data) {
    console.log(client._host+" "+data);
    if(data === "Welcome to NodeMCU world.\n>\n") {
      console.log("Client entry");

    }
    pushClient(client);
  }
}
}
