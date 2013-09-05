var Greeting = module.exports = function() {
  var slice = Array.prototype.slice;
  this.message = slice.apply(arguments).join(' ');
};

