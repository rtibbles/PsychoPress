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
  initialize: function() {}
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
var Collection, Model, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Backbone.AssociatedModel);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    this.url = __bind(this.url, this);
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.urlBase = "/api/";

  Collection.prototype.model = Model;

  Collection.prototype.initialize = function(options) {
    var apiFilter, filterparam, _i, _len, _ref2, _results;
    if (options == null) {
      options = {};
    }
    this.params = {};
    _ref2 = this.apiFilters;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      apiFilter = _ref2[_i];
      filterparam = "filter[where][" + apiFilter + "]";
      if (options[apiFilter] != null) {
        _results.push(this.params[filterparam] = options[apiFilter]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Collection.prototype.filterFetch = function(options) {
    if (options == null) {
      options = {};
    }
    options.data = this.params;
    return this.fetch(options);
  };

  Collection.prototype.url = function() {
    return this.urlBase + this.apiCollection;
  };

  return Collection;

})(Backbone.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Base", function(exports, require, module) {
'use strict';
var Collection, Model, random, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

random = require('utils/random');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.name = function() {
    return this.get("name") || this.id;
  };

  Model.prototype.save = function(key, val, options) {
    return this.set("id", random.seededguid());
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
var Base, BlockParameterSet, Collection, Model, Trial, TrialObject, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Trial = require('./Trial');

TrialObject = require('./TrialObject');

BlockParameterSet = require('./BlockParameterSet');

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
    trialObjects: [],
    numberOfTrials: null,
    triggers: []
  };

  Model.prototype.trialProperties = ["title", "width", "height", "timeout", "triggers"];

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
      relatedModel: BlockParameterSet.Model
    }
  ];

  Model.prototype.returnParameters = function(user_id, experimentParameters) {
    return this.get("parameterSet").returnTrialParameters(user_id, this.get("numberOfTrials"), experimentParameters);
  };

  Model.prototype.returnTrialProperties = function(parameters) {
    var attribute, attributes, key, parameterName, _i, _len, _ref1, _ref2;
    if (parameters == null) {
      parameters = {};
    }
    attributes = {};
    _ref1 = this.trialProperties;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      key = _ref1[_i];
      attributes[key] = this.get(key);
    }
    _ref2 = this.get("parameterizedAttributes");
    for (attribute in _ref2) {
      parameterName = _ref2[attribute];
      if (parameterName in parameters) {
        attributes[attribute] = parameters[parameterName];
      }
    }
    return attributes;
  };

  Model.prototype.createTrialObject = function(options) {
    return this.get("trialObjects").create(options);
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
var Collection, EventLog, Model, NestedAPIBase, TrialDataLog, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NestedAPIBase = require('./NestedAPIBase');

TrialDataLog = require('./TrialDataLog');

EventLog = require('./EventLog');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.logEvent = __bind(this.logEvent, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    trialdatalogs: [],
    blockeventlogs: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialdatalogs',
      collectionType: TrialDataLog.Collection
    }, {
      type: Backbone.Many,
      key: 'blockeventlogs',
      collectionType: EventLog.Collection
    }
  ];

  Model.prototype.logEvent = function(event_type, clock, options) {
    if (options == null) {
      options = {};
    }
    return this.addEvent(_.extend(options, {
      experiment_time: clock.getTime(),
      event_type: event_type
    }));
  };

  Model.prototype.addEvent = function(event) {
    return this.get("blockeventlogs").create(event);
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

;require.register("models/BlockParameterSet", function(exports, require, module) {
'use strict';
var Base, Collection, Model, Parameter, Random, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Random = require('utils/random');

Parameter = require('./Parameter');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    randomized: false,
    trialParameters: [],
    blockParameters: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialParameters',
      collectionType: Parameter.Collection
    }, {
      type: Backbone.Many,
      key: 'blockParameters',
      collectionType: Parameter.Collection
    }
  ];

  Model.prototype.returnTrialParameters = function(user_id, trials_wanted, experimentParameterSet) {
    var blockParameterSet, i, key, min_length, model, parameter, parameterList, parameterNameList, parameterObjectList, parameterSet, parameters, value, _i, _j, _k, _l, _len, _len1, _m, _ref1, _ref2;
    if (user_id == null) {
      user_id = "";
    }
    if (trials_wanted == null) {
      trials_wanted = null;
    }
    if (experimentParameterSet == null) {
      experimentParameterSet = {};
    }
    parameterObjectList = [];
    parameterNameList = [];
    blockParameterSet = {};
    _ref1 = this.get("blockParameters").models;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      model = _ref1[_i];
      blockParameterSet[model.get("parameterName")] = Random.seeded_shuffle(model.returnParameterList(user_id, null, experimentParameterSet), user_id + "blockParameterSet" + this.id)[0];
    }
    parameterSet = {};
    _ref2 = this.get("trialParameters").models;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      model = _ref2[_j];
      parameterList = model.returnParameterList(user_id, trials_wanted, blockParameterSet);
      parameterSet[model.get("parameterName")] = parameterList;
      min_length = Math.min(min_length, parameterList.length) || parameterList.length;
    }
    for (key in parameterSet) {
      value = parameterSet[key];
      if (value.length < trials_wanted) {
        console.warn("Parameter " + key + " could not produce sufficient\ntrials for desired trials_wanted value.");
      }
      parameterSet[key] = value.slice(0, min_length);
      parameterNameList.push(key);
    }
    if ((min_length == null) || min_length === 0) {
      min_length = 1;
    }
    for (key in experimentParameterSet) {
      value = experimentParameterSet[key];
      parameterList = [];
      for (i = _k = 0; 0 <= min_length ? _k < min_length : _k > min_length; i = 0 <= min_length ? ++_k : --_k) {
        parameterList.push(value);
      }
      parameterSet[key] = parameterList;
      parameterNameList.push(key);
    }
    for (key in blockParameterSet) {
      value = blockParameterSet[key];
      parameterList = [];
      for (i = _l = 0; 0 <= min_length ? _l < min_length : _l > min_length; i = 0 <= min_length ? ++_l : --_l) {
        parameterList.push(value);
      }
      parameterSet[key] = parameterList;
      parameterNameList.push(key);
    }
    for (i = _m = 0; 0 <= min_length ? _m < min_length : _m > min_length; i = 0 <= min_length ? ++_m : --_m) {
      parameters = _.object(parameterNameList, (function() {
        var _len2, _n, _results;
        _results = [];
        for (_n = 0, _len2 = parameterNameList.length; _n < _len2; _n++) {
          parameter = parameterNameList[_n];
          _results.push(parameterSet[parameter][i]);
        }
        return _results;
      })());
      parameterObjectList.push(parameters);
    }
    if (this.get("randomized")) {
      parameterObjectList = Random.seeded_shuffle(parameterObjectList, user_id + "parameterObjectList" + this.id);
    }
    return [blockParameterSet, min_length, parameterObjectList];
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

