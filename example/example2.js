var iv = require('../iv');
var config = require('./example2_config');

var container= iv.create(config);

var app = container.resolve('app', ['What time is love?']);

app.run();
