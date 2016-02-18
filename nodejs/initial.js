var async = require('async');
var scanner = require ('node-netcat').portscan ();
var range = [];
var clients = [];

for (i = 0; i <= 255; i++) {
  range[i]='192.168.1.'+i;
}
var workers = range.map( function (_host) {
  var save = function (err, result) {
    if (!err) {
      //console.log ("Output: " + result);
      clients.push (_host);
    }
  };

  return function (signal) {

    scanner.run (_host, '23', save, signal);
  }
});

async.parallel (workers, function () {
  console.log("done with everything");
  console.log (clients);

});