;require.register("models/EventLog", function(exports, require, module) {
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

;require.register("models/Experiment", function(exports, require, module) {
'use strict';
var Base, Block, Collection, ExperimentParameterSet, Model, fingerprint, random, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Block = require('./Block');

fingerprint = require('utils/fingerprint');

random = require('utils/random');

ExperimentParameterSet = require('./ExperimentParameterSet');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.initialize = function() {
    Model.__super__.initialize.apply(this, arguments);
    return random.seedGUID(fingerprint());
  };

  Model.prototype.defaults = {
    blocks: [],
    title: "Experiment",
    saveInterval: 10000,
    parameterSet: {}
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'blocks',
      collectionType: Block.Collection
    }, {
      type: Backbone.One,
      key: 'parameterSet',
      relatedModel: ExperimentParameterSet.Model
    }
  ];

  Model.prototype.createBlock = function(options) {
    return this.get("blocks").create(options);
  };

  Model.prototype.returnParameters = function(user_id) {
    return this.get("parameterSet").returnExperimentParameters(user_id);
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

;require.register("models/ExperimentDataHandler", function(exports, require, module) {
'use strict';
var APIBase, BlockDataHandler, Collection, Diff, EventLog, Model, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

APIBase = require('./APIBase');

BlockDataHandler = require('./BlockDataHandler');

Diff = require('utils/diff');

EventLog = require('./EventLog');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.syncNow = __bind(this.syncNow, this);
    this.sync = __bind(this.sync, this);
    this.logEvent = __bind(this.logEvent, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.initialize = function() {
    this.lastSync = 0;
    return this.serverState = this.toJSON();
  };

  Model.prototype.defaults = {
    blockdatahandlers: [],
    experimenteventlogs: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'blockdatahandlers',
      collectionType: BlockDataHandler.Collection
    }, {
      type: Backbone.Many,
      key: 'experimenteventlogs',
      collectionType: EventLog.Collection
    }
  ];

  Model.prototype.logEvent = function(event_type, clock, options) {
    if (options == null) {
      options = {};
    }
    return this.addEvent(_.extend(options, {
      experiment_time: clock.getTime(),
      event_type: event_type
    }));
  };

  Model.prototype.addEvent = function(event) {
    return this.get("experimenteventlogs").create(event);
  };

  Model.prototype.sync = function(method, model, options) {
    var delayTime, syncNow,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (options.now) {
      return this.syncNow(method, model, options);
    } else {
      if (model != null) {
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
      }
    }
  };

  Model.prototype.syncNow = function(method, model, options) {
    var callback, e,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (model != null) {
      if (options.success) {
        callback = options.success;
      }
      if (!this.isNew()) {
        options.attrs = Diff.Diff(this.serverState, model.toJSON());
        options.method = 'patch';
        options.success = function(saved) {
          if (saved.patched) {
            _this.set(model.attributes);
            _this.serverState = model.toJSON();
            return callback(saved);
          }
        };
      } else {
        options.success = function(data) {
          _this.set(data);
          _this.serverState = _this.toJSON();
          return callback(data);
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
    }
  };

  return Model;

})(APIBase.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  Collection.prototype.storeName = "experimentData";

  Collection.prototype.apiCollection = "experimentdatahandlers";

  Collection.prototype.apiFilters = ["experiment_identifier", "participant_id"];

  Collection.prototype.getOrCreateParticipantModel = function(participant_id, experiment_model) {
    var model;
    model = this.findWhere({
      participant_id: participant_id,
      experiment_identifier: experiment_model.get("identifier")
    });
    return model || this.create({
      participant_id: participant_id,
      saveInterval: experiment_model.get("saveInterval"),
      experiment_identifier: experiment_model.get("identifier")
    });
  };

  return Collection;

})(APIBase.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/ExperimentParameterSet", function(exports, require, module) {
'use strict';
var Base, Collection, Model, Parameter, Random, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Random = require('utils/random');

Parameter = require('./Parameter');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = {
    randomized: false,
    experimentParameters: []
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'experimentParameters',
      collectionType: Parameter.Collection
    }
  ];

  Model.prototype.returnExperimentParameters = function(user_id) {
    var experimentParameterSet, model, _i, _len, _ref1;
    if (user_id == null) {
      user_id = "";
    }
    experimentParameterSet = {};
    _ref1 = this.get("experimentParameters").models;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      model = _ref1[_i];
      experimentParameterSet[model.get("parameterName")] = Random.seeded_shuffle(model.returnParameterList(user_id, null, experimentParameterSet), user_id + "experimentParameterSet" + this.id)[0];
    }
    return experimentParameterSet;
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

;require.register("models/NestedAPIBase", function(exports, require, module) {
'use strict';
var Collection, Model, hashObject, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

hashObject = require('utils/hashObject');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    this.save = __bind(this.save, this);
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.save = function() {
    var model, _i, _len, _ref1, _results;
    this.set("id", hashObject(this.collection.parents[0].toJSON()));
    _ref1 = this.collection.parents;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      model = _ref1[_i];
      _results.push(model.save());
    }
    return _results;
  };

  return Model;

})(Backbone.AssociatedModel);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Backbone.Collection);

module.exports = {
  Model: Model,
  Collection: Collection
};
});

;require.register("models/Parameter", function(exports, require, module) {
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
  Parameter attributes can be of three basic returnTypes:
  
  fixedList       equivalent to a CSV or spreadsheet of parameters.
                  Each attribute defined in this way has an equal
                  length array of values which must be greater than
                  or equal to the requested number of trials.
  
  generatedList   each parameter can take on one of a set of discrete
                  values, ParameterSet will either return a repeating
                  set (either randomized or not), or can be combined
                  with other parameters to produce all possible
                  combinations.
  
  generatorFn     Parameters are defined by mathematical functions. Requires
                  input value for functions (either single value or array of
                  same length as number of parameters), function to change
                  input values by (either single function or array of
                  functions), and number of trials wanted.
  
  Further, Parameter Attributes can have additional methods based on their
  dataType, for example, an Array dataType is allowed to be shuffled.
  */


  Model.prototype.defaults = {
    dataType: "",
    returnType: "fixedList",
    randomized: false,
    parameterName: "Untitled Parameter",
    parameters: [],
    parameterizedAttributes: {}
  };

  Model.prototype.returnParameterList = function(user_id, trials_wanted, injectedParameters) {
    var attribute, data, name, _ref1;
    if (user_id == null) {
      user_id = "";
    }
    if (trials_wanted == null) {
      trials_wanted = null;
    }
    if (injectedParameters == null) {
      injectedParameters = {};
    }
    _ref1 = this.get("parameterizedAttributes");
    for (attribute in _ref1) {
      name = _ref1[attribute];
      if (name in injectedParameters) {
        this.set(attribute, injectedParameters[name]);
      }
    }
    switch (this.get("returnType")) {
      case "fixedList":
        data = this.fixedList(user_id, trials_wanted);
        break;
      case "generatedList":
        data = this.generatedList(user_id, trials_wanted);
        break;
      case "generatorFn":
        data = this.generatorFn(user_id, trials_wanted);
        break;
      default:
        console.log("ParameterSet returnType undefined!");
    }
    if (this.get("dataType") === "array") {
      if (this.get("shuffled")) {
        data = this.shuffleListArrays(user_id, data);
      }
    }
    return data;
  };

  Model.prototype.fixedList = function(user_id, trials_wanted) {
    var parameterList;
    parameterList = this.get("parameters");
    if (parameterList.length < trials_wanted) {
      console.warn("Trials wanted exceeds fixedList length");
    }
    if (this.get("randomized")) {
      parameterList = Random.seeded_shuffle(parameterList, user_id + "fixedList" + this.id);
    }
    if (trials_wanted != null) {
      parameterList = parameterList.slice(0, trials_wanted);
    }
    return parameterList;
  };

  Model.prototype.generatedList = function(user_id, trials_wanted) {
    var extra_count, extras, i, parameterList, wholelists, _i;
    parameterList = [];
    wholelists = Math.floor(trials_wanted / this.get("parameters").length);
    extra_count = trials_wanted % this.get("parameters").length;
    for (i = _i = 0; 0 <= wholelists ? _i < wholelists : _i > wholelists; i = 0 <= wholelists ? ++_i : --_i) {
      parameterList.push.apply(parameterList, this.get("parameters"));
    }
    if (this.get("randomized")) {
      extras = Random.seeded_shuffle(this.get("parameters"), user_id + "generatedListExtras" + this.id);
      extras = extras.slice(0, extra_count);
      parameterList.push.apply(parameterList, extras);
      parameterList = Random.seeded_shuffle(parameterList, user_id + "generatedList" + this.id);
    } else {
      parameterList.push.apply(parameterList, this.get("parameters").slice(0, extra_count));
    }
    return parameterList;
  };

  Model.prototype.generatorFn = function(user_id, trials_wanted) {
    return {};
  };

  Model.prototype.shuffleListArrays = function(user_id, list) {
    var index, item, _i, _len;
    for (index = _i = 0, _len = list.length; _i < _len; index = ++_i) {
      item = list[index];
      list[index] = Random.seeded_shuffle(item, user_id + "shuffleListArrays" + this.id + index);
    }
    return list;
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
var Collection, EventLog, Model, NestedAPIBase, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NestedAPIBase = require('./NestedAPIBase');

EventLog = require('./EventLog');

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
      collectionType: EventLog.Collection
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

;require.register("models/TrialObject", function(exports, require, module) {
'use strict';
var Base, Collection, Model, nestedModules, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

nestedModules = require('../utils/nestedModules');

Base = require('./Base');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.defaults = function() {
    var defaults, option, parameter, _i, _j, _len, _len1, _ref1, _ref2;
    defaults = {};
    _ref1 = this.objectOptions();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      option = _ref1[_i];
      if (option["default"] != null) {
        defaults[option.name] = option["default"];
      }
    }
    _ref2 = this.requiredParameters();
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      parameter = _ref2[_j];
      defaults[parameter.name] = parameter["default"];
    }
    return defaults;
  };

  Model.prototype.requiredParameters = function() {
    return [];
  };

  Model.prototype.objectOptions = function() {
    return [
      {
        name: "delay",
        "default": 0,
        type: "number"
      }, {
        name: "duration",
        "default": 0,
        type: "number"
      }, {
        name: "startWithTrial",
        "default": true,
        type: "boolean"
      }, {
        name: "parameterizedAttributes",
        "default": {},
        type: "object"
      }, {
        /*
        Triggers are objects of the form -
        { eventName: "change", objectName: "firstImage",
        callback: "firstImageMethod", arguments: {size: 17}}
        The trigger will be registered to listen to this event
        on the other trial object, and will invoke this callback
        with these arguments. An optional argument of "once" can be
        set to true to use listenToOnce instead of listenTo.
        */

        name: "triggers",
        "default": [],
        type: "array",
        embedded_type: Object
      }
    ];
  };

  Model.prototype.parameterizedTrial = function(parameters) {
    var attribute, attributes, parameterName, _ref1;
    attributes = _.clone(this.attributes);
    _ref1 = this.get("parameterizedAttributes");
    for (attribute in _ref1) {
      parameterName = _ref1[attribute];
      if (parameterName in parameters) {
        attributes[attribute] = parameters[parameterName];
      }
    }
    return attributes;
  };

  Model.prototype.returnRequired = function() {
    var parameter, required, _i, _len, _ref1;
    required = [];
    _ref1 = this.requiredParameters();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      parameter = _ref1[_i];
      required.push(this.get(parameter.name));
    }
    return required;
  };

  Model.prototype.returnOptions = function() {
    var option, options, _i, _len, _ref1;
    options = {};
    _ref1 = this.objectOptions();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      option = _ref1[_i];
      if (this.get(option.name) != null) {
        options[option.name] = this.get(option.name);
      }
    }
    return options;
  };

  Model.prototype.allParameters = function() {
    var parameter, parameters, _i, _len, _ref1;
    parameters = {};
    _ref1 = this.objectOptions().concat(this.requiredParameters());
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      parameter = _ref1[_i];
      if (this.get(parameter.name) != null) {
        parameters[parameter.alias || parameter.name] = this.get(parameter.name);
      }
    }
    return parameters;
  };

  return Model;

})(Base.Model);

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref1 = Collection.__super__.constructor.apply(this, arguments);
    return _ref1;
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

