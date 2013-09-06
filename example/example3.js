var iv = require('../iv');
var Greeting = require('./greeting');
var Greeter = require('./greeter');
var Printer = require('./printer');

var container = new iv();
var component = container.component;
var dynamic = container.dynamic;

var now = function() {
  return 'The time is: ' + new Date();
};

container.register([{
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

printer = container.resolve('printer');
printer.print();

setTimeout(function() {
  printer = container.resolve('printer');
  printer.print();
}, 1000);
