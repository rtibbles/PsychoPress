(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app/app", function(exports, require, module) {
'use strict';
var PsychoCoffee;

PsychoCoffee = {
  initialize: function() {
    var Router;
    Router = require('../routes/router');
    this.router = new Router();
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  }
};

module.exports = PsychoCoffee;
});

;require.register("initialize", function(exports, require, module) {
'use strict';
var PsychoCoffee, folderOrder, nestedImport, nestedSelectiveImport;

PsychoCoffee = window.PsychoCoffee = require('./app/app');

nestedImport = require('./utils/nestedImport');

nestedSelectiveImport = require('../utils/nestedSelectiveImport');

createjs.FlashPlugin.swfPath = "/widgets/SoundJS/";

createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);

folderOrder = ['utils', 'routes', 'models', 'views', 'templates'];

folderOrder.forEach(function(folder) {
  return nestedImport(folder, PsychoCoffee);
});

PsychoCoffee.trialObjectTypeKeys = _.invert(nestedSelectiveImport('models/TrialObjects', "Type"));

$(function() {
  PsychoCoffee.initialize();
  return Backbone.history.start();
});
});

;require.register("models/APIBase", function(exports, require, module) {
'use strict';
var Base, Collection, Model, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.urlBase = "/api/";

  Collection.prototype.local = false;

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Base", function(exports, require, module) {
'use strict';
var Collection, Model, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.name = function() {
    return this.get("name") || this.id;
  };

  return Model;

})(Backbone.AssociatedModel);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.url = "none";

  Collection.prototype.local = true;

  Collection.prototype.model = Model;

  return Collection;

})(Backbone.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Block", function(exports, require, module) {
'use strict';
var Base, Collection, Model, ParameterSet, Trial, TrialObject, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Trial = require('./Trial');

TrialObject = require('./TrialObject');

ParameterSet = require('./ParameterSet');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    trials: [],
    title: "",
    width: 640,
    height: 480,
    timeout: 1000,
    parameterSet: {},
    trialObjects: []
  };

  Model.prototype.trialProperties = ["title", "width", "height", "timeout"];

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trials',
      collectionType: Trial.Collection
    }, {
      type: Backbone.Many,
      key: 'trialObjects',
      collectionType: TrialObject.Collection
    }, {
      type: Backbone.One,
      key: 'parameterSet',
      relatedModel: ParameterSet.Model
    }
  ];

  Model.prototype.returnParameters = function() {
    return this.get("parameterSet").returnTrialParameters(this.get("numberOfTrials"));
  };

  Model.prototype.returnTrialProperties = function(clone) {
    var attributes, key, _i, _len, _ref1;
    if (clone == null) {
      clone = false;
    }
    attributes = {};
    _ref1 = this.trialProperties;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      key = _ref1[_i];
      attributes[key] = this.get(key);
    }
    if (clone) {
      attributes["trialObjects"] = this.get("trialObjects");
    }
    return attributes;
  };

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/BlockDataHandler", function(exports, require, module) {
'use strict';
var Collection, Model, NestedAPIBase, TrialDataLog, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NestedAPIBase = require('./NestedAPIBase');

TrialDataLog = require('./TrialDataLog');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    trialdatalogs: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialdatalogs',
      collectionType: TrialDataLog.Collection
    }
  ];

  return Model;

})(NestedAPIBase.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(NestedAPIBase.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Experiment", function(exports, require, module) {
'use strict';
var Base, Block, Collection, Model, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Block = require('./Block');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    blocks: [],
    title: "Experiment",
    saveInterval: 10000
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'blocks',
      collectionType: Block.Collection
    }
  ];

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/ExperimentDataHandler", function(exports, require, module) {
'use strict';
var APIBase, BlockDataHandler, Collection, Diff, Model, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

APIBase = require('./APIBase');

BlockDataHandler = require('./BlockDataHandler');

