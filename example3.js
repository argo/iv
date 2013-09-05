var ServiceLocator = require('./service_locator');
var Greeting = require('./greeting');
var Greeter = require('./greeter');
var Printer = require('./printer');

var locator = new ServiceLocator();
var component = locator.component;
var dynamic = locator.dynamic;

var now = function() {
  return 'The time is: ' + new Date();
};

locator.register([{
    name: 'greeting',
    value: Greeting,
    params: [dynamic(now)],
    lifestyle: 'transient'
  },
  {
    name: 'greeter',
    value: Greeter,
    params: [component('greeting')],
    lifestyle: 'transient'
  },
  {
    name: 'printer',
    value: Printer,
    params: [component('greeter')],
    lifestyle: 'transient'
}]);

printer = locator.resolve('printer');
printer.print();

setTimeout(function() {
  printer = locator.resolve('printer');
  printer.print();
}, 1000);
