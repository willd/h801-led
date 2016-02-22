module.exports = {
  closed: false,
  start: function (clients, dataCallback) {
    var self = this;
    clients.map(function (client) {
      client.start();

      client.on('open', function () {
        console.log('connect');
      });

      client.on('data', function (data) {
        console.log('[DATA]', data.toString('ascii'));
        dataCallback(client,data.toString('ascii'));
      });

      client.on('error', function (err) {
        console.log(err);
      });

      client.on('close', function (data) {
        console.log('close', data);
        if(!self.closed) {
          client.start();

        }

      });
    });
  },
  stop: function (clients) {
    clients.map(function (client) {
      console.log("Closing down: "+client._host);
      closed = true;

    });
  },
  getBrightness: function (client, pin) {
    return client.send('readBrightness(' + pin + ')' + '\n', false);
  }
};
