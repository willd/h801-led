module.exports = {
  setup: function (clients) {
  clients.map(function (client) {
    console.log('Starting client', client);
    client.start();

    client.on('open', function () {
    console.log('connect');
    });

    client.on('data', function (data) {
    console.log(data.toString('ascii'));
    });

    client.on('error', function (err) {
    console.log(err);
    this.start();
    });

    client.on('close', function () {
    console.log('close');
    });
  });
  }
};
