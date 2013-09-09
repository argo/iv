var iv = require('../');

var Greeting = require('./greeting');
var Greeter = require('./greeter');
var Printer = require('./printer');

var App = function(options, components) {
  this.options = options;
  this.components = components;
};

App.prototype.print = function() {
  console.log('options:', this.options);
  console.log('components:', this.components);
};

var container = iv.create({ debug: true });

var dynamic = container.dynamic;
var component = container.component;
var array = container.array;

var now = function() {
  return new Date();
};

container.register([
    {
      name: 'greeting',
      id: 'greeting.time',
      value: Greeting,
      params: ['The time is:', dynamic(now)]
    },
    {
      name: 'greeter',
      id: 'greeter.default',
      value: Greeter,
      params: [component('greeting')]
    },
    {
      name: 'printer',
      id: 'printer.default',
      value: Printer,
      params: [component('greeter')]
    },
    {
      name: 'app',
      id: 'app.default',
      value: App,
      params: [array(component('greeting'), component('greeter'),
        component('printer'), dynamic(now))]
    }
]);

var app = container.resolve('app', [{ juice: 'carrot' }]);

var info = iv.inspect(app);
console.log('debug info:', info);

app.print();
