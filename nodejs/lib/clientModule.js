module.exports = {
  start: function (clients, dataCallback) {
    var self = this;
    clients.map(function (client) {
      console.log(client);
      client.client.start();

      client.client.on('open', function () {
        console.log('connect');
      });

      client.client.on('data', function (data) {
        console.log('[DATA]', data.toString('ascii')+" from "+client._host);
        dataCallback(client,data.toString('ascii'));
      });

      client.client.on('error', function (err) {
        console.log(err);
      });

      client.client.on('close', function (data) {
        console.log('close', data);
        if(!self.closed) {
          client.client.start();
        }

      });
    });
  },

  getBrightness: function (client, pin) {
    return client.send('readBrightness(' + pin + ')' + '\n', false);
  }
};
