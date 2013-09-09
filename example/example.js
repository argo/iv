var iv = require('../iv');
var container = iv.create();

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

container.register('greeter1', 'greeter.default', Greeter, ['1: Hello world!']);
container.register('greeter2', 'greeter.default', greeterFn, ['2: Hello world!']);
container.register('greeter3', 'greeter.default', greeterObj);

for (var i = 0; i < 3; i++) {
  console.log('iteration:', i);
  container.resolve('greeter1').greet();
  container.resolve('greeter2');
  container.resolve('greeter3').greet('3: Hello world!');
  console.log('');
}
