var App = module.exports = function(message, printer) {
  this.message = message;
  this.printer = printer;
};

App.prototype.run = function() {
  console.log(this.message);
  this.printer.print();
};
