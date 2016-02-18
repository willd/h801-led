module.exports = {
  start: function (clients, dataCallback) {
    clients.map(function (client) {
      client.start();

      client.on('open', function () {
        console.log('connect');
      });

      client.on('data', function (data) {
        console.log('[DATA]', data.toString('ascii'));
        dataCallback(data.toString('ascii'));
      });

      client.on('error', function (err) {
        console.log(err);
      });

      client.on('close', function (data) {
        console.log('close', data);
        client.start();
      });
    });
  },
  stop: function (clients) {
    clients.map(function (client) {
      client.stop();
    }
  }
  getBrightness: function (client, pin) {
    return client.send('readBrightness(' + pin + ')' + '\n', false);
  }
};