;require.register("models/TrialObjects/GroupTrialObject", function(exports, require, module) {
'use strict';
/*
The group trial object acts as a special wrapper around
other trial objects to group behaviour or properties in
a privileged way.

One example might be for the randomization of buttons
across or participants or across trials. Two buttons would
be part of a group, and have their labels determined at
the button level - allowing their ordering to be
paramiterized.

As such, parameterizedAttributes on group object is
always ignored, and any arrays passed in as parameters
are assumed to be parameters for the children.
*/

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
      trialObjects: []
    }, Model.__super__.defaults.apply(this, arguments));
  };

  Model.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'trialObjects',
      collectionType: TrialObject.Collection
    }
  ];

  Model.prototype.parameterizedTrial = function(parameters) {
    var attributes, index, key, localParameters, model, trialObjects, value, _i, _len, _ref1;
    attributes = Model.__super__.parameterizedTrial.call(this);
    trialObjects = [];
    _ref1 = attributes.trialObjects.models;
    for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
      model = _ref1[index];
      localParameters = {};
      for (key in parameters) {
        value = parameters[key];
        if (value instanceof Array) {
          localParameters[key] = value[index];
        } else {
          localParameters[key] = value;
        }
      }
      trialObjects.push(model.parameterizedTrial(localParameters));
    }
    attributes.trialObjects = trialObjects;
    return attributes;
  };

  Model.prototype.createTrialObject = function(options) {
    return this.get("trialObjects").create(options);
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model,
  Type: "group"
};
});

;require.register("models/TrialObjects/HTML/TextInput/TextAreaInputHTMLTrialObject", function(exports, require, module) {
'use strict';
var Model, TextInputHTMLTrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextInputHTMLTrialObject = require("../TextInputHTMLTrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(TextInputHTMLTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "text-area-input"
};
});

;require.register("models/TrialObjects/HTML/TextInputHTMLTrialObject", function(exports, require, module) {
'use strict';
var HTMLTrialObject, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HTMLTrialObject = require("../HTMLTrialObject");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.requiredParameters = function() {
    return [
      {
        name: "prefill",
        "default": "",
        type: "string"
      }, {
        name: "prompt",
        "default": "",
        type: "string"
      }
    ];
  };

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "fontSize",
        "default": 24,
        type: "number"
      }, {
        name: "fontFamily",
        "default": "arial",
        type: "string"
      }, {
        name: "fontStyle",
        "default": "normal",
        type: "string"
      }, {
        name: "backgroundColor",
        "default": "",
        type: "hex-colour"
      }
    ]);
  };

  Model.prototype.name = function() {
    return this.get("name") || this.get("text");
  };

  return Model;

})(HTMLTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "text-input"
};
});

;require.register("models/TrialObjects/HTMLTrialObject", function(exports, require, module) {
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

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "height",
        type: "number"
      }, {
        name: "x",
        "default": 0,
        type: "number"
      }, {
        name: "originX",
        "default": "center",
        type: "options",
        options: ["center", "left", "right"]
      }, {
        name: "originY",
        "default": "center",
        type: "options",
        options: ["center", "top", "bottom"]
      }, {
        name: "y",
        "default": 0,
        type: "number"
      }, {
        name: "width",
        type: "number"
      }
    ]);
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model
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
    }, Model.__super__.defaults.apply(this, arguments));
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model,
  Type: "keyboard"
};
});

;require.register("models/TrialObjects/Visual/CircleVisualTrialObject", function(exports, require, module) {
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

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "radius",
        "default": 24,
        type: "number"
      }
    ]);
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "circle"
};
});

;require.register("models/TrialObjects/Visual/EllipseVisualTrialObject", function(exports, require, module) {
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

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "ry",
        "default": 24,
        type: "number"
      }, {
        name: "ry",
        "default": 24,
        type: "number"
      }
    ]);
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "ellipse"
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

  Model.prototype.requiredParameters = function() {
    return [
      {
        name: "file",
        "default": "",
        type: "file",
        extensions: ["png", "jpg", "gif"]
      }
    ];
  };

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

;require.register("models/TrialObjects/Visual/PolygonVisualTrialObject", function(exports, require, module) {
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

  Model.prototype.requiredParameters = function() {
    return [
      {
        name: "points",
        "default": [],
        type: "array",
        embedded_type: fabric.Point
      }
    ];
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "polygon"
};
});

;require.register("models/TrialObjects/Visual/RectangleVisualTrialObject", function(exports, require, module) {
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

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "rx",
        "default": 1,
        type: "number"
      }, {
        name: "ry",
        "default": 1,
        type: "number"
      }
    ]);
  };

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "rectangle"
};
});

;require.register("models/TrialObjects/Visual/Text/MultiLineTextVisualTrialObject", function(exports, require, module) {
'use strict';
var Model, TextVisualTrialObject, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextVisualTrialObject = require('../TextVisualTrialObject');

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "justify",
        "default": "left",
        type: "options",
        options: ["left", "right", "center"]
      }
    ]);
  };

  Model.prototype.name = function() {
    return this.get("name") || this.get("text");
  };

  return Model;

})(TextVisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "textbox"
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

  Model.prototype.requiredParameters = function() {
    return [
      {
        name: "text",
        "default": "",
        type: "string"
      }
    ];
  };

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "fontSize",
        "default": 24,
        type: "number"
      }, {
        name: "fontFamily",
        "default": "arial",
        type: "string"
      }, {
        name: "fontStyle",
        "default": "normal",
        type: "string"
      }, {
        name: "backgroundColor",
        "default": "",
        type: "hex-colour"
      }
    ]);
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

;require.register("models/TrialObjects/Visual/TriangleVisualTrialObject", function(exports, require, module) {
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

  return Model;

})(VisualTrialObject.Model);

module.exports = {
  Model: Model,
  Type: "triangle"
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

  Model.prototype.objectOptions = function() {
    return Model.__super__.objectOptions.call(this).concat([
      {
        name: "angle",
        "default": 0,
        type: "number"
      }, {
        name: "fill",
        "default": "#000000",
        type: "hex-colour"
      }, {
        name: "height",
        type: "number"
      }, {
        name: "x",
        "default": 0,
        type: "number",
        alias: "left"
      }, {
        name: "opacity",
        "default": 1,
        type: "number"
      }, {
        name: "originX",
        "default": "center",
        type: "options",
        options: ["center", "left", "right"]
      }, {
        name: "originY",
        "default": "center",
        type: "options",
        options: ["center", "top", "bottom"]
      }, {
        name: "y",
        "default": 0,
        type: "number",
        alias: "top"
      }, {
        name: "width",
        type: "number"
      }
    ]);
  };

  return Model;

})(TrialObject.Model);

module.exports = {
  Model: Model
};
});

