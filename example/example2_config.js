var Greeting = require('./greeting');
var Greeter = require('./greeter');
var Printer = require('./printer');
var App = require('./example2_app');

module.exports = function(container) {
  var component = container.component;
  var dynamic = container.dynamic;

  var now = function() {
    return new Date();
  };

  container.register([{
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
