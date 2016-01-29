module.exports = {
  setup: function (clients) {
    clients.map(function (client) {
      client.start();

      client.on('open', function () {
        console.log('connect');
      });

      client.on('data', function (data) {
        console.log('[DATA]', data.toString('ascii'));
      });

      client.on('error', function (err) {
        console.log(err);
      });

      client.on('close', function (data) {
        console.log('close', data);
      });
    });
  },
  getBrightness: function (client, pin) {
    client.send('readBrightness' + pin + ')' + '\n', false);
  }
};