;require.register("templates/TrialObjects/HTML/TextInput/textareainput", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\"text-input-prompt\">";
  if (helper = helpers.prompt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.prompt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><textarea type=\"text\" class=\"text-input\" placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></textarea>";
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

;require.register("templates/TrialObjects/HTML/textinput", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\"text-input-prompt\">";
  if (helper = helpers.prompt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.prompt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><input type=\"text\" class=\"text-input\" placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></input>";
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


  buffer += "<div id=\"trial-draw\" style=\"height: ";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "px; width: ";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "px\"><canvas id=\"trial-canvas\" height=\"";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" width=\"";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></canvas><div id=\"trial-elements\" style=\"height: ";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "px; width: ";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "px\"></div></div>\n<div id=\"trial-hidden\"></div>\n";
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
    var frames, nearestFrame;
    frames = delay / this.tick;
    nearestFrame = Math.floor(frames);
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
    this.frame = 0;
    return delete this.timerStart;
  };

  Clock.prototype.timerElapsed = function() {
    return this.getElapsedTime(this.timerStart) || 0;
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
  var array_diff, i, keys, name, obj_diff, ret, value, _i, _ref;
  if (_.isEmpty(master)) {
    return update;
  }
  ret = {};
  for (name in update) {
    value = update[name];
    if (name in master) {
      if (_.isObject(update[name])) {
        if (_.isArray(update[name])) {
          ret[name] = [];
          for (i = _i = 0, _ref = update[name].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (_.isObject(update[name][i])) {
              array_diff = diff(master[name][i], update[name][i]);
              if (!_.isEmpty(array_diff)) {
                ret[name].push(array_diff);
              }
            } else {
              ret[name].push(update[name][i]);
            }
          }
          if (ret[name].length === 0) {
            delete ret[name];
          }
        } else {
          obj_diff = diff(master[name], update[name]);
          if (!_.isEmpty(obj_diff)) {
            ret[name] = obj_diff;
          }
        }
      } else if (!_.isEqual(master[name], update[name]) || name === id_attr) {
        ret[name] = update[name];
      }
    } else {
      ret[name] = update[name];
    }
  }
  keys = Object.keys(ret);
  if (keys.length === 1 && keys[0] === id_attr) {
    return {};
  } else {
    return ret;
  }
};

/*
This will not work, and is not designed to work
for arrays that do not contain objects.
Arrays of objects allow for unique identification
of elements in the array, and mean that the exact ordering
is unimportant. Hard to do this with a diff otherwise.
*/


merge = function(master, update) {
  var i, master_node, name, update_node, value, _i, _ref;
  if (_.isEmpty(master)) {
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
                return item[id_attr] === update_node[id_attr];
              });
              if (_.isObject(master_node)) {
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

;require.register("utils/fingerprint", function(exports, require, module) {
/*
 * Checks if a font is available to be used on a web page.
 *
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @license MIT
 * @copyright Sam Clarke 2013
 * @author Sam Clarke <sam@samclarke.com>
*/

var body, calculateWidth, container, containerCss, fingerprint, fontList, isFontAvailable, monoWidth, sansWidth, serifWidth;

body = document.body;

container = document.createElement('div');

containerCss = ['position:absolute', 'width:auto', 'font-size:128px', 'left:-99999px'];

container.innerHTML = '<span style="' + containerCss.join(' !important;') + '">' + Array(100).join('wi') + '</span>';

container = container.firstChild;

calculateWidth = function(fontFamily) {
  var width;
  container.style.fontFamily = fontFamily;
  body.appendChild(container);
  width = container.clientWidth;
  body.removeChild(container);
  return width;
};

monoWidth = calculateWidth('monospace');

serifWidth = calculateWidth('serif');

sansWidth = calculateWidth('sans-serif');

isFontAvailable = function(fontName) {
  return monoWidth !== calculateWidth(fontName + ',monospace') || sansWidth !== calculateWidth(fontName + ',sans-serif') || serifWidth !== calculateWidth(fontName + ',serif');
};

fontList = ["Adobe Jenson", "Adobe Text", "Albertus", "Aldus", "Alexandria", "Algerian", "American Typewriter", "Antiqua", "Arno", "Aster", "Aurora", "News 706", "Baskerville", "Bebas", "Bebas Neue", "Bell", "Bembo", "Bembo Schoolbook", "Berkeley Old Style", "Bernhard Modern", "Bodoni", "Bauer Bodoni", "Book Antiqua", "Bookman", "Bordeaux Roman", "Bulmer", "Caledonia", "Californian FB", "Calisto MT", "Cambria", "Capitals", "Cartier", "Caslon", "Wyld", "Caslon Antique", "Fifteenth Century", "Catull", "Centaur", "Century Old Style", "Century Schoolbook", "New Century Schoolbook", "Century Schoolbook Infant", "Chaparral", "Charis SIL", "Charter", "Cheltenham", "Clearface", "Cochin", "Colonna", "Computer Modern", "Concrete Roman", "Constantia", "Cooper Black", "Corona", "News 705", "DejaVu Serif", "Didot", "Droid Serif", "Ecotype", "Elephant", "Emerson", "Espy Serif", "Excelsior", "News 702", "Fairfield", "FF Scala", "Footlight", "FreeSerif", "Friz Quadrata", "Garamond", "Gentium", "Georgia", "Gloucester", "Goudy Old Style", "Goudy", "Goudy Pro Font", "Goudy Schoolbook", "Granjon", "Heather", "Hercules", "High Tower Text", "Hiroshige", "Hoefler Text", "Humana Serif", "Imprint", "Ionic No. 5", "News 701", "ITC Benguiat", "Janson", "Jenson", "Joanna", "Korinna", "Kursivschrift", "Legacy Serif", "Lexicon", "Liberation Serif", "Linux Libertine", "Literaturnaya", "Lucida Bright", "Melior", "Memphis", "Miller", "Minion", "Modern", "Mona Lisa", "Mrs Eaves", "MS Serif", "New York", "Nimbus Roman", "NPS Rawlinson Roadway", "OCR A Extended", "Palatino", "Perpetua", "Plantin", "Plantin Schoolbook", "Playbill", "Poor Richard", "Renault", "Requiem", "Roman", "Rotis Serif", "Sabon", "Seagull", "Sistina", "Souvenir", "STIX", "Stone Informal", "Stone Serif", "Sylfaen", "Times New Roman", "Times", "Trajan", "Trinité", "Trump Mediaeval", "Utopia", "Vale Type", "Vera Serif", "Versailles", "Wanted", "Weiss", "Wide Latin", "Windsor", "XITS", "Apex", "Archer", "Athens", "Cholla Slab", "City", "Clarendon", "Courier", "Egyptienne", "Guardian Egyptian", "Lexia", "Museo Slab", "Nilland", "Rockwell", "Skeleton Antique", "Tower", "Abadi", "Agency FB", "Akzidenz-Grotesk", "Andalé Sans", "Aptifer", "Arial", "Arial Unicode MS", "Avant Garde Gothic", "Avenir", "Bank Gothic", "Barmeno", "Bauhaus", "Bell Centennial", "Bell Gothic", "Benguiat Gothic", "Berlin Sans", "Beteckna", "Blue Highway", "Brandon Grotesque", "Cabin", "Cafeteria", "Calibri", "Casey", "Century Gothic", "Charcoal", "Chicago", "Clearface Gothic", "Clearview", "Co Headline", "Co Text", "Compacta", "Corbel", "DejaVu Sans", "Dotum", "Droid Sans", "Dyslexie", "Ecofont", "Eras", "Espy Sans", "Nu Sans", "Eurocrat", "Eurostile", "Square 721", "FF Dax", "FF Meta", "FF Scala Sans", "Flama", "Formata", "Franklin Gothic", "FreeSans", "Frutiger", "Frutiger Next", "Futura", "Geneva", "Gill Sans", "Gill Sans Schoolbook", "Gotham", "Haettenschweiler", "Handel Gothic", "Denmark", "Hei", "Helvetica", "Helvetica Neue", "Swiss 721", "Highway Gothic", "Hiroshige Sans", "Hobo", "Impact", "Industria", "Interstate", "Johnston/New Johnston", "Kabel", "Lato", "ITC Legacy Sans", "Lexia Readable", "Liberation Sans", "Lucida Sans", "Meiryo", "Microgramma", "Motorway", "MS Sans Serif", "Museo Sans", "Myriad", "Neutraface", "Neuzeit S", "News Gothic", "Nimbus Sans L", "Nina", "Open Sans", "Optima", "Parisine", "Pricedown", "Prima Sans", "PT Sans", "Rail Alphabet", "Revue", "Roboto", "Rotis Sans", "Segoe UI", "Skia", "Souvenir Gothic", "ITC Stone Sans", "Syntax", "Tahoma", "Template Gothic", "Thesis Sans", "Tiresias", "Trade Gothic", "Transport", "Trebuchet MS", "Trump Gothic", "Twentieth Century", "Ubuntu", "Univers", "Zurich", "Vera Sans", "Verdana", "Virtue", "Amsterdam Old Style", "Divona", "Nyala", "Portobello", "Rotis Semi Serif", "Tema Cantante", "Andale Mono", "Anonymous and Anonymous Pro", "Arial Monospaced", "BatangChe", "Bitstream Vera", "Consolas", "CourierHP", "Courier New", "CourierPS", "Fontcraft Courier", "DejaVu Sans Mono", "Droid Sans Mono", "Everson Mono", "Fedra Mono", "Fixed", "Fixedsys", "Fixedsys Excelsior", "HyperFont", "Inconsolata", "KaiTi", "Letter Gothic", "Liberation Mono", "Lucida Console", "Lucida Sans Typewriter", "Lucida Typewriter", "Menlo", "MICR", "Miriam Fixed", "Monaco", "Monofur", "Monospace", "MS Gothic", "MS Mincho", "Nimbus Mono L", "OCR-A", "OCR-B", "Orator", "Ormaxx", "PragmataPro", "Prestige Elite", "ProFont", "Proggy programming fonts", "SimHei", "SimSun", "Small Fonts", "Sydnie", "Terminal", "Tex Gyre Cursor", "Trixie", "Ubuntu Mono", "UM Typewriter", "Vera Sans Mono", "William Monospace", "Balloon", "Brush Script", "Choc", "Dom Casual", "Dragonwick", "Mistral", "Papyrus", "Segoe Script", "Tempus Sans", "Amazone", "American Scribe", "AMS Euler", "Apple Chancery", "Aquiline", "Aristocrat", "Bickley Script", "Civitype", "Codex", "Edwardian Script", "Forte", "French Script", "ITC Zapf Chancery", "Kuenstler Script", "Monotype Corsiva", "Old English Text MT", "Palace Script", "Park Avenue", "Scriptina", "Shelley Volante", "Vivaldi", "Vladimir Script", "Zapfino", "Andy", "Ashley Script", "Cézanne", "Chalkboard", "Comic Sans MS", "Fontoon", "Irregularis", "Jefferson", "Kristen", "Lucida Handwriting", "Rage Italic", "Rufscript", "Scribble", "Soupbone", "Tekton", "Alecko", "Cinderella", "Coronet", "Cupola", "Curlz", "Magnificat", "Script", "American Text", "Bastard", "Breitkopf Fraktur", "Cloister Black", "Fette Fraktur", "Fletcher", "Fraktur", "Goudy Text", "Lucida Blackletter", "Old English Text", "Schwabacher", "Wedding Text", "Aegyptus", "Aharoni", "Aisha", "Amienne", "Batak Script", "Chandas", "Grecs du roi", "Hanacaraka", "Japanese Gothic", "Jomolhari", "Kochi", "Koren", "Lontara Script", "Maiola", "Malgun Gothic", "Microsoft JhengHei", "Microsoft YaHei", "Minchō", "Ming", "Mona", "Nassim", "Nastaliq Navees", "Neacademia", "Perpetua Greek", "Porson", "Skolar", "Skolar Devanagari", "Sundanese Unicode", "Sutturah", "Tai Le Valentinium", "Tengwar", "Tibetan Machine Uni", "Tunga", "Wadalab", "Wilson Greek", "Alphabetum", "Batang", "Gungsuh", "Bitstream Cyberbit", "ClearlyU", "Code2000", "Code2001", "Code2002", "DejaVu fonts", "Doulos SIL", "Fallback font", "Free UCS Outline Fonts", "FreeFont", "GNU Unifont", "Georgia Ref", "Gulim", "New Gulim", "Junicode", "LastResort", "Lucida Grande", "Lucida Sans Unicode", "Nimbus Sans Global", "Squarish Sans CT v0.10", "Symbola", "Titus Cyberbit Basic", "Verdana Ref", "Y.OzFontN", "Apple Symbols", "Asana-Math", "Blackboard bold", "Bookshelf Symbol 7", "Braille", "Cambria Math", "Commercial Pi", "Corel", "Erler Dingbats", "HM Phonetic", "Lucida Math", "Marlett", "Mathematical Pi", "Morse Code", "OpenSymbol", "RichStyle", "Symbol", "SymbolPS", "Webdings", "Wingdings", "Wingdings 2", "Wingdings 3", "Zapf Dingbats", "Abracadabra", "Ad Lib", "Allegro", "Andreas", "Arnold Böcklin", "Astur", "Balloon Pop Outlaw Black", "Banco", "Beat", "Braggadocio", "Broadway", "Ellington", "Exablock", "Exocet", "FIG Script", "Gabriola", "Gigi", "Harlow Solid", "Harrington", "Horizon", "Jim Crow", "Jokerman", "Juice", "Lo-Type", "Magneto", "Megadeth", "Neuland", "Peignot", "Ravie", "San Francisco", "Showcard Gothic", "Snap", "Stencil", "Umbra", "Westminster", "Willow", "Bagel", "Lithos", "Talmud", "3x3", "Compatil", "Generis", "Grasset", "LED", "Luxi", "System"];

module.exports = fingerprint = function() {
  var font, key, value;
  return window.navigator.userAgent + window.navigator.cookieEnabled + ((function() {
    var _ref, _results;
    _ref = window.navigator.plugins;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      _results.push(value.name);
    }
    return _results;
  })()).join(",") + window.screen.height + window.screen.width + window.screen.colorDepth + ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = fontList.length; _i < _len; _i++) {
      font = fontList[_i];
      if (isFontAvailable(font)) {
        _results.push(font);
      }
    }
    return _results;
  })()).join(",");
};
});

