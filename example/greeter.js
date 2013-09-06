var Greeter = module.exports = function(greeting) {
  this.greeting = greeting;
};

Greeter.prototype.greet = function() {
  return this.greeting.message;
};