Diff = require('utils/diff');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.syncNow = __bind(this.syncNow, this);
    this.sync = __bind(this.sync, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.initialize = function() {
    return this.lastSync = 0;
  };

  Model.prototype.defaults = {
    blockdatahandlers: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'blockdatahandlers',
      collectionType: BlockDataHandler.Collection
    }
  ];

  Model.prototype.sync = function(method, model, options) {
    var delayTime, syncNow,
      _this = this;
    syncNow = function() {
      return _this.syncNow(method, model, options);
    };
    delayTime = this.lastSync + this.get("saveInterval") - performance.now();
    if (delayTime <= 0) {
      return this.syncNow();
    } else {
      if (!this.syncCache) {
        return this.syncCache = setTimeout(syncNow, delayTime);
      }
    }
  };

  Model.prototype.syncNow = function(method, model, options) {
    var e,
      _this = this;
    if (!_.isEmpty(this.serverState)) {
      options.attrs = Diff.Diff(this.serverState, model.toJSON());
      options.method = 'patch';
      options.success = function(saved) {
        if (saved) {
          return _this.serverState = _this.toJSON();
        }
      };
    } else {
      options.success = function(data) {
        _this.set(data);
        return _this.serverState = _this.toJSON();
      };
    }
    this.lastSync = performance.now();
    clearTimeout(this.syncCache);
    delete this.syncCache;
    try {
      return Backbone.sync(method, model, options);
    } catch (_error) {
      e = _error;
      return console.debug(e, method, model, options);
    }
  };

  return Model;

})(APIBase.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    this.url = __bind(this.url, this);
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  Collection.prototype.url = function() {
    return this.urlBase + "experimentdatahandlers";
  };

  Collection.prototype.getOrCreateParticipantModel = function(participant_id, saveInterval) {
    var model;
    model = this.findWhere({
      participant_id: participant_id
    });
    return model || this.create({
      participant_id: participant_id,
      saveInterval: saveInterval
    });
  };

  return Collection;

})(APIBase.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/NestedAPIBase", function(exports, require, module) {
'use strict';
var Base, Collection, Model, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.save = __bind(this.save, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.save = function() {
    var model, _i, _len, _ref1, _results;
    Model.__super__.save.apply(this, arguments);
    _ref1 = this.collection.parents;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      model = _ref1[_i];
      _results.push(model.save());
    }
    return _results;
  };

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/ParameterSet", function(exports, require, module) {
'use strict';
var Base, Collection, Model, Random, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Random = require('utils/random');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  Parameters can be of three basic types:
  fixedList   equivalent to a CSV or spreadsheet of parameters.
              Each attribute has an equal length array of values
              which will be assigned based on the index.
  randomList  each parameter can take on one of a set of discrete
              values, ParameterSet will return all possible combinations,
              or a pseudorandom subset up to a max number. Subset will be
              seeded by participant id so will be deterministic on refresh.
  generatorFn Parameters are defined by mathematical functions. Requires
              input value for functions (either single value or array of
              same length as number of parameters), function to change input
              values by (either single function or array of functions), and
              number of trials wanted.
  */


  Model.prototype.defaults = {
    type: "fixedList",
    randomized: false
  };

  Model.prototype.returnTrialParameters = function(trials_wanted) {
    if (trials_wanted == null) {
      trials_wanted = null;
    }
    switch (this.get("type")) {
      case "fixedList":
        return this.fixedList(trials_wanted);
      case "randomList":
        return this.randomList(trials_wanted);
      case "generatorFn":
        return this.generatorFn(trials_wanted);
      default:
        return console.log("ParameterSet type undefined!");
    }
  };

  Model.prototype.fixedList = function(trials_wanted) {
    var i, key, length, parameter, parameterList, parameterSet, parameters, value, _i, _ref1;
    length = 0;
    parameterSet = [];
    parameterList = [];
    _ref1 = this.get("parameters");
    for (key in _ref1) {
      value = _ref1[key];
      parameterList.push(key);
      length = value.length;
    }
    for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
      parameters = _.object(parameterList, (function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = parameterList.length; _j < _len; _j++) {
          parameter = parameterList[_j];
          _results.push(this.get("parameters")[parameter][i]);
        }
        return _results;
      }).call(this));
      parameterSet.push(parameters);
    }
    if (this.get("randomized")) {
      parameterSet = Random.seeded_shuffle(parameterSet, "TODO - insert a reference to participant ID here!");
    }
    if (trials_wanted != null) {
      parameterSet = parameterSet.slice(0, trials_wanted);
    }
    return [length, parameterSet];
  };

  Model.prototype.randomList = function(trials_wanted) {
    return {};
  };

  Model.prototype.generatorFn = function(trials_wanted) {
    return {};
  };

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Trial", function(exports, require, module) {
'use strict';
var Base, Collection, Model, TrialObject, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

TrialObject = require("./TrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    width: 640,
    height: 480,
    trialObjects: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialObjects',
      collectionType: TrialObject.Collection
    }
  ];

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/TrialDataLog", function(exports, require, module) {
'use strict';
var Collection, Model, NestedAPIBase, TrialEventLog, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NestedAPIBase = require('./NestedAPIBase');

TrialEventLog = require('./TrialEventLog');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.logEvent = __bind(this.logEvent, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    trialeventlogs: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialeventlogs',
      collectionType: TrialEventLog.Collection
    }
  ];

  Model.prototype.logEvent = function(event_type, clock, options) {
    if (options == null) {
      options = {};
    }
    return this.addEvent(_.extend(options, {
      experiment_time: clock.getTime(),
      trial_time: clock.timerElapsed(),
      event_type: event_type
    }));
  };

  Model.prototype.addEvent = function(event) {
    return this.get("trialeventlogs").create(event);
  };

  return Model;

})(NestedAPIBase.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(NestedAPIBase.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/TrialEventLog", function(exports, require, module) {
'use strict';
var Collection, Model, NestedAPIBase, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NestedAPIBase = require('./NestedAPIBase');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(NestedAPIBase.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(NestedAPIBase.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/TrialObject", function(exports, require, module) {
'use strict';
var Base, Collection, Model, modulename, nestedModules, subModels, _i, _len, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

nestedModules = require('../utils/nestedModules');

Base = require('./Base');

subModels = {};

_ref = nestedModules('models/TrialObjects');
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  modulename = _ref[_i];
  subModels[modulename] = modulename + ".Model";
}

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref1 = Model.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Model.prototype.subModelTypes = subModels;

  Model.prototype.defaults = function() {
    return {
      delay: 0,
      duration: 5000,
      parameterizedAttributes: {},
      /*
      Triggers are objects of the form -
      { eventName: "change", objectName: "firstImage",
      callback: "firstImageMethod", arguments: {size: 17}}
      The trigger will be registered to listen to this event
      on the other trial object, and will invoke this callback
      with these arguments. An optional argument of "once" can be
      set to true to use listenToOnce instead of listenTo.
      */

      triggers: []
    };
  };

  Model.prototype.parameterizedTrial = function(parameters) {
    var attribute, attributes, parameterName, _ref2;
    attributes = _.clone(this.attributes);
    _ref2 = this.get("parameterizedAttributes");
    for (attribute in _ref2) {
      parameterName = _ref2[attribute];
      attributes[attribute] = parameters[parameterName];
    }
    return attributes;
  };

  Model.prototype.setParameter = function(attribute, parameter) {
    return this.set("parameterizedAttributes", this.get("parameterizedAttributes")[attribute] = parameter);
  };

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref2 = Collection.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  Collection.prototype.model = function(attrs, options) {
    var error, model, modelType;
    try {
      modelType = attrs["subModelTypeAttribute"] || PsychoCoffee.trialObjectTypeKeys[attrs["type"]];
      model = PsychoCoffee[modelType]["Model"];
    } catch (_error) {
      error = _error;
      model = Model;
    }
    return new model(attrs, options);
  };

  return Collection;

})(Base.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/TrialObjects/AudioTrialObject", function(exports, require, module) {
'use strict';
var Model, TrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObject = require("../TrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.name = function() {
    return this.get("name") || this.get("file");
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model,
  Type: "audio"
};
});

