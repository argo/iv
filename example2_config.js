var Greeting = require('./greeting');
var Greeter = require('./greeter');
var Printer = require('./printer');
var App = require('./example2_app');

module.exports = function(locator) {
  var component = locator.component;
  var dynamic = locator.dynamic;

  var now = function() {
    return new Date();
  };

  locator.register([{
      name: 'greeting',
      value: Greeting,
      params: ['The time is:', dynamic(now)]
    },
    {
      name: 'greeter',
      value: Greeter,
      params: [component('greeting')]
    },
    {
      name: 'printer',
      value: Printer,
      params: [component('greeter')]
    },
    {
      name: 'app',
      value: App,
      params: [component('printer')]
  }]);
};
