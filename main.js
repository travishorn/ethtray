const { app, Menu, Tray } = require('electron');
const request = require('request');
const moment = require('moment');

let tray = null;

app.on('ready', () => {
  const updatePrice = () => {
    request({
      url: 'https://api.coinbase.com/v2/prices/ETH-USD/spot',
      headers: { 'CB-VERSION': '2017-08-04' },
    }, (err, res, body) => {
      if (err) {
        tray.setToolTip('Error getting market price.');
      } else {
        const amount = JSON.parse(body).data.amount;
        const timestamp = moment().format('YYYY-MM-DD HH:mm');

        tray.setToolTip(`$${amount} as of ${timestamp}`);
      }
    });
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Update', click: updatePrice },
    { label: 'Quit', click: () => { app.quit(); } },
  ]);


  tray = new Tray('ethereum-logo.ico');

  tray.setToolTip('Getting market price...');
  tray.setContextMenu(contextMenu);

  updatePrice();
});