;require.register("utils/hashObject", function(exports, require, module) {
/*
Derived from:
 Javascript HashCode v1.0.0
 This function returns a hash code (MD5) based on the argument object.
 http://pmav.eu/stuff/javascript-hash-code

 Example:
  var s = "my String";
  alert(HashCode.value(s));

 pmav, 2010
*/

var serialize;

serialize = function(object) {
  var element, serializedCode, type;
  serializedCode = "";
  type = typeof object;
  if (type === 'object') {
    for (element in object) {
      serializedCode += "[" + type + ":" + element + serialize(object[element]) + "]";
    }
  } else if (type === 'function') {
    serializedCode += "[" + type + ":" + object.toString() + "]";
  } else {
    serializedCode += "[" + type + ":" + object + "]";
  }
  return serializedCode.replace(/\s/g, "");
};

module.exports = function(object) {
  return md5(serialize(object));
};
});

;require.register("utils/keys", function(exports, require, module) {
var delete_text, dummy, keys, keysToText;

keys = {
  "backspace": 8,
  "tab": 9,
  "enter": 13,
  "shift": 16,
  "ctrl": 17,
  "alt": 18,
  "escape": 27,
  "space": 32,
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

delete_text = function(text) {
  return text.slice(0, -1);
};

dummy = function(text) {
  return text;
};

keysToText = {
  "backspace": delete_text,
  "tab": "\t",
  "enter": "\n",
  "delete": delete_text,
  "space": " ",
  "shift": dummy,
  "ctrl": dummy,
  "alt": dummy,
  "escape": dummy,
  "page_up": dummy,
  "page_down": dummy,
  "end": dummy,
  "home": dummy,
  "insert": dummy,
  "numpad0": dummy,
  "numpad1": dummy,
  "numpad2": dummy,
  "numpad3": dummy,
  "numpad4": dummy,
  "numpad5": dummy,
  "numpad6": dummy,
  "numpad7": dummy,
  "numpad8": dummy,
  "numpad9": dummy,
  "numpad*": dummy,
  "numpad+": dummy,
  "numpad-": dummy,
  "numpad.": dummy,
  "numpad/": dummy,
  "f1": dummy,
  "f2": dummy,
  "f3": dummy,
  "f4": dummy,
  "f5": dummy,
  "f6": dummy,
  "f7": dummy,
  "f8": dummy,
  "f9": dummy,
  "f10": dummy,
  "f11": dummy,
  "f12": dummy,
  "num_lock": dummy,
  "scroll_lock": dummy
};

module.exports = {
  Keys: keys,
  KeysToText: keysToText
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
var GUIDseed, guid, seedGUID, seeded_shuffle, seededguid;

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

guid = function(seed) {
  var random, _p8;
  if (seed == null) {
    seed = null;
  }
  random = seed || Math.random;
  _p8 = function(s) {
    var p;
    p = (random().toString(16) + "000000000").substr(2, 8);
    if (s) {
      return "-" + p.substr(0, 4) + "-" + p.substr(4, 4);
    } else {
      return p;
    }
  };
  return _p8() + _p8(true) + _p8(true) + _p8();
};

seededguid = function() {
  return guid(PsychoCoffee.random.GUIDseed);
};

GUIDseed = null;

seedGUID = function(seed) {
  return PsychoCoffee.random.GUIDseed = new Math.seedrandom(seed);
};

module.exports = {
  seeded_shuffle: seeded_shuffle,
  guid: guid,
  seededguid: seededguid,
  seedGUID: seedGUID,
  GUIDseed: GUIDseed
};
});

;require.register("utils/stringHash", function(exports, require, module) {
var stringHash;

module.exports = stringHash = function(string) {
  var chr, hash, i, _i, _ref;
  hash = 5381;
  if (string.length === 0) {
    return hash;
  }
  for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) + hash) + chr;
    hash |= 0;
  }
  return hash.toString(16);
};
});

;require.register("utils/urlParse", function(exports, require, module) {
var decodeGetParams;

decodeGetParams = function(url) {
  var data, item, params, _i, _len, _ref;
  url = decodeURIComponent(url).split("?")[1];
  params = {};
  if (url) {
    _ref = url.split("&");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      data = item.split("=");
      if (data[1]) {
        params[data[0]] = data[1];
      }
    }
  }
  return params;
};

module.exports = {
  decodeGetParams: decodeGetParams
};
});

