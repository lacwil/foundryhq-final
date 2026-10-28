require('dotenv').config();
const { createApp } = require('./server/app.cjs');
createApp().listen(3000, '127.0.0.1', () => {
  console.log('Local development API listening on port 3000');
});
