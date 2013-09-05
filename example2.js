var ServiceLocator = require('./service_locator');
var config = require('./example2_config');

var locator = ServiceLocator.create(config);

var app = locator.resolve('app', ['What time is love?']);

app.run();