;require.register("utils/wrapCanvasText", function(exports, require, module) {
module.exports = function(t, canvas, maxW, maxH, justify) {
  var breakLineCount, context, currentLine, formatted, i, isNewLine, lineHeight, maxHAdjusted, n, ret, sansBreaks, testOverlap, w, withHypeh, wordOverlap, words, _i, _ref;
  maxH = maxH != null ? maxH : 0;
  words = t.text.split(" ");
  formatted = '';
  justify = justify || 'left';
  sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
  lineHeight = new fabric.Text(sansBreaks, {
    fontFamily: t.fontFamily,
    fontSize: t.fontSize
  }).height;
  maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
  context = canvas.getContext("2d");
  context.font = t.fontSize + "px " + t.fontFamily;
  currentLine = '';
  breakLineCount = 0;
  n = 0;
  while (n < words.length) {
    isNewLine = currentLine === "";
    testOverlap = currentLine + ' ' + words[n];
    w = context.measureText(testOverlap).width;
    if (w < maxW) {
      if (currentLine !== '') {
        currentLine += ' ';
      }
      currentLine += words[n];
    } else {
      if (isNewLine) {
        wordOverlap = "";
        for (i = _i = 0, _ref = words[n].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          wordOverlap += words[n].charAt(i);
          withHypeh = wordOverlap + "-";
          if (context.measureText(withHypeh).width >= maxW) {
            withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
            words[n] = words[n].substr(wordOverlap.length, -1, words[n].length);
            formatted += withHypeh;
            break;
          }
        }
      }
      while (justify === 'right' && context.measureText(' ' + currentLine).width < maxW) {
        currentLine = ' ' + currentLine;
      }
      while (justify === 'center' && context.measureText(' ' + currentLine + ' ').width < maxW) {
        currentLine = ' ' + currentLine + ' ';
      }
      formatted += currentLine + '\n';
      breakLineCount++;
      currentLine = "";
      continue;
    }
    if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
      formatted = formatted.substr(0, formatted.length - 3) + "...\n";
      currentLine = "";
      break;
    }
    n++;
  }
  if (currentLine !== '') {
    while (justify === 'right' && context.measureText(' ' + currentLine).width < maxW) {
      currentLine = ' ' + currentLine;
    }
    while (justify === 'center' && context.measureText(' ' + currentLine + ' ').width < maxW) {
      currentLine = ' ' + currentLine + ' ';
    }
    formatted += currentLine + '\n';
    breakLineCount++;
    currentLine = "";
  }
  formatted = formatted.substr(0, formatted.length - 1);
  ret = t.setText(formatted);
  return ret;
};
});

;require.register("views/BlockView", function(exports, require, module) {
'use strict';
var BlockView, HandlerView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HandlerView = require('./HandlerView');

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
    return this.instantiateSubViews("trials", "TrialView", null);
  };

  BlockView.prototype.generateTrialModels = function() {
    var model, parameters, trial, _i, _len, _ref1, _ref2, _results;
    _ref1 = this.model.returnParameters(this.user_id, this.injectedParameters), this.parameters = _ref1[0], this.trialListLength = _ref1[1], this.parameterSet = _ref1[2];
    _ref2 = this.parameterSet;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      parameters = _ref2[_i];
      trial = this.model.get("trials").create(this.model.returnTrialProperties(parameters));
      trial.set("parameters", parameters);
      _results.push(trial.get("trialObjects").add((function() {
        var _j, _len1, _ref3, _results1;
        _ref3 = this.model.get("trialObjects").models;
        _results1 = [];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          model = _ref3[_j];
          _results1.push(model.parameterizedTrial(parameters));
        }
        return _results1;
      }).call(this)));
    }
    return _results;
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
    var currentTrial, date_time;
    date_time = new Date().getTime();
    if (this.datamodel.get("start_time") != null) {
      this.logEvent("block_resume", {
        date_time: date_time
      });
    } else {
      this.datamodel.set("start_time", date_time);
      this.logEvent("block_start", {
        date_time: date_time
      });
    }
    this.datamodel.set("block_id", this.model.id);
    this.datamodel.set("parameters", this.parameters);
    this.datamodel.set("trial", this.datamodel.get("trial") || 0);
    currentTrial = this.model.get("trials").at(this.datamodel.get("trial"));
    return this.showTrial(currentTrial);
  };

  BlockView.prototype.showTrial = function(trial) {
    var trialView;
    if (!trial) {
      this.endBlock();
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

  BlockView.prototype.endBlock = function() {
    var date_time, key, view, _ref1;
    date_time = new Date().getTime();
    this.logEvent("block_end", {
      date_time: date_time
    });
    this.datamodel.set("end_time", date_time);
    this.datamodel.set("complete", true);
    _ref1 = this.subViews;
    for (key in _ref1) {
      view = _ref1[key];
      view.remove();
    }
    this.stopListening();
    this.remove();
    return this.trigger("blockEnded");
  };

  return BlockView;

})(HandlerView);
});

