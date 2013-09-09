var Implementation = function(constructor, args) {
  this.constructor = constructor;
  this.args = args;
};

var Definition = function(name, id, constructor, args, lifestyle) {
  this.name = name;
  this.id = id;
  this.value = new Implementation(constructor, args);
  this.dependencies = [];
  this.lifestyle = lifestyle || 'transient';
  this.instance = null;
};

var Iv = module.exports = function(options) {
  this.debug = options ? options.debug : false;
  this.entries = {};
  this.dependents = {};
};

Iv.create = function(config, options) {
  if (typeof config === 'object') {
    options = config;
    config = null;
  };

  var container = new Iv(options);

  if (config) {
    config(container);
  }

  return container;
};

Iv.inspect = function(obj) {
  if (!obj.__iv_debug_enabled) {
    return null;
  }

  var debug = {
    name: obj.__iv_name,
    id: obj.__iv_id,
    dependencies: obj.__iv_dependencies
  };

  return debug;
};

Iv.prototype.register = function(name, id, constructor, args, lifestyle) {
  if (typeof name === 'function') {
    this.register(name.call(this));
  }

  if (Array.isArray(name)) {
    var multiOptions = name;
    var self = this;
    multiOptions.forEach(function(options) {
      self.register(options);
    });
    return;
  }

  if (typeof name === 'object') {
    var options = name;
    id = options.id;
    constructor = options.value;
    args = options.params;
    lifestyle = options.lifestyle;
    name = options.name;
  }

  var definition = new Definition(name, id, constructor, args, lifestyle);
  args = args || [];

  var self = this;
  args.forEach(function(arg) {
    if (typeof arg === 'object' && arg['$type']
      && arg['$type'] === 'component') {
      var $value = arg['$value'];
      definition.dependencies.push($value);
      if (!self.dependents[$value]) {
        self.dependents[$value] = [];
      }
      self.dependents[$value].push(definition.name);
    }
  });

  this.evict(name);
  this.entries[name] = definition;
};

Iv.prototype.evict = function(name) {
  var self = this;
  if (self.dependents[name]) {
    self.dependents[name].forEach(function(dep) {
      self.entries[dep].instance = null;
      self.evict(dep);
    });
  }
};

Iv.prototype.resolve = function(name, args) {
  // Prefer using args at registration or from a factory.
  // Args are prepended to args set at registration time.
  // This might be useful when starting an app, for instance.

  var definition = this.entries[name];

  if (!definition) {
    var message = 'No definition for `' + name + '` exists.';
    throw new Error(message);
  }

  var obj;

  if (definition.instance) {
    if (typeof definition.instance === 'function') {
      obj = definition.instance();
    } else if (typeof definition.instance === 'object') {
      obj = definition.instance;
    }
  } else {
    var value = definition.value;
    var constructor = value.constructor;
    var tempArgs = value.args || [];
    var args = args || [];

    function evalArg(arg, definition) {
      var ret = arg;

      if (typeof arg === 'object' && arg['$type']) {
        var type = arg['$type'];

        switch(type) {
          case 'component':
            ret = self.resolve(arg['$value']);
            definition.dependencies.push(arg['$value']);
            break;
          case 'dynamic':
            ret = arg['$value']();
            break;
          case 'array':
            ret = arg['$value'].map(function(a) {
              return evalArg(a, definition);
            });
        }
      }

      return ret;
    }

    var self = this;
    tempArgs.forEach(function(arg) {
      arg = evalArg(arg, definition);
      args.push(arg);
    });

    if (typeof constructor === 'function') {
      if (this.debug) {
        var deps = [];

        if (definition.dependencies.length) {
          var self = this;
          deps = definition.dependencies.map(function(dep) {
            var entry = self.entries[dep];
            return { id: entry.id, name: entry.name };
          });
        }

        constructor.prototype.__iv_debug_enabled = true;
        constructor.prototype.__iv_name = definition.name;
        constructor.prototype.__iv_id = definition.id;
        constructor.prototype.__iv_dependencies = deps;
      }

      obj = Object.create(constructor.prototype);
      obj.constructor.apply(obj, args);

      if (!Object.keys(constructor.prototype).length &&
          !Object.keys(obj).length) {
        // non-constructor function
        // bind args to function for entry instance
        var boundArgs = [constructor].concat(args);
        if (definition.lifestyle === 'singleton') {
          definition.instance = constructor.bind.apply(constructor, boundArgs);
        }
      } else {
        if (definition.lifestyle === 'singleton') {
          definition.instance = obj;
        }
      }
    } else if (typeof constructor === 'object') {
      obj = constructor;
      if (definition.lifestyle === 'singleton') {
        definition.instance = obj;
      }
    }
  }

  return obj;
};

Iv.prototype.component = function(name) {
  return {
    $type: 'component',
    $value: name
  };
};

Iv.prototype.dynamic = function(fn) {
  return {
    $type: 'dynamic',
    $value: fn
  };
};

Iv.prototype.array = function() {
  return {
    $type: 'array',
    $value: Array.prototype.slice.call(arguments)
  };
};
