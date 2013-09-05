var Printer = module.exports = function(greeter) {
  this.greeter = greeter;
};

Printer.prototype.print = function() {
  console.log(this.greeter.greet());
};