;require.register("models/TrialObjects/KeyboardTrialObject", function(exports, require, module) {
'use strict';
var Keys, Model, TrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObject = require("../TrialObject");

Keys = require("utils/keys");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = function() {
    return _.extend({
      keys: _.keys(Keys.Keys)
    });
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model,
  Type: "keyboard"
};
});

;require.register("models/TrialObjects/Visual/ImageVisualTrialObject", function(exports, require, module) {
'use strict';
var Model, VisualTrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObject = require("../VisualTrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.name = function() {
    return this.get("name") || this.get("file");
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "image"
};
});

;require.register("models/TrialObjects/Visual/TextVisualTrialObject", function(exports, require, module) {
'use strict';
var Model, VisualTrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObject = require("../VisualTrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = function() {
    return _.extend({
      text: "hello",
      fontSize: 24,
      fontFamily: "arial",
      fontStyle: "normal"
    }, Model.__super__.defaults.apply(this, arguments));
  };

  Model.prototype.name = function() {
    return this.get("name") || this.get("text");
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "text"
};
});

;require.register("models/TrialObjects/VisualTrialObject", function(exports, require, module) {
'use strict';
var Model, TrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObject = require("../TrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = function() {
    return _.extend({
      angle: 0,
      fill: "#000000",
      height: 0,
      left: 0,
      opacity: 1,
      originX: "center",
      originY: "center",
      top: 0,
      width: 0
    }, Model.__super__.defaults.apply(this, arguments));
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model
};
});

;require.register("routes/router", function(exports, require, module) {
var Router, experimentView, homeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

homeView = require("../views/HomeView");

experimentView = require("../views/ExperimentView");

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    '': 'home'
  };

  Router.prototype.home = function() {
    return true;
  };

  Router.prototype.loadView = function(view) {
    if (this.view) {
      if (this.view.close) {
        this.view.close();
      } else {
        this.view.remove();
      }
    }
    this.view = view;
    this.view.appendTo("#app");
    return this.view.render();
  };

  return Router;

})(Backbone.Router);
});

;require.register("templates/application", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  if (helper = helpers.outlet) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.outlet); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiment", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"messages\"></div>\n<div id=\"trials\">\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/home", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Welcome to PsychoCoffee</h2>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/progressbar", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"progressBarContainer\"><span>Loading...</span><div id=\"progressBar\"><div id=\"indicator\"></div></div></div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/trial", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"trial-draw\"><canvas id=\"trial-canvas\" height=\"";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" width=\"";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></canvas></div>\n<div id=\"trial-hidden\"></div>\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("utils/clock", function(exports, require, module) {
var Clock, lastTime, vendor, vendors, __nativeSI__, __nativeST__, _i, _len,
  __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.performance = window.performance || {};

performance.type = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow ? "html5" : "date";

performance.now = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return new Date().getTime();
};

__nativeST__ = window.setTimeout;

__nativeSI__ = window.setInterval;

window.setTimeout = function() {
  var aArgs, callback, nDelay, oThis, vCallback;
  vCallback = arguments[0], nDelay = arguments[1], aArgs = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  oThis = this;
  if (vCallback instanceof Function) {
    callback = function() {
      return vCallback.apply(oThis, aArgs);
    };
  } else {
    callback = vCallback;
  }
  return __nativeST__(callback, nDelay);
};

window.setInterval = function() {
  var aArgs, callback, nDelay, oThis, vCallback;
  vCallback = arguments[0], nDelay = arguments[1], aArgs = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  oThis = this;
  if (vCallback instanceof Function) {
    callback = function() {
      return vCallback.apply(oThis, aArgs);
    };
  } else {
    callback = vCallback;
  }
  return __nativeSI__(callback, nDelay);
};

lastTime = 0;

vendors = ['ms', 'moz', 'webkit', 'o'];

