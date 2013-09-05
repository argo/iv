var ServiceLocator = require('./service_locator');
var locator = new ServiceLocator();

var Greeter = function(message) {
  this.message = message;
};

Greeter.prototype.greet = function() {
  console.log(this.message);
};


var greeterFn = function(message) { console.log(message); };

var greeterObj = {
  greet: function(message) {
    console.log(message);
  }
};

locator.register('greeter1', Greeter, ['1: Hello world!']);
locator.register('greeter2', greeterFn, ['2: Hello world!']);
locator.register('greeter3', greeterObj);

for (var i = 0; i < 3; i++) {
  console.log('iteration:', i);
  locator.resolve('greeter1').greet();
  locator.resolve('greeter2');
  locator.resolve('greeter3').greet('3: Hello world!');
  console.log('');
}
