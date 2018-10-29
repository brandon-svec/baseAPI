var app = require('app');

app.Init(function () {
  console.log('Initialized');

  app.Run(function () {
    console.log('Processed');
    return true;
  });
});