for (_i = 0, _len = vendors.length; _i < _len; _i++) {
  vendor = vendors[_i];
  if (window.requestAnimationFrame) {
    window.AnimationFrameType = "RequestAnimationFrame";
    break;
  }
  window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendors + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
  window.AnimationFrameType = "SetTimeout";
  window.requestAnimationFrame = function(callback, element) {
    var currTime, id, timeToCall;
    currTime = performance.now();
    timeToCall = Math.max(0, 16 - (currTime - lastTime));
    id = window.setTimeout(function() {
      return callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    return clearTimeout(id);
  };
}

Clock = (function() {
  function Clock(framerate) {
    if (framerate == null) {
      framerate = 60;
    }
    this.ticktock = __bind(this.ticktock, this);
    this.timerElapsed = __bind(this.timerElapsed, this);
    this.stopTimer = __bind(this.stopTimer, this);
    this.resumeTimer = __bind(this.resumeTimer, this);
    this.pauseTimer = __bind(this.pauseTimer, this);
    this.startTimer = __bind(this.startTimer, this);
    this.delayedTrigger = __bind(this.delayedTrigger, this);
    this.setStartTime = __bind(this.setStartTime, this);
    this.getElapsedTime = __bind(this.getElapsedTime, this);
    this.getTime = __bind(this.getTime, this);
    this.reset = __bind(this.reset, this);
    _.extend(this, Backbone.Events);
    this.reset();
    this.tick = 1000 / framerate;
    this.frame = 0;
    this.changeEvents = [];
    this.timingType = performance.type;
    this.animationFrameType = window.AnimationFrameType;
    console.log("Using clock type:", this.timingType);
  }

  Clock.prototype.reset = function() {
    return this.start = performance.now();
  };

  Clock.prototype.getTime = function() {
    return performance.now() - this.start;
  };

  Clock.prototype.getElapsedTime = function(time) {
    return this.getTime() - time;
  };

  Clock.prototype.getAbsoluteTime = function() {
    return new Date().getTime();
  };

  Clock.prototype.setStartTime = function(time) {
    return this.start = Number(time);
  };

  Clock.prototype.delayedTrigger = function(delay, object, callback) {
    var frames, nearestFrame, timeoutDelay;
    frames = delay / this.tick;
    nearestFrame = Math.floor(frames);
    timeoutDelay = this.tick * (nearestFrame - frames);
    if (timeoutDelay >= 1) {
      callback = function() {
        return setTimeout(callback, timeoutDelay);
      };
    }
    return object.listenToOnce(this, this.frame + nearestFrame, callback);
  };

  Clock.prototype.startTimer = function() {
    this.timerStart = this.getTime();
    return this.ticktock();
  };

  Clock.prototype.pauseTimer = function() {
    this.pauseTimestamp = this.getTime();
    this.stopTimer();
    if (window.confirm("Do you really want to stop the experiment?")) {
      return window.close();
    } else {
      return this.resumeTimer(this.pauseTimestamp);
    }
  };

  Clock.prototype.resumeTimer = function(timestamp) {
    this.start += this.getTime() - timestamp;
    return this.ticktock();
  };

  Clock.prototype.stopTimer = function() {
    clearTimeout(this.timer);
    return this.frame = 0;
  };

  Clock.prototype.timerElapsed = function() {
    return this.getElapsedTime(this.timerStart);
  };

  Clock.prototype.ticktock = function() {
    var _ref;
    this.timer = setTimeout(this.ticktock, this.tick - (this.timerElapsed() - this.frame * this.tick));
    this.trigger(this.frame);
    this.frame += 1;
    if (this.changeEvents.length) {
      if ((_ref = this.canvas) != null) {
        _ref.renderAll();
      }
    }
    return this.changeEvents = [];
  };

  return Clock;

})();

module.exports = {
  Clock: Clock
};
});

;require.register("utils/diff", function(exports, require, module) {
var diff, id_attr, merge, _;

if (typeof window === 'undefined') {
  _ = require("underscore");
} else {
  _ = window._;
}

id_attr = "id";

diff = function(master, update) {
  var array_diff, i, name, ret, value, _i, _ref;
  if (!master) {
    return update;
  }
  ret = {};
  for (name in master) {
    value = master[name];
    if (name in update) {
      if (_.isObject(update[name])) {
        if (_.isArray(update[name])) {
          ret[name] = [];
          for (i = _i = 0, _ref = update[name].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            array_diff = diff(master[name][i], update[name][i]);
            if (!_.isEmpty(array_diff)) {
              ret[name].push(array_diff);
            }
          }
          if (ret[name].length === 0) {
            delete ret[name];
          }
        } else {
          diff = diff(master[name], update[name]);
          if (!_.isEmpty(diff)) {
            ret[name] = diff;
          }
        }
      } else if (!_.isEqual(master[name], update[name]) || name === id_attr) {
        ret[name] = update[name];
      }
    }
  }
  return ret;
};

merge = function(master, update) {
  var i, master_node, name, update_node, value, _i, _ref;
  if (!master) {
    return update;
  }
  for (name in update) {
    value = update[name];
    if (name in master) {
      if (_.isObject(update[name])) {
        if (_.isArray(update[name])) {
          for (i = _i = 0, _ref = update[name].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            update_node = update[name][i];
            if (_.isObject(update_node)) {
              master_node = _.find(master[name], function(item) {
                return item.id === update_node.id;
              });
              if (master_node) {
                master_node = merge(master_node, update_node);
              } else {
                master[name].push(update_node);
              }
            } else {
              master[name].push(update_node);
            }
          }
        } else {
          master[name] = merge(master[name], update[name]);
        }
      } else {
        console.log(name, master[name], update[name]);
        master[name] = update[name];
      }
    } else {
      master[name] = update[name];
    }
  }
  return master;
};

module.exports = {
  Diff: diff,
  Merge: merge
};
});

;require.register("utils/keys", function(exports, require, module) {
var keys;

keys = {
  "backspace": 8,
  "tab": 9,
  "enter": 13,
  "escape": 27,
  "page_up": 33,
  "page_down": 34,
  "end": 35,
  "home": 36,
  "insert": 45,
  "delete": 46,
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  "a": 65,
  "b": 66,
  "c": 67,
  "d": 68,
  "e": 69,
  "f": 70,
  "g": 71,
  "h": 72,
  "i": 73,
  "j": 74,
  "k": 75,
  "l": 76,
  "m": 77,
  "n": 78,
  "o": 79,
  "p": 80,
  "q": 81,
  "r": 82,
  "s": 83,
  "t": 84,
  "u": 85,
  "v": 86,
  "w": 87,
  "x": 88,
  "y": 89,
  "z": 90,
  "numpad0": 96,
  "numpad1": 97,
  "numpad2": 98,
  "numpad3": 99,
  "numpad4": 100,
  "numpad5": 101,
  "numpad6": 102,
  "numpad7": 103,
  "numpad8": 104,
  "numpad9": 105,
  "numpad*": 106,
  "numpad+": 107,
  "numpad-": 109,
  "numpad.": 110,
  "numpad/": 111,
  "f1": 112,
  "f2": 113,
  "f3": 114,
  "f4": 115,
  "f5": 116,
  "f6": 117,
  "f7": 118,
  "f8": 119,
  "f9": 120,
  "f10": 121,
  "f11": 122,
  "f12": 123,
  "num_lock": 144,
  "scroll_lock": 145,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222
};

module.exports = {
  Keys: keys
};
});