;require.register("views/ExperimentView", function(exports, require, module) {
'use strict';
var Experiment, ExperimentDataHandler, ExperimentView, HandlerView, ProgressBarView, Template, clock, fingerprint, stringHash, urlParse, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

clock = require("utils/clock");

HandlerView = require('./HandlerView');

Experiment = require('../models/Experiment');

ExperimentDataHandler = require('../models/ExperimentDataHandler');

Template = require('templates/experiment');

ProgressBarView = require('./ProgressBarView');

stringHash = require('utils/stringHash');

fingerprint = require('utils/fingerprint');

urlParse = require('utils/urlParse');

module.exports = ExperimentView = (function(_super) {
  __extends(ExperimentView, _super);

  function ExperimentView() {
    this.endExperiment = __bind(this.endExperiment, this);
    this.showBlock = __bind(this.showBlock, this);
    this.startExperiment = __bind(this.startExperiment, this);
    this.refreshTime = __bind(this.refreshTime, this);
    this.initialize = __bind(this.initialize, this);
    _ref = ExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ExperimentView.prototype.template = Template;

  ExperimentView.prototype.initialize = function() {
    var _ref1, _ref2,
      _this = this;
    ExperimentView.__super__.initialize.apply(this, arguments);
    this.urlParams = urlParse.decodeGetParams(window.location.href);
    switch ((_ref1 = this.model) != null ? _ref1.get("subjectPool") : void 0) {
      case "AMT":
        this.user_id = this.urlParams.workerId;
        this.assignment_id = this.urlParams.assignmentId;
        this.turkSubmitTo = this.urlParams.turkSubmitTo;
        this.hitId = this.urlParams.hitId;
        break;
      default:
        this.user_id = stringHash(fingerprint());
    }
    this.clock = new clock.Clock();
    this.refreshTime();
    this.render();
    this.appendTo("#app");
    this.datacollection = new ExperimentDataHandler.Collection({
      experiment_identifier: (_ref2 = this.model) != null ? _ref2.get("identifier") : void 0,
      participant_id: this.user_id
    });
    return this.datacollection.filterFetch().then(function() {
      _this.datamodel = _this.datacollection.getOrCreateParticipantModel(_this.user_id, _this.model);
      _this.datamodel.set("parameters", _this.datamodel.get("parameters") || _this.model.returnParameters(_this.user_id));
      if (_this.model.get("subjectPool") === "AMT") {
        _this.datamodel.set({
          assignment_id: _this.assignment_id,
          turkSubmitTo: _this.turkSubmitTo,
          hitId: _this.hitId
        });
      }
      _this.instantiateSubViews("blocks", "BlockView", null, {
        parameters: _this.datamodel.get("parameters")
      });
      return _this.preLoadExperiment();
    });
  };

  ExperimentView.prototype.refreshTime = function() {
    return this.time = this.clock.getTime();
  };

  ExperimentView.prototype.preLoadExperiment = function() {
    var key, queue, view, _ref1;
    queue = new createjs.LoadQueue(true);
    _ref1 = this.subViews;
    for (key in _ref1) {
      view = _ref1[key];
      view.preLoadBlock(queue);
    }
    this.progressBarView = new ProgressBarView({
      queue: queue,
      complete: this.startExperiment
    });
    this.progressBarView.appendTo("#messages");
    return this.progressBarView.render();
  };

  ExperimentView.prototype.startExperiment = function() {
    var currentBlock, date_time;
    date_time = new Date().getTime();
    if (this.datamodel.get("start_time") != null) {
      this.logEvent("experiment_resume", {
        date_time: date_time
      });
    } else {
      this.datamodel.set("start_time", date_time);
      this.logEvent("experiment_start", {
        date_time: date_time
      });
    }
    this.datamodel.set("block", this.datamodel.get("block") || 0);
    currentBlock = this.model.get("blocks").at(this.datamodel.get("block"));
    return this.showBlock(currentBlock);
  };

  ExperimentView.prototype.showBlock = function(block) {
    var blockView;
    if (!block) {
      this.endExperiment();
      return;
    }
    blockView = this.subViews[block.get("id")];
    if (this.blockView) {
      if (this.blockView.close) {
        this.blockView.close();
      } else {
        this.blockView.remove();
      }
    }
    this.blockdatamodel = this.datamodel.get("blockdatahandlers").at(this.datamodel.get("block")) || this.datamodel.get("blockdatahandlers").create();
    this.datamodel.save();
    this.blockView = blockView;
    this.blockView.datamodel = this.blockdatamodel;
    this.blockView.render();
    this.listenToOnce(this.blockView, "blockEnded", this.nextBlock);
    return this.blockView.startBlock();
  };

  ExperimentView.prototype.nextBlock = function() {
    var currentBlock;
    this.datamodel.set("block", this.datamodel.get("block") + 1);
    currentBlock = this.model.get("blocks").at(this.datamodel.get("block"));
    return this.showBlock(currentBlock);
  };

  ExperimentView.prototype.endExperiment = function() {
    var date_time,
      _this = this;
    date_time = new Date().getTime();
    this.logEvent("experiment_end", {
      date_time: date_time
    });
    this.datamodel.set("end_time", date_time);
    this.datamodel.set("complete", true);
    return this.datamodel.save(null, {
      now: true,
      success: function() {
        console.log("I'm done here!");
        return _this.$("#messages").html("<h1>Experiment Complete - Thank you</h1>");
      }
    });
  };

  return ExperimentView;

})(HandlerView);
});

;require.register("views/HandlerView", function(exports, require, module) {
'use strict';
var HandlerView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./View');

module.exports = HandlerView = (function(_super) {
  __extends(HandlerView, _super);

  function HandlerView() {
    this.logEvent = __bind(this.logEvent, this);
    _ref = HandlerView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HandlerView.prototype.logEvent = function(event_type, options) {
    if (options == null) {
      options = {};
    }
    return this.datamodel.logEvent(event_type, this.clock, _.extend(options, {
      object: this.model.name()
    }));
  };

  return HandlerView;

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

  ProgressBarView.prototype.render = function() {
    ProgressBarView.__super__.render.apply(this, arguments);
    if (this.queue._numItems === 0) {
      this.setProgressBar(1);
      return this.finish();
    }
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
      this.active = true;
      this.listenTo(this.model, "change", this.render);
      if (this.model.get("duration")) {
        return this.clock.delayedTrigger(this.model.get("duration"), this, this.deactivate);
      }
    }
  };

  TrialObjectView.prototype.deactivate = function() {
    if (this.active) {
      this.trigger("deactivated");
      this.logEvent("deactivated");
      this.active = false;
      return this.stopListening(this.model, "change", this.render);
    }
  };

  TrialObjectView.prototype.registerEvents = function(siblingViews) {
    var trigger, view, _i, _len, _ref1, _results,
      _this = this;
    if (this.model.get("startWithTrial")) {
      this.clock.delayedTrigger(this.model.get("delay"), this, this.activate);
    }
    _ref1 = this.model.get("triggers") || [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      trigger = _ref1[_i];
      view = _.find(siblingViews, function(sibling) {
        return sibling.name === trigger.objectName;
      });
      if (view != null) {
        _results.push(this.listenTo(view, trigger.eventName, function(options) {
          console.log("Triggering", trigger.eventName);
          return _this[trigger.callback](_.extend(options, trigger["arguments"] || {}));
        }));
      } else {
        _results.push(console.debug("There is no object with the name\n" + trigger.objectName + " in this trial."));
      }
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
    if (!this.object) {
      return this.object = createjs.Sound.createInstance(this.object_id);
    }
  };

  return AudioTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialObjectViews/GroupTrialObjectView", function(exports, require, module) {
'use strict';
var GroupTrialObjectView, TrialObjectView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObjectView = require('../TrialObjectView');

module.exports = GroupTrialObjectView = (function(_super) {
  __extends(GroupTrialObjectView, _super);

  function GroupTrialObjectView() {
    this.preLoadTrialObject = __bind(this.preLoadTrialObject, this);
    this.initialize = __bind(this.initialize, this);
    _ref = GroupTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  GroupTrialObjectView.prototype.initialize = function(options) {
    GroupTrialObjectView.__super__.initialize.apply(this, arguments);
    this.instantiateSubViews("trialObjects", "TrialObjectView", this.trialObjectViewType);
    return this.registerSubViewSubViews();
  };

  GroupTrialObjectView.prototype.preLoadTrialObject = function(queue) {
    var view, _i, _len, _ref1, _results;
    _ref1 = this.subViewList;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      _results.push(view.preLoadTrialObject(queue));
    }
    return _results;
  };

  GroupTrialObjectView.prototype.attach = function(endpoints) {
    var view, _i, _len, _ref1, _results;
    _ref1 = this.subViewList;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      _results.push(view.attach(endpoints));
    }
    return _results;
  };

  GroupTrialObjectView.prototype.activate = function() {
    var view, _i, _len, _ref1;
    _ref1 = this.subViewList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      view.activate();
    }
    return GroupTrialObjectView.__super__.activate.call(this);
  };

  GroupTrialObjectView.prototype.deactivate = function() {
    var view, _i, _len, _ref1;
    _ref1 = this.subViewList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      view.deactivate();
    }
    return GroupTrialObjectView.__super__.deactivate.call(this);
  };

  GroupTrialObjectView.prototype.render = function() {};

  GroupTrialObjectView.prototype.trialObjectViewType = function(model) {
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

  return GroupTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialObjectViews/HTML/TextInput/TextAreaInputHTMLTrialObjectView", function(exports, require, module) {
'use strict';
var Template, TextAreaInputHTMLTrialObjectView, TextInputHTMLTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextInputHTMLTrialObjectView = require('../TextInputHTMLTrialObjectView');

Template = require("/templates/TrialObjects/HTML/TextInput/textareainput");

module.exports = TextAreaInputHTMLTrialObjectView = (function(_super) {
  __extends(TextAreaInputHTMLTrialObjectView, _super);

  function TextAreaInputHTMLTrialObjectView() {
    _ref = TextAreaInputHTMLTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TextAreaInputHTMLTrialObjectView.prototype.template = Template;

  return TextAreaInputHTMLTrialObjectView;

})(TextInputHTMLTrialObjectView);
});

;require.register("views/TrialObjectViews/HTML/TextInputHTMLTrialObjectView", function(exports, require, module) {
'use strict';
var HTMLTrialObjectView, Template, TextInputHTMLTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HTMLTrialObjectView = require('../HTMLTrialObjectView');

Template = require("/templates/TrialObjects/HTML/textinput");

module.exports = TextInputHTMLTrialObjectView = (function(_super) {
  __extends(TextInputHTMLTrialObjectView, _super);

  function TextInputHTMLTrialObjectView() {
    _ref = TextInputHTMLTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TextInputHTMLTrialObjectView.prototype.template = Template;

  TextInputHTMLTrialObjectView.prototype.deactivate = function() {
    TextInputHTMLTrialObjectView.__super__.deactivate.apply(this, arguments);
    return this.logInput();
  };

  TextInputHTMLTrialObjectView.prototype.logInput = function() {
    return this.logEvent("text_input", {
      "text_value": this.$(".text-input").val()
    });
  };

  return TextInputHTMLTrialObjectView;

})(HTMLTrialObjectView);
});

;require.register("views/TrialObjectViews/HTMLTrialObjectView", function(exports, require, module) {
'use strict';
var HTMLTrialObjectView, TrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TrialObjectView = require('../TrialObjectView');

module.exports = HTMLTrialObjectView = (function(_super) {
  __extends(HTMLTrialObjectView, _super);

  function HTMLTrialObjectView() {
    _ref = HTMLTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HTMLTrialObjectView.prototype.className = "trial-object";

  HTMLTrialObjectView.prototype.attach = function(endpoints) {
    this.$el.css("visibility", "hidden");
    this.appendTo(endpoints.elements);
    return this.positionElement();
  };

  HTMLTrialObjectView.prototype.activate = function() {
    this.$el.css("visibility", "visible");
    return HTMLTrialObjectView.__super__.activate.call(this);
  };

  HTMLTrialObjectView.prototype.deactivate = function() {
    this.$el.css("visibility", "hidden");
    return HTMLTrialObjectView.__super__.deactivate.call(this);
  };

  HTMLTrialObjectView.prototype.positionElement = function() {
    switch (this.model.get("originX")) {
      case "left":
        this.$el.css("left", this.model.get("x"));
        break;
      case "right":
        this.$el.css("right", this.model.get("x"));
        break;
      case "center":
        this.$el.css("left", this.model.get("x") - this.$el.width() / 2);
    }
    switch (this.model.get("originY")) {
      case "top":
        return this.$el.css("top", this.model.get("y"));
      case "bottom":
        return this.$el.css("bottom", this.model.get("y"));
      case "center":
        return this.$el.css("top", this.model.get("y") - this.$el.height() / 2);
    }
  };

  HTMLTrialObjectView.prototype.render = function() {
    this.$el.html(this.template(this.model.allParameters()));
    return this.positionElement();
  };

  return HTMLTrialObjectView;

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
    var key;
    if (_.has(this.keyCodeCache, event.keyCode)) {
      key = this.keyCodeCache[event.keyCode];
      this.trigger("keypress", {
        key: key,
        shiftKey: event.shiftKey
      });
      return this.logEvent("keypress", {
        key: key
      });
    }
  };

  KeyboardTrialObjectView.prototype.render = function() {};

  return KeyboardTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/CircleVisualTrialObjectView", function(exports, require, module) {
'use strict';
var CircleVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = CircleVisualTrialObjectView = (function(_super) {
  __extends(CircleVisualTrialObjectView, _super);

  function CircleVisualTrialObjectView() {
    _ref = CircleVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CircleVisualTrialObjectView.prototype.object_type = fabric.Circle;

  return CircleVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/EllipseVisualTrialObjectView", function(exports, require, module) {
'use strict';
var EllipseVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = EllipseVisualTrialObjectView = (function(_super) {
  __extends(EllipseVisualTrialObjectView, _super);

  function EllipseVisualTrialObjectView() {
    _ref = EllipseVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EllipseVisualTrialObjectView.prototype.object_type = fabric.Ellipse;

  return EllipseVisualTrialObjectView;

})(VisualTrialObjectView);
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
    if (!this.object) {
      this.object = new fabric.Image(this.file_object, this.model.returnOptions());
    }
    return ImageVisualTrialObjectView.__super__.render.apply(this, arguments);
  };

  return ImageVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/PolygonVisualTrialObjectView", function(exports, require, module) {
'use strict';
var PolygonVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = PolygonVisualTrialObjectView = (function(_super) {
  __extends(PolygonVisualTrialObjectView, _super);

  function PolygonVisualTrialObjectView() {
    _ref = PolygonVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PolygonVisualTrialObjectView.prototype.object_type = fabric.Polygon;

  PolygonVisualTrialObjectView.prototype.render = function() {
    if (!this.object) {
      this.object = new this.object_type(this.model.returnRequired()[0], this.model.returnOptions());
    }
    return PolygonVisualTrialObjectView.__super__.render.apply(this, arguments);
  };

  return PolygonVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/RectangleVisualTrialObjectView", function(exports, require, module) {
'use strict';
var RectangleVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = RectangleVisualTrialObjectView = (function(_super) {
  __extends(RectangleVisualTrialObjectView, _super);

  function RectangleVisualTrialObjectView() {
    _ref = RectangleVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  RectangleVisualTrialObjectView.prototype.object_type = fabric.Rect;

  return RectangleVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/Text/MultiLineTextVisualTrialObjectView", function(exports, require, module) {
'use strict';
var MultiLineTextVisualTrialObjectView, TextVisualTrialObjectView, wrapCanvasText, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextVisualTrialObjectView = require('../TextVisualTrialObjectView');

wrapCanvasText = require('utils/wrapCanvasText');

module.exports = MultiLineTextVisualTrialObjectView = (function(_super) {
  __extends(MultiLineTextVisualTrialObjectView, _super);

  function MultiLineTextVisualTrialObjectView() {
    _ref = MultiLineTextVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MultiLineTextVisualTrialObjectView.prototype.render = function() {
    MultiLineTextVisualTrialObjectView.__super__.render.apply(this, arguments);
    if (this.canvas) {
      return this.object = wrapCanvasText(this.object, this.canvas, this.model.get("width"), this.model.get("height"), this.model.get("justify"));
    }
  };

  return MultiLineTextVisualTrialObjectView;

})(TextVisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/TextVisualTrialObjectView", function(exports, require, module) {
'use strict';
var Keys, TextVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

Keys = require("utils/keys");

module.exports = TextVisualTrialObjectView = (function(_super) {
  __extends(TextVisualTrialObjectView, _super);

  function TextVisualTrialObjectView() {
    _ref = TextVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TextVisualTrialObjectView.prototype.object_type = fabric.Text;

  TextVisualTrialObjectView.prototype.render = function() {
    if (!this.object) {
      this.object = new this.object_type(this.model.returnRequired()[0], this.model.returnOptions());
    }
    return TextVisualTrialObjectView.__super__.render.apply(this, arguments);
  };

  TextVisualTrialObjectView.prototype.addText = function(options) {
    var text;
    if ("text" in options) {
      text = options.text;
    } else if ("key" in options) {
      text = Keys.KeysToText[options.key] || options.key;
      if (typeof text === "string" && options.shiftKey) {
        text = text.toUpperCase();
      }
    }
    if (text instanceof Function) {
      return this.model.set("text", text(this.model.get("text")));
    } else {
      return this.model.set("text", this.model.get("text") + text);
    }
  };

  return TextVisualTrialObjectView;

})(VisualTrialObjectView);
});

;require.register("views/TrialObjectViews/Visual/TriangleVisualTrialObjectView", function(exports, require, module) {
'use strict';
var TriangleVisualTrialObjectView, VisualTrialObjectView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

VisualTrialObjectView = require('../VisualTrialObjectView');

module.exports = TriangleVisualTrialObjectView = (function(_super) {
  __extends(TriangleVisualTrialObjectView, _super);

  function TriangleVisualTrialObjectView() {
    _ref = TriangleVisualTrialObjectView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TriangleVisualTrialObjectView.prototype.object_type = fabric.Triangle;

  return TriangleVisualTrialObjectView;

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
    this.canvas.add(this.object);
    return this.render();
  };

  VisualTrialObjectView.prototype.activate = function() {
    var _this = this;
    this.object.hasControls = false;
    this.object.hasBorders = false;
    this.object.lockMovementX = this.object.lockMovementY = true;
    this.object.setVisible(true);
    this.addToClockChangeEvents("activated");
    this.object.on("mousedown", function(event) {
      _this.trigger("click");
      return _this.logEvent("click");
    });
    return VisualTrialObjectView.__super__.activate.call(this);
  };

  VisualTrialObjectView.prototype.deactivate = function() {
    this.object.setVisible(false);
    this.addToClockChangeEvents("deactivated");
    this.object.off("mousedown");
    return VisualTrialObjectView.__super__.deactivate.call(this);
  };

  VisualTrialObjectView.prototype.render = function() {
    if (!this.object) {
      this.object = new this.object_type();
    }
    this.object.set(this.model.allParameters());
    return this.addToClockChangeEvents("change");
  };

  return VisualTrialObjectView;

})(TrialObjectView);
});

;require.register("views/TrialView", function(exports, require, module) {
'use strict';
var HandlerView, Template, TrialView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HandlerView = require('./HandlerView');

Template = require('templates/trial');

module.exports = TrialView = (function(_super) {
  __extends(TrialView, _super);

  function TrialView() {
    this.registerEvents = __bind(this.registerEvents, this);
    this.registerTimeout = __bind(this.registerTimeout, this);
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
    return this.registerSubViewSubViews();
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
    var date_time, endpoints, view, _i, _len, _ref1;
    date_time = new Date().getTime();
    if (this.datamodel.get("start_time") != null) {
      this.logEvent("trial_resume", {
        date_time: date_time
      });
    } else {
      this.datamodel.set("start_time", date_time);
      this.logEvent("trial_start", {
        date_time: date_time
      });
    }
    this.datamodel.set("trial_id", this.model.id);
    this.datamodel.set("parameters", this.model.get("parameters"));
    this.createCanvas();
    endpoints = {
      canvas: this.canvas,
      hidden: this.$("#trial-hidden"),
      elements: this.$("#trial-elements")
    };
    _ref1 = this.subViewList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      view.attach(endpoints);
      view.datamodel = this.datamodel;
      view.registerEvents(this.subViewList);
    }
    this.registerEvents();
    this.registerTimeout();
    return this.clock.startTimer();
  };

  TrialView.prototype.createCanvas = function() {
    var eventType, _i, _len, _ref1, _results,
      _this = this;
    this.canvas = new fabric.Canvas("trial-canvas");
    this.canvas.selection = false;
    this.canvas.hoverCursor = 'default';
    this.clock.canvas = this.canvas;
    if (!Modernizr.pointerevents) {
      _ref1 = ["mousedown", "mouseup"];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventType = _ref1[_i];
        _results.push(this.$("#trial-elements")[eventType](function(event) {
          var target;
          target = _this.canvas.findTarget(event);
          return target.trigger(eventType);
        }));
      }
      return _results;
    }
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

  TrialView.prototype.registerTimeout = function() {
    if (this.model.get("timeout")) {
      return this.clock.delayedTrigger(this.model.get("timeout"), this, this.endTrial);
    }
  };

  TrialView.prototype.endTrial = function() {
    var date_time, key, view, _ref1;
    date_time = new Date().getTime();
    this.logEvent("trial_end", {
      date_time: date_time
    });
    this.datamodel.set("end_time", date_time);
    _ref1 = this.subViews;
    for (key in _ref1) {
      view = _ref1[key];
      view.remove();
    }
    this.clock.stopTimer();
    delete this.clock.canvas;
    delete this.canvas;
    this.remove();
    return this.trigger("trialEnded");
  };

  TrialView.prototype.registerEvents = function() {
    var trigger, view, _i, _len, _ref1, _results,
      _this = this;
    _ref1 = this.model.get("triggers") || [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      trigger = _ref1[_i];
      view = _.find(this.subViews, function(subView) {
        return subView.name === trigger.objectName;
      });
      if (view != null) {
        _results.push(this.listenTo(view, trigger.eventName, function() {
          return _this[trigger.callback](trigger["arguments"] || {});
        }));
      } else {
        _results.push(console.debug("There is no object with the name\n" + trigger.objectName + " in this trial."));
      }
    }
    return _results;
  };

  return TrialView;

})(HandlerView);
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
    this.clock = options != null ? options.clock : void 0;
    this.user_id = options != null ? options.user_id : void 0;
    return this.injectedParameters = options != null ? options.parameters : void 0;
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

  View.prototype.instantiateSubViews = function(key, viewType, viewFunction, options) {
    var model, _i, _len, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    this.subViews = {};
    _ref2 = ((_ref1 = this.model) != null ? _ref1.get(key).models : void 0) || [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      model = _ref2[_i];
      if (viewFunction != null) {
        viewType = viewFunction(model);
      }
      options = _.extend(options, {
        model: model,
        clock: this.clock,
        user_id: this.user_id
      });
      this.subViews[model.id] = new PsychoCoffee[viewType](options);
    }
    return this.subViewList = _.values(this.subViews);
  };

  View.prototype.registerSubViewSubViews = function() {
    var key, subView, value, _i, _len, _ref1, _ref2;
    _ref1 = this.subViewList;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      subView = _ref1[_i];
      _ref2 = subView.subViews;
      for (key in _ref2) {
        value = _ref2[key];
        this.subViews[key] = value;
      }
    }
    return this.subViewList = _.values(this.subViews);
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