;require.register("utils/nestedImport", function(exports, require, module) {
module.exports = function(folder, app) {
  return window.require.list().filter(function(module) {
    return new RegExp('^' + folder + '/').test(module);
  }).forEach(function(module) {
    return app[module.split("/").slice(-1)[0]] = require(module);
  });
};
});

;require.register("utils/nestedModules", function(exports, require, module) {
module.exports = function(folder) {
  var modulesExported;
  modulesExported = [];
  window.require.list().filter(function(module) {
    return new RegExp('^' + folder + '/').test(module);
  }).forEach(function(module) {
    return modulesExported.push(module.split("/").slice(-1)[0]);
  });
  return modulesExported;
};
});

;require.register("utils/nestedSelectiveImport", function(exports, require, module) {
module.exports = function(folder, moduleSubKey) {
  var subModules;
  subModules = {};
  window.require.list().filter(function(module) {
    return new RegExp('^' + folder + '/').test(module);
  }).forEach(function(module) {
    subModules[module.split("/").slice(-1)[0]] = require(module)[moduleSubKey];
    if (!subModules[module.split("/").slice(-1)[0]]) {
      return delete subModules[module.split("/").slice(-1)[0]];
    }
  });
  return subModules;
};
});

;require.register("utils/random", function(exports, require, module) {
var seeded_shuffle;

seeded_shuffle = function(source_array, seed) {
  var array, i, m, random, t;
  random = new Math.seedrandom(seed);
  array = source_array.slice(0);
  m = array.length;
  while (m) {
    i = Math.floor(random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

module.exports = {
  seeded_shuffle: seeded_shuffle
};
});

;require.register("views/BlockView", function(exports, require, module) {
'use strict';
var BlockView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./View');

module.exports = BlockView = (function(_super) {
  __extends(BlockView, _super);

  function BlockView() {
    this.showTrial = __bind(this.showTrial, this);
    this.preLoadBlock = __bind(this.preLoadBlock, this);
    this.initialize = __bind(this.initialize, this);
    _ref = BlockView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BlockView.prototype.initialize = function(options) {
    BlockView.__super__.initialize.apply(this, arguments);
    this.generateTrialModels();
    return this.instantiateSubViews("trials", "TrialView", this.trialObjectViewType);
  };

  BlockView.prototype.generateTrialModels = function() {
    var model, parameterSet, parameters, trial, trialListLength, _i, _len, _ref1, _results;
    _ref1 = this.model.returnParameters(), trialListLength = _ref1[0], parameterSet = _ref1[1];
    if (!trialListLength) {
      return this.model.get("trials").create(this.model.returnTrialProperties(true));
    } else {
      _results = [];
      for (_i = 0, _len = parameterSet.length; _i < _len; _i++) {
        parameters = parameterSet[_i];
        trial = this.model.get("trials").create(this.model.returnTrialProperties());
        _results.push(trial.get("trialObjects").add((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = this.model.get("trialObjects").models;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            model = _ref2[_j];
            _results1.push(model.parameterizedTrial(parameters));
          }
          return _results1;
        }).call(this)));
      }
      return _results;
    }
  };

  BlockView.prototype.preLoadBlock = function(queue) {
    var key, view, _ref1, _results;
    _ref1 = this.subViews;
    _results = [];
    for (key in _ref1) {
      view = _ref1[key];
      _results.push(view.preLoadTrial(queue));
    }
    return _results;
  };

  BlockView.prototype.startBlock = function() {
    var currentTrial;
    this.datamodel.set("trial", this.datamodel.get("trial") || 0);
    currentTrial = this.model.get("trials").at(this.datamodel.get("trial"));
    return this.showTrial(currentTrial);
  };

  BlockView.prototype.showTrial = function(trial) {
    var trialView;
    if (!trial) {
      console.log("Done, finito, finished!");
      return;
    }
    trialView = this.subViews[trial.get("id")];
    if (this.trialView) {
      if (this.trialView.close) {
        this.trialView.close();
      } else {
        this.trialView.remove();
      }
    }
    this.trialdatamodel = this.datamodel.get("trialdatalogs").at(this.datamodel.get("trial")) || this.datamodel.get("trialdatalogs").create();
    this.datamodel.save();
    this.trialView = trialView;
    this.trialView.datamodel = this.trialdatamodel;
    this.trialView.render();
    this.trialView.appendTo("#trials");
    this.listenToOnce(this.trialView, "trialEnded", this.nextTrial);
    return this.trialView.startTrial();
  };

  BlockView.prototype.nextTrial = function() {
    var currentTrial;
    this.datamodel.set("trial", this.datamodel.get("trial") + 1);
    currentTrial = this.model.get("trials").at(this.datamodel.get("trial"));
    return this.showTrial(currentTrial);
  };

  return BlockView;

})(View);
});

;require.register("views/ExperimentView", function(exports, require, module) {
'use strict';
var Experiment, ExperimentDataHandler, ExperimentView, ProgressBarView, Template, View, clock, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

clock = require("utils/clock");

View = require('./View');

Experiment = require('../models/Experiment');

ExperimentDataHandler = require('../models/ExperimentDataHandler');

Template = require('templates/experiment');

ProgressBarView = require('./ProgressBarView');

module.exports = ExperimentView = (function(_super) {
  __extends(ExperimentView, _super);

  function ExperimentView() {
    this.startExperiment = __bind(this.startExperiment, this);
    this.startBlock = __bind(this.startBlock, this);
    this.refreshTime = __bind(this.refreshTime, this);
    this.initialize = __bind(this.initialize, this);
    _ref = ExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ExperimentView.prototype.template = Template;

  ExperimentView.prototype.initialize = function() {
    var _this = this;
    ExperimentView.__super__.initialize.apply(this, arguments);
    this.clock = new clock.Clock();
    this.refreshTime();
    this.render();
    this.appendTo("#app");
    this.datacollection = new ExperimentDataHandler.Collection;
    return this.datacollection.fetch().then(function() {
      _this.datamodel = _this.datacollection.getOrCreateParticipantModel(1, _this.model.get("saveInterval"));
      _this.instantiateSubViews("blocks", "BlockView");
      return _this.preLoadExperiment();
    });
  };

  ExperimentView.prototype.refreshTime = function() {
    return this.time = this.clock.getTime();
  };

  ExperimentView.prototype.startBlock = function(block) {
    var blockView;
    blockView = this.subViews[block.get("id")];
    if (this.blockView) {
      if (this.blockView.close) {
        this.blockView.close();
      } else {
        this.blockView.remove();
      }
    }
    this.blockdatamodel = this.datamodel.get("blockdatahandlers").at(block) || this.datamodel.get("blockdatahandlers").create();
    this.datamodel.save();
    this.blockView = blockView;
    this.blockView.datamodel = this.blockdatamodel;
    this.blockView.render();
    return this.blockView.startBlock();
  };

  ExperimentView.prototype.preLoadExperiment = function() {
    var key, progressBarView, queue, view, _ref1;
    queue = new createjs.LoadQueue(true);
    _ref1 = this.subViews;
    for (key in _ref1) {
      view = _ref1[key];
      view.preLoadBlock(queue);
    }
    progressBarView = new ProgressBarView({
      queue: queue,
      complete: this.startExperiment
    });
    progressBarView.appendTo("#messages");
    return progressBarView.render();
  };

  ExperimentView.prototype.startExperiment = function() {
    var currentBlock;
    currentBlock = this.model.get("blocks").at(this.datamodel.get("block") || 0);
    return this.startBlock(currentBlock);
  };

  return ExperimentView;

})(View);
});

;require.register("views/HomeView", function(exports, require, module) {
'use strict';
var HomeView, View, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

template = require('../templates/home');

View = require('./View');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = template;

  return HomeView;

})(View);
});

;require.register("views/ProgressBarView", function(exports, require, module) {
'use strict';
var ProgressBarView, View, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

template = require('../templates/progressbar');

View = require('./View');

module.exports = ProgressBarView = (function(_super) {
  __extends(ProgressBarView, _super);

  function ProgressBarView() {
    this.close = __bind(this.close, this);
    this.finish = __bind(this.finish, this);
    this.progress = __bind(this.progress, this);
    this.initialize = __bind(this.initialize, this);
    _ref = ProgressBarView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ProgressBarView.prototype.template = template;

  ProgressBarView.prototype.initialize = function(options) {
    ProgressBarView.__super__.initialize.apply(this, arguments);
    this.queue = options.queue;
    this.complete = options.complete;
    this.queue.on("progress", this.progress);
    return this.queue.on("complete", this.finish);
  };

  ProgressBarView.prototype.progress = function(data) {
    return this.setProgressBar(data.progress);
  };

  ProgressBarView.prototype.finish = function() {
    return this.$el.animate({
      opacity: 0
    }, 1000, "swing", this.close);
  };

  ProgressBarView.prototype.close = function() {
    this.complete();
    return this.remove();
  };

  ProgressBarView.prototype.setProgressBar = function(fraction) {
    var progressBarWidth;
    progressBarWidth = fraction * this.$el.find("#progressBar").width();
    return this.$el.find("#indicator").animate({
      width: progressBarWidth
    }, 100).html(Math.round(fraction * 100) + "%&nbsp;");
  };

  return ProgressBarView;

})(View);
});

;require.register("views/TrialObjectView", function(exports, require, module) {
'use strict';
var TrialObjectView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./View');

module.exports = TrialObjectView = (function(_super) {
  __extends(TrialObjectView, _super);

  function TrialObjectView() {
    this.registerEvents = __bind(this.registerEvents, this);
    this.logEvent = __bind(this.logEvent, this);
    this.render = __bind(this.render, this);
    this.postFileLoad = __bind(this.postFileLoad, this);
    this.preLoadTrialObject = __bind(this.preLoadTrialObject, this);
    _ref = TrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrialObjectView.prototype.initialize = function() {
    TrialObjectView.__super__.initialize.apply(this, arguments);
    if (!this.model.get("file")) {
      this.render();
    }
    this.active = false;
    return this.name = this.model.name();
  };

  TrialObjectView.prototype.attach = function(endpoints) {};

  TrialObjectView.prototype.preLoadTrialObject = function(queue) {
    if (this.model.get("file")) {
      this.object_id = this.model.get("file");
      if (!queue.getItem(this.object_id)) {
        queue.loadFile({
          src: this.object_id
        });
      }
      return queue.on("fileload", this.postFileLoad);
    }
  };

  TrialObjectView.prototype.postFileLoad = function(data) {
    if (data.item.src === this.model.get("file")) {
      this.file_object = data.result;
      return this.render();
    }
  };

  TrialObjectView.prototype.render = function() {
    console.debug("Rendering " + this.constructor.name);
    return this.$el.html(this.file_object);
  };

  TrialObjectView.prototype.logEvent = function(event_type, options) {
    if (options == null) {
      options = {};
    }
    return this.datamodel.logEvent(event_type, this.clock, _.extend(options, {
      object: this.model.name(),
      details: this.logDetails()
    }));
  };

  TrialObjectView.prototype.addToClockChangeEvents = function(event) {
    return this.clock.changeEvents.push(event);
  };

  TrialObjectView.prototype.logDetails = function() {
    if (PsychoCoffee.DEBUG) {
      return this.model.attributes;
    } else {
      return this.model.get("type") || this.model.get("subModelTypeAttribute");
    }
  };

  TrialObjectView.prototype.activate = function() {
    if (!this.active) {
      this.trigger("activated");
      this.logEvent("activated");
      return this.active = true;
    }
  };

  TrialObjectView.prototype.deactivate = function() {
    if (this.active) {
      this.trigger("deactivated");
      this.logEvent("deactivated");
      return this.active = false;
    }
  };

  TrialObjectView.prototype.modelSet = function(attr, value) {
    return this.model.set(attr, value);
  };

  TrialObjectView.prototype.registerEvents = function(siblingViews) {
    var trigger, view, _i, _len, _ref1, _results,
      _this = this;
    this.clock.delayedTrigger(this.model.get("delay"), this, this.activate);
    this.clock.delayedTrigger(this.model.get("delay") + this.model.get("duration"), this, this.deactivate);
    _ref1 = this.model.get("triggers") || [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      trigger = _ref1[_i];
      view = _.find(siblingViews, function(sibling) {
        return sibling.name === trigger.objectName;
      });
      _results.push(this.listenTo(view, trigger.eventName, function() {
        console.log("Triggering", trigger.eventName);
        return _this[trigger.callback](trigger["arguments"] || {});
      }));
    }
    return _results;
  };

  return TrialObjectView;

})(View);
});

;require.register("views/TrialObjectViews/AudioTrialObjectView", function(exports, require, module) {
'use strict';
var AudioTrialObjectView, TrialObjectView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObjectView = require('../TrialObjectView');

module.exports = AudioTrialObjectView = (function(_super) {
  __extends(AudioTrialObjectView, _super);

  function AudioTrialObjectView() {
    this.render = __bind(this.render, this);
    this.preLoadTrialObject = __bind(this.preLoadTrialObject, this);
    _ref = AudioTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AudioTrialObjectView.prototype.attach = function(endpoints) {
    return this.appendTo(endpoints.hidden);
  };

  AudioTrialObjectView.prototype.preLoadTrialObject = function(queue) {
    queue.installPlugin(createjs.Sound);
    return AudioTrialObjectView.__super__.preLoadTrialObject.apply(this, arguments);
  };

  AudioTrialObjectView.prototype.activate = function() {
    this.object.play();
    return AudioTrialObjectView.__super__.activate.call(this);
  };

  AudioTrialObjectView.prototype.deactivate = function() {
    this.object.stop();
    return AudioTrialObjectView.__super__.deactivate.call(this);
  };

  AudioTrialObjectView.prototype.render = function() {
    return this.object = createjs.Sound.createInstance(this.object_id);
  };

  return AudioTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialObjectViews/KeyboardTrialObjectView", function(exports, require, module) {
'use strict';
var KeyboardTrialObjectView, Keys, TrialObjectView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObjectView = require('../TrialObjectView');

Keys = require("utils/keys");

module.exports = KeyboardTrialObjectView = (function(_super) {
  __extends(KeyboardTrialObjectView, _super);

  function KeyboardTrialObjectView() {
    this.keyPressed = __bind(this.keyPressed, this);
    this.activate = __bind(this.activate, this);
    this.initialize = __bind(this.initialize, this);
    _ref = KeyboardTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  KeyboardTrialObjectView.prototype.initialize = function() {
    KeyboardTrialObjectView.__super__.initialize.apply(this, arguments);
    return this.keyCodeCache = _.invert(_.pick(Keys.Keys, this.model.get("keys")));
  };

  KeyboardTrialObjectView.prototype.attach = function(endpoints) {
    return this.object = $(window);
  };

  KeyboardTrialObjectView.prototype.activate = function() {
    this.object.keydown(this.keyPressed);
    return KeyboardTrialObjectView.__super__.activate.call(this);
  };

  KeyboardTrialObjectView.prototype.deactivate = function() {
    this.object.unbind("keydown", this.keyPressed);
    return KeyboardTrialObjectView.__super__.deactivate.call(this);
  };

  KeyboardTrialObjectView.prototype.keyPressed = function(event) {
    if (_.has(this.keyCodeCache, event.keyCode)) {
      this.trigger("keypress");
      return this.logEvent("keypress", {
        key: this.keyCodeCache[event.keyCode]
      });
    }
  };

  KeyboardTrialObjectView.prototype.render = function() {};

  return KeyboardTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/ImageVisualTrialObjectView", function(exports, require, module) {
'use strict';
var ImageVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = ImageVisualTrialObjectView = (function(_super) {
  __extends(ImageVisualTrialObjectView, _super);

  function ImageVisualTrialObjectView() {
    _ref = ImageVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ImageVisualTrialObjectView.prototype.render = function() {
    return this.object = new fabric.Image(this.file_object);
  };

  return ImageVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/TextVisualTrialObjectView", function(exports, require, module) {
'use strict';
var TextVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = TextVisualTrialObjectView = (function(_super) {
  __extends(TextVisualTrialObjectView, _super);

  function TextVisualTrialObjectView() {
    _ref = TextVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TextVisualTrialObjectView.prototype.render = function() {
    return this.object = new fabric.Text(this.model.get("text"));
  };

  return TextVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/VisualTrialObjectView", function(exports, require, module) {
'use strict';
var TrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObjectView = require('../TrialObjectView');

module.exports = VisualTrialObjectView = (function(_super) {
  __extends(VisualTrialObjectView, _super);

  function VisualTrialObjectView() {
    _ref = VisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  VisualTrialObjectView.prototype.attach = function(endpoints) {
    this.canvas = endpoints.canvas;
    this.object.setVisible(false);
    return this.canvas.add(this.object);
  };

  VisualTrialObjectView.prototype.activate = function() {
    this.object.setVisible(true);
    this.addToClockChangeEvents("activated");
    return VisualTrialObjectView.__super__.activate.call(this);
  };

  VisualTrialObjectView.prototype.deactivate = function() {
    this.object.setVisible(false);
    this.addToClockChangeEvents("deactivated");
    return VisualTrialObjectView.__super__.deactivate.call(this);
  };

  return VisualTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialView", function(exports, require, module) {
'use strict';
var Template, TrialView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./View');

Template = require('templates/trial');

module.exports = TrialView = (function(_super) {
  __extends(TrialView, _super);

  function TrialView() {
    this.registerTimeout = __bind(this.registerTimeout, this);
    this.logEvent = __bind(this.logEvent, this);
    this.canvasPerformanceTracking = __bind(this.canvasPerformanceTracking, this);
    this.createCanvas = __bind(this.createCanvas, this);
    this.preLoadTrial = __bind(this.preLoadTrial, this);
    this.initialize = __bind(this.initialize, this);
    _ref = TrialView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrialView.prototype.template = Template;

  TrialView.prototype.initialize = function(options) {
    TrialView.__super__.initialize.apply(this, arguments);
    this.instantiateSubViews("trialObjects", "TrialObjectView", this.trialObjectViewType);
    return this.subViewList = _.values(this.subViews);
  };

  TrialView.prototype.preLoadTrial = function(queue) {
    var key, view, _ref1, _results;
    _ref1 = this.subViews;
    _results = [];
    for (key in _ref1) {
      view = _ref1[key];
      _results.push(view.preLoadTrialObject(queue));
    }
    return _results;
  };

  TrialView.prototype.trialObjectViewType = function(model) {
    var elementType, elementView, error;
    elementType = model.get("subModelTypeAttribute") || PsychoCoffee.trialObjectTypeKeys[model.get("type")];
    elementView = elementType + "View";
    try {
      PsychoCoffee[elementView];
      return elementView;
    } catch (_error) {
      error = _error;
      return console.debug(error, "Unknown element type " + elementType);
    }
  };

  TrialView.prototype.startTrial = function() {
    var view, _i, _len, _ref1;
    this.createCanvas();
    _ref1 = this.subViewList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      view.attach({
        canvas: this.canvas,
        hidden: this.$("#trial-hidden")
      });
      view.datamodel = this.datamodel;
      view.registerEvents(this.subViewList);
    }
    this.registerTimeout();
    this.clock.startTimer();
    return this.logEvent("trial_start");
  };

  TrialView.prototype.createCanvas = function() {
    this.canvas = new fabric.StaticCanvas("trial-canvas");
    return this.clock.canvas = this.canvas;
  };

  TrialView.prototype.canvasPerformanceTracking = function(options) {
    var now,
      _this = this;
    now = options.event_time;
    return this.canvas.on("after:render", function() {
      console.log(_this.clock.timerElapsed() - now, "ms between object added/removed and render completion");
      return _this.canvas.off("after:render");
    });
  };

  TrialView.prototype.logEvent = function(event_type, options) {
    if (options == null) {
      options = {};
    }
    return this.datamodel.logEvent(event_type, this.clock, _.extend(options, {
      object: this.model.name()
    }));
  };

  TrialView.prototype.registerTimeout = function() {
    if (this.model.get("timeout")) {
      return this.clock.delayedTrigger(this.model.get("timeout"), this, this.endTrial);
    }
  };

  TrialView.prototype.endTrial = function() {
    var key, view, _ref1;
    _ref1 = this.subViews;
    for (key in _ref1) {
      view = _ref1[key];
      view.deactivate();
      view.remove();
    }
    this.clock.stopTimer();
    delete this.clock.canvas;
    delete this.canvas;
    this.stopListening();
    this.remove();
    return this.trigger("trialEnded");
  };

  return TrialView;

})(View);
});

;require.register("views/View", function(exports, require, module) {
var View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    this.instantiateSubViews = __bind(this.instantiateSubViews, this);
    this.appendTo = __bind(this.appendTo, this);
    this.render = __bind(this.render, this);
    this.initialize = __bind(this.initialize, this);
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.initialize = function(options) {
    View.__super__.initialize.apply(this, arguments);
    return this.clock = options.clock;
  };

  View.prototype.template = function() {};

  View.prototype.getRenderData = function() {
    var _ref1;
    return ((_ref1 = this.model) != null ? _ref1.attributes : void 0) || {};
  };

  View.prototype.render = function() {
    console.debug("Rendering " + this.constructor.name);
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  View.prototype.appendTo = function(el) {
    return $(el).append(this.el);
  };

  View.prototype.instantiateSubViews = function(key, viewType, viewFunction) {
    var model, _i, _len, _ref1, _results;
    this.subViews = {};
    _ref1 = this.model.get(key).models;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      model = _ref1[_i];
      if (viewFunction) {
        viewType = viewFunction(model);
      }
      _results.push(this.subViews[model.id] = new PsychoCoffee[viewType]({
        model: model,
        clock: this.clock
      }));
    }
    return _results;
  };

  View.prototype.afterRender = function() {};

  return View;

})(Backbone.View);
});

;require.register("envs/development/env", function(exports, require, module) {
'use strict';

module.exports = 'development';

});

;
//# sourceMappingURL=app.js.map