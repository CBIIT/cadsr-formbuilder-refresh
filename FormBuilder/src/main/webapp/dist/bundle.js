/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {//     Backbone.js 1.2.3
	
	//     (c) 2010-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Backbone may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     http://backbonejs.org
	
	(function(factory) {
	
	  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
	  // We use `self` instead of `window` for `WebWorker` support.
	  var root = (typeof self == 'object' && self.self == self && self) ||
	            (typeof global == 'object' && global.global == global && global);
	
	  // Set up Backbone appropriately for the environment. Start with AMD.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function(_, $, exports) {
	      // Export global even in AMD case in case this script is loaded with
	      // others that may still expect a global Backbone.
	      root.Backbone = factory(root, exports, _, $);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
	  } else if (typeof exports !== 'undefined') {
	    var _ = require('underscore'), $;
	    try { $ = require('jquery'); } catch(e) {}
	    factory(root, exports, _, $);
	
	  // Finally, as a browser global.
	  } else {
	    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
	  }
	
	}(function(root, Backbone, _, $) {
	
	  // Initial Setup
	  // -------------
	
	  // Save the previous value of the `Backbone` variable, so that it can be
	  // restored later on, if `noConflict` is used.
	  var previousBackbone = root.Backbone;
	
	  // Create a local reference to a common array method we'll want to use later.
	  var slice = Array.prototype.slice;
	
	  // Current version of the library. Keep in sync with `package.json`.
	  Backbone.VERSION = '1.2.3';
	
	  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
	  // the `$` variable.
	  Backbone.$ = $;
	
	  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
	  // to its previous owner. Returns a reference to this Backbone object.
	  Backbone.noConflict = function() {
	    root.Backbone = previousBackbone;
	    return this;
	  };
	
	  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
	  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
	  // set a `X-Http-Method-Override` header.
	  Backbone.emulateHTTP = false;
	
	  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
	  // `application/json` requests ... this will encode the body as
	  // `application/x-www-form-urlencoded` instead and will send the model in a
	  // form param named `model`.
	  Backbone.emulateJSON = false;
	
	  // Proxy Backbone class methods to Underscore functions, wrapping the model's
	  // `attributes` object or collection's `models` array behind the scenes.
	  //
	  // collection.filter(function(model) { return model.get('age') > 10 });
	  // collection.each(this.addView);
	  //
	  // `Function#apply` can be slow so we use the method's arg count, if we know it.
	  var addMethod = function(length, method, attribute) {
	    switch (length) {
	      case 1: return function() {
	        return _[method](this[attribute]);
	      };
	      case 2: return function(value) {
	        return _[method](this[attribute], value);
	      };
	      case 3: return function(iteratee, context) {
	        return _[method](this[attribute], cb(iteratee, this), context);
	      };
	      case 4: return function(iteratee, defaultVal, context) {
	        return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
	      };
	      default: return function() {
	        var args = slice.call(arguments);
	        args.unshift(this[attribute]);
	        return _[method].apply(_, args);
	      };
	    }
	  };
	  var addUnderscoreMethods = function(Class, methods, attribute) {
	    _.each(methods, function(length, method) {
	      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
	    });
	  };
	
	  // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
	  var cb = function(iteratee, instance) {
	    if (_.isFunction(iteratee)) return iteratee;
	    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
	    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
	    return iteratee;
	  };
	  var modelMatcher = function(attrs) {
	    var matcher = _.matches(attrs);
	    return function(model) {
	      return matcher(model.attributes);
	    };
	  };
	
	  // Backbone.Events
	  // ---------------
	
	  // A module that can be mixed in to *any object* in order to provide it with
	  // a custom event channel. You may bind a callback to an event with `on` or
	  // remove with `off`; `trigger`-ing an event fires all callbacks in
	  // succession.
	  //
	  //     var object = {};
	  //     _.extend(object, Backbone.Events);
	  //     object.on('expand', function(){ alert('expanded'); });
	  //     object.trigger('expand');
	  //
	  var Events = Backbone.Events = {};
	
	  // Regular expression used to split event strings.
	  var eventSplitter = /\s+/;
	
	  // Iterates over the standard `event, callback` (as well as the fancy multiple
	  // space-separated events `"change blur", callback` and jQuery-style event
	  // maps `{event: callback}`).
	  var eventsApi = function(iteratee, events, name, callback, opts) {
	    var i = 0, names;
	    if (name && typeof name === 'object') {
	      // Handle event maps.
	      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
	      for (names = _.keys(name); i < names.length ; i++) {
	        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
	      }
	    } else if (name && eventSplitter.test(name)) {
	      // Handle space separated event names by delegating them individually.
	      for (names = name.split(eventSplitter); i < names.length; i++) {
	        events = iteratee(events, names[i], callback, opts);
	      }
	    } else {
	      // Finally, standard events.
	      events = iteratee(events, name, callback, opts);
	    }
	    return events;
	  };
	
	  // Bind an event to a `callback` function. Passing `"all"` will bind
	  // the callback to all events fired.
	  Events.on = function(name, callback, context) {
	    return internalOn(this, name, callback, context);
	  };
	
	  // Guard the `listening` argument from the public API.
	  var internalOn = function(obj, name, callback, context, listening) {
	    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
	        context: context,
	        ctx: obj,
	        listening: listening
	    });
	
	    if (listening) {
	      var listeners = obj._listeners || (obj._listeners = {});
	      listeners[listening.id] = listening;
	    }
	
	    return obj;
	  };
	
	  // Inversion-of-control versions of `on`. Tell *this* object to listen to
	  // an event in another object... keeping track of what it's listening to
	  // for easier unbinding later.
	  Events.listenTo =  function(obj, name, callback) {
	    if (!obj) return this;
	    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	    var listeningTo = this._listeningTo || (this._listeningTo = {});
	    var listening = listeningTo[id];
	
	    // This object is not listening to any other events on `obj` yet.
	    // Setup the necessary references to track the listening callbacks.
	    if (!listening) {
	      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
	      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
	    }
	
	    // Bind callbacks on obj, and keep track of them on listening.
	    internalOn(obj, name, callback, this, listening);
	    return this;
	  };
	
	  // The reducing API that adds a callback to the `events` object.
	  var onApi = function(events, name, callback, options) {
	    if (callback) {
	      var handlers = events[name] || (events[name] = []);
	      var context = options.context, ctx = options.ctx, listening = options.listening;
	      if (listening) listening.count++;
	
	      handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
	    }
	    return events;
	  };
	
	  // Remove one or many callbacks. If `context` is null, removes all
	  // callbacks with that function. If `callback` is null, removes all
	  // callbacks for the event. If `name` is null, removes all bound
	  // callbacks for all events.
	  Events.off =  function(name, callback, context) {
	    if (!this._events) return this;
	    this._events = eventsApi(offApi, this._events, name, callback, {
	        context: context,
	        listeners: this._listeners
	    });
	    return this;
	  };
	
	  // Tell this object to stop listening to either specific events ... or
	  // to every object it's currently listening to.
	  Events.stopListening =  function(obj, name, callback) {
	    var listeningTo = this._listeningTo;
	    if (!listeningTo) return this;
	
	    var ids = obj ? [obj._listenId] : _.keys(listeningTo);
	
	    for (var i = 0; i < ids.length; i++) {
	      var listening = listeningTo[ids[i]];
	
	      // If listening doesn't exist, this object is not currently
	      // listening to obj. Break out early.
	      if (!listening) break;
	
	      listening.obj.off(name, callback, this);
	    }
	    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;
	
	    return this;
	  };
	
	  // The reducing API that removes a callback from the `events` object.
	  var offApi = function(events, name, callback, options) {
	    if (!events) return;
	
	    var i = 0, listening;
	    var context = options.context, listeners = options.listeners;
	
	    // Delete all events listeners and "drop" events.
	    if (!name && !callback && !context) {
	      var ids = _.keys(listeners);
	      for (; i < ids.length; i++) {
	        listening = listeners[ids[i]];
	        delete listeners[listening.id];
	        delete listening.listeningTo[listening.objId];
	      }
	      return;
	    }
	
	    var names = name ? [name] : _.keys(events);
	    for (; i < names.length; i++) {
	      name = names[i];
	      var handlers = events[name];
	
	      // Bail out if there are no events stored.
	      if (!handlers) break;
	
	      // Replace events if there are any remaining.  Otherwise, clean up.
	      var remaining = [];
	      for (var j = 0; j < handlers.length; j++) {
	        var handler = handlers[j];
	        if (
	          callback && callback !== handler.callback &&
	            callback !== handler.callback._callback ||
	              context && context !== handler.context
	        ) {
	          remaining.push(handler);
	        } else {
	          listening = handler.listening;
	          if (listening && --listening.count === 0) {
	            delete listeners[listening.id];
	            delete listening.listeningTo[listening.objId];
	          }
	        }
	      }
	
	      // Update tail event if the list has any events.  Otherwise, clean up.
	      if (remaining.length) {
	        events[name] = remaining;
	      } else {
	        delete events[name];
	      }
	    }
	    if (_.size(events)) return events;
	  };
	
	  // Bind an event to only be triggered a single time. After the first time
	  // the callback is invoked, its listener will be removed. If multiple events
	  // are passed in using the space-separated syntax, the handler will fire
	  // once for each event, not once for a combination of all events.
	  Events.once =  function(name, callback, context) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
	    return this.on(events, void 0, context);
	  };
	
	  // Inversion-of-control versions of `once`.
	  Events.listenToOnce =  function(obj, name, callback) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
	    return this.listenTo(obj, events);
	  };
	
	  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
	  // `offer` unbinds the `onceWrapper` after it has been called.
	  var onceMap = function(map, name, callback, offer) {
	    if (callback) {
	      var once = map[name] = _.once(function() {
	        offer(name, once);
	        callback.apply(this, arguments);
	      });
	      once._callback = callback;
	    }
	    return map;
	  };
	
	  // Trigger one or many events, firing all bound callbacks. Callbacks are
	  // passed the same arguments as `trigger` is, apart from the event name
	  // (unless you're listening on `"all"`, which will cause your callback to
	  // receive the true name of the event as the first argument).
	  Events.trigger =  function(name) {
	    if (!this._events) return this;
	
	    var length = Math.max(0, arguments.length - 1);
	    var args = Array(length);
	    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
	
	    eventsApi(triggerApi, this._events, name, void 0, args);
	    return this;
	  };
	
	  // Handles triggering the appropriate event callbacks.
	  var triggerApi = function(objEvents, name, cb, args) {
	    if (objEvents) {
	      var events = objEvents[name];
	      var allEvents = objEvents.all;
	      if (events && allEvents) allEvents = allEvents.slice();
	      if (events) triggerEvents(events, args);
	      if (allEvents) triggerEvents(allEvents, [name].concat(args));
	    }
	    return objEvents;
	  };
	
	  // A difficult-to-believe, but optimized internal dispatch function for
	  // triggering events. Tries to keep the usual cases speedy (most internal
	  // Backbone events have 3 arguments).
	  var triggerEvents = function(events, args) {
	    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	    switch (args.length) {
	      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
	      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
	      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
	      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
	      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	    }
	  };
	
	  // Aliases for backwards compatibility.
	  Events.bind   = Events.on;
	  Events.unbind = Events.off;
	
	  // Allow the `Backbone` object to serve as a global event bus, for folks who
	  // want global "pubsub" in a convenient place.
	  _.extend(Backbone, Events);
	
	  // Backbone.Model
	  // --------------
	
	  // Backbone **Models** are the basic data object in the framework --
	  // frequently representing a row in a table in a database on your server.
	  // A discrete chunk of data and a bunch of useful, related methods for
	  // performing computations and transformations on that data.
	
	  // Create a new model with the specified attributes. A client id (`cid`)
	  // is automatically generated and assigned for you.
	  var Model = Backbone.Model = function(attributes, options) {
	    var attrs = attributes || {};
	    options || (options = {});
	    this.cid = _.uniqueId(this.cidPrefix);
	    this.attributes = {};
	    if (options.collection) this.collection = options.collection;
	    if (options.parse) attrs = this.parse(attrs, options) || {};
	    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
	    this.set(attrs, options);
	    this.changed = {};
	    this.initialize.apply(this, arguments);
	  };
	
	  // Attach all inheritable methods to the Model prototype.
	  _.extend(Model.prototype, Events, {
	
	    // A hash of attributes whose current and previous value differ.
	    changed: null,
	
	    // The value returned during the last failed validation.
	    validationError: null,
	
	    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
	    // CouchDB users may want to set this to `"_id"`.
	    idAttribute: 'id',
	
	    // The prefix is used to create the client id which is used to identify models locally.
	    // You may want to override this if you're experiencing name clashes with model ids.
	    cidPrefix: 'c',
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // Return a copy of the model's `attributes` object.
	    toJSON: function(options) {
	      return _.clone(this.attributes);
	    },
	
	    // Proxy `Backbone.sync` by default -- but override this if you need
	    // custom syncing semantics for *this* particular model.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },
	
	    // Get the value of an attribute.
	    get: function(attr) {
	      return this.attributes[attr];
	    },
	
	    // Get the HTML-escaped value of an attribute.
	    escape: function(attr) {
	      return _.escape(this.get(attr));
	    },
	
	    // Returns `true` if the attribute contains a value that is not null
	    // or undefined.
	    has: function(attr) {
	      return this.get(attr) != null;
	    },
	
	    // Special-cased proxy to underscore's `_.matches` method.
	    matches: function(attrs) {
	      return !!_.iteratee(attrs, this)(this.attributes);
	    },
	
	    // Set a hash of model attributes on the object, firing `"change"`. This is
	    // the core primitive operation of a model, updating the data and notifying
	    // anyone who needs to know about the change in state. The heart of the beast.
	    set: function(key, val, options) {
	      if (key == null) return this;
	
	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      var attrs;
	      if (typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }
	
	      options || (options = {});
	
	      // Run validation.
	      if (!this._validate(attrs, options)) return false;
	
	      // Extract attributes and options.
	      var unset      = options.unset;
	      var silent     = options.silent;
	      var changes    = [];
	      var changing   = this._changing;
	      this._changing = true;
	
	      if (!changing) {
	        this._previousAttributes = _.clone(this.attributes);
	        this.changed = {};
	      }
	
	      var current = this.attributes;
	      var changed = this.changed;
	      var prev    = this._previousAttributes;
	
	      // For each `set` attribute, update or delete the current value.
	      for (var attr in attrs) {
	        val = attrs[attr];
	        if (!_.isEqual(current[attr], val)) changes.push(attr);
	        if (!_.isEqual(prev[attr], val)) {
	          changed[attr] = val;
	        } else {
	          delete changed[attr];
	        }
	        unset ? delete current[attr] : current[attr] = val;
	      }
	
	      // Update the `id`.
	      this.id = this.get(this.idAttribute);
	
	      // Trigger all relevant attribute changes.
	      if (!silent) {
	        if (changes.length) this._pending = options;
	        for (var i = 0; i < changes.length; i++) {
	          this.trigger('change:' + changes[i], this, current[changes[i]], options);
	        }
	      }
	
	      // You might be wondering why there's a `while` loop here. Changes can
	      // be recursively nested within `"change"` events.
	      if (changing) return this;
	      if (!silent) {
	        while (this._pending) {
	          options = this._pending;
	          this._pending = false;
	          this.trigger('change', this, options);
	        }
	      }
	      this._pending = false;
	      this._changing = false;
	      return this;
	    },
	
	    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
	    // if the attribute doesn't exist.
	    unset: function(attr, options) {
	      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
	    },
	
	    // Clear all attributes on the model, firing `"change"`.
	    clear: function(options) {
	      var attrs = {};
	      for (var key in this.attributes) attrs[key] = void 0;
	      return this.set(attrs, _.extend({}, options, {unset: true}));
	    },
	
	    // Determine if the model has changed since the last `"change"` event.
	    // If you specify an attribute name, determine if that attribute has changed.
	    hasChanged: function(attr) {
	      if (attr == null) return !_.isEmpty(this.changed);
	      return _.has(this.changed, attr);
	    },
	
	    // Return an object containing all the attributes that have changed, or
	    // false if there are no changed attributes. Useful for determining what
	    // parts of a view need to be updated and/or what attributes need to be
	    // persisted to the server. Unset attributes will be set to undefined.
	    // You can also pass an attributes object to diff against the model,
	    // determining if there *would be* a change.
	    changedAttributes: function(diff) {
	      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
	      var old = this._changing ? this._previousAttributes : this.attributes;
	      var changed = {};
	      for (var attr in diff) {
	        var val = diff[attr];
	        if (_.isEqual(old[attr], val)) continue;
	        changed[attr] = val;
	      }
	      return _.size(changed) ? changed : false;
	    },
	
	    // Get the previous value of an attribute, recorded at the time the last
	    // `"change"` event was fired.
	    previous: function(attr) {
	      if (attr == null || !this._previousAttributes) return null;
	      return this._previousAttributes[attr];
	    },
	
	    // Get all of the attributes of the model at the time of the previous
	    // `"change"` event.
	    previousAttributes: function() {
	      return _.clone(this._previousAttributes);
	    },
	
	    // Fetch the model from the server, merging the response with the model's
	    // local attributes. Any changed attributes will trigger a "change" event.
	    fetch: function(options) {
	      options = _.extend({parse: true}, options);
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
	        if (!model.set(serverAttrs, options)) return false;
	        if (success) success.call(options.context, model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },
	
	    // Set a hash of model attributes, and sync the model to the server.
	    // If the server returns an attributes hash that differs, the model's
	    // state will be `set` again.
	    save: function(key, val, options) {
	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      var attrs;
	      if (key == null || typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }
	
	      options = _.extend({validate: true, parse: true}, options);
	      var wait = options.wait;
	
	      // If we're not waiting and attributes exist, save acts as
	      // `set(attr).save(null, opts)` with validation. Otherwise, check if
	      // the model will be valid when the attributes, if any, are set.
	      if (attrs && !wait) {
	        if (!this.set(attrs, options)) return false;
	      } else {
	        if (!this._validate(attrs, options)) return false;
	      }
	
	      // After a successful server-side save, the client is (optionally)
	      // updated with the server-side state.
	      var model = this;
	      var success = options.success;
	      var attributes = this.attributes;
	      options.success = function(resp) {
	        // Ensure attributes are restored during synchronous saves.
	        model.attributes = attributes;
	        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
	        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
	        if (serverAttrs && !model.set(serverAttrs, options)) return false;
	        if (success) success.call(options.context, model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	
	      // Set temporary attributes if `{wait: true}` to properly find new ids.
	      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);
	
	      var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
	      if (method === 'patch' && !options.attrs) options.attrs = attrs;
	      var xhr = this.sync(method, this, options);
	
	      // Restore attributes.
	      this.attributes = attributes;
	
	      return xhr;
	    },
	
	    // Destroy this model on the server if it was already persisted.
	    // Optimistically removes the model from its collection, if it has one.
	    // If `wait: true` is passed, waits for the server to respond before removal.
	    destroy: function(options) {
	      options = options ? _.clone(options) : {};
	      var model = this;
	      var success = options.success;
	      var wait = options.wait;
	
	      var destroy = function() {
	        model.stopListening();
	        model.trigger('destroy', model, model.collection, options);
	      };
	
	      options.success = function(resp) {
	        if (wait) destroy();
	        if (success) success.call(options.context, model, resp, options);
	        if (!model.isNew()) model.trigger('sync', model, resp, options);
	      };
	
	      var xhr = false;
	      if (this.isNew()) {
	        _.defer(options.success);
	      } else {
	        wrapError(this, options);
	        xhr = this.sync('delete', this, options);
	      }
	      if (!wait) destroy();
	      return xhr;
	    },
	
	    // Default URL for the model's representation on the server -- if you're
	    // using Backbone's restful methods, override this to change the endpoint
	    // that will be called.
	    url: function() {
	      var base =
	        _.result(this, 'urlRoot') ||
	        _.result(this.collection, 'url') ||
	        urlError();
	      if (this.isNew()) return base;
	      var id = this.get(this.idAttribute);
	      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
	    },
	
	    // **parse** converts a response into the hash of attributes to be `set` on
	    // the model. The default implementation is just to pass the response along.
	    parse: function(resp, options) {
	      return resp;
	    },
	
	    // Create a new model with identical attributes to this one.
	    clone: function() {
	      return new this.constructor(this.attributes);
	    },
	
	    // A model is new if it has never been saved to the server, and lacks an id.
	    isNew: function() {
	      return !this.has(this.idAttribute);
	    },
	
	    // Check if the model is currently in a valid state.
	    isValid: function(options) {
	      return this._validate({}, _.defaults({validate: true}, options));
	    },
	
	    // Run validation against the next complete set of model attributes,
	    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
	    _validate: function(attrs, options) {
	      if (!options.validate || !this.validate) return true;
	      attrs = _.extend({}, this.attributes, attrs);
	      var error = this.validationError = this.validate(attrs, options) || null;
	      if (!error) return true;
	      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
	      return false;
	    }
	
	  });
	
	  // Underscore methods that we want to implement on the Model, mapped to the
	  // number of arguments they take.
	  var modelMethods = { keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
	      omit: 0, chain: 1, isEmpty: 1 };
	
	  // Mix in each Underscore method as a proxy to `Model#attributes`.
	  addUnderscoreMethods(Model, modelMethods, 'attributes');
	
	  // Backbone.Collection
	  // -------------------
	
	  // If models tend to represent a single row of data, a Backbone Collection is
	  // more analogous to a table full of data ... or a small slice or page of that
	  // table, or a collection of rows that belong together for a particular reason
	  // -- all of the messages in this particular folder, all of the documents
	  // belonging to this particular author, and so on. Collections maintain
	  // indexes of their models, both in order, and for lookup by `id`.
	
	  // Create a new **Collection**, perhaps to contain a specific type of `model`.
	  // If a `comparator` is specified, the Collection will maintain
	  // its models in sort order, as they're added and removed.
	  var Collection = Backbone.Collection = function(models, options) {
	    options || (options = {});
	    if (options.model) this.model = options.model;
	    if (options.comparator !== void 0) this.comparator = options.comparator;
	    this._reset();
	    this.initialize.apply(this, arguments);
	    if (models) this.reset(models, _.extend({silent: true}, options));
	  };
	
	  // Default options for `Collection#set`.
	  var setOptions = {add: true, remove: true, merge: true};
	  var addOptions = {add: true, remove: false};
	
	  // Splices `insert` into `array` at index `at`.
	  var splice = function(array, insert, at) {
	    at = Math.min(Math.max(at, 0), array.length);
	    var tail = Array(array.length - at);
	    var length = insert.length;
	    for (var i = 0; i < tail.length; i++) tail[i] = array[i + at];
	    for (i = 0; i < length; i++) array[i + at] = insert[i];
	    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
	  };
	
	  // Define the Collection's inheritable methods.
	  _.extend(Collection.prototype, Events, {
	
	    // The default model for a collection is just a **Backbone.Model**.
	    // This should be overridden in most cases.
	    model: Model,
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // The JSON representation of a Collection is an array of the
	    // models' attributes.
	    toJSON: function(options) {
	      return this.map(function(model) { return model.toJSON(options); });
	    },
	
	    // Proxy `Backbone.sync` by default.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },
	
	    // Add a model, or list of models to the set. `models` may be Backbone
	    // Models or raw JavaScript objects to be converted to Models, or any
	    // combination of the two.
	    add: function(models, options) {
	      return this.set(models, _.extend({merge: false}, options, addOptions));
	    },
	
	    // Remove a model, or a list of models from the set.
	    remove: function(models, options) {
	      options = _.extend({}, options);
	      var singular = !_.isArray(models);
	      models = singular ? [models] : _.clone(models);
	      var removed = this._removeModels(models, options);
	      if (!options.silent && removed) this.trigger('update', this, options);
	      return singular ? removed[0] : removed;
	    },
	
	    // Update a collection by `set`-ing a new list of models, adding new ones,
	    // removing models that are no longer present, and merging models that
	    // already exist in the collection, as necessary. Similar to **Model#set**,
	    // the core operation for updating the data contained by the collection.
	    set: function(models, options) {
	      if (models == null) return;
	
	      options = _.defaults({}, options, setOptions);
	      if (options.parse && !this._isModel(models)) models = this.parse(models, options);
	
	      var singular = !_.isArray(models);
	      models = singular ? [models] : models.slice();
	
	      var at = options.at;
	      if (at != null) at = +at;
	      if (at < 0) at += this.length + 1;
	
	      var set = [];
	      var toAdd = [];
	      var toRemove = [];
	      var modelMap = {};
	
	      var add = options.add;
	      var merge = options.merge;
	      var remove = options.remove;
	
	      var sort = false;
	      var sortable = this.comparator && (at == null) && options.sort !== false;
	      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
	
	      // Turn bare objects into model references, and prevent invalid models
	      // from being added.
	      var model;
	      for (var i = 0; i < models.length; i++) {
	        model = models[i];
	
	        // If a duplicate is found, prevent it from being added and
	        // optionally merge it into the existing model.
	        var existing = this.get(model);
	        if (existing) {
	          if (merge && model !== existing) {
	            var attrs = this._isModel(model) ? model.attributes : model;
	            if (options.parse) attrs = existing.parse(attrs, options);
	            existing.set(attrs, options);
	            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
	          }
	          if (!modelMap[existing.cid]) {
	            modelMap[existing.cid] = true;
	            set.push(existing);
	          }
	          models[i] = existing;
	
	        // If this is a new, valid model, push it to the `toAdd` list.
	        } else if (add) {
	          model = models[i] = this._prepareModel(model, options);
	          if (model) {
	            toAdd.push(model);
	            this._addReference(model, options);
	            modelMap[model.cid] = true;
	            set.push(model);
	          }
	        }
	      }
	
	      // Remove stale models.
	      if (remove) {
	        for (i = 0; i < this.length; i++) {
	          model = this.models[i];
	          if (!modelMap[model.cid]) toRemove.push(model);
	        }
	        if (toRemove.length) this._removeModels(toRemove, options);
	      }
	
	      // See if sorting is needed, update `length` and splice in new models.
	      var orderChanged = false;
	      var replace = !sortable && add && remove;
	      if (set.length && replace) {
	        orderChanged = this.length != set.length || _.some(this.models, function(model, index) {
	          return model !== set[index];
	        });
	        this.models.length = 0;
	        splice(this.models, set, 0);
	        this.length = this.models.length;
	      } else if (toAdd.length) {
	        if (sortable) sort = true;
	        splice(this.models, toAdd, at == null ? this.length : at);
	        this.length = this.models.length;
	      }
	
	      // Silently sort the collection if appropriate.
	      if (sort) this.sort({silent: true});
	
	      // Unless silenced, it's time to fire all appropriate add/sort events.
	      if (!options.silent) {
	        for (i = 0; i < toAdd.length; i++) {
	          if (at != null) options.index = at + i;
	          model = toAdd[i];
	          model.trigger('add', model, this, options);
	        }
	        if (sort || orderChanged) this.trigger('sort', this, options);
	        if (toAdd.length || toRemove.length) this.trigger('update', this, options);
	      }
	
	      // Return the added (or merged) model (or models).
	      return singular ? models[0] : models;
	    },
	
	    // When you have more items than you want to add or remove individually,
	    // you can reset the entire set with a new list of models, without firing
	    // any granular `add` or `remove` events. Fires `reset` when finished.
	    // Useful for bulk operations and optimizations.
	    reset: function(models, options) {
	      options = options ? _.clone(options) : {};
	      for (var i = 0; i < this.models.length; i++) {
	        this._removeReference(this.models[i], options);
	      }
	      options.previousModels = this.models;
	      this._reset();
	      models = this.add(models, _.extend({silent: true}, options));
	      if (!options.silent) this.trigger('reset', this, options);
	      return models;
	    },
	
	    // Add a model to the end of the collection.
	    push: function(model, options) {
	      return this.add(model, _.extend({at: this.length}, options));
	    },
	
	    // Remove a model from the end of the collection.
	    pop: function(options) {
	      var model = this.at(this.length - 1);
	      return this.remove(model, options);
	    },
	
	    // Add a model to the beginning of the collection.
	    unshift: function(model, options) {
	      return this.add(model, _.extend({at: 0}, options));
	    },
	
	    // Remove a model from the beginning of the collection.
	    shift: function(options) {
	      var model = this.at(0);
	      return this.remove(model, options);
	    },
	
	    // Slice out a sub-array of models from the collection.
	    slice: function() {
	      return slice.apply(this.models, arguments);
	    },
	
	    // Get a model from the set by id.
	    get: function(obj) {
	      if (obj == null) return void 0;
	      var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
	      return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
	    },
	
	    // Get the model at the given index.
	    at: function(index) {
	      if (index < 0) index += this.length;
	      return this.models[index];
	    },
	
	    // Return models with matching attributes. Useful for simple cases of
	    // `filter`.
	    where: function(attrs, first) {
	      return this[first ? 'find' : 'filter'](attrs);
	    },
	
	    // Return the first model with matching attributes. Useful for simple cases
	    // of `find`.
	    findWhere: function(attrs) {
	      return this.where(attrs, true);
	    },
	
	    // Force the collection to re-sort itself. You don't need to call this under
	    // normal circumstances, as the set will maintain sort order as each item
	    // is added.
	    sort: function(options) {
	      var comparator = this.comparator;
	      if (!comparator) throw new Error('Cannot sort a set without a comparator');
	      options || (options = {});
	
	      var length = comparator.length;
	      if (_.isFunction(comparator)) comparator = _.bind(comparator, this);
	
	      // Run sort based on type of `comparator`.
	      if (length === 1 || _.isString(comparator)) {
	        this.models = this.sortBy(comparator);
	      } else {
	        this.models.sort(comparator);
	      }
	      if (!options.silent) this.trigger('sort', this, options);
	      return this;
	    },
	
	    // Pluck an attribute from each model in the collection.
	    pluck: function(attr) {
	      return _.invoke(this.models, 'get', attr);
	    },
	
	    // Fetch the default set of models for this collection, resetting the
	    // collection when they arrive. If `reset: true` is passed, the response
	    // data will be passed through the `reset` method instead of `set`.
	    fetch: function(options) {
	      options = _.extend({parse: true}, options);
	      var success = options.success;
	      var collection = this;
	      options.success = function(resp) {
	        var method = options.reset ? 'reset' : 'set';
	        collection[method](resp, options);
	        if (success) success.call(options.context, collection, resp, options);
	        collection.trigger('sync', collection, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },
	
	    // Create a new instance of a model in this collection. Add the model to the
	    // collection immediately, unless `wait: true` is passed, in which case we
	    // wait for the server to agree.
	    create: function(model, options) {
	      options = options ? _.clone(options) : {};
	      var wait = options.wait;
	      model = this._prepareModel(model, options);
	      if (!model) return false;
	      if (!wait) this.add(model, options);
	      var collection = this;
	      var success = options.success;
	      options.success = function(model, resp, callbackOpts) {
	        if (wait) collection.add(model, callbackOpts);
	        if (success) success.call(callbackOpts.context, model, resp, callbackOpts);
	      };
	      model.save(null, options);
	      return model;
	    },
	
	    // **parse** converts a response into a list of models to be added to the
	    // collection. The default implementation is just to pass it through.
	    parse: function(resp, options) {
	      return resp;
	    },
	
	    // Create a new collection with an identical list of models as this one.
	    clone: function() {
	      return new this.constructor(this.models, {
	        model: this.model,
	        comparator: this.comparator
	      });
	    },
	
	    // Define how to uniquely identify models in the collection.
	    modelId: function (attrs) {
	      return attrs[this.model.prototype.idAttribute || 'id'];
	    },
	
	    // Private method to reset all internal state. Called when the collection
	    // is first initialized or reset.
	    _reset: function() {
	      this.length = 0;
	      this.models = [];
	      this._byId  = {};
	    },
	
	    // Prepare a hash of attributes (or other model) to be added to this
	    // collection.
	    _prepareModel: function(attrs, options) {
	      if (this._isModel(attrs)) {
	        if (!attrs.collection) attrs.collection = this;
	        return attrs;
	      }
	      options = options ? _.clone(options) : {};
	      options.collection = this;
	      var model = new this.model(attrs, options);
	      if (!model.validationError) return model;
	      this.trigger('invalid', this, model.validationError, options);
	      return false;
	    },
	
	    // Internal method called by both remove and set.
	    _removeModels: function(models, options) {
	      var removed = [];
	      for (var i = 0; i < models.length; i++) {
	        var model = this.get(models[i]);
	        if (!model) continue;
	
	        var index = this.indexOf(model);
	        this.models.splice(index, 1);
	        this.length--;
	
	        if (!options.silent) {
	          options.index = index;
	          model.trigger('remove', model, this, options);
	        }
	
	        removed.push(model);
	        this._removeReference(model, options);
	      }
	      return removed.length ? removed : false;
	    },
	
	    // Method for checking whether an object should be considered a model for
	    // the purposes of adding to the collection.
	    _isModel: function (model) {
	      return model instanceof Model;
	    },
	
	    // Internal method to create a model's ties to a collection.
	    _addReference: function(model, options) {
	      this._byId[model.cid] = model;
	      var id = this.modelId(model.attributes);
	      if (id != null) this._byId[id] = model;
	      model.on('all', this._onModelEvent, this);
	    },
	
	    // Internal method to sever a model's ties to a collection.
	    _removeReference: function(model, options) {
	      delete this._byId[model.cid];
	      var id = this.modelId(model.attributes);
	      if (id != null) delete this._byId[id];
	      if (this === model.collection) delete model.collection;
	      model.off('all', this._onModelEvent, this);
	    },
	
	    // Internal method called every time a model in the set fires an event.
	    // Sets need to update their indexes when models change ids. All other
	    // events simply proxy through. "add" and "remove" events that originate
	    // in other collections are ignored.
	    _onModelEvent: function(event, model, collection, options) {
	      if ((event === 'add' || event === 'remove') && collection !== this) return;
	      if (event === 'destroy') this.remove(model, options);
	      if (event === 'change') {
	        var prevId = this.modelId(model.previousAttributes());
	        var id = this.modelId(model.attributes);
	        if (prevId !== id) {
	          if (prevId != null) delete this._byId[prevId];
	          if (id != null) this._byId[id] = model;
	        }
	      }
	      this.trigger.apply(this, arguments);
	    }
	
	  });
	
	  // Underscore methods that we want to implement on the Collection.
	  // 90% of the core usefulness of Backbone Collections is actually implemented
	  // right here:
	  var collectionMethods = { forEach: 3, each: 3, map: 3, collect: 3, reduce: 4,
	      foldl: 4, inject: 4, reduceRight: 4, foldr: 4, find: 3, detect: 3, filter: 3,
	      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
	      contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
	      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
	      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
	      isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
	      sortBy: 3, indexBy: 3};
	
	  // Mix in each Underscore method as a proxy to `Collection#models`.
	  addUnderscoreMethods(Collection, collectionMethods, 'models');
	
	  // Backbone.View
	  // -------------
	
	  // Backbone Views are almost more convention than they are actual code. A View
	  // is simply a JavaScript object that represents a logical chunk of UI in the
	  // DOM. This might be a single item, an entire list, a sidebar or panel, or
	  // even the surrounding frame which wraps your whole app. Defining a chunk of
	  // UI as a **View** allows you to define your DOM events declaratively, without
	  // having to worry about render order ... and makes it easy for the view to
	  // react to specific changes in the state of your models.
	
	  // Creating a Backbone.View creates its initial element outside of the DOM,
	  // if an existing element is not provided...
	  var View = Backbone.View = function(options) {
	    this.cid = _.uniqueId('view');
	    _.extend(this, _.pick(options, viewOptions));
	    this._ensureElement();
	    this.initialize.apply(this, arguments);
	  };
	
	  // Cached regex to split keys for `delegate`.
	  var delegateEventSplitter = /^(\S+)\s*(.*)$/;
	
	  // List of view options to be set as properties.
	  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
	
	  // Set up all inheritable **Backbone.View** properties and methods.
	  _.extend(View.prototype, Events, {
	
	    // The default `tagName` of a View's element is `"div"`.
	    tagName: 'div',
	
	    // jQuery delegate for element lookup, scoped to DOM elements within the
	    // current view. This should be preferred to global lookups where possible.
	    $: function(selector) {
	      return this.$el.find(selector);
	    },
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // **render** is the core function that your view should override, in order
	    // to populate its element (`this.el`), with the appropriate HTML. The
	    // convention is for **render** to always return `this`.
	    render: function() {
	      return this;
	    },
	
	    // Remove this view by taking the element out of the DOM, and removing any
	    // applicable Backbone.Events listeners.
	    remove: function() {
	      this._removeElement();
	      this.stopListening();
	      return this;
	    },
	
	    // Remove this view's element from the document and all event listeners
	    // attached to it. Exposed for subclasses using an alternative DOM
	    // manipulation API.
	    _removeElement: function() {
	      this.$el.remove();
	    },
	
	    // Change the view's element (`this.el` property) and re-delegate the
	    // view's events on the new element.
	    setElement: function(element) {
	      this.undelegateEvents();
	      this._setElement(element);
	      this.delegateEvents();
	      return this;
	    },
	
	    // Creates the `this.el` and `this.$el` references for this view using the
	    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
	    // context or an element. Subclasses can override this to utilize an
	    // alternative DOM manipulation API and are only required to set the
	    // `this.el` property.
	    _setElement: function(el) {
	      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
	      this.el = this.$el[0];
	    },
	
	    // Set callbacks, where `this.events` is a hash of
	    //
	    // *{"event selector": "callback"}*
	    //
	    //     {
	    //       'mousedown .title':  'edit',
	    //       'click .button':     'save',
	    //       'click .open':       function(e) { ... }
	    //     }
	    //
	    // pairs. Callbacks will be bound to the view, with `this` set properly.
	    // Uses event delegation for efficiency.
	    // Omitting the selector binds the event to `this.el`.
	    delegateEvents: function(events) {
	      events || (events = _.result(this, 'events'));
	      if (!events) return this;
	      this.undelegateEvents();
	      for (var key in events) {
	        var method = events[key];
	        if (!_.isFunction(method)) method = this[method];
	        if (!method) continue;
	        var match = key.match(delegateEventSplitter);
	        this.delegate(match[1], match[2], _.bind(method, this));
	      }
	      return this;
	    },
	
	    // Add a single event listener to the view's element (or a child element
	    // using `selector`). This only works for delegate-able events: not `focus`,
	    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
	    delegate: function(eventName, selector, listener) {
	      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
	      return this;
	    },
	
	    // Clears all callbacks previously bound to the view by `delegateEvents`.
	    // You usually don't need to use this, but may wish to if you have multiple
	    // Backbone views attached to the same DOM element.
	    undelegateEvents: function() {
	      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
	      return this;
	    },
	
	    // A finer-grained `undelegateEvents` for removing a single delegated event.
	    // `selector` and `listener` are both optional.
	    undelegate: function(eventName, selector, listener) {
	      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
	      return this;
	    },
	
	    // Produces a DOM element to be assigned to your view. Exposed for
	    // subclasses using an alternative DOM manipulation API.
	    _createElement: function(tagName) {
	      return document.createElement(tagName);
	    },
	
	    // Ensure that the View has a DOM element to render into.
	    // If `this.el` is a string, pass it through `$()`, take the first
	    // matching element, and re-assign it to `el`. Otherwise, create
	    // an element from the `id`, `className` and `tagName` properties.
	    _ensureElement: function() {
	      if (!this.el) {
	        var attrs = _.extend({}, _.result(this, 'attributes'));
	        if (this.id) attrs.id = _.result(this, 'id');
	        if (this.className) attrs['class'] = _.result(this, 'className');
	        this.setElement(this._createElement(_.result(this, 'tagName')));
	        this._setAttributes(attrs);
	      } else {
	        this.setElement(_.result(this, 'el'));
	      }
	    },
	
	    // Set attributes from a hash on this view's element.  Exposed for
	    // subclasses using an alternative DOM manipulation API.
	    _setAttributes: function(attributes) {
	      this.$el.attr(attributes);
	    }
	
	  });
	
	  // Backbone.sync
	  // -------------
	
	  // Override this function to change the manner in which Backbone persists
	  // models to the server. You will be passed the type of request, and the
	  // model in question. By default, makes a RESTful Ajax request
	  // to the model's `url()`. Some possible customizations could be:
	  //
	  // * Use `setTimeout` to batch rapid-fire updates into a single request.
	  // * Send up the models as XML instead of JSON.
	  // * Persist models via WebSockets instead of Ajax.
	  //
	  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
	  // as `POST`, with a `_method` parameter containing the true HTTP method,
	  // as well as all requests with the body as `application/x-www-form-urlencoded`
	  // instead of `application/json` with the model in a param named `model`.
	  // Useful when interfacing with server-side languages like **PHP** that make
	  // it difficult to read the body of `PUT` requests.
	  Backbone.sync = function(method, model, options) {
	    var type = methodMap[method];
	
	    // Default options, unless specified.
	    _.defaults(options || (options = {}), {
	      emulateHTTP: Backbone.emulateHTTP,
	      emulateJSON: Backbone.emulateJSON
	    });
	
	    // Default JSON-request options.
	    var params = {type: type, dataType: 'json'};
	
	    // Ensure that we have a URL.
	    if (!options.url) {
	      params.url = _.result(model, 'url') || urlError();
	    }
	
	    // Ensure that we have the appropriate request data.
	    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	      params.contentType = 'application/json';
	      params.data = JSON.stringify(options.attrs || model.toJSON(options));
	    }
	
	    // For older servers, emulate JSON by encoding the request into an HTML-form.
	    if (options.emulateJSON) {
	      params.contentType = 'application/x-www-form-urlencoded';
	      params.data = params.data ? {model: params.data} : {};
	    }
	
	    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	    // And an `X-HTTP-Method-Override` header.
	    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
	      params.type = 'POST';
	      if (options.emulateJSON) params.data._method = type;
	      var beforeSend = options.beforeSend;
	      options.beforeSend = function(xhr) {
	        xhr.setRequestHeader('X-HTTP-Method-Override', type);
	        if (beforeSend) return beforeSend.apply(this, arguments);
	      };
	    }
	
	    // Don't process data on a non-GET request.
	    if (params.type !== 'GET' && !options.emulateJSON) {
	      params.processData = false;
	    }
	
	    // Pass along `textStatus` and `errorThrown` from jQuery.
	    var error = options.error;
	    options.error = function(xhr, textStatus, errorThrown) {
	      options.textStatus = textStatus;
	      options.errorThrown = errorThrown;
	      if (error) error.call(options.context, xhr, textStatus, errorThrown);
	    };
	
	    // Make the request, allowing the user to override any Ajax options.
	    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
	    model.trigger('request', model, xhr, options);
	    return xhr;
	  };
	
	  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	  var methodMap = {
	    'create': 'POST',
	    'update': 'PUT',
	    'patch':  'PATCH',
	    'delete': 'DELETE',
	    'read':   'GET'
	  };
	
	  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
	  // Override this if you'd like to use a different library.
	  Backbone.ajax = function() {
	    return Backbone.$.ajax.apply(Backbone.$, arguments);
	  };
	
	  // Backbone.Router
	  // ---------------
	
	  // Routers map faux-URLs to actions, and fire events when routes are
	  // matched. Creating a new one sets its `routes` hash, if not set statically.
	  var Router = Backbone.Router = function(options) {
	    options || (options = {});
	    if (options.routes) this.routes = options.routes;
	    this._bindRoutes();
	    this.initialize.apply(this, arguments);
	  };
	
	  // Cached regular expressions for matching named param parts and splatted
	  // parts of route strings.
	  var optionalParam = /\((.*?)\)/g;
	  var namedParam    = /(\(\?)?:\w+/g;
	  var splatParam    = /\*\w+/g;
	  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	
	  // Set up all inheritable **Backbone.Router** properties and methods.
	  _.extend(Router.prototype, Events, {
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // Manually bind a single named route to a callback. For example:
	    //
	    //     this.route('search/:query/p:num', 'search', function(query, num) {
	    //       ...
	    //     });
	    //
	    route: function(route, name, callback) {
	      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
	      if (_.isFunction(name)) {
	        callback = name;
	        name = '';
	      }
	      if (!callback) callback = this[name];
	      var router = this;
	      Backbone.history.route(route, function(fragment) {
	        var args = router._extractParameters(route, fragment);
	        if (router.execute(callback, args, name) !== false) {
	          router.trigger.apply(router, ['route:' + name].concat(args));
	          router.trigger('route', name, args);
	          Backbone.history.trigger('route', router, name, args);
	        }
	      });
	      return this;
	    },
	
	    // Execute a route handler with the provided parameters.  This is an
	    // excellent place to do pre-route setup or post-route cleanup.
	    execute: function(callback, args, name) {
	      if (callback) callback.apply(this, args);
	    },
	
	    // Simple proxy to `Backbone.history` to save a fragment into the history.
	    navigate: function(fragment, options) {
	      Backbone.history.navigate(fragment, options);
	      return this;
	    },
	
	    // Bind all defined routes to `Backbone.history`. We have to reverse the
	    // order of the routes here to support behavior where the most general
	    // routes can be defined at the bottom of the route map.
	    _bindRoutes: function() {
	      if (!this.routes) return;
	      this.routes = _.result(this, 'routes');
	      var route, routes = _.keys(this.routes);
	      while ((route = routes.pop()) != null) {
	        this.route(route, this.routes[route]);
	      }
	    },
	
	    // Convert a route string into a regular expression, suitable for matching
	    // against the current location hash.
	    _routeToRegExp: function(route) {
	      route = route.replace(escapeRegExp, '\\$&')
	                   .replace(optionalParam, '(?:$1)?')
	                   .replace(namedParam, function(match, optional) {
	                     return optional ? match : '([^/?]+)';
	                   })
	                   .replace(splatParam, '([^?]*?)');
	      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	    },
	
	    // Given a route, and a URL fragment that it matches, return the array of
	    // extracted decoded parameters. Empty or unmatched parameters will be
	    // treated as `null` to normalize cross-browser behavior.
	    _extractParameters: function(route, fragment) {
	      var params = route.exec(fragment).slice(1);
	      return _.map(params, function(param, i) {
	        // Don't decode the search params.
	        if (i === params.length - 1) return param || null;
	        return param ? decodeURIComponent(param) : null;
	      });
	    }
	
	  });
	
	  // Backbone.History
	  // ----------------
	
	  // Handles cross-browser history management, based on either
	  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
	  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
	  // and URL fragments. If the browser supports neither (old IE, natch),
	  // falls back to polling.
	  var History = Backbone.History = function() {
	    this.handlers = [];
	    this.checkUrl = _.bind(this.checkUrl, this);
	
	    // Ensure that `History` can be used outside of the browser.
	    if (typeof window !== 'undefined') {
	      this.location = window.location;
	      this.history = window.history;
	    }
	  };
	
	  // Cached regex for stripping a leading hash/slash and trailing space.
	  var routeStripper = /^[#\/]|\s+$/g;
	
	  // Cached regex for stripping leading and trailing slashes.
	  var rootStripper = /^\/+|\/+$/g;
	
	  // Cached regex for stripping urls of hash.
	  var pathStripper = /#.*$/;
	
	  // Has the history handling already been started?
	  History.started = false;
	
	  // Set up all inheritable **Backbone.History** properties and methods.
	  _.extend(History.prototype, Events, {
	
	    // The default interval to poll for hash changes, if necessary, is
	    // twenty times a second.
	    interval: 50,
	
	    // Are we at the app root?
	    atRoot: function() {
	      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
	      return path === this.root && !this.getSearch();
	    },
	
	    // Does the pathname match the root?
	    matchRoot: function() {
	      var path = this.decodeFragment(this.location.pathname);
	      var root = path.slice(0, this.root.length - 1) + '/';
	      return root === this.root;
	    },
	
	    // Unicode characters in `location.pathname` are percent encoded so they're
	    // decoded for comparison. `%25` should not be decoded since it may be part
	    // of an encoded parameter.
	    decodeFragment: function(fragment) {
	      return decodeURI(fragment.replace(/%25/g, '%2525'));
	    },
	
	    // In IE6, the hash fragment and search params are incorrect if the
	    // fragment contains `?`.
	    getSearch: function() {
	      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
	      return match ? match[0] : '';
	    },
	
	    // Gets the true hash value. Cannot use location.hash directly due to bug
	    // in Firefox where location.hash will always be decoded.
	    getHash: function(window) {
	      var match = (window || this).location.href.match(/#(.*)$/);
	      return match ? match[1] : '';
	    },
	
	    // Get the pathname and search params, without the root.
	    getPath: function() {
	      var path = this.decodeFragment(
	        this.location.pathname + this.getSearch()
	      ).slice(this.root.length - 1);
	      return path.charAt(0) === '/' ? path.slice(1) : path;
	    },
	
	    // Get the cross-browser normalized URL fragment from the path or hash.
	    getFragment: function(fragment) {
	      if (fragment == null) {
	        if (this._usePushState || !this._wantsHashChange) {
	          fragment = this.getPath();
	        } else {
	          fragment = this.getHash();
	        }
	      }
	      return fragment.replace(routeStripper, '');
	    },
	
	    // Start the hash change handling, returning `true` if the current URL matches
	    // an existing route, and `false` otherwise.
	    start: function(options) {
	      if (History.started) throw new Error('Backbone.history has already been started');
	      History.started = true;
	
	      // Figure out the initial configuration. Do we need an iframe?
	      // Is pushState desired ... is it available?
	      this.options          = _.extend({root: '/'}, this.options, options);
	      this.root             = this.options.root;
	      this._wantsHashChange = this.options.hashChange !== false;
	      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
	      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
	      this._wantsPushState  = !!this.options.pushState;
	      this._hasPushState    = !!(this.history && this.history.pushState);
	      this._usePushState    = this._wantsPushState && this._hasPushState;
	      this.fragment         = this.getFragment();
	
	      // Normalize root to always include a leading and trailing slash.
	      this.root = ('/' + this.root + '/').replace(rootStripper, '/');
	
	      // Transition from hashChange to pushState or vice versa if both are
	      // requested.
	      if (this._wantsHashChange && this._wantsPushState) {
	
	        // If we've started off with a route from a `pushState`-enabled
	        // browser, but we're currently in a browser that doesn't support it...
	        if (!this._hasPushState && !this.atRoot()) {
	          var root = this.root.slice(0, -1) || '/';
	          this.location.replace(root + '#' + this.getPath());
	          // Return immediately as browser will do redirect to new url
	          return true;
	
	        // Or if we've started out with a hash-based route, but we're currently
	        // in a browser where it could be `pushState`-based instead...
	        } else if (this._hasPushState && this.atRoot()) {
	          this.navigate(this.getHash(), {replace: true});
	        }
	
	      }
	
	      // Proxy an iframe to handle location events if the browser doesn't
	      // support the `hashchange` event, HTML5 history, or the user wants
	      // `hashChange` but not `pushState`.
	      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
	        this.iframe = document.createElement('iframe');
	        this.iframe.src = 'javascript:0';
	        this.iframe.style.display = 'none';
	        this.iframe.tabIndex = -1;
	        var body = document.body;
	        // Using `appendChild` will throw on IE < 9 if the document is not ready.
	        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
	        iWindow.document.open();
	        iWindow.document.close();
	        iWindow.location.hash = '#' + this.fragment;
	      }
	
	      // Add a cross-platform `addEventListener` shim for older browsers.
	      var addEventListener = window.addEventListener || function (eventName, listener) {
	        return attachEvent('on' + eventName, listener);
	      };
	
	      // Depending on whether we're using pushState or hashes, and whether
	      // 'onhashchange' is supported, determine how we check the URL state.
	      if (this._usePushState) {
	        addEventListener('popstate', this.checkUrl, false);
	      } else if (this._useHashChange && !this.iframe) {
	        addEventListener('hashchange', this.checkUrl, false);
	      } else if (this._wantsHashChange) {
	        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
	      }
	
	      if (!this.options.silent) return this.loadUrl();
	    },
	
	    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
	    // but possibly useful for unit testing Routers.
	    stop: function() {
	      // Add a cross-platform `removeEventListener` shim for older browsers.
	      var removeEventListener = window.removeEventListener || function (eventName, listener) {
	        return detachEvent('on' + eventName, listener);
	      };
	
	      // Remove window listeners.
	      if (this._usePushState) {
	        removeEventListener('popstate', this.checkUrl, false);
	      } else if (this._useHashChange && !this.iframe) {
	        removeEventListener('hashchange', this.checkUrl, false);
	      }
	
	      // Clean up the iframe if necessary.
	      if (this.iframe) {
	        document.body.removeChild(this.iframe);
	        this.iframe = null;
	      }
	
	      // Some environments will throw when clearing an undefined interval.
	      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
	      History.started = false;
	    },
	
	    // Add a route to be tested when the fragment changes. Routes added later
	    // may override previous routes.
	    route: function(route, callback) {
	      this.handlers.unshift({route: route, callback: callback});
	    },
	
	    // Checks the current URL to see if it has changed, and if it has,
	    // calls `loadUrl`, normalizing across the hidden iframe.
	    checkUrl: function(e) {
	      var current = this.getFragment();
	
	      // If the user pressed the back button, the iframe's hash will have
	      // changed and we should use that for comparison.
	      if (current === this.fragment && this.iframe) {
	        current = this.getHash(this.iframe.contentWindow);
	      }
	
	      if (current === this.fragment) return false;
	      if (this.iframe) this.navigate(current);
	      this.loadUrl();
	    },
	
	    // Attempt to load the current URL fragment. If a route succeeds with a
	    // match, returns `true`. If no defined routes matches the fragment,
	    // returns `false`.
	    loadUrl: function(fragment) {
	      // If the root doesn't match, no routes can match either.
	      if (!this.matchRoot()) return false;
	      fragment = this.fragment = this.getFragment(fragment);
	      return _.some(this.handlers, function(handler) {
	        if (handler.route.test(fragment)) {
	          handler.callback(fragment);
	          return true;
	        }
	      });
	    },
	
	    // Save a fragment into the hash history, or replace the URL state if the
	    // 'replace' option is passed. You are responsible for properly URL-encoding
	    // the fragment in advance.
	    //
	    // The options object can contain `trigger: true` if you wish to have the
	    // route callback be fired (not usually desirable), or `replace: true`, if
	    // you wish to modify the current URL without adding an entry to the history.
	    navigate: function(fragment, options) {
	      if (!History.started) return false;
	      if (!options || options === true) options = {trigger: !!options};
	
	      // Normalize the fragment.
	      fragment = this.getFragment(fragment || '');
	
	      // Don't include a trailing slash on the root.
	      var root = this.root;
	      if (fragment === '' || fragment.charAt(0) === '?') {
	        root = root.slice(0, -1) || '/';
	      }
	      var url = root + fragment;
	
	      // Strip the hash and decode for matching.
	      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));
	
	      if (this.fragment === fragment) return;
	      this.fragment = fragment;
	
	      // If pushState is available, we use it to set the fragment as a real URL.
	      if (this._usePushState) {
	        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
	
	      // If hash changes haven't been explicitly disabled, update the hash
	      // fragment to store history.
	      } else if (this._wantsHashChange) {
	        this._updateHash(this.location, fragment, options.replace);
	        if (this.iframe && (fragment !== this.getHash(this.iframe.contentWindow))) {
	          var iWindow = this.iframe.contentWindow;
	
	          // Opening and closing the iframe tricks IE7 and earlier to push a
	          // history entry on hash-tag change.  When replace is true, we don't
	          // want this.
	          if (!options.replace) {
	            iWindow.document.open();
	            iWindow.document.close();
	          }
	
	          this._updateHash(iWindow.location, fragment, options.replace);
	        }
	
	      // If you've told us that you explicitly don't want fallback hashchange-
	      // based history, then `navigate` becomes a page refresh.
	      } else {
	        return this.location.assign(url);
	      }
	      if (options.trigger) return this.loadUrl(fragment);
	    },
	
	    // Update the hash location, either replacing the current entry, or adding
	    // a new one to the browser history.
	    _updateHash: function(location, fragment, replace) {
	      if (replace) {
	        var href = location.href.replace(/(javascript:|#).*$/, '');
	        location.replace(href + '#' + fragment);
	      } else {
	        // Some browsers require that `hash` contains a leading #.
	        location.hash = '#' + fragment;
	      }
	    }
	
	  });
	
	  // Create the default Backbone.history.
	  Backbone.history = new History;
	
	  // Helpers
	  // -------
	
	  // Helper function to correctly set up the prototype chain for subclasses.
	  // Similar to `goog.inherits`, but uses a hash of prototype properties and
	  // class properties to be extended.
	  var extend = function(protoProps, staticProps) {
	    var parent = this;
	    var child;
	
	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent constructor.
	    if (protoProps && _.has(protoProps, 'constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ return parent.apply(this, arguments); };
	    }
	
	    // Add static properties to the constructor function, if supplied.
	    _.extend(child, parent, staticProps);
	
	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent` constructor function.
	    var Surrogate = function(){ this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;
	
	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) _.extend(child.prototype, protoProps);
	
	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;
	
	    return child;
	  };
	
	  // Set up inheritance for the model, collection, router, view and history.
	  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
	
	  // Throw an error when a URL is needed, and none is supplied.
	  var urlError = function() {
	    throw new Error('A "url" property or function must be specified');
	  };
	
	  // Wrap an optional error callback with a fallback error event.
	  var wrapError = function(model, options) {
	    var error = options.error;
	    options.error = function(resp) {
	      if (error) error.call(options.context, model, resp, options);
	      model.trigger('error', model, resp, options);
	    };
	  };
	
	  return Backbone;
	
	}));
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// MarionetteJS (Backbone.Marionette)
	// ----------------------------------
	// v2.4.7
	//
	// Copyright (c)2016 Derick Bailey, Muted Solutions, LLC.
	// Distributed under MIT license
	//
	// http://marionettejs.com
	
	(function(root, factory) {
	
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(19), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Backbone, _) {
	      return (root.Marionette = root.Mn = factory(root, Backbone, _));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    var Backbone = require('backbone');
	    var _ = require('underscore');
	    var Wreqr = require('backbone.wreqr');
	    var BabySitter = require('backbone.babysitter');
	    module.exports = factory(root, Backbone, _);
	  } else {
	    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
	  }
	
	}(this, function(root, Backbone, _) {
	  'use strict';
	
	  var previousMarionette = root.Marionette;
	  var previousMn = root.Mn;
	
	  var Marionette = Backbone.Marionette = {};
	
	  Marionette.VERSION = '2.4.7';
	
	  Marionette.noConflict = function() {
	    root.Marionette = previousMarionette;
	    root.Mn = previousMn;
	    return this;
	  };
	
	  // Get the Deferred creator for later use
	  Marionette.Deferred = Backbone.$.Deferred;
	
	  Marionette.FEATURES = {
	  };
	  
	  Marionette.isEnabled = function(name) {
	    return !!Marionette.FEATURES[name];
	  };
	  
	  /* jshint unused: false *//* global console */
	  
	  // Helpers
	  // -------
	  
	  // Marionette.extend
	  // -----------------
	  
	  // Borrow the Backbone `extend` method so we can use it as needed
	  Marionette.extend = Backbone.Model.extend;
	  
	  // Marionette.isNodeAttached
	  // -------------------------
	  
	  // Determine if `el` is a child of the document
	  Marionette.isNodeAttached = function(el) {
	    return Backbone.$.contains(document.documentElement, el);
	  };
	  
	  // Merge `keys` from `options` onto `this`
	  Marionette.mergeOptions = function(options, keys) {
	    if (!options) { return; }
	    _.extend(this, _.pick(options, keys));
	  };
	  
	  // Marionette.getOption
	  // --------------------
	  
	  // Retrieve an object, function or other value from a target
	  // object or its `options`, with `options` taking precedence.
	  Marionette.getOption = function(target, optionName) {
	    if (!target || !optionName) { return; }
	    if (target.options && (target.options[optionName] !== undefined)) {
	      return target.options[optionName];
	    } else {
	      return target[optionName];
	    }
	  };
	  
	  // Proxy `Marionette.getOption`
	  Marionette.proxyGetOption = function(optionName) {
	    return Marionette.getOption(this, optionName);
	  };
	  
	  // Similar to `_.result`, this is a simple helper
	  // If a function is provided we call it with context
	  // otherwise just return the value. If the value is
	  // undefined return a default value
	  Marionette._getValue = function(value, context, params) {
	    if (_.isFunction(value)) {
	      value = params ? value.apply(context, params) : value.call(context);
	    }
	    return value;
	  };
	  
	  // Marionette.normalizeMethods
	  // ----------------------
	  
	  // Pass in a mapping of events => functions or function names
	  // and return a mapping of events => functions
	  Marionette.normalizeMethods = function(hash) {
	    return _.reduce(hash, function(normalizedHash, method, name) {
	      if (!_.isFunction(method)) {
	        method = this[method];
	      }
	      if (method) {
	        normalizedHash[name] = method;
	      }
	      return normalizedHash;
	    }, {}, this);
	  };
	  
	  // utility method for parsing @ui. syntax strings
	  // into associated selector
	  Marionette.normalizeUIString = function(uiString, ui) {
	    return uiString.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function(r) {
	      return ui[r.slice(4)];
	    });
	  };
	  
	  // allows for the use of the @ui. syntax within
	  // a given key for triggers and events
	  // swaps the @ui with the associated selector.
	  // Returns a new, non-mutated, parsed events hash.
	  Marionette.normalizeUIKeys = function(hash, ui) {
	    return _.reduce(hash, function(memo, val, key) {
	      var normalizedKey = Marionette.normalizeUIString(key, ui);
	      memo[normalizedKey] = val;
	      return memo;
	    }, {});
	  };
	  
	  // allows for the use of the @ui. syntax within
	  // a given value for regions
	  // swaps the @ui with the associated selector
	  Marionette.normalizeUIValues = function(hash, ui, properties) {
	    _.each(hash, function(val, key) {
	      if (_.isString(val)) {
	        hash[key] = Marionette.normalizeUIString(val, ui);
	      } else if (_.isObject(val) && _.isArray(properties)) {
	        _.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui));
	        /* Value is an object, and we got an array of embedded property names to normalize. */
	        _.each(properties, function(property) {
	          var propertyVal = val[property];
	          if (_.isString(propertyVal)) {
	            val[property] = Marionette.normalizeUIString(propertyVal, ui);
	          }
	        });
	      }
	    });
	    return hash;
	  };
	  
	  // Mix in methods from Underscore, for iteration, and other
	  // collection related features.
	  // Borrowing this code from Backbone.Collection:
	  // http://backbonejs.org/docs/backbone.html#section-121
	  Marionette.actAsCollection = function(object, listProperty) {
	    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
	      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
	      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
	      'last', 'without', 'isEmpty', 'pluck'];
	  
	    _.each(methods, function(method) {
	      object[method] = function() {
	        var list = _.values(_.result(this, listProperty));
	        var args = [list].concat(_.toArray(arguments));
	        return _[method].apply(_, args);
	      };
	    });
	  };
	  
	  var deprecate = Marionette.deprecate = function(message, test) {
	    if (_.isObject(message)) {
	      message = (
	        message.prev + ' is going to be removed in the future. ' +
	        'Please use ' + message.next + ' instead.' +
	        (message.url ? ' See: ' + message.url : '')
	      );
	    }
	  
	    if ((test === undefined || !test) && !deprecate._cache[message]) {
	      deprecate._warn('Deprecation warning: ' + message);
	      deprecate._cache[message] = true;
	    }
	  };
	  
	  deprecate._console = typeof console !== 'undefined' ? console : {};
	  deprecate._warn = function() {
	    var warn = deprecate._console.warn || deprecate._console.log || function() {};
	    return warn.apply(deprecate._console, arguments);
	  };
	  deprecate._cache = {};
	  
	  /* jshint maxstatements: 14, maxcomplexity: 7 */
	  
	  // Trigger Method
	  // --------------
	  
	  Marionette._triggerMethod = (function() {
	    // split the event name on the ":"
	    var splitter = /(^|:)(\w)/gi;
	  
	    // take the event section ("section1:section2:section3")
	    // and turn it in to uppercase name
	    function getEventName(match, prefix, eventName) {
	      return eventName.toUpperCase();
	    }
	  
	    return function(context, event, args) {
	      var noEventArg = arguments.length < 3;
	      if (noEventArg) {
	        args = event;
	        event = args[0];
	      }
	  
	      // get the method name from the event name
	      var methodName = 'on' + event.replace(splitter, getEventName);
	      var method = context[methodName];
	      var result;
	  
	      // call the onMethodName if it exists
	      if (_.isFunction(method)) {
	        // pass all args, except the event name
	        result = method.apply(context, noEventArg ? _.rest(args) : args);
	      }
	  
	      // trigger the event, if a trigger method exists
	      if (_.isFunction(context.trigger)) {
	        if (noEventArg + args.length > 1) {
	          context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
	        } else {
	          context.trigger(event);
	        }
	      }
	  
	      return result;
	    };
	  })();
	  
	  // Trigger an event and/or a corresponding method name. Examples:
	  //
	  // `this.triggerMethod("foo")` will trigger the "foo" event and
	  // call the "onFoo" method.
	  //
	  // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
	  // call the "onFooBar" method.
	  Marionette.triggerMethod = function(event) {
	    return Marionette._triggerMethod(this, arguments);
	  };
	  
	  // triggerMethodOn invokes triggerMethod on a specific context
	  //
	  // e.g. `Marionette.triggerMethodOn(view, 'show')`
	  // will trigger a "show" event or invoke onShow the view.
	  Marionette.triggerMethodOn = function(context) {
	    var fnc = _.isFunction(context.triggerMethod) ?
	                  context.triggerMethod :
	                  Marionette.triggerMethod;
	  
	    return fnc.apply(context, _.rest(arguments));
	  };
	  
	  // DOM Refresh
	  // -----------
	  
	  // Monitor a view's state, and after it has been rendered and shown
	  // in the DOM, trigger a "dom:refresh" event every time it is
	  // re-rendered.
	  
	  Marionette.MonitorDOMRefresh = function(view) {
	    if (view._isDomRefreshMonitored) { return; }
	    view._isDomRefreshMonitored = true;
	  
	    // track when the view has been shown in the DOM,
	    // using a Marionette.Region (or by other means of triggering "show")
	    function handleShow() {
	      view._isShown = true;
	      triggerDOMRefresh();
	    }
	  
	    // track when the view has been rendered
	    function handleRender() {
	      view._isRendered = true;
	      triggerDOMRefresh();
	    }
	  
	    // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
	    function triggerDOMRefresh() {
	      if (view._isShown && view._isRendered && Marionette.isNodeAttached(view.el)) {
	        Marionette.triggerMethodOn(view, 'dom:refresh', view);
	      }
	    }
	  
	    view.on({
	      show: handleShow,
	      render: handleRender
	    });
	  };
	  
	  /* jshint maxparams: 5 */
	  
	  // Bind Entity Events & Unbind Entity Events
	  // -----------------------------------------
	  //
	  // These methods are used to bind/unbind a backbone "entity" (e.g. collection/model)
	  // to methods on a target object.
	  //
	  // The first parameter, `target`, must have the Backbone.Events module mixed in.
	  //
	  // The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
	  // any object that has Backbone.Events mixed in) to bind the events from.
	  //
	  // The third parameter is a hash of { "event:name": "eventHandler" }
	  // configuration. Multiple handlers can be separated by a space. A
	  // function can be supplied instead of a string handler name.
	  
	  (function(Marionette) {
	    'use strict';
	  
	    // Bind the event to handlers specified as a string of
	    // handler names on the target object
	    function bindFromStrings(target, entity, evt, methods) {
	      var methodNames = methods.split(/\s+/);
	  
	      _.each(methodNames, function(methodName) {
	  
	        var method = target[methodName];
	        if (!method) {
	          throw new Marionette.Error('Method "' + methodName +
	            '" was configured as an event handler, but does not exist.');
	        }
	  
	        target.listenTo(entity, evt, method);
	      });
	    }
	  
	    // Bind the event to a supplied callback function
	    function bindToFunction(target, entity, evt, method) {
	      target.listenTo(entity, evt, method);
	    }
	  
	    // Bind the event to handlers specified as a string of
	    // handler names on the target object
	    function unbindFromStrings(target, entity, evt, methods) {
	      var methodNames = methods.split(/\s+/);
	  
	      _.each(methodNames, function(methodName) {
	        var method = target[methodName];
	        target.stopListening(entity, evt, method);
	      });
	    }
	  
	    // Bind the event to a supplied callback function
	    function unbindToFunction(target, entity, evt, method) {
	      target.stopListening(entity, evt, method);
	    }
	  
	    // generic looping function
	    function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
	      if (!entity || !bindings) { return; }
	  
	      // type-check bindings
	      if (!_.isObject(bindings)) {
	        throw new Marionette.Error({
	          message: 'Bindings must be an object or function.',
	          url: 'marionette.functions.html#marionettebindentityevents'
	        });
	      }
	  
	      // allow the bindings to be a function
	      bindings = Marionette._getValue(bindings, target);
	  
	      // iterate the bindings and bind them
	      _.each(bindings, function(methods, evt) {
	  
	        // allow for a function as the handler,
	        // or a list of event names as a string
	        if (_.isFunction(methods)) {
	          functionCallback(target, entity, evt, methods);
	        } else {
	          stringCallback(target, entity, evt, methods);
	        }
	  
	      });
	    }
	  
	    // Export Public API
	    Marionette.bindEntityEvents = function(target, entity, bindings) {
	      iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
	    };
	  
	    Marionette.unbindEntityEvents = function(target, entity, bindings) {
	      iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
	    };
	  
	    // Proxy `bindEntityEvents`
	    Marionette.proxyBindEntityEvents = function(entity, bindings) {
	      return Marionette.bindEntityEvents(this, entity, bindings);
	    };
	  
	    // Proxy `unbindEntityEvents`
	    Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
	      return Marionette.unbindEntityEvents(this, entity, bindings);
	    };
	  })(Marionette);
	  
	
	  // Error
	  // -----
	  
	  var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];
	  
	  Marionette.Error = Marionette.extend.call(Error, {
	    urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/',
	  
	    constructor: function(message, options) {
	      if (_.isObject(message)) {
	        options = message;
	        message = options.message;
	      } else if (!options) {
	        options = {};
	      }
	  
	      var error = Error.call(this, message);
	      _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));
	  
	      this.captureStackTrace();
	  
	      if (options.url) {
	        this.url = this.urlRoot + options.url;
	      }
	    },
	  
	    captureStackTrace: function() {
	      if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, Marionette.Error);
	      }
	    },
	  
	    toString: function() {
	      return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
	    }
	  });
	  
	  Marionette.Error.extend = Marionette.extend;
	  
	  // Callbacks
	  // ---------
	  
	  // A simple way of managing a collection of callbacks
	  // and executing them at a later point in time, using jQuery's
	  // `Deferred` object.
	  Marionette.Callbacks = function() {
	    this._deferred = Marionette.Deferred();
	    this._callbacks = [];
	  };
	  
	  _.extend(Marionette.Callbacks.prototype, {
	  
	    // Add a callback to be executed. Callbacks added here are
	    // guaranteed to execute, even if they are added after the
	    // `run` method is called.
	    add: function(callback, contextOverride) {
	      var promise = _.result(this._deferred, 'promise');
	  
	      this._callbacks.push({cb: callback, ctx: contextOverride});
	  
	      promise.then(function(args) {
	        if (contextOverride) { args.context = contextOverride; }
	        callback.call(args.context, args.options);
	      });
	    },
	  
	    // Run all registered callbacks with the context specified.
	    // Additional callbacks can be added after this has been run
	    // and they will still be executed.
	    run: function(options, context) {
	      this._deferred.resolve({
	        options: options,
	        context: context
	      });
	    },
	  
	    // Resets the list of callbacks to be run, allowing the same list
	    // to be run multiple times - whenever the `run` method is called.
	    reset: function() {
	      var callbacks = this._callbacks;
	      this._deferred = Marionette.Deferred();
	      this._callbacks = [];
	  
	      _.each(callbacks, function(cb) {
	        this.add(cb.cb, cb.ctx);
	      }, this);
	    }
	  });
	  
	  // Controller
	  // ----------
	  
	  // A multi-purpose object to use as a controller for
	  // modules and routers, and as a mediator for workflow
	  // and coordination of other objects, views, and more.
	  Marionette.Controller = function(options) {
	    this.options = options || {};
	  
	    if (_.isFunction(this.initialize)) {
	      this.initialize(this.options);
	    }
	  };
	  
	  Marionette.Controller.extend = Marionette.extend;
	  
	  // Controller Methods
	  // --------------
	  
	  // Ensure it can trigger events with Backbone.Events
	  _.extend(Marionette.Controller.prototype, Backbone.Events, {
	    destroy: function() {
	      Marionette._triggerMethod(this, 'before:destroy', arguments);
	      Marionette._triggerMethod(this, 'destroy', arguments);
	  
	      this.stopListening();
	      this.off();
	      return this;
	    },
	  
	    // import the `triggerMethod` to trigger events with corresponding
	    // methods if the method exists
	    triggerMethod: Marionette.triggerMethod,
	  
	    // A handy way to merge options onto the instance
	    mergeOptions: Marionette.mergeOptions,
	  
	    // Proxy `getOption` to enable getting options from this or this.options by name.
	    getOption: Marionette.proxyGetOption
	  
	  });
	  
	  // Object
	  // ------
	  
	  // A Base Class that other Classes should descend from.
	  // Object borrows many conventions and utilities from Backbone.
	  Marionette.Object = function(options) {
	    this.options = _.extend({}, _.result(this, 'options'), options);
	  
	    this.initialize.apply(this, arguments);
	  };
	  
	  Marionette.Object.extend = Marionette.extend;
	  
	  // Object Methods
	  // --------------
	  
	  // Ensure it can trigger events with Backbone.Events
	  _.extend(Marionette.Object.prototype, Backbone.Events, {
	  
	    //this is a noop method intended to be overridden by classes that extend from this base
	    initialize: function() {},
	  
	    destroy: function(options) {
	      options = options || {};
	  
	      this.triggerMethod('before:destroy', options);
	      this.triggerMethod('destroy', options);
	      this.stopListening();
	  
	      return this;
	    },
	  
	    // Import the `triggerMethod` to trigger events with corresponding
	    // methods if the method exists
	    triggerMethod: Marionette.triggerMethod,
	  
	    // A handy way to merge options onto the instance
	    mergeOptions: Marionette.mergeOptions,
	  
	    // Proxy `getOption` to enable getting options from this or this.options by name.
	    getOption: Marionette.proxyGetOption,
	  
	    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
	    bindEntityEvents: Marionette.proxyBindEntityEvents,
	  
	    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
	    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
	  });
	  
	  /* jshint maxcomplexity: 16, maxstatements: 45, maxlen: 120 */
	  
	  // Region
	  // ------
	  
	  // Manage the visual regions of your composite application. See
	  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
	  
	  Marionette.Region = Marionette.Object.extend({
	    constructor: function(options) {
	  
	      // set options temporarily so that we can get `el`.
	      // options will be overriden by Object.constructor
	      this.options = options || {};
	      this.el = this.getOption('el');
	  
	      // Handle when this.el is passed in as a $ wrapped element.
	      this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;
	  
	      if (!this.el) {
	        throw new Marionette.Error({
	          name: 'NoElError',
	          message: 'An "el" must be specified for a region.'
	        });
	      }
	  
	      this.$el = this.getEl(this.el);
	      Marionette.Object.call(this, options);
	    },
	  
	    // Displays a backbone view instance inside of the region.
	    // Handles calling the `render` method for you. Reads content
	    // directly from the `el` attribute. Also calls an optional
	    // `onShow` and `onDestroy` method on your view, just after showing
	    // or just before destroying the view, respectively.
	    // The `preventDestroy` option can be used to prevent a view from
	    // the old view being destroyed on show.
	    // The `forceShow` option can be used to force a view to be
	    // re-rendered if it's already shown in the region.
	    show: function(view, options) {
	      if (!this._ensureElement()) {
	        return;
	      }
	  
	      this._ensureViewIsIntact(view);
	      Marionette.MonitorDOMRefresh(view);
	  
	      var showOptions     = options || {};
	      var isDifferentView = view !== this.currentView;
	      var preventDestroy  = !!showOptions.preventDestroy;
	      var forceShow       = !!showOptions.forceShow;
	  
	      // We are only changing the view if there is a current view to change to begin with
	      var isChangingView = !!this.currentView;
	  
	      // Only destroy the current view if we don't want to `preventDestroy` and if
	      // the view given in the first argument is different than `currentView`
	      var _shouldDestroyView = isDifferentView && !preventDestroy;
	  
	      // Only show the view given in the first argument if it is different than
	      // the current view or if we want to re-show the view. Note that if
	      // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
	      var _shouldShowView = isDifferentView || forceShow;
	  
	      if (isChangingView) {
	        this.triggerMethod('before:swapOut', this.currentView, this, options);
	      }
	  
	      if (this.currentView && isDifferentView) {
	        delete this.currentView._parent;
	      }
	  
	      if (_shouldDestroyView) {
	        this.empty();
	  
	      // A `destroy` event is attached to the clean up manually removed views.
	      // We need to detach this event when a new view is going to be shown as it
	      // is no longer relevant.
	      } else if (isChangingView && _shouldShowView) {
	        this.currentView.off('destroy', this.empty, this);
	      }
	  
	      if (_shouldShowView) {
	  
	        // We need to listen for if a view is destroyed
	        // in a way other than through the region.
	        // If this happens we need to remove the reference
	        // to the currentView since once a view has been destroyed
	        // we can not reuse it.
	        view.once('destroy', this.empty, this);
	  
	        // make this region the view's parent,
	        // It's important that this parent binding happens before rendering
	        // so that any events the child may trigger during render can also be
	        // triggered on the child's ancestor views
	        view._parent = this;
	        this._renderView(view);
	  
	        if (isChangingView) {
	          this.triggerMethod('before:swap', view, this, options);
	        }
	  
	        this.triggerMethod('before:show', view, this, options);
	        Marionette.triggerMethodOn(view, 'before:show', view, this, options);
	  
	        if (isChangingView) {
	          this.triggerMethod('swapOut', this.currentView, this, options);
	        }
	  
	        // An array of views that we're about to display
	        var attachedRegion = Marionette.isNodeAttached(this.el);
	  
	        // The views that we're about to attach to the document
	        // It's important that we prevent _getNestedViews from being executed unnecessarily
	        // as it's a potentially-slow method
	        var displayedViews = [];
	  
	        var attachOptions = _.extend({
	          triggerBeforeAttach: this.triggerBeforeAttach,
	          triggerAttach: this.triggerAttach
	        }, showOptions);
	  
	        if (attachedRegion && attachOptions.triggerBeforeAttach) {
	          displayedViews = this._displayedViews(view);
	          this._triggerAttach(displayedViews, 'before:');
	        }
	  
	        this.attachHtml(view);
	        this.currentView = view;
	  
	        if (attachedRegion && attachOptions.triggerAttach) {
	          displayedViews = this._displayedViews(view);
	          this._triggerAttach(displayedViews);
	        }
	  
	        if (isChangingView) {
	          this.triggerMethod('swap', view, this, options);
	        }
	  
	        this.triggerMethod('show', view, this, options);
	        Marionette.triggerMethodOn(view, 'show', view, this, options);
	  
	        return this;
	      }
	  
	      return this;
	    },
	  
	    triggerBeforeAttach: true,
	    triggerAttach: true,
	  
	    _triggerAttach: function(views, prefix) {
	      var eventName = (prefix || '') + 'attach';
	      _.each(views, function(view) {
	        Marionette.triggerMethodOn(view, eventName, view, this);
	      }, this);
	    },
	  
	    _displayedViews: function(view) {
	      return _.union([view], _.result(view, '_getNestedViews') || []);
	    },
	  
	    _renderView: function(view) {
	      if (!view.supportsRenderLifecycle) {
	        Marionette.triggerMethodOn(view, 'before:render', view);
	      }
	      view.render();
	      if (!view.supportsRenderLifecycle) {
	        Marionette.triggerMethodOn(view, 'render', view);
	      }
	    },
	  
	    _ensureElement: function() {
	      if (!_.isObject(this.el)) {
	        this.$el = this.getEl(this.el);
	        this.el = this.$el[0];
	      }
	  
	      if (!this.$el || this.$el.length === 0) {
	        if (this.getOption('allowMissingEl')) {
	          return false;
	        } else {
	          throw new Marionette.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
	        }
	      }
	      return true;
	    },
	  
	    _ensureViewIsIntact: function(view) {
	      if (!view) {
	        throw new Marionette.Error({
	          name: 'ViewNotValid',
	          message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
	        });
	      }
	  
	      if (view.isDestroyed) {
	        throw new Marionette.Error({
	          name: 'ViewDestroyedError',
	          message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
	        });
	      }
	    },
	  
	    // Override this method to change how the region finds the DOM
	    // element that it manages. Return a jQuery selector object scoped
	    // to a provided parent el or the document if none exists.
	    getEl: function(el) {
	      return Backbone.$(el, Marionette._getValue(this.options.parentEl, this));
	    },
	  
	    // Override this method to change how the new view is
	    // appended to the `$el` that the region is managing
	    attachHtml: function(view) {
	      this.$el.contents().detach();
	  
	      this.el.appendChild(view.el);
	    },
	  
	    // Destroy the current view, if there is one. If there is no
	    // current view, it does nothing and returns immediately.
	    empty: function(options) {
	      var view = this.currentView;
	  
	      var emptyOptions = options || {};
	      var preventDestroy  = !!emptyOptions.preventDestroy;
	      // If there is no view in the region
	      // we should not remove anything
	      if (!view) { return this; }
	  
	      view.off('destroy', this.empty, this);
	      this.triggerMethod('before:empty', view);
	      if (!preventDestroy) {
	        this._destroyView();
	      }
	      this.triggerMethod('empty', view);
	  
	      // Remove region pointer to the currentView
	      delete this.currentView;
	  
	      if (preventDestroy) {
	        this.$el.contents().detach();
	      }
	  
	      return this;
	    },
	  
	    // call 'destroy' or 'remove', depending on which is found
	    // on the view (if showing a raw Backbone view or a Marionette View)
	    _destroyView: function() {
	      var view = this.currentView;
	      if (view.isDestroyed) { return; }
	  
	      if (!view.supportsDestroyLifecycle) {
	        Marionette.triggerMethodOn(view, 'before:destroy', view);
	      }
	      if (view.destroy) {
	        view.destroy();
	      } else {
	        view.remove();
	  
	        // appending isDestroyed to raw Backbone View allows regions
	        // to throw a ViewDestroyedError for this view
	        view.isDestroyed = true;
	      }
	      if (!view.supportsDestroyLifecycle) {
	        Marionette.triggerMethodOn(view, 'destroy', view);
	      }
	    },
	  
	    // Attach an existing view to the region. This
	    // will not call `render` or `onShow` for the new view,
	    // and will not replace the current HTML for the `el`
	    // of the region.
	    attachView: function(view) {
	      if (this.currentView) {
	        delete this.currentView._parent;
	      }
	      view._parent = this;
	      this.currentView = view;
	      return this;
	    },
	  
	    // Checks whether a view is currently present within
	    // the region. Returns `true` if there is and `false` if
	    // no view is present.
	    hasView: function() {
	      return !!this.currentView;
	    },
	  
	    // Reset the region by destroying any existing view and
	    // clearing out the cached `$el`. The next time a view
	    // is shown via this region, the region will re-query the
	    // DOM for the region's `el`.
	    reset: function() {
	      this.empty();
	  
	      if (this.$el) {
	        this.el = this.$el.selector;
	      }
	  
	      delete this.$el;
	      return this;
	    }
	  
	  },
	  
	  // Static Methods
	  {
	  
	    // Build an instance of a region by passing in a configuration object
	    // and a default region class to use if none is specified in the config.
	    //
	    // The config object should either be a string as a jQuery DOM selector,
	    // a Region class directly, or an object literal that specifies a selector,
	    // a custom regionClass, and any options to be supplied to the region:
	    //
	    // ```js
	    // {
	    //   selector: "#foo",
	    //   regionClass: MyCustomRegion,
	    //   allowMissingEl: false
	    // }
	    // ```
	    //
	    buildRegion: function(regionConfig, DefaultRegionClass) {
	      if (_.isString(regionConfig)) {
	        return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
	      }
	  
	      if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
	        return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
	      }
	  
	      if (_.isFunction(regionConfig)) {
	        return this._buildRegionFromRegionClass(regionConfig);
	      }
	  
	      throw new Marionette.Error({
	        message: 'Improper region configuration type.',
	        url: 'marionette.region.html#region-configuration-types'
	      });
	    },
	  
	    // Build the region from a string selector like '#foo-region'
	    _buildRegionFromSelector: function(selector, DefaultRegionClass) {
	      return new DefaultRegionClass({el: selector});
	    },
	  
	    // Build the region from a configuration object
	    // ```js
	    // { selector: '#foo', regionClass: FooRegion, allowMissingEl: false }
	    // ```
	    _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
	      var RegionClass = regionConfig.regionClass || DefaultRegionClass;
	      var options = _.omit(regionConfig, 'selector', 'regionClass');
	  
	      if (regionConfig.selector && !options.el) {
	        options.el = regionConfig.selector;
	      }
	  
	      return new RegionClass(options);
	    },
	  
	    // Build the region directly from a given `RegionClass`
	    _buildRegionFromRegionClass: function(RegionClass) {
	      return new RegionClass();
	    }
	  });
	  
	  // Region Manager
	  // --------------
	  
	  // Manage one or more related `Marionette.Region` objects.
	  Marionette.RegionManager = Marionette.Controller.extend({
	    constructor: function(options) {
	      this._regions = {};
	      this.length = 0;
	  
	      Marionette.Controller.call(this, options);
	  
	      this.addRegions(this.getOption('regions'));
	    },
	  
	    // Add multiple regions using an object literal or a
	    // function that returns an object literal, where
	    // each key becomes the region name, and each value is
	    // the region definition.
	    addRegions: function(regionDefinitions, defaults) {
	      regionDefinitions = Marionette._getValue(regionDefinitions, this, arguments);
	  
	      return _.reduce(regionDefinitions, function(regions, definition, name) {
	        if (_.isString(definition)) {
	          definition = {selector: definition};
	        }
	        if (definition.selector) {
	          definition = _.defaults({}, definition, defaults);
	        }
	  
	        regions[name] = this.addRegion(name, definition);
	        return regions;
	      }, {}, this);
	    },
	  
	    // Add an individual region to the region manager,
	    // and return the region instance
	    addRegion: function(name, definition) {
	      var region;
	  
	      if (definition instanceof Marionette.Region) {
	        region = definition;
	      } else {
	        region = Marionette.Region.buildRegion(definition, Marionette.Region);
	      }
	  
	      this.triggerMethod('before:add:region', name, region);
	  
	      region._parent = this;
	      this._store(name, region);
	  
	      this.triggerMethod('add:region', name, region);
	      return region;
	    },
	  
	    // Get a region by name
	    get: function(name) {
	      return this._regions[name];
	    },
	  
	    // Gets all the regions contained within
	    // the `regionManager` instance.
	    getRegions: function() {
	      return _.clone(this._regions);
	    },
	  
	    // Remove a region by name
	    removeRegion: function(name) {
	      var region = this._regions[name];
	      this._remove(name, region);
	  
	      return region;
	    },
	  
	    // Empty all regions in the region manager, and
	    // remove them
	    removeRegions: function() {
	      var regions = this.getRegions();
	      _.each(this._regions, function(region, name) {
	        this._remove(name, region);
	      }, this);
	  
	      return regions;
	    },
	  
	    // Empty all regions in the region manager, but
	    // leave them attached
	    emptyRegions: function() {
	      var regions = this.getRegions();
	      _.invoke(regions, 'empty');
	      return regions;
	    },
	  
	    // Destroy all regions and shut down the region
	    // manager entirely
	    destroy: function() {
	      this.removeRegions();
	      return Marionette.Controller.prototype.destroy.apply(this, arguments);
	    },
	  
	    // internal method to store regions
	    _store: function(name, region) {
	      if (!this._regions[name]) {
	        this.length++;
	      }
	  
	      this._regions[name] = region;
	    },
	  
	    // internal method to remove a region
	    _remove: function(name, region) {
	      this.triggerMethod('before:remove:region', name, region);
	      region.empty();
	      region.stopListening();
	  
	      delete region._parent;
	      delete this._regions[name];
	      this.length--;
	      this.triggerMethod('remove:region', name, region);
	    }
	  });
	  
	  Marionette.actAsCollection(Marionette.RegionManager.prototype, '_regions');
	  
	
	  // Template Cache
	  // --------------
	  
	  // Manage templates stored in `<script>` blocks,
	  // caching them for faster access.
	  Marionette.TemplateCache = function(templateId) {
	    this.templateId = templateId;
	  };
	  
	  // TemplateCache object-level methods. Manage the template
	  // caches from these method calls instead of creating
	  // your own TemplateCache instances
	  _.extend(Marionette.TemplateCache, {
	    templateCaches: {},
	  
	    // Get the specified template by id. Either
	    // retrieves the cached version, or loads it
	    // from the DOM.
	    get: function(templateId, options) {
	      var cachedTemplate = this.templateCaches[templateId];
	  
	      if (!cachedTemplate) {
	        cachedTemplate = new Marionette.TemplateCache(templateId);
	        this.templateCaches[templateId] = cachedTemplate;
	      }
	  
	      return cachedTemplate.load(options);
	    },
	  
	    // Clear templates from the cache. If no arguments
	    // are specified, clears all templates:
	    // `clear()`
	    //
	    // If arguments are specified, clears each of the
	    // specified templates from the cache:
	    // `clear("#t1", "#t2", "...")`
	    clear: function() {
	      var i;
	      var args = _.toArray(arguments);
	      var length = args.length;
	  
	      if (length > 0) {
	        for (i = 0; i < length; i++) {
	          delete this.templateCaches[args[i]];
	        }
	      } else {
	        this.templateCaches = {};
	      }
	    }
	  });
	  
	  // TemplateCache instance methods, allowing each
	  // template cache object to manage its own state
	  // and know whether or not it has been loaded
	  _.extend(Marionette.TemplateCache.prototype, {
	  
	    // Internal method to load the template
	    load: function(options) {
	      // Guard clause to prevent loading this template more than once
	      if (this.compiledTemplate) {
	        return this.compiledTemplate;
	      }
	  
	      // Load the template and compile it
	      var template = this.loadTemplate(this.templateId, options);
	      this.compiledTemplate = this.compileTemplate(template, options);
	  
	      return this.compiledTemplate;
	    },
	  
	    // Load a template from the DOM, by default. Override
	    // this method to provide your own template retrieval
	    // For asynchronous loading with AMD/RequireJS, consider
	    // using a template-loader plugin as described here:
	    // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
	    loadTemplate: function(templateId, options) {
	      var $template = Backbone.$(templateId);
	  
	      if (!$template.length) {
	        throw new Marionette.Error({
	          name: 'NoTemplateError',
	          message: 'Could not find template: "' + templateId + '"'
	        });
	      }
	      return $template.html();
	    },
	  
	    // Pre-compile the template before caching it. Override
	    // this method if you do not need to pre-compile a template
	    // (JST / RequireJS for example) or if you want to change
	    // the template engine used (Handebars, etc).
	    compileTemplate: function(rawTemplate, options) {
	      return _.template(rawTemplate, options);
	    }
	  });
	  
	  // Renderer
	  // --------
	  
	  // Render a template with data by passing in the template
	  // selector and the data to render.
	  Marionette.Renderer = {
	  
	    // Render a template with data. The `template` parameter is
	    // passed to the `TemplateCache` object to retrieve the
	    // template function. Override this method to provide your own
	    // custom rendering and template handling for all of Marionette.
	    render: function(template, data) {
	      if (!template) {
	        throw new Marionette.Error({
	          name: 'TemplateNotFoundError',
	          message: 'Cannot render the template since its false, null or undefined.'
	        });
	      }
	  
	      var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template);
	  
	      return templateFunc(data);
	    }
	  };
	  
	
	  /* jshint maxlen: 114, nonew: false */
	  // View
	  // ----
	  
	  // The core view class that other Marionette views extend from.
	  Marionette.View = Backbone.View.extend({
	    isDestroyed: false,
	    supportsRenderLifecycle: true,
	    supportsDestroyLifecycle: true,
	  
	    constructor: function(options) {
	      this.render = _.bind(this.render, this);
	  
	      options = Marionette._getValue(options, this);
	  
	      // this exposes view options to the view initializer
	      // this is a backfill since backbone removed the assignment
	      // of this.options
	      // at some point however this may be removed
	      this.options = _.extend({}, _.result(this, 'options'), options);
	  
	      this._behaviors = Marionette.Behaviors(this);
	  
	      Backbone.View.call(this, this.options);
	  
	      Marionette.MonitorDOMRefresh(this);
	    },
	  
	    // Get the template for this view
	    // instance. You can set a `template` attribute in the view
	    // definition or pass a `template: "whatever"` parameter in
	    // to the constructor options.
	    getTemplate: function() {
	      return this.getOption('template');
	    },
	  
	    // Serialize a model by returning its attributes. Clones
	    // the attributes to allow modification.
	    serializeModel: function(model) {
	      return model.toJSON.apply(model, _.rest(arguments));
	    },
	  
	    // Mix in template helper methods. Looks for a
	    // `templateHelpers` attribute, which can either be an
	    // object literal, or a function that returns an object
	    // literal. All methods and attributes from this object
	    // are copies to the object passed in.
	    mixinTemplateHelpers: function(target) {
	      target = target || {};
	      var templateHelpers = this.getOption('templateHelpers');
	      templateHelpers = Marionette._getValue(templateHelpers, this);
	      return _.extend(target, templateHelpers);
	    },
	  
	    // normalize the keys of passed hash with the views `ui` selectors.
	    // `{"@ui.foo": "bar"}`
	    normalizeUIKeys: function(hash) {
	      var uiBindings = _.result(this, '_uiBindings');
	      return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
	    },
	  
	    // normalize the values of passed hash with the views `ui` selectors.
	    // `{foo: "@ui.bar"}`
	    normalizeUIValues: function(hash, properties) {
	      var ui = _.result(this, 'ui');
	      var uiBindings = _.result(this, '_uiBindings');
	      return Marionette.normalizeUIValues(hash, uiBindings || ui, properties);
	    },
	  
	    // Configure `triggers` to forward DOM events to view
	    // events. `triggers: {"click .foo": "do:foo"}`
	    configureTriggers: function() {
	      if (!this.triggers) { return; }
	  
	      // Allow `triggers` to be configured as a function
	      var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));
	  
	      // Configure the triggers, prevent default
	      // action and stop propagation of DOM events
	      return _.reduce(triggers, function(events, value, key) {
	        events[key] = this._buildViewTrigger(value);
	        return events;
	      }, {}, this);
	    },
	  
	    // Overriding Backbone.View's delegateEvents to handle
	    // the `triggers`, `modelEvents`, and `collectionEvents` configuration
	    delegateEvents: function(events) {
	      this._delegateDOMEvents(events);
	      this.bindEntityEvents(this.model, this.getOption('modelEvents'));
	      this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
	  
	      _.each(this._behaviors, function(behavior) {
	        behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
	        behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
	      }, this);
	  
	      return this;
	    },
	  
	    // internal method to delegate DOM events and triggers
	    _delegateDOMEvents: function(eventsArg) {
	      var events = Marionette._getValue(eventsArg || this.events, this);
	  
	      // normalize ui keys
	      events = this.normalizeUIKeys(events);
	      if (_.isUndefined(eventsArg)) {this.events = events;}
	  
	      var combinedEvents = {};
	  
	      // look up if this view has behavior events
	      var behaviorEvents = _.result(this, 'behaviorEvents') || {};
	      var triggers = this.configureTriggers();
	      var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};
	  
	      // behavior events will be overriden by view events and or triggers
	      _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);
	  
	      Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
	    },
	  
	    // Overriding Backbone.View's undelegateEvents to handle unbinding
	    // the `triggers`, `modelEvents`, and `collectionEvents` config
	    undelegateEvents: function() {
	      Backbone.View.prototype.undelegateEvents.apply(this, arguments);
	  
	      this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
	      this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
	  
	      _.each(this._behaviors, function(behavior) {
	        behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
	        behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
	      }, this);
	  
	      return this;
	    },
	  
	    // Internal helper method to verify whether the view hasn't been destroyed
	    _ensureViewIsIntact: function() {
	      if (this.isDestroyed) {
	        throw new Marionette.Error({
	          name: 'ViewDestroyedError',
	          message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
	        });
	      }
	    },
	  
	    // Default `destroy` implementation, for removing a view from the
	    // DOM and unbinding it. Regions will call this method
	    // for you. You can specify an `onDestroy` method in your view to
	    // add custom code that is called after the view is destroyed.
	    destroy: function() {
	      if (this.isDestroyed) { return this; }
	  
	      var args = _.toArray(arguments);
	  
	      this.triggerMethod.apply(this, ['before:destroy'].concat(args));
	  
	      // mark as destroyed before doing the actual destroy, to
	      // prevent infinite loops within "destroy" event handlers
	      // that are trying to destroy other views
	      this.isDestroyed = true;
	      this.triggerMethod.apply(this, ['destroy'].concat(args));
	  
	      // unbind UI elements
	      this.unbindUIElements();
	  
	      this.isRendered = false;
	  
	      // remove the view from the DOM
	      this.remove();
	  
	      // Call destroy on each behavior after
	      // destroying the view.
	      // This unbinds event listeners
	      // that behaviors have registered for.
	      _.invoke(this._behaviors, 'destroy', args);
	  
	      return this;
	    },
	  
	    bindUIElements: function() {
	      this._bindUIElements();
	      _.invoke(this._behaviors, this._bindUIElements);
	    },
	  
	    // This method binds the elements specified in the "ui" hash inside the view's code with
	    // the associated jQuery selectors.
	    _bindUIElements: function() {
	      if (!this.ui) { return; }
	  
	      // store the ui hash in _uiBindings so they can be reset later
	      // and so re-rendering the view will be able to find the bindings
	      if (!this._uiBindings) {
	        this._uiBindings = this.ui;
	      }
	  
	      // get the bindings result, as a function or otherwise
	      var bindings = _.result(this, '_uiBindings');
	  
	      // empty the ui so we don't have anything to start with
	      this.ui = {};
	  
	      // bind each of the selectors
	      _.each(bindings, function(selector, key) {
	        this.ui[key] = this.$(selector);
	      }, this);
	    },
	  
	    // This method unbinds the elements specified in the "ui" hash
	    unbindUIElements: function() {
	      this._unbindUIElements();
	      _.invoke(this._behaviors, this._unbindUIElements);
	    },
	  
	    _unbindUIElements: function() {
	      if (!this.ui || !this._uiBindings) { return; }
	  
	      // delete all of the existing ui bindings
	      _.each(this.ui, function($el, name) {
	        delete this.ui[name];
	      }, this);
	  
	      // reset the ui element to the original bindings configuration
	      this.ui = this._uiBindings;
	      delete this._uiBindings;
	    },
	  
	    // Internal method to create an event handler for a given `triggerDef` like
	    // 'click:foo'
	    _buildViewTrigger: function(triggerDef) {
	  
	      var options = _.defaults({}, triggerDef, {
	        preventDefault: true,
	        stopPropagation: true
	      });
	  
	      var eventName = _.isObject(triggerDef) ? options.event : triggerDef;
	  
	      return function(e) {
	        if (e) {
	          if (e.preventDefault && options.preventDefault) {
	            e.preventDefault();
	          }
	  
	          if (e.stopPropagation && options.stopPropagation) {
	            e.stopPropagation();
	          }
	        }
	  
	        var args = {
	          view: this,
	          model: this.model,
	          collection: this.collection
	        };
	  
	        this.triggerMethod(eventName, args);
	      };
	    },
	  
	    setElement: function() {
	      var ret = Backbone.View.prototype.setElement.apply(this, arguments);
	  
	      // proxy behavior $el to the view's $el.
	      // This is needed because a view's $el proxy
	      // is not set until after setElement is called.
	      _.invoke(this._behaviors, 'proxyViewProperties', this);
	  
	      return ret;
	    },
	  
	    // import the `triggerMethod` to trigger events with corresponding
	    // methods if the method exists
	    triggerMethod: function() {
	      var ret = Marionette._triggerMethod(this, arguments);
	  
	      this._triggerEventOnBehaviors(arguments);
	      this._triggerEventOnParentLayout(arguments[0], _.rest(arguments));
	  
	      return ret;
	    },
	  
	    _triggerEventOnBehaviors: function(args) {
	      var triggerMethod = Marionette._triggerMethod;
	      var behaviors = this._behaviors;
	      // Use good ol' for as this is a very hot function
	      for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
	        triggerMethod(behaviors[i], args);
	      }
	    },
	  
	    _triggerEventOnParentLayout: function(eventName, args) {
	      var layoutView = this._parentLayoutView();
	      if (!layoutView) {
	        return;
	      }
	  
	      // invoke triggerMethod on parent view
	      var eventPrefix = Marionette.getOption(layoutView, 'childViewEventPrefix');
	      var prefixedEventName = eventPrefix + ':' + eventName;
	      var callArgs = [this].concat(args);
	  
	      Marionette._triggerMethod(layoutView, prefixedEventName, callArgs);
	  
	      // call the parent view's childEvents handler
	      var childEvents = Marionette.getOption(layoutView, 'childEvents');
	  
	      // since childEvents can be an object or a function use Marionette._getValue
	      // to handle the abstaction for us.
	      childEvents = Marionette._getValue(childEvents, layoutView);
	      var normalizedChildEvents = layoutView.normalizeMethods(childEvents);
	  
	      if (normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
	        normalizedChildEvents[eventName].apply(layoutView, callArgs);
	      }
	    },
	  
	    // This method returns any views that are immediate
	    // children of this view
	    _getImmediateChildren: function() {
	      return [];
	    },
	  
	    // Returns an array of every nested view within this view
	    _getNestedViews: function() {
	      var children = this._getImmediateChildren();
	  
	      if (!children.length) { return children; }
	  
	      return _.reduce(children, function(memo, view) {
	        if (!view._getNestedViews) { return memo; }
	        return memo.concat(view._getNestedViews());
	      }, children);
	    },
	  
	    // Walk the _parent tree until we find a layout view (if one exists).
	    // Returns the parent layout view hierarchically closest to this view.
	    _parentLayoutView: function() {
	      var parent  = this._parent;
	  
	      while (parent) {
	        if (parent instanceof Marionette.LayoutView) {
	          return parent;
	        }
	        parent = parent._parent;
	      }
	    },
	  
	    // Imports the "normalizeMethods" to transform hashes of
	    // events=>function references/names to a hash of events=>function references
	    normalizeMethods: Marionette.normalizeMethods,
	  
	    // A handy way to merge passed-in options onto the instance
	    mergeOptions: Marionette.mergeOptions,
	  
	    // Proxy `getOption` to enable getting options from this or this.options by name.
	    getOption: Marionette.proxyGetOption,
	  
	    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
	    bindEntityEvents: Marionette.proxyBindEntityEvents,
	  
	    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
	    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
	  });
	  
	  // Item View
	  // ---------
	  
	  // A single item view implementation that contains code for rendering
	  // with underscore.js templates, serializing the view's model or collection,
	  // and calling several methods on extended views, such as `onRender`.
	  Marionette.ItemView = Marionette.View.extend({
	  
	    // Setting up the inheritance chain which allows changes to
	    // Marionette.View.prototype.constructor which allows overriding
	    constructor: function() {
	      Marionette.View.apply(this, arguments);
	    },
	  
	    // Serialize the model or collection for the view. If a model is
	    // found, the view's `serializeModel` is called. If a collection is found,
	    // each model in the collection is serialized by calling
	    // the view's `serializeCollection` and put into an `items` array in
	    // the resulting data. If both are found, defaults to the model.
	    // You can override the `serializeData` method in your own view definition,
	    // to provide custom serialization for your view's data.
	    serializeData: function() {
	      if (!this.model && !this.collection) {
	        return {};
	      }
	  
	      var args = [this.model || this.collection];
	      if (arguments.length) {
	        args.push.apply(args, arguments);
	      }
	  
	      if (this.model) {
	        return this.serializeModel.apply(this, args);
	      } else {
	        return {
	          items: this.serializeCollection.apply(this, args)
	        };
	      }
	    },
	  
	    // Serialize a collection by serializing each of its models.
	    serializeCollection: function(collection) {
	      return collection.toJSON.apply(collection, _.rest(arguments));
	    },
	  
	    // Render the view, defaulting to underscore.js templates.
	    // You can override this in your view definition to provide
	    // a very specific rendering for your view. In general, though,
	    // you should override the `Marionette.Renderer` object to
	    // change how Marionette renders views.
	    render: function() {
	      this._ensureViewIsIntact();
	  
	      this.triggerMethod('before:render', this);
	  
	      this._renderTemplate();
	      this.isRendered = true;
	      this.bindUIElements();
	  
	      this.triggerMethod('render', this);
	  
	      return this;
	    },
	  
	    // Internal method to render the template with the serialized data
	    // and template helpers via the `Marionette.Renderer` object.
	    // Throws an `UndefinedTemplateError` error if the template is
	    // any falsely value but literal `false`.
	    _renderTemplate: function() {
	      var template = this.getTemplate();
	  
	      // Allow template-less item views
	      if (template === false) {
	        return;
	      }
	  
	      if (!template) {
	        throw new Marionette.Error({
	          name: 'UndefinedTemplateError',
	          message: 'Cannot render the template since it is null or undefined.'
	        });
	      }
	  
	      // Add in entity data and template helpers
	      var data = this.mixinTemplateHelpers(this.serializeData());
	  
	      // Render and add to el
	      var html = Marionette.Renderer.render(template, data, this);
	      this.attachElContent(html);
	  
	      return this;
	    },
	  
	    // Attaches the content of a given view.
	    // This method can be overridden to optimize rendering,
	    // or to render in a non standard way.
	    //
	    // For example, using `innerHTML` instead of `$el.html`
	    //
	    // ```js
	    // attachElContent: function(html) {
	    //   this.el.innerHTML = html;
	    //   return this;
	    // }
	    // ```
	    attachElContent: function(html) {
	      this.$el.html(html);
	  
	      return this;
	    }
	  });
	  
	  /* jshint maxstatements: 20, maxcomplexity: 7 */
	  
	  // Collection View
	  // ---------------
	  
	  // A view that iterates over a Backbone.Collection
	  // and renders an individual child view for each model.
	  Marionette.CollectionView = Marionette.View.extend({
	  
	    // used as the prefix for child view events
	    // that are forwarded through the collectionview
	    childViewEventPrefix: 'childview',
	  
	    // flag for maintaining the sorted order of the collection
	    sort: true,
	  
	    // constructor
	    // option to pass `{sort: false}` to prevent the `CollectionView` from
	    // maintaining the sorted order of the collection.
	    // This will fallback onto appending childView's to the end.
	    //
	    // option to pass `{comparator: compFunction()}` to allow the `CollectionView`
	    // to use a custom sort order for the collection.
	    constructor: function(options) {
	      this.once('render', this._initialEvents);
	      this._initChildViewStorage();
	  
	      Marionette.View.apply(this, arguments);
	  
	      this.on({
	        'before:show':   this._onBeforeShowCalled,
	        'show':          this._onShowCalled,
	        'before:attach': this._onBeforeAttachCalled,
	        'attach':        this._onAttachCalled
	      });
	      this.initRenderBuffer();
	    },
	  
	    // Instead of inserting elements one by one into the page,
	    // it's much more performant to insert elements into a document
	    // fragment and then insert that document fragment into the page
	    initRenderBuffer: function() {
	      this._bufferedChildren = [];
	    },
	  
	    startBuffering: function() {
	      this.initRenderBuffer();
	      this.isBuffering = true;
	    },
	  
	    endBuffering: function() {
	      // Only trigger attach if already shown and attached, otherwise Region#show() handles this.
	      var canTriggerAttach = this._isShown && Marionette.isNodeAttached(this.el);
	      var nestedViews;
	  
	      this.isBuffering = false;
	  
	      if (this._isShown) {
	        this._triggerMethodMany(this._bufferedChildren, this, 'before:show');
	      }
	      if (canTriggerAttach && this._triggerBeforeAttach) {
	        nestedViews = this._getNestedViews();
	        this._triggerMethodMany(nestedViews, this, 'before:attach');
	      }
	  
	      this.attachBuffer(this, this._createBuffer());
	  
	      if (canTriggerAttach && this._triggerAttach) {
	        nestedViews = this._getNestedViews();
	        this._triggerMethodMany(nestedViews, this, 'attach');
	      }
	      if (this._isShown) {
	        this._triggerMethodMany(this._bufferedChildren, this, 'show');
	      }
	      this.initRenderBuffer();
	    },
	  
	    _triggerMethodMany: function(targets, source, eventName) {
	      var args = _.drop(arguments, 3);
	  
	      _.each(targets, function(target) {
	        Marionette.triggerMethodOn.apply(target, [target, eventName, target, source].concat(args));
	      });
	    },
	  
	    // Configured the initial events that the collection view
	    // binds to.
	    _initialEvents: function() {
	      if (this.collection) {
	        this.listenTo(this.collection, 'add', this._onCollectionAdd);
	        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
	        this.listenTo(this.collection, 'reset', this.render);
	  
	        if (this.getOption('sort')) {
	          this.listenTo(this.collection, 'sort', this._sortViews);
	        }
	      }
	    },
	  
	    // Handle a child added to the collection
	    _onCollectionAdd: function(child, collection, opts) {
	      // `index` is present when adding with `at` since BB 1.2; indexOf fallback for < 1.2
	      var index = opts.at !== undefined && (opts.index || collection.indexOf(child));
	  
	      // When filtered or when there is no initial index, calculate index.
	      if (this.getOption('filter') || index === false) {
	        index = _.indexOf(this._filteredSortedModels(index), child);
	      }
	  
	      if (this._shouldAddChild(child, index)) {
	        this.destroyEmptyView();
	        var ChildView = this.getChildView(child);
	        this.addChild(child, ChildView, index);
	      }
	    },
	  
	    // get the child view by model it holds, and remove it
	    _onCollectionRemove: function(model) {
	      var view = this.children.findByModel(model);
	      this.removeChildView(view);
	      this.checkEmpty();
	    },
	  
	    _onBeforeShowCalled: function() {
	      // Reset attach event flags at the top of the Region#show() event lifecycle; if the Region's
	      // show() options permit onBeforeAttach/onAttach events, these flags will be set true again.
	      this._triggerBeforeAttach = this._triggerAttach = false;
	      this.children.each(function(childView) {
	        Marionette.triggerMethodOn(childView, 'before:show', childView);
	      });
	    },
	  
	    _onShowCalled: function() {
	      this.children.each(function(childView) {
	        Marionette.triggerMethodOn(childView, 'show', childView);
	      });
	    },
	  
	    // If during Region#show() onBeforeAttach was fired, continue firing it for child views
	    _onBeforeAttachCalled: function() {
	      this._triggerBeforeAttach = true;
	    },
	  
	    // If during Region#show() onAttach was fired, continue firing it for child views
	    _onAttachCalled: function() {
	      this._triggerAttach = true;
	    },
	  
	    // Render children views. Override this method to
	    // provide your own implementation of a render function for
	    // the collection view.
	    render: function() {
	      this._ensureViewIsIntact();
	      this.triggerMethod('before:render', this);
	      this._renderChildren();
	      this.isRendered = true;
	      this.triggerMethod('render', this);
	      return this;
	    },
	  
	    // Reorder DOM after sorting. When your element's rendering
	    // do not use their index, you can pass reorderOnSort: true
	    // to only reorder the DOM after a sort instead of rendering
	    // all the collectionView
	    reorder: function() {
	      var children = this.children;
	      var models = this._filteredSortedModels();
	  
	      if (!models.length && this._showingEmptyView) { return this; }
	  
	      var anyModelsAdded = _.some(models, function(model) {
	        return !children.findByModel(model);
	      });
	  
	      // If there are any new models added due to filtering
	      // We need to add child views
	      // So render as normal
	      if (anyModelsAdded) {
	        this.render();
	      } else {
	        // get the DOM nodes in the same order as the models
	        var elsToReorder = _.map(models, function(model, index) {
	          var view = children.findByModel(model);
	          view._index = index;
	          return view.el;
	        });
	  
	        // find the views that were children before but arent in this new ordering
	        var filteredOutViews = children.filter(function(view) {
	          return !_.contains(elsToReorder, view.el);
	        });
	  
	        this.triggerMethod('before:reorder');
	  
	        // since append moves elements that are already in the DOM,
	        // appending the elements will effectively reorder them
	        this._appendReorderedChildren(elsToReorder);
	  
	        // remove any views that have been filtered out
	        _.each(filteredOutViews, this.removeChildView, this);
	        this.checkEmpty();
	  
	        this.triggerMethod('reorder');
	      }
	    },
	  
	    // Render view after sorting. Override this method to
	    // change how the view renders after a `sort` on the collection.
	    // An example of this would be to only `renderChildren` in a `CompositeView`
	    // rather than the full view.
	    resortView: function() {
	      if (Marionette.getOption(this, 'reorderOnSort')) {
	        this.reorder();
	      } else {
	        this.render();
	      }
	    },
	  
	    // Internal method. This checks for any changes in the order of the collection.
	    // If the index of any view doesn't match, it will render.
	    _sortViews: function() {
	      var models = this._filteredSortedModels();
	  
	      // check for any changes in sort order of views
	      var orderChanged = _.find(models, function(item, index) {
	        var view = this.children.findByModel(item);
	        return !view || view._index !== index;
	      }, this);
	  
	      if (orderChanged) {
	        this.resortView();
	      }
	    },
	  
	    // Internal reference to what index a `emptyView` is.
	    _emptyViewIndex: -1,
	  
	    // Internal method. Separated so that CompositeView can append to the childViewContainer
	    // if necessary
	    _appendReorderedChildren: function(children) {
	      this.$el.append(children);
	    },
	  
	    // Internal method. Separated so that CompositeView can have
	    // more control over events being triggered, around the rendering
	    // process
	    _renderChildren: function() {
	      this.destroyEmptyView();
	      this.destroyChildren({checkEmpty: false});
	  
	      if (this.isEmpty(this.collection)) {
	        this.showEmptyView();
	      } else {
	        this.triggerMethod('before:render:collection', this);
	        this.startBuffering();
	        this.showCollection();
	        this.endBuffering();
	        this.triggerMethod('render:collection', this);
	  
	        // If we have shown children and none have passed the filter, show the empty view
	        if (this.children.isEmpty() && this.getOption('filter')) {
	          this.showEmptyView();
	        }
	      }
	    },
	  
	    // Internal method to loop through collection and show each child view.
	    showCollection: function() {
	      var ChildView;
	  
	      var models = this._filteredSortedModels();
	  
	      _.each(models, function(child, index) {
	        ChildView = this.getChildView(child);
	        this.addChild(child, ChildView, index);
	      }, this);
	    },
	  
	    // Allow the collection to be sorted by a custom view comparator
	    _filteredSortedModels: function(addedAt) {
	      var viewComparator = this.getViewComparator();
	      var models = this.collection.models;
	      addedAt = Math.min(Math.max(addedAt, 0), models.length - 1);
	  
	      if (viewComparator) {
	        var addedModel;
	        // Preserve `at` location, even for a sorted view
	        if (addedAt) {
	          addedModel = models[addedAt];
	          models = models.slice(0, addedAt).concat(models.slice(addedAt + 1));
	        }
	        models = this._sortModelsBy(models, viewComparator);
	        if (addedModel) {
	          models.splice(addedAt, 0, addedModel);
	        }
	      }
	  
	      // Filter after sorting in case the filter uses the index
	      if (this.getOption('filter')) {
	        models = _.filter(models, function(model, index) {
	          return this._shouldAddChild(model, index);
	        }, this);
	      }
	  
	      return models;
	    },
	  
	    _sortModelsBy: function(models, comparator) {
	      if (typeof comparator === 'string') {
	        return _.sortBy(models, function(model) {
	          return model.get(comparator);
	        }, this);
	      } else if (comparator.length === 1) {
	        return _.sortBy(models, comparator, this);
	      } else {
	        return models.sort(_.bind(comparator, this));
	      }
	    },
	  
	    // Internal method to show an empty view in place of
	    // a collection of child views, when the collection is empty
	    showEmptyView: function() {
	      var EmptyView = this.getEmptyView();
	  
	      if (EmptyView && !this._showingEmptyView) {
	        this.triggerMethod('before:render:empty');
	  
	        this._showingEmptyView = true;
	        var model = new Backbone.Model();
	        this.addEmptyView(model, EmptyView);
	  
	        this.triggerMethod('render:empty');
	      }
	    },
	  
	    // Internal method to destroy an existing emptyView instance
	    // if one exists. Called when a collection view has been
	    // rendered empty, and then a child is added to the collection.
	    destroyEmptyView: function() {
	      if (this._showingEmptyView) {
	        this.triggerMethod('before:remove:empty');
	  
	        this.destroyChildren();
	        delete this._showingEmptyView;
	  
	        this.triggerMethod('remove:empty');
	      }
	    },
	  
	    // Retrieve the empty view class
	    getEmptyView: function() {
	      return this.getOption('emptyView');
	    },
	  
	    // Render and show the emptyView. Similar to addChild method
	    // but "add:child" events are not fired, and the event from
	    // emptyView are not forwarded
	    addEmptyView: function(child, EmptyView) {
	      // Only trigger attach if already shown, attached, and not buffering, otherwise endBuffer() or
	      // Region#show() handles this.
	      var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
	      var nestedViews;
	  
	      // get the emptyViewOptions, falling back to childViewOptions
	      var emptyViewOptions = this.getOption('emptyViewOptions') ||
	                            this.getOption('childViewOptions');
	  
	      if (_.isFunction(emptyViewOptions)) {
	        emptyViewOptions = emptyViewOptions.call(this, child, this._emptyViewIndex);
	      }
	  
	      // build the empty view
	      var view = this.buildChildView(child, EmptyView, emptyViewOptions);
	  
	      view._parent = this;
	  
	      // Proxy emptyView events
	      this.proxyChildEvents(view);
	  
	      view.once('render', function() {
	        // trigger the 'before:show' event on `view` if the collection view has already been shown
	        if (this._isShown) {
	          Marionette.triggerMethodOn(view, 'before:show', view);
	        }
	  
	        // Trigger `before:attach` following `render` to avoid adding logic and event triggers
	        // to public method `renderChildView()`.
	        if (canTriggerAttach && this._triggerBeforeAttach) {
	          nestedViews = this._getViewAndNested(view);
	          this._triggerMethodMany(nestedViews, this, 'before:attach');
	        }
	      }, this);
	  
	      // Store the `emptyView` like a `childView` so we can properly remove and/or close it later
	      this.children.add(view);
	      this.renderChildView(view, this._emptyViewIndex);
	  
	      // Trigger `attach`
	      if (canTriggerAttach && this._triggerAttach) {
	        nestedViews = this._getViewAndNested(view);
	        this._triggerMethodMany(nestedViews, this, 'attach');
	      }
	      // call the 'show' method if the collection view has already been shown
	      if (this._isShown) {
	        Marionette.triggerMethodOn(view, 'show', view);
	      }
	    },
	  
	    // Retrieve the `childView` class, either from `this.options.childView`
	    // or from the `childView` in the object definition. The "options"
	    // takes precedence.
	    // This method receives the model that will be passed to the instance
	    // created from this `childView`. Overriding methods may use the child
	    // to determine what `childView` class to return.
	    getChildView: function(child) {
	      var childView = this.getOption('childView');
	  
	      if (!childView) {
	        throw new Marionette.Error({
	          name: 'NoChildViewError',
	          message: 'A "childView" must be specified'
	        });
	      }
	  
	      return childView;
	    },
	  
	    // Render the child's view and add it to the
	    // HTML for the collection view at a given index.
	    // This will also update the indices of later views in the collection
	    // in order to keep the children in sync with the collection.
	    addChild: function(child, ChildView, index) {
	      var childViewOptions = this.getOption('childViewOptions');
	      childViewOptions = Marionette._getValue(childViewOptions, this, [child, index]);
	  
	      var view = this.buildChildView(child, ChildView, childViewOptions);
	  
	      // increment indices of views after this one
	      this._updateIndices(view, true, index);
	  
	      this.triggerMethod('before:add:child', view);
	      this._addChildView(view, index);
	      this.triggerMethod('add:child', view);
	  
	      view._parent = this;
	  
	      return view;
	    },
	  
	    // Internal method. This decrements or increments the indices of views after the
	    // added/removed view to keep in sync with the collection.
	    _updateIndices: function(view, increment, index) {
	      if (!this.getOption('sort')) {
	        return;
	      }
	  
	      if (increment) {
	        // assign the index to the view
	        view._index = index;
	      }
	  
	      // update the indexes of views after this one
	      this.children.each(function(laterView) {
	        if (laterView._index >= view._index) {
	          laterView._index += increment ? 1 : -1;
	        }
	      });
	    },
	  
	    // Internal Method. Add the view to children and render it at
	    // the given index.
	    _addChildView: function(view, index) {
	      // Only trigger attach if already shown, attached, and not buffering, otherwise endBuffer() or
	      // Region#show() handles this.
	      var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
	      var nestedViews;
	  
	      // set up the child view event forwarding
	      this.proxyChildEvents(view);
	  
	      view.once('render', function() {
	        // trigger the 'before:show' event on `view` if the collection view has already been shown
	        if (this._isShown && !this.isBuffering) {
	          Marionette.triggerMethodOn(view, 'before:show', view);
	        }
	  
	        // Trigger `before:attach` following `render` to avoid adding logic and event triggers
	        // to public method `renderChildView()`.
	        if (canTriggerAttach && this._triggerBeforeAttach) {
	          nestedViews = this._getViewAndNested(view);
	          this._triggerMethodMany(nestedViews, this, 'before:attach');
	        }
	      }, this);
	  
	      // Store the child view itself so we can properly remove and/or destroy it later
	      this.children.add(view);
	      this.renderChildView(view, index);
	  
	      // Trigger `attach`
	      if (canTriggerAttach && this._triggerAttach) {
	        nestedViews = this._getViewAndNested(view);
	        this._triggerMethodMany(nestedViews, this, 'attach');
	      }
	      // Trigger `show`
	      if (this._isShown && !this.isBuffering) {
	        Marionette.triggerMethodOn(view, 'show', view);
	      }
	    },
	  
	    // render the child view
	    renderChildView: function(view, index) {
	      if (!view.supportsRenderLifecycle) {
	        Marionette.triggerMethodOn(view, 'before:render', view);
	      }
	      view.render();
	      if (!view.supportsRenderLifecycle) {
	        Marionette.triggerMethodOn(view, 'render', view);
	      }
	      this.attachHtml(this, view, index);
	      return view;
	    },
	  
	    // Build a `childView` for a model in the collection.
	    buildChildView: function(child, ChildViewClass, childViewOptions) {
	      var options = _.extend({model: child}, childViewOptions);
	      var childView = new ChildViewClass(options);
	      Marionette.MonitorDOMRefresh(childView);
	      return childView;
	    },
	  
	    // Remove the child view and destroy it.
	    // This function also updates the indices of
	    // later views in the collection in order to keep
	    // the children in sync with the collection.
	    removeChildView: function(view) {
	      if (!view) { return view; }
	  
	      this.triggerMethod('before:remove:child', view);
	  
	      if (!view.supportsDestroyLifecycle) {
	        Marionette.triggerMethodOn(view, 'before:destroy', view);
	      }
	      // call 'destroy' or 'remove', depending on which is found
	      if (view.destroy) {
	        view.destroy();
	      } else {
	        view.remove();
	      }
	      if (!view.supportsDestroyLifecycle) {
	        Marionette.triggerMethodOn(view, 'destroy', view);
	      }
	  
	      delete view._parent;
	      this.stopListening(view);
	      this.children.remove(view);
	      this.triggerMethod('remove:child', view);
	  
	      // decrement the index of views after this one
	      this._updateIndices(view, false);
	  
	      return view;
	    },
	  
	    // check if the collection is empty
	    isEmpty: function() {
	      return !this.collection || this.collection.length === 0;
	    },
	  
	    // If empty, show the empty view
	    checkEmpty: function() {
	      if (this.isEmpty(this.collection)) {
	        this.showEmptyView();
	      }
	    },
	  
	    // You might need to override this if you've overridden attachHtml
	    attachBuffer: function(collectionView, buffer) {
	      collectionView.$el.append(buffer);
	    },
	  
	    // Create a fragment buffer from the currently buffered children
	    _createBuffer: function() {
	      var elBuffer = document.createDocumentFragment();
	      _.each(this._bufferedChildren, function(b) {
	        elBuffer.appendChild(b.el);
	      });
	      return elBuffer;
	    },
	  
	    // Append the HTML to the collection's `el`.
	    // Override this method to do something other
	    // than `.append`.
	    attachHtml: function(collectionView, childView, index) {
	      if (collectionView.isBuffering) {
	        // buffering happens on reset events and initial renders
	        // in order to reduce the number of inserts into the
	        // document, which are expensive.
	        collectionView._bufferedChildren.splice(index, 0, childView);
	      } else {
	        // If we've already rendered the main collection, append
	        // the new child into the correct order if we need to. Otherwise
	        // append to the end.
	        if (!collectionView._insertBefore(childView, index)) {
	          collectionView._insertAfter(childView);
	        }
	      }
	    },
	  
	    // Internal method. Check whether we need to insert the view into
	    // the correct position.
	    _insertBefore: function(childView, index) {
	      var currentView;
	      var findPosition = this.getOption('sort') && (index < this.children.length - 1);
	      if (findPosition) {
	        // Find the view after this one
	        currentView = this.children.find(function(view) {
	          return view._index === index + 1;
	        });
	      }
	  
	      if (currentView) {
	        currentView.$el.before(childView.el);
	        return true;
	      }
	  
	      return false;
	    },
	  
	    // Internal method. Append a view to the end of the $el
	    _insertAfter: function(childView) {
	      this.$el.append(childView.el);
	    },
	  
	    // Internal method to set up the `children` object for
	    // storing all of the child views
	    _initChildViewStorage: function() {
	      this.children = new Backbone.ChildViewContainer();
	    },
	  
	    // Handle cleanup and other destroying needs for the collection of views
	    destroy: function() {
	      if (this.isDestroyed) { return this; }
	  
	      this.triggerMethod('before:destroy:collection');
	      this.destroyChildren({checkEmpty: false});
	      this.triggerMethod('destroy:collection');
	  
	      return Marionette.View.prototype.destroy.apply(this, arguments);
	    },
	  
	    // Destroy the child views that this collection view
	    // is holding on to, if any
	    destroyChildren: function(options) {
	      var destroyOptions = options || {};
	      var shouldCheckEmpty = true;
	      var childViews = this.children.map(_.identity);
	  
	      if (!_.isUndefined(destroyOptions.checkEmpty)) {
	        shouldCheckEmpty = destroyOptions.checkEmpty;
	      }
	  
	      this.children.each(this.removeChildView, this);
	  
	      if (shouldCheckEmpty) {
	        this.checkEmpty();
	      }
	      return childViews;
	    },
	  
	    // Return true if the given child should be shown
	    // Return false otherwise
	    // The filter will be passed (child, index, collection)
	    // Where
	    //  'child' is the given model
	    //  'index' is the index of that model in the collection
	    //  'collection' is the collection referenced by this CollectionView
	    _shouldAddChild: function(child, index) {
	      var filter = this.getOption('filter');
	      return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
	    },
	  
	    // Set up the child view event forwarding. Uses a "childview:"
	    // prefix in front of all forwarded events.
	    proxyChildEvents: function(view) {
	      var prefix = this.getOption('childViewEventPrefix');
	  
	      // Forward all child view events through the parent,
	      // prepending "childview:" to the event name
	      this.listenTo(view, 'all', function() {
	        var args = _.toArray(arguments);
	        var rootEvent = args[0];
	        var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));
	  
	        args[0] = prefix + ':' + rootEvent;
	        args.splice(1, 0, view);
	  
	        // call collectionView childEvent if defined
	        if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
	          childEvents[rootEvent].apply(this, args.slice(1));
	        }
	  
	        this.triggerMethod.apply(this, args);
	      });
	    },
	  
	    _getImmediateChildren: function() {
	      return _.values(this.children._views);
	    },
	  
	    _getViewAndNested: function(view) {
	      // This will not fail on Backbone.View which does not have #_getNestedViews.
	      return [view].concat(_.result(view, '_getNestedViews') || []);
	    },
	  
	    getViewComparator: function() {
	      return this.getOption('viewComparator');
	    }
	  });
	  
	  /* jshint maxstatements: 17, maxlen: 117 */
	  
	  // Composite View
	  // --------------
	  
	  // Used for rendering a branch-leaf, hierarchical structure.
	  // Extends directly from CollectionView and also renders an
	  // a child view as `modelView`, for the top leaf
	  Marionette.CompositeView = Marionette.CollectionView.extend({
	  
	    // Setting up the inheritance chain which allows changes to
	    // Marionette.CollectionView.prototype.constructor which allows overriding
	    // option to pass '{sort: false}' to prevent the CompositeView from
	    // maintaining the sorted order of the collection.
	    // This will fallback onto appending childView's to the end.
	    constructor: function() {
	      Marionette.CollectionView.apply(this, arguments);
	    },
	  
	    // Configured the initial events that the composite view
	    // binds to. Override this method to prevent the initial
	    // events, or to add your own initial events.
	    _initialEvents: function() {
	  
	      // Bind only after composite view is rendered to avoid adding child views
	      // to nonexistent childViewContainer
	  
	      if (this.collection) {
	        this.listenTo(this.collection, 'add', this._onCollectionAdd);
	        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
	        this.listenTo(this.collection, 'reset', this._renderChildren);
	  
	        if (this.getOption('sort')) {
	          this.listenTo(this.collection, 'sort', this._sortViews);
	        }
	      }
	    },
	  
	    // Retrieve the `childView` to be used when rendering each of
	    // the items in the collection. The default is to return
	    // `this.childView` or Marionette.CompositeView if no `childView`
	    // has been defined
	    getChildView: function(child) {
	      var childView = this.getOption('childView') || this.constructor;
	  
	      return childView;
	    },
	  
	    // Serialize the model for the view.
	    // You can override the `serializeData` method in your own view
	    // definition, to provide custom serialization for your view's data.
	    serializeData: function() {
	      var data = {};
	  
	      if (this.model) {
	        data = _.partial(this.serializeModel, this.model).apply(this, arguments);
	      }
	  
	      return data;
	    },
	  
	    // Renders the model and the collection.
	    render: function() {
	      this._ensureViewIsIntact();
	      this._isRendering = true;
	      this.resetChildViewContainer();
	  
	      this.triggerMethod('before:render', this);
	  
	      this._renderTemplate();
	      this._renderChildren();
	  
	      this._isRendering = false;
	      this.isRendered = true;
	      this.triggerMethod('render', this);
	      return this;
	    },
	  
	    _renderChildren: function() {
	      if (this.isRendered || this._isRendering) {
	        Marionette.CollectionView.prototype._renderChildren.call(this);
	      }
	    },
	  
	    // Render the root template that the children
	    // views are appended to
	    _renderTemplate: function() {
	      var data = {};
	      data = this.serializeData();
	      data = this.mixinTemplateHelpers(data);
	  
	      this.triggerMethod('before:render:template');
	  
	      var template = this.getTemplate();
	      var html = Marionette.Renderer.render(template, data, this);
	      this.attachElContent(html);
	  
	      // the ui bindings is done here and not at the end of render since they
	      // will not be available until after the model is rendered, but should be
	      // available before the collection is rendered.
	      this.bindUIElements();
	      this.triggerMethod('render:template');
	    },
	  
	    // Attaches the content of the root.
	    // This method can be overridden to optimize rendering,
	    // or to render in a non standard way.
	    //
	    // For example, using `innerHTML` instead of `$el.html`
	    //
	    // ```js
	    // attachElContent: function(html) {
	    //   this.el.innerHTML = html;
	    //   return this;
	    // }
	    // ```
	    attachElContent: function(html) {
	      this.$el.html(html);
	  
	      return this;
	    },
	  
	    // You might need to override this if you've overridden attachHtml
	    attachBuffer: function(compositeView, buffer) {
	      var $container = this.getChildViewContainer(compositeView);
	      $container.append(buffer);
	    },
	  
	    // Internal method. Append a view to the end of the $el.
	    // Overidden from CollectionView to ensure view is appended to
	    // childViewContainer
	    _insertAfter: function(childView) {
	      var $container = this.getChildViewContainer(this, childView);
	      $container.append(childView.el);
	    },
	  
	    // Internal method. Append reordered childView'.
	    // Overidden from CollectionView to ensure reordered views
	    // are appended to childViewContainer
	    _appendReorderedChildren: function(children) {
	      var $container = this.getChildViewContainer(this);
	      $container.append(children);
	    },
	  
	    // Internal method to ensure an `$childViewContainer` exists, for the
	    // `attachHtml` method to use.
	    getChildViewContainer: function(containerView, childView) {
	      if (!!containerView.$childViewContainer) {
	        return containerView.$childViewContainer;
	      }
	  
	      var container;
	      var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
	      if (childViewContainer) {
	  
	        var selector = Marionette._getValue(childViewContainer, containerView);
	  
	        if (selector.charAt(0) === '@' && containerView.ui) {
	          container = containerView.ui[selector.substr(4)];
	        } else {
	          container = containerView.$(selector);
	        }
	  
	        if (container.length <= 0) {
	          throw new Marionette.Error({
	            name: 'ChildViewContainerMissingError',
	            message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
	          });
	        }
	  
	      } else {
	        container = containerView.$el;
	      }
	  
	      containerView.$childViewContainer = container;
	      return container;
	    },
	  
	    // Internal method to reset the `$childViewContainer` on render
	    resetChildViewContainer: function() {
	      if (this.$childViewContainer) {
	        this.$childViewContainer = undefined;
	      }
	    }
	  });
	  
	  // Layout View
	  // -----------
	  
	  // Used for managing application layoutViews, nested layoutViews and
	  // multiple regions within an application or sub-application.
	  //
	  // A specialized view class that renders an area of HTML and then
	  // attaches `Region` instances to the specified `regions`.
	  // Used for composite view management and sub-application areas.
	  Marionette.LayoutView = Marionette.ItemView.extend({
	    regionClass: Marionette.Region,
	  
	    options: {
	      destroyImmediate: false
	    },
	  
	    // used as the prefix for child view events
	    // that are forwarded through the layoutview
	    childViewEventPrefix: 'childview',
	  
	    // Ensure the regions are available when the `initialize` method
	    // is called.
	    constructor: function(options) {
	      options = options || {};
	  
	      this._firstRender = true;
	      this._initializeRegions(options);
	  
	      Marionette.ItemView.call(this, options);
	    },
	  
	    // LayoutView's render will use the existing region objects the
	    // first time it is called. Subsequent calls will destroy the
	    // views that the regions are showing and then reset the `el`
	    // for the regions to the newly rendered DOM elements.
	    render: function() {
	      this._ensureViewIsIntact();
	  
	      if (this._firstRender) {
	        // if this is the first render, don't do anything to
	        // reset the regions
	        this._firstRender = false;
	      } else {
	        // If this is not the first render call, then we need to
	        // re-initialize the `el` for each region
	        this._reInitializeRegions();
	      }
	  
	      return Marionette.ItemView.prototype.render.apply(this, arguments);
	    },
	  
	    // Handle destroying regions, and then destroy the view itself.
	    destroy: function() {
	      if (this.isDestroyed) { return this; }
	      // #2134: remove parent element before destroying the child views, so
	      // removing the child views doesn't retrigger repaints
	      if (this.getOption('destroyImmediate') === true) {
	        this.$el.remove();
	      }
	      this.regionManager.destroy();
	      return Marionette.ItemView.prototype.destroy.apply(this, arguments);
	    },
	  
	    showChildView: function(regionName, view, options) {
	      var region = this.getRegion(regionName);
	      return region.show.apply(region, _.rest(arguments));
	    },
	  
	    getChildView: function(regionName) {
	      return this.getRegion(regionName).currentView;
	    },
	  
	    // Add a single region, by name, to the layoutView
	    addRegion: function(name, definition) {
	      var regions = {};
	      regions[name] = definition;
	      return this._buildRegions(regions)[name];
	    },
	  
	    // Add multiple regions as a {name: definition, name2: def2} object literal
	    addRegions: function(regions) {
	      this.regions = _.extend({}, this.regions, regions);
	      return this._buildRegions(regions);
	    },
	  
	    // Remove a single region from the LayoutView, by name
	    removeRegion: function(name) {
	      delete this.regions[name];
	      return this.regionManager.removeRegion(name);
	    },
	  
	    // Provides alternative access to regions
	    // Accepts the region name
	    // getRegion('main')
	    getRegion: function(region) {
	      return this.regionManager.get(region);
	    },
	  
	    // Get all regions
	    getRegions: function() {
	      return this.regionManager.getRegions();
	    },
	  
	    // internal method to build regions
	    _buildRegions: function(regions) {
	      var defaults = {
	        regionClass: this.getOption('regionClass'),
	        parentEl: _.partial(_.result, this, 'el')
	      };
	  
	      return this.regionManager.addRegions(regions, defaults);
	    },
	  
	    // Internal method to initialize the regions that have been defined in a
	    // `regions` attribute on this layoutView.
	    _initializeRegions: function(options) {
	      var regions;
	      this._initRegionManager();
	  
	      regions = Marionette._getValue(this.regions, this, [options]) || {};
	  
	      // Enable users to define `regions` as instance options.
	      var regionOptions = this.getOption.call(options, 'regions');
	  
	      // enable region options to be a function
	      regionOptions = Marionette._getValue(regionOptions, this, [options]);
	  
	      _.extend(regions, regionOptions);
	  
	      // Normalize region selectors hash to allow
	      // a user to use the @ui. syntax.
	      regions = this.normalizeUIValues(regions, ['selector', 'el']);
	  
	      this.addRegions(regions);
	    },
	  
	    // Internal method to re-initialize all of the regions by updating the `el` that
	    // they point to
	    _reInitializeRegions: function() {
	      this.regionManager.invoke('reset');
	    },
	  
	    // Enable easy overriding of the default `RegionManager`
	    // for customized region interactions and business specific
	    // view logic for better control over single regions.
	    getRegionManager: function() {
	      return new Marionette.RegionManager();
	    },
	  
	    // Internal method to initialize the region manager
	    // and all regions in it
	    _initRegionManager: function() {
	      this.regionManager = this.getRegionManager();
	      this.regionManager._parent = this;
	  
	      this.listenTo(this.regionManager, 'before:add:region', function(name) {
	        this.triggerMethod('before:add:region', name);
	      });
	  
	      this.listenTo(this.regionManager, 'add:region', function(name, region) {
	        this[name] = region;
	        this.triggerMethod('add:region', name, region);
	      });
	  
	      this.listenTo(this.regionManager, 'before:remove:region', function(name) {
	        this.triggerMethod('before:remove:region', name);
	      });
	  
	      this.listenTo(this.regionManager, 'remove:region', function(name, region) {
	        delete this[name];
	        this.triggerMethod('remove:region', name, region);
	      });
	    },
	  
	    _getImmediateChildren: function() {
	      return _.chain(this.regionManager.getRegions())
	        .pluck('currentView')
	        .compact()
	        .value();
	    }
	  });
	  
	
	  // Behavior
	  // --------
	  
	  // A Behavior is an isolated set of DOM /
	  // user interactions that can be mixed into any View.
	  // Behaviors allow you to blackbox View specific interactions
	  // into portable logical chunks, keeping your views simple and your code DRY.
	  
	  Marionette.Behavior = Marionette.Object.extend({
	    constructor: function(options, view) {
	      // Setup reference to the view.
	      // this comes in handle when a behavior
	      // wants to directly talk up the chain
	      // to the view.
	      this.view = view;
	      this.defaults = _.result(this, 'defaults') || {};
	      this.options  = _.extend({}, this.defaults, options);
	      // Construct an internal UI hash using
	      // the views UI hash and then the behaviors UI hash.
	      // This allows the user to use UI hash elements
	      // defined in the parent view as well as those
	      // defined in the given behavior.
	      this.ui = _.extend({}, _.result(view, 'ui'), _.result(this, 'ui'));
	  
	      Marionette.Object.apply(this, arguments);
	    },
	  
	    // proxy behavior $ method to the view
	    // this is useful for doing jquery DOM lookups
	    // scoped to behaviors view.
	    $: function() {
	      return this.view.$.apply(this.view, arguments);
	    },
	  
	    // Stops the behavior from listening to events.
	    // Overrides Object#destroy to prevent additional events from being triggered.
	    destroy: function() {
	      this.stopListening();
	  
	      return this;
	    },
	  
	    proxyViewProperties: function(view) {
	      this.$el = view.$el;
	      this.el = view.el;
	    }
	  });
	  
	  /* jshint maxlen: 143 */
	  // Behaviors
	  // ---------
	  
	  // Behaviors is a utility class that takes care of
	  // gluing your behavior instances to their given View.
	  // The most important part of this class is that you
	  // **MUST** override the class level behaviorsLookup
	  // method for things to work properly.
	  
	  Marionette.Behaviors = (function(Marionette, _) {
	    // Borrow event splitter from Backbone
	    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
	  
	    function Behaviors(view, behaviors) {
	  
	      if (!_.isObject(view.behaviors)) {
	        return {};
	      }
	  
	      // Behaviors defined on a view can be a flat object literal
	      // or it can be a function that returns an object.
	      behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));
	  
	      // Wraps several of the view's methods
	      // calling the methods first on each behavior
	      // and then eventually calling the method on the view.
	      Behaviors.wrap(view, behaviors, _.keys(methods));
	      return behaviors;
	    }
	  
	    var methods = {
	      behaviorTriggers: function(behaviorTriggers, behaviors) {
	        var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
	        return triggerBuilder.buildBehaviorTriggers();
	      },
	  
	      behaviorEvents: function(behaviorEvents, behaviors) {
	        var _behaviorsEvents = {};
	  
	        _.each(behaviors, function(b, i) {
	          var _events = {};
	          var behaviorEvents = _.clone(_.result(b, 'events')) || {};
	  
	          // Normalize behavior events hash to allow
	          // a user to use the @ui. syntax.
	          behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));
	  
	          var j = 0;
	          _.each(behaviorEvents, function(behaviour, key) {
	            var match     = key.match(delegateEventSplitter);
	  
	            // Set event name to be namespaced using the view cid,
	            // the behavior index, and the behavior event index
	            // to generate a non colliding event namespace
	            // http://api.jquery.com/event.namespace/
	            var eventName = match[1] + '.' + [this.cid, i, j++, ' '].join('');
	            var selector  = match[2];
	  
	            var eventKey  = eventName + selector;
	            var handler   = _.isFunction(behaviour) ? behaviour : b[behaviour];
	            if (!handler) { return; }
	            _events[eventKey] = _.bind(handler, b);
	          }, this);
	  
	          _behaviorsEvents = _.extend(_behaviorsEvents, _events);
	        }, this);
	  
	        return _behaviorsEvents;
	      }
	    };
	  
	    _.extend(Behaviors, {
	  
	      // Placeholder method to be extended by the user.
	      // The method should define the object that stores the behaviors.
	      // i.e.
	      //
	      // ```js
	      // Marionette.Behaviors.behaviorsLookup: function() {
	      //   return App.Behaviors
	      // }
	      // ```
	      behaviorsLookup: function() {
	        throw new Marionette.Error({
	          message: 'You must define where your behaviors are stored.',
	          url: 'marionette.behaviors.html#behaviorslookup'
	        });
	      },
	  
	      // Takes care of getting the behavior class
	      // given options and a key.
	      // If a user passes in options.behaviorClass
	      // default to using that. Otherwise delegate
	      // the lookup to the users `behaviorsLookup` implementation.
	      getBehaviorClass: function(options, key) {
	        if (options.behaviorClass) {
	          return options.behaviorClass;
	        }
	  
	        // Get behavior class can be either a flat object or a method
	        return Marionette._getValue(Behaviors.behaviorsLookup, this, [options, key])[key];
	      },
	  
	      // Iterate over the behaviors object, for each behavior
	      // instantiate it and get its grouped behaviors.
	      parseBehaviors: function(view, behaviors) {
	        return _.chain(behaviors).map(function(options, key) {
	          var BehaviorClass = Behaviors.getBehaviorClass(options, key);
	  
	          var behavior = new BehaviorClass(options, view);
	          var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));
	  
	          return [behavior].concat(nestedBehaviors);
	        }).flatten().value();
	      },
	  
	      // Wrap view internal methods so that they delegate to behaviors. For example,
	      // `onDestroy` should trigger destroy on all of the behaviors and then destroy itself.
	      // i.e.
	      //
	      // `view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);`
	      wrap: function(view, behaviors, methodNames) {
	        _.each(methodNames, function(methodName) {
	          view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
	        });
	      }
	    });
	  
	    // Class to build handlers for `triggers` on behaviors
	    // for views
	    function BehaviorTriggersBuilder(view, behaviors) {
	      this._view      = view;
	      this._behaviors = behaviors;
	      this._triggers  = {};
	    }
	  
	    _.extend(BehaviorTriggersBuilder.prototype, {
	      // Main method to build the triggers hash with event keys and handlers
	      buildBehaviorTriggers: function() {
	        _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
	        return this._triggers;
	      },
	  
	      // Internal method to build all trigger handlers for a given behavior
	      _buildTriggerHandlersForBehavior: function(behavior, i) {
	        var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};
	  
	        triggersHash = Marionette.normalizeUIKeys(triggersHash, getBehaviorsUI(behavior));
	  
	        _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
	      },
	  
	      // Internal method to create and assign the trigger handler for a given
	      // behavior
	      _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
	        // Unique identifier for the `this._triggers` hash
	        var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
	          return triggerName + '.' + 'behaviortriggers' + i;
	        });
	  
	        this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
	      }
	    });
	  
	    function getBehaviorsUI(behavior) {
	      return behavior._uiBindings || behavior.ui;
	    }
	  
	    return Behaviors;
	  
	  })(Marionette, _);
	  
	
	  // App Router
	  // ----------
	  
	  // Reduce the boilerplate code of handling route events
	  // and then calling a single method on another object.
	  // Have your routers configured to call the method on
	  // your object, directly.
	  //
	  // Configure an AppRouter with `appRoutes`.
	  //
	  // App routers can only take one `controller` object.
	  // It is recommended that you divide your controller
	  // objects in to smaller pieces of related functionality
	  // and have multiple routers / controllers, instead of
	  // just one giant router and controller.
	  //
	  // You can also add standard routes to an AppRouter.
	  
	  Marionette.AppRouter = Backbone.Router.extend({
	  
	    constructor: function(options) {
	      this.options = options || {};
	  
	      Backbone.Router.apply(this, arguments);
	  
	      var appRoutes = this.getOption('appRoutes');
	      var controller = this._getController();
	      this.processAppRoutes(controller, appRoutes);
	      this.on('route', this._processOnRoute, this);
	    },
	  
	    // Similar to route method on a Backbone Router but
	    // method is called on the controller
	    appRoute: function(route, methodName) {
	      var controller = this._getController();
	      this._addAppRoute(controller, route, methodName);
	    },
	  
	    // process the route event and trigger the onRoute
	    // method call, if it exists
	    _processOnRoute: function(routeName, routeArgs) {
	      // make sure an onRoute before trying to call it
	      if (_.isFunction(this.onRoute)) {
	        // find the path that matches the current route
	        var routePath = _.invert(this.getOption('appRoutes'))[routeName];
	        this.onRoute(routeName, routePath, routeArgs);
	      }
	    },
	  
	    // Internal method to process the `appRoutes` for the
	    // router, and turn them in to routes that trigger the
	    // specified method on the specified `controller`.
	    processAppRoutes: function(controller, appRoutes) {
	      if (!appRoutes) { return; }
	  
	      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes
	  
	      _.each(routeNames, function(route) {
	        this._addAppRoute(controller, route, appRoutes[route]);
	      }, this);
	    },
	  
	    _getController: function() {
	      return this.getOption('controller');
	    },
	  
	    _addAppRoute: function(controller, route, methodName) {
	      var method = controller[methodName];
	  
	      if (!method) {
	        throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
	      }
	  
	      this.route(route, methodName, _.bind(method, controller));
	    },
	  
	    mergeOptions: Marionette.mergeOptions,
	  
	    // Proxy `getOption` to enable getting options from this or this.options by name.
	    getOption: Marionette.proxyGetOption,
	  
	    triggerMethod: Marionette.triggerMethod,
	  
	    bindEntityEvents: Marionette.proxyBindEntityEvents,
	  
	    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
	  });
	  
	  // Application
	  // -----------
	  
	  // Contain and manage the composite application as a whole.
	  // Stores and starts up `Region` objects, includes an
	  // event aggregator as `app.vent`
	  Marionette.Application = Marionette.Object.extend({
	    constructor: function(options) {
	      this._initializeRegions(options);
	      this._initCallbacks = new Marionette.Callbacks();
	      this.submodules = {};
	      _.extend(this, options);
	      this._initChannel();
	      Marionette.Object.apply(this, arguments);
	    },
	  
	    // Command execution, facilitated by Backbone.Wreqr.Commands
	    execute: function() {
	      this.commands.execute.apply(this.commands, arguments);
	    },
	  
	    // Request/response, facilitated by Backbone.Wreqr.RequestResponse
	    request: function() {
	      return this.reqres.request.apply(this.reqres, arguments);
	    },
	  
	    // Add an initializer that is either run at when the `start`
	    // method is called, or run immediately if added after `start`
	    // has already been called.
	    addInitializer: function(initializer) {
	      this._initCallbacks.add(initializer);
	    },
	  
	    // kick off all of the application's processes.
	    // initializes all of the regions that have been added
	    // to the app, and runs all of the initializer functions
	    start: function(options) {
	      this.triggerMethod('before:start', options);
	      this._initCallbacks.run(options, this);
	      this.triggerMethod('start', options);
	    },
	  
	    // Add regions to your app.
	    // Accepts a hash of named strings or Region objects
	    // addRegions({something: "#someRegion"})
	    // addRegions({something: Region.extend({el: "#someRegion"}) });
	    addRegions: function(regions) {
	      return this._regionManager.addRegions(regions);
	    },
	  
	    // Empty all regions in the app, without removing them
	    emptyRegions: function() {
	      return this._regionManager.emptyRegions();
	    },
	  
	    // Removes a region from your app, by name
	    // Accepts the regions name
	    // removeRegion('myRegion')
	    removeRegion: function(region) {
	      return this._regionManager.removeRegion(region);
	    },
	  
	    // Provides alternative access to regions
	    // Accepts the region name
	    // getRegion('main')
	    getRegion: function(region) {
	      return this._regionManager.get(region);
	    },
	  
	    // Get all the regions from the region manager
	    getRegions: function() {
	      return this._regionManager.getRegions();
	    },
	  
	    // Create a module, attached to the application
	    module: function(moduleNames, moduleDefinition) {
	  
	      // Overwrite the module class if the user specifies one
	      var ModuleClass = Marionette.Module.getClass(moduleDefinition);
	  
	      var args = _.toArray(arguments);
	      args.unshift(this);
	  
	      // see the Marionette.Module object for more information
	      return ModuleClass.create.apply(ModuleClass, args);
	    },
	  
	    // Enable easy overriding of the default `RegionManager`
	    // for customized region interactions and business-specific
	    // view logic for better control over single regions.
	    getRegionManager: function() {
	      return new Marionette.RegionManager();
	    },
	  
	    // Internal method to initialize the regions that have been defined in a
	    // `regions` attribute on the application instance
	    _initializeRegions: function(options) {
	      var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
	  
	      this._initRegionManager();
	  
	      // Enable users to define `regions` in instance options.
	      var optionRegions = Marionette.getOption(options, 'regions');
	  
	      // Enable region options to be a function
	      if (_.isFunction(optionRegions)) {
	        optionRegions = optionRegions.call(this, options);
	      }
	  
	      // Overwrite current regions with those passed in options
	      _.extend(regions, optionRegions);
	  
	      this.addRegions(regions);
	  
	      return this;
	    },
	  
	    // Internal method to set up the region manager
	    _initRegionManager: function() {
	      this._regionManager = this.getRegionManager();
	      this._regionManager._parent = this;
	  
	      this.listenTo(this._regionManager, 'before:add:region', function() {
	        Marionette._triggerMethod(this, 'before:add:region', arguments);
	      });
	  
	      this.listenTo(this._regionManager, 'add:region', function(name, region) {
	        this[name] = region;
	        Marionette._triggerMethod(this, 'add:region', arguments);
	      });
	  
	      this.listenTo(this._regionManager, 'before:remove:region', function() {
	        Marionette._triggerMethod(this, 'before:remove:region', arguments);
	      });
	  
	      this.listenTo(this._regionManager, 'remove:region', function(name) {
	        delete this[name];
	        Marionette._triggerMethod(this, 'remove:region', arguments);
	      });
	    },
	  
	    // Internal method to setup the Wreqr.radio channel
	    _initChannel: function() {
	      this.channelName = _.result(this, 'channelName') || 'global';
	      this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
	      this.vent = _.result(this, 'vent') || this.channel.vent;
	      this.commands = _.result(this, 'commands') || this.channel.commands;
	      this.reqres = _.result(this, 'reqres') || this.channel.reqres;
	    }
	  });
	  
	  /* jshint maxparams: 9 */
	  
	  // Module
	  // ------
	  
	  // A simple module system, used to create privacy and encapsulation in
	  // Marionette applications
	  Marionette.Module = function(moduleName, app, options) {
	    this.moduleName = moduleName;
	    this.options = _.extend({}, this.options, options);
	    // Allow for a user to overide the initialize
	    // for a given module instance.
	    this.initialize = options.initialize || this.initialize;
	  
	    // Set up an internal store for sub-modules.
	    this.submodules = {};
	  
	    this._setupInitializersAndFinalizers();
	  
	    // Set an internal reference to the app
	    // within a module.
	    this.app = app;
	  
	    if (_.isFunction(this.initialize)) {
	      this.initialize(moduleName, app, this.options);
	    }
	  };
	  
	  Marionette.Module.extend = Marionette.extend;
	  
	  // Extend the Module prototype with events / listenTo, so that the module
	  // can be used as an event aggregator or pub/sub.
	  _.extend(Marionette.Module.prototype, Backbone.Events, {
	  
	    // By default modules start with their parents.
	    startWithParent: true,
	  
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic when extending Marionette.Module.
	    initialize: function() {},
	  
	    // Initializer for a specific module. Initializers are run when the
	    // module's `start` method is called.
	    addInitializer: function(callback) {
	      this._initializerCallbacks.add(callback);
	    },
	  
	    // Finalizers are run when a module is stopped. They are used to teardown
	    // and finalize any variables, references, events and other code that the
	    // module had set up.
	    addFinalizer: function(callback) {
	      this._finalizerCallbacks.add(callback);
	    },
	  
	    // Start the module, and run all of its initializers
	    start: function(options) {
	      // Prevent re-starting a module that is already started
	      if (this._isInitialized) { return; }
	  
	      // start the sub-modules (depth-first hierarchy)
	      _.each(this.submodules, function(mod) {
	        // check to see if we should start the sub-module with this parent
	        if (mod.startWithParent) {
	          mod.start(options);
	        }
	      });
	  
	      // run the callbacks to "start" the current module
	      this.triggerMethod('before:start', options);
	  
	      this._initializerCallbacks.run(options, this);
	      this._isInitialized = true;
	  
	      this.triggerMethod('start', options);
	    },
	  
	    // Stop this module by running its finalizers and then stop all of
	    // the sub-modules for this module
	    stop: function() {
	      // if we are not initialized, don't bother finalizing
	      if (!this._isInitialized) { return; }
	      this._isInitialized = false;
	  
	      this.triggerMethod('before:stop');
	  
	      // stop the sub-modules; depth-first, to make sure the
	      // sub-modules are stopped / finalized before parents
	      _.invoke(this.submodules, 'stop');
	  
	      // run the finalizers
	      this._finalizerCallbacks.run(undefined, this);
	  
	      // reset the initializers and finalizers
	      this._initializerCallbacks.reset();
	      this._finalizerCallbacks.reset();
	  
	      this.triggerMethod('stop');
	    },
	  
	    // Configure the module with a definition function and any custom args
	    // that are to be passed in to the definition function
	    addDefinition: function(moduleDefinition, customArgs) {
	      this._runModuleDefinition(moduleDefinition, customArgs);
	    },
	  
	    // Internal method: run the module definition function with the correct
	    // arguments
	    _runModuleDefinition: function(definition, customArgs) {
	      // If there is no definition short circut the method.
	      if (!definition) { return; }
	  
	      // build the correct list of arguments for the module definition
	      var args = _.flatten([
	        this,
	        this.app,
	        Backbone,
	        Marionette,
	        Backbone.$, _,
	        customArgs
	      ]);
	  
	      definition.apply(this, args);
	    },
	  
	    // Internal method: set up new copies of initializers and finalizers.
	    // Calling this method will wipe out all existing initializers and
	    // finalizers.
	    _setupInitializersAndFinalizers: function() {
	      this._initializerCallbacks = new Marionette.Callbacks();
	      this._finalizerCallbacks = new Marionette.Callbacks();
	    },
	  
	    // import the `triggerMethod` to trigger events with corresponding
	    // methods if the method exists
	    triggerMethod: Marionette.triggerMethod
	  });
	  
	  // Class methods to create modules
	  _.extend(Marionette.Module, {
	  
	    // Create a module, hanging off the app parameter as the parent object.
	    create: function(app, moduleNames, moduleDefinition) {
	      var module = app;
	  
	      // get the custom args passed in after the module definition and
	      // get rid of the module name and definition function
	      var customArgs = _.drop(arguments, 3);
	  
	      // Split the module names and get the number of submodules.
	      // i.e. an example module name of `Doge.Wow.Amaze` would
	      // then have the potential for 3 module definitions.
	      moduleNames = moduleNames.split('.');
	      var length = moduleNames.length;
	  
	      // store the module definition for the last module in the chain
	      var moduleDefinitions = [];
	      moduleDefinitions[length - 1] = moduleDefinition;
	  
	      // Loop through all the parts of the module definition
	      _.each(moduleNames, function(moduleName, i) {
	        var parentModule = module;
	        module = this._getModule(parentModule, moduleName, app, moduleDefinition);
	        this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
	      }, this);
	  
	      // Return the last module in the definition chain
	      return module;
	    },
	  
	    _getModule: function(parentModule, moduleName, app, def, args) {
	      var options = _.extend({}, def);
	      var ModuleClass = this.getClass(def);
	  
	      // Get an existing module of this name if we have one
	      var module = parentModule[moduleName];
	  
	      if (!module) {
	        // Create a new module if we don't have one
	        module = new ModuleClass(moduleName, app, options);
	        parentModule[moduleName] = module;
	        // store the module on the parent
	        parentModule.submodules[moduleName] = module;
	      }
	  
	      return module;
	    },
	  
	    // ## Module Classes
	    //
	    // Module classes can be used as an alternative to the define pattern.
	    // The extend function of a Module is identical to the extend functions
	    // on other Backbone and Marionette classes.
	    // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
	    getClass: function(moduleDefinition) {
	      var ModuleClass = Marionette.Module;
	  
	      if (!moduleDefinition) {
	        return ModuleClass;
	      }
	  
	      // If all of the module's functionality is defined inside its class,
	      // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
	      if (moduleDefinition.prototype instanceof ModuleClass) {
	        return moduleDefinition;
	      }
	  
	      return moduleDefinition.moduleClass || ModuleClass;
	    },
	  
	    // Add the module definition and add a startWithParent initializer function.
	    // This is complicated because module definitions are heavily overloaded
	    // and support an anonymous function, module class, or options object
	    _addModuleDefinition: function(parentModule, module, def, args) {
	      var fn = this._getDefine(def);
	      var startWithParent = this._getStartWithParent(def, module);
	  
	      if (fn) {
	        module.addDefinition(fn, args);
	      }
	  
	      this._addStartWithParent(parentModule, module, startWithParent);
	    },
	  
	    _getStartWithParent: function(def, module) {
	      var swp;
	  
	      if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
	        swp = module.constructor.prototype.startWithParent;
	        return _.isUndefined(swp) ? true : swp;
	      }
	  
	      if (_.isObject(def)) {
	        swp = def.startWithParent;
	        return _.isUndefined(swp) ? true : swp;
	      }
	  
	      return true;
	    },
	  
	    _getDefine: function(def) {
	      if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
	        return def;
	      }
	  
	      if (_.isObject(def)) {
	        return def.define;
	      }
	  
	      return null;
	    },
	  
	    _addStartWithParent: function(parentModule, module, startWithParent) {
	      module.startWithParent = module.startWithParent && startWithParent;
	  
	      if (!module.startWithParent || !!module.startWithParentIsConfigured) {
	        return;
	      }
	  
	      module.startWithParentIsConfigured = true;
	  
	      parentModule.addInitializer(function(options) {
	        if (module.startWithParent) {
	          module.start(options);
	        }
	      });
	    }
	  });
	  
	
	  return Marionette;
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Backbone.Radio v1.0.4
	
	(function (global, factory) {
	   true ? module.exports = factory(__webpack_require__(2), __webpack_require__(1)) :
	  typeof define === 'function' && define.amd ? define(['underscore', 'backbone'], factory) :
	  (global.Backbone = global.Backbone || {}, global.Backbone.Radio = factory(global._,global.Backbone));
	}(this, function (_,Backbone) { 'use strict';
	
	  _ = 'default' in _ ? _['default'] : _;
	  Backbone = 'default' in Backbone ? Backbone['default'] : Backbone;
	
	  var babelHelpers = {};
	  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	  };
	  babelHelpers;
	
	  var previousRadio = Backbone.Radio;
	
	  var Radio = Backbone.Radio = {};
	
	  Radio.VERSION = '1.0.4';
	
	  // This allows you to run multiple instances of Radio on the same
	  // webapp. After loading the new version, call `noConflict()` to
	  // get a reference to it. At the same time the old version will be
	  // returned to Backbone.Radio.
	  Radio.noConflict = function () {
	    Backbone.Radio = previousRadio;
	    return this;
	  };
	
	  // Whether or not we're in DEBUG mode or not. DEBUG mode helps you
	  // get around the issues of lack of warnings when events are mis-typed.
	  Radio.DEBUG = false;
	
	  // Format debug text.
	  Radio._debugText = function (warning, eventName, channelName) {
	    return warning + (channelName ? ' on the ' + channelName + ' channel' : '') + ': "' + eventName + '"';
	  };
	
	  // This is the method that's called when an unregistered event was called.
	  // By default, it logs warning to the console. By overriding this you could
	  // make it throw an Error, for instance. This would make firing a nonexistent event
	  // have the same consequence as firing a nonexistent method on an Object.
	  Radio.debugLog = function (warning, eventName, channelName) {
	    if (Radio.DEBUG && console && console.warn) {
	      console.warn(Radio._debugText(warning, eventName, channelName));
	    }
	  };
	
	  var eventSplitter = /\s+/;
	
	  // An internal method used to handle Radio's method overloading for Requests.
	  // It's borrowed from Backbone.Events. It differs from Backbone's overload
	  // API (which is used in Backbone.Events) in that it doesn't support space-separated
	  // event names.
	  Radio._eventsApi = function (obj, action, name, rest) {
	    if (!name) {
	      return false;
	    }
	
	    var results = {};
	
	    // Handle event maps.
	    if ((typeof name === 'undefined' ? 'undefined' : babelHelpers.typeof(name)) === 'object') {
	      for (var key in name) {
	        var result = obj[action].apply(obj, [key, name[key]].concat(rest));
	        eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
	      }
	      return results;
	    }
	
	    // Handle space separated event names.
	    if (eventSplitter.test(name)) {
	      var names = name.split(eventSplitter);
	      for (var i = 0, l = names.length; i < l; i++) {
	        results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
	      }
	      return results;
	    }
	
	    return false;
	  };
	
	  // An optimized way to execute callbacks.
	  Radio._callHandler = function (callback, context, args) {
	    var a1 = args[0],
	        a2 = args[1],
	        a3 = args[2];
	    switch (args.length) {
	      case 0:
	        return callback.call(context);
	      case 1:
	        return callback.call(context, a1);
	      case 2:
	        return callback.call(context, a1, a2);
	      case 3:
	        return callback.call(context, a1, a2, a3);
	      default:
	        return callback.apply(context, args);
	    }
	  };
	
	  // A helper used by `off` methods to the handler from the store
	  function removeHandler(store, name, callback, context) {
	    var event = store[name];
	    if ((!callback || callback === event.callback || callback === event.callback._callback) && (!context || context === event.context)) {
	      delete store[name];
	      return true;
	    }
	  }
	
	  function removeHandlers(store, name, callback, context) {
	    store || (store = {});
	    var names = name ? [name] : _.keys(store);
	    var matched = false;
	
	    for (var i = 0, length = names.length; i < length; i++) {
	      name = names[i];
	
	      // If there's no event by this name, log it and continue
	      // with the loop
	      if (!store[name]) {
	        continue;
	      }
	
	      if (removeHandler(store, name, callback, context)) {
	        matched = true;
	      }
	    }
	
	    return matched;
	  }
	
	  /*
	   * tune-in
	   * -------
	   * Get console logs of a channel's activity
	   *
	   */
	
	  var _logs = {};
	
	  // This is to produce an identical function in both tuneIn and tuneOut,
	  // so that Backbone.Events unregisters it.
	  function _partial(channelName) {
	    return _logs[channelName] || (_logs[channelName] = _.bind(Radio.log, Radio, channelName));
	  }
	
	  _.extend(Radio, {
	
	    // Log information about the channel and event
	    log: function log(channelName, eventName) {
	      if (typeof console === 'undefined') {
	        return;
	      }
	      var args = _.toArray(arguments).slice(2);
	      console.log('[' + channelName + '] "' + eventName + '"', args);
	    },
	
	    // Logs all events on this channel to the console. It sets an
	    // internal value on the channel telling it we're listening,
	    // then sets a listener on the Backbone.Events
	    tuneIn: function tuneIn(channelName) {
	      var channel = Radio.channel(channelName);
	      channel._tunedIn = true;
	      channel.on('all', _partial(channelName));
	      return this;
	    },
	
	    // Stop logging all of the activities on this channel to the console
	    tuneOut: function tuneOut(channelName) {
	      var channel = Radio.channel(channelName);
	      channel._tunedIn = false;
	      channel.off('all', _partial(channelName));
	      delete _logs[channelName];
	      return this;
	    }
	  });
	
	  /*
	   * Backbone.Radio.Requests
	   * -----------------------
	   * A messaging system for requesting data.
	   *
	   */
	
	  function makeCallback(callback) {
	    return _.isFunction(callback) ? callback : function () {
	      return callback;
	    };
	  }
	
	  Radio.Requests = {
	
	    // Make a request
	    request: function request(name) {
	      var args = _.toArray(arguments).slice(1);
	      var results = Radio._eventsApi(this, 'request', name, args);
	      if (results) {
	        return results;
	      }
	      var channelName = this.channelName;
	      var requests = this._requests;
	
	      // Check if we should log the request, and if so, do it
	      if (channelName && this._tunedIn) {
	        Radio.log.apply(this, [channelName, name].concat(args));
	      }
	
	      // If the request isn't handled, log it in DEBUG mode and exit
	      if (requests && (requests[name] || requests['default'])) {
	        var handler = requests[name] || requests['default'];
	        args = requests[name] ? args : arguments;
	        return Radio._callHandler(handler.callback, handler.context, args);
	      } else {
	        Radio.debugLog('An unhandled request was fired', name, channelName);
	      }
	    },
	
	    // Set up a handler for a request
	    reply: function reply(name, callback, context) {
	      if (Radio._eventsApi(this, 'reply', name, [callback, context])) {
	        return this;
	      }
	
	      this._requests || (this._requests = {});
	
	      if (this._requests[name]) {
	        Radio.debugLog('A request was overwritten', name, this.channelName);
	      }
	
	      this._requests[name] = {
	        callback: makeCallback(callback),
	        context: context || this
	      };
	
	      return this;
	    },
	
	    // Set up a handler that can only be requested once
	    replyOnce: function replyOnce(name, callback, context) {
	      if (Radio._eventsApi(this, 'replyOnce', name, [callback, context])) {
	        return this;
	      }
	
	      var self = this;
	
	      var once = _.once(function () {
	        self.stopReplying(name);
	        return makeCallback(callback).apply(this, arguments);
	      });
	
	      return this.reply(name, once, context);
	    },
	
	    // Remove handler(s)
	    stopReplying: function stopReplying(name, callback, context) {
	      if (Radio._eventsApi(this, 'stopReplying', name)) {
	        return this;
	      }
	
	      // Remove everything if there are no arguments passed
	      if (!name && !callback && !context) {
	        delete this._requests;
	      } else if (!removeHandlers(this._requests, name, callback, context)) {
	        Radio.debugLog('Attempted to remove the unregistered request', name, this.channelName);
	      }
	
	      return this;
	    }
	  };
	
	  /*
	   * Backbone.Radio.channel
	   * ----------------------
	   * Get a reference to a channel by name.
	   *
	   */
	
	  Radio._channels = {};
	
	  Radio.channel = function (channelName) {
	    if (!channelName) {
	      throw new Error('You must provide a name for the channel.');
	    }
	
	    if (Radio._channels[channelName]) {
	      return Radio._channels[channelName];
	    } else {
	      return Radio._channels[channelName] = new Radio.Channel(channelName);
	    }
	  };
	
	  /*
	   * Backbone.Radio.Channel
	   * ----------------------
	   * A Channel is an object that extends from Backbone.Events,
	   * and Radio.Requests.
	   *
	   */
	
	  Radio.Channel = function (channelName) {
	    this.channelName = channelName;
	  };
	
	  _.extend(Radio.Channel.prototype, Backbone.Events, Radio.Requests, {
	
	    // Remove all handlers from the messaging systems of this channel
	    reset: function reset() {
	      this.off();
	      this.stopListening();
	      this.stopReplying();
	      return this;
	    }
	  });
	
	  /*
	   * Top-level API
	   * -------------
	   * Supplies the 'top-level API' for working with Channels directly
	   * from Backbone.Radio.
	   *
	   */
	
	  var channel;
	  var args;
	  var systems = [Backbone.Events, Radio.Requests];
	  _.each(systems, function (system) {
	    _.each(system, function (method, methodName) {
	      Radio[methodName] = function (channelName) {
	        args = _.toArray(arguments).slice(1);
	        channel = this.channel(channelName);
	        return channel[methodName].apply(channel, args);
	      };
	    });
	  });
	
	  Radio.reset = function (channelName) {
	    var channels = !channelName ? this._channels : [this._channels[channelName]];
	    _.each(channels, function (channel) {
	      channel.reset();
	    });
	  };
	
	  return Radio;
	
	}));
	//# sourceMappingURL=./backbone.radio.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.2.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-05-20T17:23Z
	 */
	
	(function( global, factory ) {
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr = [];
	
	var document = window.document;
	
	var slice = arr.slice;
	
	var concat = arr.concat;
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var support = {};
	
	
	
	var
		version = "2.2.4",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// Start with an empty selector
		selector: "",
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?
	
				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	
				// Return all the elements in a clean array
				slice.call( this );
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray,
	
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},
	
		isPlainObject: function( obj ) {
			var key;
	
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}
	
			// Not own constructor property must be Object
			if ( obj.constructor &&
					!hasOwn.call( obj, "constructor" ) &&
					!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
				return false;
			}
	
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own
			for ( key in obj ) {}
	
			return key === undefined || hasOwn.call( obj, key );
		},
	
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
	
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;
	
			code = jQuery.trim( code );
	
			if ( code ) {
	
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf( "use strict" ) === 1 ) {
					script = document.createElement( "script" );
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {
	
					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval
	
					indirect( code );
				}
			}
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: Date.now,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	/* jshint ignore: end */
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
		rescape = /'|\\/g,
	
		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");
	
		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];
	
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},
	
			"disabled": function( elem ) {
				return elem.disabled === true;
			},
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
	
		}
	
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
	
		}
	
		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}
	
			qualifier = jQuery.filter( qualifier, elements );
		}
	
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {
	
							// Inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;
	
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :
	
						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
						matched.push( cur );
						break;
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	} );
	var rnotwhite = ( /\S+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
	
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Keep pipe for back-compat
			promise.pipe = promise.then;
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];
	
				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add( function() {
	
						// state = [ resolved | rejected ]
						state = stateString;
	
					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}
	
				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,
	
				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
	
				progressValues, progressContexts, resolveContexts;
	
			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}
	
			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}
	
			return deferred.promise();
		}
	} );
	
	
	// The deferred used on DOM ready
	var readyList;
	
	jQuery.fn.ready = function( fn ) {
	
		// Add the callback
		jQuery.ready.promise().done( fn );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
	
			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );
	
	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}
	
	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {
	
			readyList = jQuery.Deferred();
	
			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );
	
			} else {
	
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );
	
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
			}
		}
		return readyList.promise( obj );
	};
	
	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		return chainable ?
			elems :
	
			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {
	
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	
	
	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	
	Data.prototype = {
	
		register: function( owner, initial ) {
			var value = initial || {};
	
			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if ( owner.nodeType ) {
				owner[ this.expando ] = value;
	
			// Otherwise secure it in a non-enumerable, non-writable property
			// configurability must be true to allow the property to be
			// deleted with the delete operator
			} else {
				Object.defineProperty( owner, this.expando, {
					value: value,
					writable: true,
					configurable: true
				} );
			}
			return owner[ this.expando ];
		},
		cache: function( owner ) {
	
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( !acceptData( owner ) ) {
				return {};
			}
	
			// Check if the owner object already has a cache
			var value = owner[ this.expando ];
	
			// If not, create one
			if ( !value ) {
				value = {};
	
				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {
	
					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;
	
					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}
	
			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );
	
			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
	
				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
				owner[ this.expando ] && owner[ this.expando ][ key ];
		},
		access: function( owner, key, value ) {
			var stored;
	
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				stored = this.get( owner, key );
	
				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase( key ) );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key === undefined ) {
				this.register( owner );
	
			} else {
	
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
	
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );
	
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {
	
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}
	
				i = name.length;
	
				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();
	
	var dataUser = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
	
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );
	
					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}
	
			return access( this, function( value ) {
				var data, camelKey;
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
	
					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get( elem, key ) ||
	
						// Try to find dashed key if it exists (gh-2779)
						// This is for 2.2.x only
						dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );
	
					if ( data !== undefined ) {
						return data;
					}
	
					camelKey = jQuery.camelCase( key );
	
					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				camelKey = jQuery.camelCase( key );
				this.each( function() {
	
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get( this, camelKey );
	
					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set( this, camelKey, value );
	
					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
						dataUser.set( this, key, value );
					}
				} );
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHidden = function( elem, el ) {
	
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([\w:-]+)/ );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
	
		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
	
		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		_default: [ 0, "", "" ]
	};
	
	// Support: IE9
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
	
		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
				[];
	
		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/;
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
	
					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	}
	
	
	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Android 4.0-4.3, Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	
	
	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},
	
		dispatch: function( event ) {
	
			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );
	
			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),
	
		fixHooks: {},
	
		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {
	
				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}
	
				return event;
			}
		},
	
		mouseHooks: {
			props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;
	
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
	
					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}
	
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}
	
				return event;
			}
		},
	
		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}
	
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];
	
			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
			event = new jQuery.Event( originalEvent );
	
			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}
	
			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};
	
	jQuery.removeEvent = function( elem, type, handle ) {
	
		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	jQuery.fn.extend( {
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );
	
	
	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
	
		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
	
			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
	
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
	
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;
	
			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			dataUser.set( dest, udataCur );
		}
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {
	
						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
	
		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,
	
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	
	
	var iframe,
		elemdisplay = {
	
			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};
	
	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	
			display = jQuery.css( elem[ 0 ], "display" );
	
		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();
	
		return display;
	}
	
	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];
	
		if ( !display ) {
			display = actualDisplay( nodeName, doc );
	
			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {
	
				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );
	
				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;
	
				// Support: IE
				doc.write();
				doc.close();
	
				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}
	
			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}
	
		return display;
	}
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
	
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var documentElement = document.documentElement;
	
	
	
	( function() {
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
			div.style.cssText =
	
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );
	
			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";
	
			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";
	
			documentElement.removeChild( container );
		}
	
		jQuery.extend( support, {
			pixelPosition: function() {
	
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
	
				// Support: Android 4.0-4.3
				// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
				// since that compresses better and they're computed together anyway.
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
	
				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			},
			reliableMarginRight: function() {
	
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );
	
				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
	
					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;box-sizing:content-box;" +
					"display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				documentElement.appendChild( container );
	
				ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );
	
				documentElement.removeChild( container );
				div.removeChild( marginDiv );
	
				return ret;
			}
		} );
	} )();
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;
	
		computed = computed || getStyles( elem );
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;
	
		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}
	
		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
	
			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
	
			// Support: IE9-11+
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function setPositiveNumber( elem, value, subtract ) {
	
		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
	
			// If we already have the right measurement, avoid augmentation
			4 :
	
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,
	
			val = 0;
	
		for ( ; i < 4; i += 2 ) {
	
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;
	
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			values[ index ] = dataPriv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
	
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}
	
				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = dataPriv.access(
						elem,
						"olddisplay",
						defaultDisplay( elem.nodeName )
					);
				}
			} else {
				hidden = isHidden( elem );
	
				if ( display !== "none" || !hidden ) {
					dataPriv.set(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}
	
		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}
	
		return elements;
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					style[ name ] = value;
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);
	
				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {
	
					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}
	
				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);
	
	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back Compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );
	
		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
	
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );
	
			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
	
			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	
		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	
			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}
	
		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", {} );
			}
	
			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;
	
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
	
		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
			opt.duration : opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		window.clearInterval( timerId );
	
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();
	
	
	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;
	
					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
	
						// Set corresponding property to false
						elem[ propName ] = false;
					}
	
					elem.removeAttribute( name );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
	
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} );
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	
	
	
	var rclass = /[\t\r\n\f]/g;
	
	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// Store className if set
						dataPriv.set( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					return typeof ret === "string" ?
	
						// Handle most common string cases
						ret.replace( rreturn, "" ) :
	
						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
	
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	
	jQuery.extend( jQuery.event, {
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);
	
			jQuery.event.trigger( e, null, elem );
		}
	
	} );
	
	jQuery.fn.extend( {
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	
	
	support.focusin = "onfocusin" in window;
	
	
	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );
	
					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE9
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
	
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers
				responseHeadersString,
				responseHeaders,
	
				// timeout handle
				timeoutTimer,
	
				// Url cleanup var
				urlAnchor,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				// Loop variable
				i,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// The jqXHR state
				state = 0,
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
	
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
	
			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
				.replace( rprotocol, location.protocol + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
	
			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );
	
				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;
	
					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {
	
					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?
	
						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :
	
						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
	
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Called once
				if ( state === 2 ) {
					return;
				}
	
				// State is "done" now
				state = 2;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;
	
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}
	
			if ( this[ 0 ] ) {
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );
	
	
	jQuery.expr.filters.hidden = function( elem ) {
		return !jQuery.expr.filters.visible( elem );
	};
	jQuery.expr.filters.visible = function( elem ) {
	
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		// Use OR instead of AND as the element is not visible if either is true
		// See tickets #10406 and #13132
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	};
	
	
	
	
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
	
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};
	
	var xhrSuccessStatus = {
	
			// File protocol always yields status code 0, assume 200
			0: 200,
	
			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();
	
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
	
									// Support: IE9
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(
	
											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
	
										// Support: IE9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );
	
					// Support: IE9
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
	
							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {
	
								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}
	
					// Create the abort callback
					callback = callback( "abort" );
	
					try {
	
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
	
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
	
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// Force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
	
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	// Keep a copy of the old load method
	var _load = jQuery.fn.load;
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}
	
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;
	
			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
	
			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}
	
			box = elem.getBoundingClientRect();
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
	
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );
	
	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {
	
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},
		size: function() {
			return this.length;
		}
	} );
	
	jQuery.fn.andSelf = jQuery.fn.addBack;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	return jQuery;
	}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(3);
	
	var Marionette = _interopRequireWildcard(_backbone);
	
	var _AppLayoutView = __webpack_require__(12);
	
	var _AppLayoutView2 = _interopRequireDefault(_AppLayoutView);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var App = Marionette.Application.extend({
		initialize: function initialize() {
			this.layout = new _AppLayoutView2.default();
			this.layout.render();
		}
	});
	
	var app = new App();
	
	exports.default = app;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(18);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _SearchResultModel = __webpack_require__(10);
	
	var _SearchResultModel2 = _interopRequireDefault(_SearchResultModel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SearchResultsCollection = _backbone2.default.extend({
		model: _SearchResultModel2.default,
		url: 'http://localhost:8080/FormService/api/v1/legacy/forms?formLongName=demographics',
		state: {
			pageSize: 50
		},
		mode: "client"
	
	});
	
	exports.default = SearchResultsCollection;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _marionetteService = __webpack_require__(21);
	
	var _marionetteService2 = _interopRequireDefault(_marionetteService);
	
	var _SearchRouter = __webpack_require__(11);
	
	var _SearchRouter2 = _interopRequireDefault(_SearchRouter);
	
	var _SearchLayoutView = __webpack_require__(15);
	
	var _SearchLayoutView2 = _interopRequireDefault(_SearchLayoutView);
	
	var _SearchResultsCollection = __webpack_require__(7);
	
	var _SearchResultsCollection2 = _interopRequireDefault(_SearchResultsCollection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SearchController = _marionetteService2.default.extend({
		initialize: function initialize() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			this.container = options.container;
			//this.model = searchModel;
			var searchRouter = new _SearchRouter2.default();
	
			this.view = new _SearchLayoutView2.default({
				el: this.container.el,
				collection: new _SearchResultsCollection2.default()
			});
			this.container.show(this.view);
		}
	});
	
	exports.default = SearchController;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _App = __webpack_require__(6);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _backbone = __webpack_require__(1);
	
	var Backbone = _interopRequireWildcard(_backbone);
	
	var _jquery = __webpack_require__(5);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _SearchController = __webpack_require__(8);
	
	var _SearchController2 = _interopRequireDefault(_SearchController);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	Backbone.$ = _jquery2.default;
	
	_App2.default.on('start', function () {
	
		this.search = new _SearchController2.default({
			container: this.layout.getRegion("main")
		});
	
		Backbone.history.start();
	});
	
	_App2.default.start();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(1);
	
	var SearchResultModel = _backbone.Model.extend({
		default: {
			formLongName: '',
			protocolIdSeq: '',
			context: '',
			workflow: '',
			categoryName: '',
			type: '',
			classification: '',
			publicId: ''
		}
	});
	
	exports.default = SearchResultModel;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(1);
	
	var Backbone = _interopRequireWildcard(_backbone);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SearchRouter = Backbone.Router.extend({
		routes: {
			'search': 'initialize'
		}
	});
	
	exports.default = SearchRouter;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(3);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _backbone3 = __webpack_require__(4);
	
	var _backbone4 = _interopRequireDefault(_backbone3);
	
	var _HeaderView = __webpack_require__(14);
	
	var _HeaderView2 = _interopRequireDefault(_HeaderView);
	
	var _FooterView = __webpack_require__(13);
	
	var _FooterView2 = _interopRequireDefault(_FooterView);
	
	var _appLayout = __webpack_require__(22);
	
	var _appLayout2 = _interopRequireDefault(_appLayout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var AppLayoutView = _backbone2.default.LayoutView.extend({
		el: "#app",
		template: _appLayout2.default,
		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer'
		},
	
		onRender: function onRender() {
			this.showHeader();
			this.showFooter();
		},
		showHeader: function showHeader() {
			var header = new _HeaderView2.default();
			this.showChildView('header', header);
		},
		showFooter: function showFooter() {
			var footer = new _FooterView2.default();
			this.showChildView('footer', footer);
		}
	});
	
	exports.default = AppLayoutView;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(3);
	
	var Marionette = _interopRequireWildcard(_backbone);
	
	var _footer = __webpack_require__(23);
	
	var _footer2 = _interopRequireDefault(_footer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var FooterView = Marionette.ItemView.extend({
		template: _footer2.default
	});
	
	exports.default = FooterView;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _backbone = __webpack_require__(3);
	
	var Marionette = _interopRequireWildcard(_backbone);
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _header = __webpack_require__(24);
	
	var _header2 = _interopRequireDefault(_header);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var HeaderView = Marionette.ItemView.extend({
	  template: _header2.default
	});
	
	exports.default = HeaderView;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(3);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _backbone3 = __webpack_require__(4);
	
	var _backbone4 = _interopRequireDefault(_backbone3);
	
	var _searchLayout = __webpack_require__(25);
	
	var _searchLayout2 = _interopRequireDefault(_searchLayout);
	
	var _SearchResultsView = __webpack_require__(16);
	
	var _SearchResultsView2 = _interopRequireDefault(_SearchResultsView);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var filterChannel = _backbone4.default.channel('filter');
	
	var SearchLayoutView = _backbone2.default.LayoutView.extend({
		template: _searchLayout2.default,
		tagMame: "section",
		regions: {
			searchCriteria: '#search-form-wrapper',
			searchResults: '#search-results-wrapper'
		},
		onRender: function onRender() {
			this.showSearchForm();
			this.showSearchResultsView();
		},
		showSearchForm: function showSearchForm() {},
		showSearchResultsView: function showSearchResultsView() {
			/*TODO move this, just testing now */
			this.collection.fetch();
			var view = new _SearchResultsView2.default({
				collection: this.collection
			});
			this.showChildView('searchResults', view);
		}
		/*
	  showSearchForm () {
	  const searchLayoutView = new SearchLayoutView({});
	  this.showChildView('header', searchLayoutView);
	  }*/
	
	});
	
	exports.default = SearchLayoutView;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _backbone = __webpack_require__(1);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _backgrid = __webpack_require__(20);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var columns = [{
		name: "id",
		label: "Long Name",
		editable: false,
		cell: "string"
	}, {
		name: "name",
		label: "Context",
		editable: false,
		cell: "string"
	}, {
		name: "pop",
		label: "Type",
		editable: false,
		cell: "string"
	}, {
		name: "percentage",
		label: "Protocol Long Name(s)",
		editable: false,
		cell: "string"
	}, {
		name: "date",
		label: "Workflow Status",
		editable: false,
		cell: "string"
	}, {
		name: "url",
		label: "Public ID",
		editable: false,
		cell: "string"
	}, {
		name: "name",
		label: "Context",
		editable: false,
		cell: "string"
	}];
	
	var SearchResultsView = _backgrid.Grid.extend({
		initialize: function initialize() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			this.collection = options.collection;
		},
	
		columns: columns,
		emptyText: "No Data is available"
	});
	
	exports.default = SearchResultsView;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Backbone.BabySitter
	// -------------------
	// v0.1.11
	//
	// Copyright (c)2016 Derick Bailey, Muted Solutions, LLC.
	// Distributed under MIT license
	//
	// http://github.com/marionettejs/backbone.babysitter
	
	(function(root, factory) {
	
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Backbone, _) {
	      return factory(Backbone, _);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    var Backbone = require('backbone');
	    var _ = require('underscore');
	    module.exports = factory(Backbone, _);
	  } else {
	    factory(root.Backbone, root._);
	  }
	
	}(this, function(Backbone, _) {
	  'use strict';
	
	  var previousChildViewContainer = Backbone.ChildViewContainer;
	
	  // BabySitter.ChildViewContainer
	  // -----------------------------
	  //
	  // Provide a container to store, retrieve and
	  // shut down child views.
	  
	  Backbone.ChildViewContainer = (function (Backbone, _) {
	  
	    // Container Constructor
	    // ---------------------
	  
	    var Container = function(views){
	      this._views = {};
	      this._indexByModel = {};
	      this._indexByCustom = {};
	      this._updateLength();
	  
	      _.each(views, this.add, this);
	    };
	  
	    // Container Methods
	    // -----------------
	  
	    _.extend(Container.prototype, {
	  
	      // Add a view to this container. Stores the view
	      // by `cid` and makes it searchable by the model
	      // cid (and model itself). Optionally specify
	      // a custom key to store an retrieve the view.
	      add: function(view, customIndex){
	        var viewCid = view.cid;
	  
	        // store the view
	        this._views[viewCid] = view;
	  
	        // index it by model
	        if (view.model){
	          this._indexByModel[view.model.cid] = viewCid;
	        }
	  
	        // index by custom
	        if (customIndex){
	          this._indexByCustom[customIndex] = viewCid;
	        }
	  
	        this._updateLength();
	        return this;
	      },
	  
	      // Find a view by the model that was attached to
	      // it. Uses the model's `cid` to find it.
	      findByModel: function(model){
	        return this.findByModelCid(model.cid);
	      },
	  
	      // Find a view by the `cid` of the model that was attached to
	      // it. Uses the model's `cid` to find the view `cid` and
	      // retrieve the view using it.
	      findByModelCid: function(modelCid){
	        var viewCid = this._indexByModel[modelCid];
	        return this.findByCid(viewCid);
	      },
	  
	      // Find a view by a custom indexer.
	      findByCustom: function(index){
	        var viewCid = this._indexByCustom[index];
	        return this.findByCid(viewCid);
	      },
	  
	      // Find by index. This is not guaranteed to be a
	      // stable index.
	      findByIndex: function(index){
	        return _.values(this._views)[index];
	      },
	  
	      // retrieve a view by its `cid` directly
	      findByCid: function(cid){
	        return this._views[cid];
	      },
	  
	      // Remove a view
	      remove: function(view){
	        var viewCid = view.cid;
	  
	        // delete model index
	        if (view.model){
	          delete this._indexByModel[view.model.cid];
	        }
	  
	        // delete custom index
	        _.any(this._indexByCustom, function(cid, key) {
	          if (cid === viewCid) {
	            delete this._indexByCustom[key];
	            return true;
	          }
	        }, this);
	  
	        // remove the view from the container
	        delete this._views[viewCid];
	  
	        // update the length
	        this._updateLength();
	        return this;
	      },
	  
	      // Call a method on every view in the container,
	      // passing parameters to the call method one at a
	      // time, like `function.call`.
	      call: function(method){
	        this.apply(method, _.tail(arguments));
	      },
	  
	      // Apply a method on every view in the container,
	      // passing parameters to the call method one at a
	      // time, like `function.apply`.
	      apply: function(method, args){
	        _.each(this._views, function(view){
	          if (_.isFunction(view[method])){
	            view[method].apply(view, args || []);
	          }
	        });
	      },
	  
	      // Update the `.length` attribute on this container
	      _updateLength: function(){
	        this.length = _.size(this._views);
	      }
	    });
	  
	    // Borrowing this code from Backbone.Collection:
	    // http://backbonejs.org/docs/backbone.html#section-106
	    //
	    // Mix in methods from Underscore, for iteration, and other
	    // collection related features.
	    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
	      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
	      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
	      'last', 'without', 'isEmpty', 'pluck', 'reduce'];
	  
	    _.each(methods, function(method) {
	      Container.prototype[method] = function() {
	        var views = _.values(this._views);
	        var args = [views].concat(_.toArray(arguments));
	        return _[method].apply(_, args);
	      };
	    });
	  
	    // return the public API
	    return Container;
	  })(Backbone, _);
	  
	
	  Backbone.ChildViewContainer.VERSION = '0.1.11';
	
	  Backbone.ChildViewContainer.noConflict = function () {
	    Backbone.ChildViewContainer = previousChildViewContainer;
	    return this;
	  };
	
	  return Backbone.ChildViewContainer;
	
	}));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  backbone.paginator
	  http://github.com/backbone-paginator/backbone.paginator
	
	  Copyright (c) 2016 Jimmy Yuen Ho Wong and contributors
	
	  @module
	  @license MIT
	*/
	
	(function (factory) {
	
	  // CommonJS
	  if (true) {
	    module.exports = factory(__webpack_require__(2), __webpack_require__(1));
	  }
	  // AMD
	  else if (typeof define == "function" && define.amd) {
	    define(["underscore", "backbone"], factory);
	  }
	  // Browser
	  else if (typeof _ !== "undefined" && typeof Backbone !== "undefined") {
	    var oldPageableCollection = Backbone.PageableCollection;
	    var PageableCollection = factory(_, Backbone);
	
	    /**
	       __BROWSER ONLY__
	
	       If you already have an object named `PageableCollection` attached to the
	       `Backbone` module, you can use this to return a local reference to this
	       PageableCollection class and reset the name PageableCollection to its
	       previous definition.
	
	           // The left hand side gives you a reference to this
	           // PageableCollection implementation, the right hand side
	           // resets PageableCollection to your other PageableCollection.
	           var PageableCollection = PageableCollection.noConflict();
	
	       @static
	       @return {PageableCollection}
	    */
	    Backbone.PageableCollection.noConflict = function () {
	      Backbone.PageableCollection = oldPageableCollection;
	      return PageableCollection;
	    };
	  }
	
	}(function (_, Backbone) {
	
	  "use strict";
	
	  var _extend = _.extend;
	  var _omit = _.omit;
	  var _clone = _.clone;
	  var _each = _.each;
	  var _pick = _.pick;
	  var _contains = _.contains;
	  var _isEmpty = _.isEmpty;
	  var _pairs = _.pairs;
	  var _invert = _.invert;
	  var _isArray = _.isArray;
	  var _isFunction = _.isFunction;
	  var _isObject = _.isObject;
	  var _keys = _.keys;
	  var _isUndefined = _.isUndefined;
	  var ceil = Math.ceil;
	  var floor = Math.floor;
	  var max = Math.max;
	
	  var BBColProto = Backbone.Collection.prototype;
	
	  function finiteInt (val, name) {
	    if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
	      throw new TypeError("`" + name + "` must be a finite integer");
	    }
	    return val;
	  }
	
	  function queryStringToParams (qs) {
	    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
	    var kvps = qs.split('&');
	    for (var i = 0, l = kvps.length; i < l; i++) {
	      var param = kvps[i];
	      kvp = param.split('='), k = kvp[0], v = kvp[1];
	      if (v == null) v = true;
	      k = decode(k), v = decode(v), ls = params[k];
	      if (_isArray(ls)) ls.push(v);
	      else if (ls) params[k] = [ls, v];
	      else params[k] = v;
	    }
	    return params;
	  }
	
	  // hack to make sure the whatever event handlers for this event is run
	  // before func is, and the event handlers that func will trigger.
	  function runOnceAtLastHandler (col, event, func) {
	    var eventHandlers = col._events[event];
	    if (eventHandlers && eventHandlers.length) {
	      var lastHandler = eventHandlers[eventHandlers.length - 1];
	      var oldCallback = lastHandler.callback;
	      lastHandler.callback = function () {
	        try {
	          oldCallback.apply(this, arguments);
	          func();
	        }
	        catch (e) {
	          throw e;
	        }
	        finally {
	          lastHandler.callback = oldCallback;
	        }
	      };
	    }
	    else func();
	  }
	
	  var PARAM_TRIM_RE = /[\s'"]/g;
	  var URL_TRIM_RE = /[<>\s'"]/g;
	
	
	  /**
	   * State change event. Fired when PageableCollection#state gets updated
	   *
	   * @event pageable:state:change
	   * @type {object} The PageableCollection#state object of this
	   * PageableCollection instance
	   */
	
	
	  /**
	     Drop-in replacement for Backbone.Collection. Supports server-side and
	     client-side pagination and sorting. Client-side mode also support fully
	     multi-directional synchronization of changes between pages.
	
	     @class PageableCollection
	     @extends Backbone.Collection
	  */
	  var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({
	
	    /**
	       The container object to store all pagination states.
	
	       You can override the default state by extending this class or specifying
	       them in an `options` hash to the constructor.
	
	       @property {number} firstPage = 1 - The first page index. Set to 0 if
	       your server API uses 0-based indices. You should only override this value
	       during extension, initialization or reset by the server after
	       fetching. This value should be read only at other times.
	
	       @property {number} lastPage = null - The last page index. This value
	       is __read only__ and it's calculated based on whether `firstPage` is 0 or
	       1, during bootstrapping, fetching and resetting. Please don't change this
	       value under any circumstances.
	
	       @property {number} currentPage = null - The current page index. You
	       should only override this value during extension, initialization or reset
	       by the server after fetching. This value should be read only at other
	       times. Can be a 0-based or 1-based index, depending on whether
	       `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
	       on initialization.
	
	       @property {number} pageSize = 25 - How many records to show per
	       page. This value is __read only__ after initialization, if you want to
	       change the page size after initialization, you must call
	       PageableCollection#setPageSize.
	
	       @property {number} totalPages = null - How many pages there are. This
	       value is __read only__ and it is calculated from `totalRecords`.
	
	       @property {number} totalRecords = null - How many records there
	       are. This value is __required__ under server mode. This value is optional
	       for client mode as the number will be the same as the number of models
	       during bootstrapping and during fetching, either supplied by the server
	       in the metadata, or calculated from the size of the response.
	
	       @property {string} sortKey = null - The model attribute to use for
	       sorting.
	
	       @property {number} order = -1 - The order to use for sorting. Specify
	       -1 for ascending order or 1 for descending order. If 0, no client side
	       sorting will be done and the order query parameter will not be sent to
	       the server during a fetch.
	    */
	    state: {
	      firstPage: 1,
	      lastPage: null,
	      currentPage: null,
	      pageSize: 25,
	      totalPages: null,
	      totalRecords: null,
	      sortKey: null,
	      order: -1
	    },
	
	    /**
	       @property {string} mode = "server" The mode of operations for this
	       collection. `"server"` paginates on the server-side, `"client"` paginates
	       on the client-side and `"infinite"` paginates on the server-side for APIs
	       that do not support `totalRecords`.
	    */
	    mode: "server",
	
	    /**
	       A translation map to convert PageableCollection state attributes
	       to the query parameters accepted by your server API.
	
	       You can override the default state by extending this class or specifying
	       them in `options.queryParams` object hash to the constructor.
	
	       @property {string} currentPage = "page"
	       @property {string} pageSize = "per_page"
	       @property {string} totalPages = "total_pages"
	       @property {string} totalRecords = "total_entries"
	       @property {string} sortKey = "sort_by"
	       @property {string} order = "order"
	       @property {string} directions = {"-1": "asc", "1": "desc"} - A map for
	       translating a PageableCollection#state.order constant to the ones your
	       server API accepts.
	    */
	    queryParams: {
	      currentPage: "page",
	      pageSize: "per_page",
	      totalPages: "total_pages",
	      totalRecords: "total_entries",
	      sortKey: "sort_by",
	      order: "order",
	      directions: {
	        "-1": "asc",
	        "1": "desc"
	      }
	    },
	
	    /**
	       Given a list of models or model attributues, bootstraps the full
	       collection in client mode or infinite mode, or just the page you want in
	       server mode.
	
	       If you want to initialize a collection to a different state than the
	       default, you can specify them in `options.state`. Any state parameters
	       supplied will be merged with the default. If you want to change the
	       default mapping from PageableCollection#state keys to your server API's
	       query parameter names, you can specifiy an object hash in
	       `option.queryParams`. Likewise, any mapping provided will be merged with
	       the default. Lastly, all Backbone.Collection constructor options are also
	       accepted.
	
	       See:
	
	       - PageableCollection#state
	       - PageableCollection#queryParams
	       - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)
	
	       @constructor
	
	       @property {Backbone.Collection} fullCollection - __CLIENT MODE ONLY__
	       This collection is the internal storage for the bootstrapped or fetched
	       models. You can use this if you want to operate on all the pages.
	
	       @param {Array.<Object>} models
	
	       @param {Object} options
	
	       @param {function(*, *): number} options.comparator - If specified, this
	       comparator is set to the current page under server mode, or the
	       PageableCollection#fullCollection otherwise.
	
	       @param {boolean} options.full 0 If `false` and either a
	       `options.comparator` or `sortKey` is defined, the comparator is attached
	       to the current page. Default is `true` under client or infinite mode and
	       the comparator will be attached to the PageableCollection#fullCollection.
	
	       @param {Object} options.state - The state attributes overriding the defaults.
	
	       @param {string} options.state.sortKey - The model attribute to use for
	       sorting. If specified instead of `options.comparator`, a comparator will
	       be automatically created using this value, and optionally a sorting order
	       specified in `options.state.order`. The comparator is then attached to
	       the new collection instance.
	
	       @param {number} options.state.order - The order to use for sorting. Specify
	       -1 for ascending order and 1 for descending order.
	
	       @param {Object} options.queryParam
	    */
	    constructor: function (models, options) {
	
	      BBColProto.constructor.apply(this, arguments);
	
	      options = options || {};
	
	      var mode = this.mode = options.mode || this.mode || PageableProto.mode;
	
	      var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
	                                options.queryParams || {});
	
	      queryParams.directions = _extend({},
	                                       PageableProto.queryParams.directions,
	                                       this.queryParams.directions,
	                                       queryParams.directions);
	
	      this.queryParams = queryParams;
	
	      var state = this.state = _extend({}, PageableProto.state, this.state,
	                                       options.state);
	
	      state.currentPage = state.currentPage == null ?
	        state.firstPage :
	        state.currentPage;
	
	      if (!_isArray(models)) models = models ? [models] : [];
	      models = models.slice();
	
	      if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
	        state.totalRecords = models.length;
	      }
	
	      this.switchMode(mode, _extend({fetch: false,
	                                     resetState: false,
	                                     models: models}, options));
	
	      var comparator = options.comparator;
	
	      if (state.sortKey && !comparator) {
	        this.setSorting(state.sortKey, state.order, options);
	      }
	
	      if (mode != "server") {
	        var fullCollection = this.fullCollection;
	
	        if (comparator && options.full) {
	          this.comparator = null;
	          fullCollection.comparator = comparator;
	        }
	
	        if (options.full) fullCollection.sort();
	
	        // make sure the models in the current page and full collection have the
	        // same references
	        if (!_isEmpty(models)) {
	          this.reset(models, _extend({silent: true}, options));
	          this.getPage(state.currentPage);
	          models.splice.apply(models, [0, models.length].concat(this.models));
	        }
	      }
	
	      this._initState = _clone(this.state);
	    },
	
	    /**
	       Makes a Backbone.Collection that contains all the pages.
	
	       @private
	       @param {Array.<Object|Backbone.Model>} models
	       @param {Object} options Options for Backbone.Collection constructor.
	       @return {Backbone.Collection}
	    */
	    _makeFullCollection: function (models, options) {
	
	      var properties = ["url", "model", "sync", "comparator"];
	      var thisProto = this.constructor.prototype;
	      var i, length, prop;
	
	      var proto = {};
	      for (i = 0, length = properties.length; i < length; i++) {
	        prop = properties[i];
	        if (!_isUndefined(thisProto[prop])) {
	          proto[prop] = thisProto[prop];
	        }
	      }
	
	      var fullCollection = new (Backbone.Collection.extend(proto))(models, options);
	
	      for (i = 0, length = properties.length; i < length; i++) {
	        prop = properties[i];
	        if (this[prop] !== thisProto[prop]) {
	          fullCollection[prop] = this[prop];
	        }
	      }
	
	      return fullCollection;
	    },
	
	    /**
	       Factory method that returns a Backbone event handler that responses to
	       the `add`, `remove`, `reset`, and the `sort` events. The returned event
	       handler will synchronize the current page collection and the full
	       collection's models.
	
	       @private
	
	       @fires PageableCollection#pageable:state:change when handling an
	       `add`, `remove`, or `reset` event
	
	       @param {PageableCollection} pageCol
	       @param {Backbone.Collection} fullCol
	
	       @return {function(string, Backbone.Model, Backbone.Collection, Object)}
	       Collection event handler
	    */
	    _makeCollectionEventHandler: function (pageCol, fullCol) {
	
	      return function collectionEventHandler (event, model, collection, options) {
	
	        var handlers = pageCol._handlers;
	        _each(_keys(handlers), function (event) {
	          var handler = handlers[event];
	          pageCol.off(event, handler);
	          fullCol.off(event, handler);
	        });
	
	        var state = _clone(pageCol.state);
	        var firstPage = state.firstPage;
	        var currentPage = firstPage === 0 ?
	          state.currentPage :
	          state.currentPage - 1;
	        var pageSize = state.pageSize;
	        var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;
	
	        if (event == "add") {
	          var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
	          if (collection == fullCol) {
	            fullIndex = fullCol.indexOf(model);
	            if (fullIndex >= pageStart && fullIndex < pageEnd) {
	              colToAdd = pageCol;
	              pageIndex = addAt = fullIndex - pageStart;
	            }
	          }
	          else {
	            pageIndex = pageCol.indexOf(model);
	            fullIndex = pageStart + pageIndex;
	            colToAdd = fullCol;
	            var addAt = !_isUndefined(options.at) ?
	              options.at + pageStart :
	              fullIndex;
	          }
	
	          if (!options.onRemove) {
	            ++state.totalRecords;
	            delete options.onRemove;
	          }
	
	          pageCol.state = pageCol._checkState(state);
	
	          if (colToAdd) {
	            colToAdd.add(model, _extend({}, options, {at: addAt}));
	            var modelToRemove = pageIndex >= pageSize ?
	              model :
	              !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
	              pageCol.at(pageSize) :
	              null;
	            if (modelToRemove) {
	              runOnceAtLastHandler(collection, event, function () {
	                pageCol.remove(modelToRemove, {onAdd: true});
	              });
	            }
	          }
	
	          if (!options.silent) pageCol.trigger("pageable:state:change", pageCol.state);
	        }
	
	        // remove the model from the other collection as well
	        if (event == "remove") {
	          if (!options.onAdd) {
	            // decrement totalRecords and update totalPages and lastPage
	            if (!--state.totalRecords) {
	              state.totalRecords = null;
	              state.totalPages = null;
	            }
	            else {
	              var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
	              state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
	              if (state.currentPage > totalPages) state.currentPage = state.lastPage;
	            }
	            pageCol.state = pageCol._checkState(state);
	
	            var nextModel, removedIndex = options.index;
	            if (collection == pageCol) {
	              if (nextModel = fullCol.at(pageEnd)) {
	                runOnceAtLastHandler(pageCol, event, function () {
	                  pageCol.push(nextModel, {onRemove: true});
	                });
	              }
	              else if (!pageCol.length && state.totalRecords) {
	                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
	                              _extend({}, options, {parse: false}));
	              }
	              fullCol.remove(model);
	            }
	            else if (removedIndex >= pageStart && removedIndex < pageEnd) {
	              if (nextModel = fullCol.at(pageEnd - 1)) {
	                runOnceAtLastHandler(pageCol, event, function() {
	                  pageCol.push(nextModel, {onRemove: true});
	                });
	              }
	              pageCol.remove(model);
	              if (!pageCol.length && state.totalRecords) {
	                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
	                              _extend({}, options, {parse: false}));
	              }
	            }
	          }
	          else delete options.onAdd;
	
	          if (!options.silent) pageCol.trigger("pageable:state:change", pageCol.state);
	        }
	
	        if (event == "reset") {
	          options = collection;
	          collection = model;
	
	          // Reset that's not a result of getPage
	          if (collection == pageCol && options.from == null &&
	              options.to == null) {
	            var head = fullCol.models.slice(0, pageStart);
	            var tail = fullCol.models.slice(pageStart + pageCol.models.length);
	            fullCol.reset(head.concat(pageCol.models).concat(tail), options);
	          }
	          else if (collection == fullCol) {
	            if (!(state.totalRecords = fullCol.models.length)) {
	              state.totalRecords = null;
	              state.totalPages = null;
	            }
	            if (pageCol.mode == "client") {
	              firstPage = state.lastPage = state.currentPage = state.firstPage;
	              currentPage = firstPage === 0 ? state.currentPage : state.currentPage - 1;
	              pageStart = currentPage * pageSize;
	              pageEnd = pageStart + pageSize;
	            }
	            pageCol.state = pageCol._checkState(state);
	            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
	                          _extend({}, options, {parse: false}));
	          }
	
	          if (!options.silent) pageCol.trigger("pageable:state:change", pageCol.state);
	        }
	
	        if (event == "sort") {
	          options = collection;
	          collection = model;
	          if (collection === fullCol) {
	            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
	                          _extend({}, options, {parse: false}));
	          }
	        }
	
	        _each(_keys(handlers), function (event) {
	          var handler = handlers[event];
	          _each([pageCol, fullCol], function (col) {
	            col.on(event, handler);
	            var callbacks = col._events[event] || [];
	            callbacks.unshift(callbacks.pop());
	          });
	        });
	      };
	    },
	
	    /**
	       Sanity check this collection's pagination states. Only perform checks
	       when all the required pagination state values are defined and not null.
	       If `totalPages` is undefined or null, it is set to `totalRecords` /
	       `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
	       when no error occurs.
	
	       @private
	
	       @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
	       `firstPage` is not a finite integer.
	
	       @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
	       of bounds.
	
	       @return {Object} Returns the `state` object if no error was found.
	    */
	    _checkState: function (state) {
	      var mode = this.mode;
	      var links = this.links;
	      var totalRecords = state.totalRecords;
	      var pageSize = state.pageSize;
	      var currentPage = state.currentPage;
	      var firstPage = state.firstPage;
	      var totalPages = state.totalPages;
	
	      if (totalRecords != null && pageSize != null && currentPage != null &&
	          firstPage != null && (mode == "infinite" ? links : true)) {
	
	        totalRecords = finiteInt(totalRecords, "totalRecords");
	        pageSize = finiteInt(pageSize, "pageSize");
	        currentPage = finiteInt(currentPage, "currentPage");
	        firstPage = finiteInt(firstPage, "firstPage");
	
	        if (pageSize < 1) {
	          throw new RangeError("`pageSize` must be >= 1");
	        }
	
	        totalPages = state.totalPages = ceil(totalRecords / pageSize);
	
	        if (firstPage < 0 || firstPage > 1) {
	          throw new RangeError("`firstPage must be 0 or 1`");
	        }
	
	        state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
	
	        if (mode == "infinite") {
	          if (!links[currentPage + '']) {
	            throw new RangeError("No link found for page " + currentPage);
	          }
	        }
	        else if (currentPage < firstPage ||
	                 (totalPages > 0 &&
	                  (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
	          throw new RangeError("`currentPage` must be firstPage <= currentPage " +
	                               (firstPage ? "<" : "<=") +
	                               " totalPages if " + firstPage + "-based. Got " +
	                               currentPage + '.');
	        }
	      }
	
	      return state;
	    },
	
	    /**
	       Change the page size of this collection.
	
	       Under most if not all circumstances, you should call this method to
	       change the page size of a pageable collection because it will keep the
	       pagination state sane. By default, the method will recalculate the
	       current page number to one that will retain the current page's models
	       when increasing the page size. When decreasing the page size, this method
	       will retain the last models to the current page that will fit into the
	       smaller page size.
	
	       If `options.first` is true, changing the page size will also reset the
	       current page back to the first page instead of trying to be smart.
	
	       For server mode operations, changing the page size will trigger a
	       PageableCollection#fetch and subsequently a `reset` event.
	
	       For client mode operations, changing the page size will `reset` the
	       current page by recalculating the current page boundary on the client
	       side.
	
	       If `options.fetch` is true, a fetch can be forced if the collection is in
	       client mode.
	
	       @param {number} pageSize - The new page size to set to PageableCollection#state.
	       @param {Object} options - {@link PageableCollection#fetch} options.
	       @param {boolean} options.first = false 0 Reset the current page number to
	       the first page if `true`.
	       @param {boolean} options.fetch - If `true`, force a fetch in client mode.
	
	       @throws {TypeError} If `pageSize` is not a finite integer.
	       @throws {RangeError} If `pageSize` is less than 1.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    setPageSize: function (pageSize, options) {
	      pageSize = finiteInt(pageSize, "pageSize");
	
	      options = options || {first: false};
	
	      var state = this.state;
	      var totalPages = ceil(state.totalRecords / pageSize);
	      var currentPage = totalPages ?
	          max(state.firstPage, floor(totalPages * state.currentPage / state.totalPages)) :
	        state.firstPage;
	
	      state = this.state = this._checkState(_extend({}, state, {
	        pageSize: pageSize,
	        currentPage: options.first ? state.firstPage : currentPage,
	        totalPages: totalPages
	      }));
	
	      return this.getPage(state.currentPage, _omit(options, ["first"]));
	    },
	
	    /**
	       Switching between client, server and infinite mode.
	
	       If switching from client to server mode, the #fullCollection is emptied
	       first and then deleted and a fetch is immediately issued for the current
	       page from the server. Pass `false` to `options.fetch` to skip fetching.
	
	       If switching to infinite mode, and if `options.models` is given for an
	       array of models,PageableCollection#links will be populated with a URL per
	       page, using the default URL for this collection.
	
	       If switching from server to client mode, all of the pages are immediately
	       refetched. If you have too many pages, you can pass `false` to
	       `options.fetch` to skip fetching.
	
	       If switching to any mode from infinite mode, thePageableCollection#links
	       will be deleted.
	
	       @fires PageableCollection#pageable:state:change
	
	       @param {"server"|"client"|"infinite"} mode - The mode to switch to.
	
	       @param {Object} options
	
	       @param {boolean} options.fetch = true - If `false`, no fetching is done.
	
	       @param {boolean} options.resetState = true - If 'false', the state is not
	       reset, but checked for sanity instead.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this if `options.fetch` is `false`.
	    */
	    switchMode: function (mode, options) {
	
	      if (!_contains(["server", "client", "infinite"], mode)) {
	        throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
	      }
	
	      options = options || {fetch: true, resetState: true};
	
	      var state = this.state = options.resetState ?
	        _clone(this._initState) :
	        this._checkState(_extend({}, this.state));
	
	      this.mode = mode;
	
	      var self = this;
	      var fullCollection = this.fullCollection;
	      var handlers = this._handlers = this._handlers || {}, handler;
	      if (mode != "server" && !fullCollection) {
	        fullCollection = this._makeFullCollection(options.models || [], options);
	        fullCollection.pageableCollection = this;
	        this.fullCollection = fullCollection;
	        var allHandler = this._makeCollectionEventHandler(this, fullCollection);
	        _each(["add", "remove", "reset", "sort"], function (event) {
	          handlers[event] = handler = _.bind(allHandler, {}, event);
	          self.on(event, handler);
	          fullCollection.on(event, handler);
	        });
	        fullCollection.comparator = this._fullComparator;
	      }
	      else if (mode == "server" && fullCollection) {
	        _each(_keys(handlers), function (event) {
	          handler = handlers[event];
	          self.off(event, handler);
	          fullCollection.off(event, handler);
	        });
	        delete this._handlers;
	        this._fullComparator = fullCollection.comparator;
	        delete this.fullCollection;
	      }
	
	      if (mode == "infinite") {
	        var links = this.links = {};
	        var firstPage = state.firstPage;
	        var totalPages = ceil(state.totalRecords / state.pageSize);
	        var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
	        for (var i = state.firstPage; i <= lastPage; i++) {
	          links[i] = this.url;
	        }
	      }
	      else if (this.links) delete this.links;
	
	      if (!options.silent) this.trigger("pageable:state:change", state);
	
	      return options.fetch ?
	        this.fetch(_omit(options, "fetch", "resetState")) :
	        this;
	    },
	
	    /**
	       @return {boolean} `true` if this collection can page backward, `false`
	       otherwise.
	    */
	    hasPreviousPage: function () {
	      var state = this.state;
	      var currentPage = state.currentPage;
	      if (this.mode != "infinite") return currentPage > state.firstPage;
	      return !!this.links[currentPage - 1];
	    },
	
	    /**
	       @return {boolean} `true` if this collection can page forward, `false`
	       otherwise.
	    */
	    hasNextPage: function () {
	      var state = this.state;
	      var currentPage = this.state.currentPage;
	      if (this.mode != "infinite") return currentPage < state.lastPage;
	      return !!this.links[currentPage + 1];
	    },
	
	    /**
	       Fetch the first page in server mode, or reset the current page of this
	       collection to the first page in client or infinite mode.
	
	       @param {Object} options {@linkPageableCollection#getPage} options.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getFirstPage: function (options) {
	      return this.getPage("first", options);
	    },
	
	    /**
	       Fetch the previous page in server mode, or reset the current page of this
	       collection to the previous page in client or infinite mode.
	
	       @param {Object} options {@linkPageableCollection#getPage} options.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getPreviousPage: function (options) {
	      return this.getPage("prev", options);
	    },
	
	    /**
	       Fetch the next page in server mode, or reset the current page of this
	       collection to the next page in client mode.
	
	       @param {Object} options {@linkPageableCollection#getPage} options.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getNextPage: function (options) {
	      return this.getPage("next", options);
	    },
	
	    /**
	       Fetch the last page in server mode, or reset the current page of this
	       collection to the last page in client mode.
	
	       @param {Object} options {@linkPageableCollection#getPage} options.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getLastPage: function (options) {
	      return this.getPage("last", options);
	    },
	
	    /**
	       Given a page index, set PageableCollection#state.currentPage to that
	       index. If this collection is in server mode, fetch the page using the
	       updated state, otherwise, reset the current page of this collection to
	       the page specified by `index` in client mode. If `options.fetch` is true,
	       a fetch can be forced in client mode before resetting the current
	       page. Under infinite mode, if the index is less than the current page, a
	       reset is done as in client mode. If the index is greater than the current
	       page number, a fetch is made with the results **appended**
	       toPageableCollection#fullCollection.  The current page will then be reset
	       after fetching.
	
	       @fires PageableCollection#pageable:state:change
	
	       @param {number|string} index - The page index to go to, or the page name to
	       look up fromPageableCollection#links in infinite mode.
	       @param {Object} options - {@linkPageableCollection#fetch} options or
	       [reset](http://backbonejs.org/#Collection-reset) options for client mode
	       when `options.fetch` is `false`.
	       @param {boolean} options.fetch = false - If true, force a
	       {@linkPageableCollection#fetch} in client mode.
	
	       @throws {TypeError} If `index` is not a finite integer under server or
	       client mode, or does not yield a URL fromPageableCollection#links under
	       infinite mode.
	
	       @throws {RangeError} If `index` is out of bounds.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getPage: function (index, options) {
	
	      var mode = this.mode, fullCollection = this.fullCollection;
	
	      options = options || {fetch: false};
	
	      var state = this.state,
	      firstPage = state.firstPage,
	      currentPage = state.currentPage,
	      lastPage = state.lastPage,
	      pageSize = state.pageSize;
	
	      var pageNum = index;
	      switch (index) {
	        case "first": pageNum = firstPage; break;
	        case "prev": pageNum = currentPage - 1; break;
	        case "next": pageNum = currentPage + 1; break;
	        case "last": pageNum = lastPage; break;
	        default: pageNum = finiteInt(index, "index");
	      }
	
	      this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));
	      if (!options.silent) this.trigger("pageable:state:change", this.state);
	
	      options.from = currentPage, options.to = pageNum;
	
	      var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
	      var pageModels = fullCollection && fullCollection.length ?
	        fullCollection.models.slice(pageStart, pageStart + pageSize) :
	        [];
	      if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
	          !options.fetch) {
	        this.reset(pageModels, _omit(options, "fetch"));
	        return this;
	      }
	
	      if (mode == "infinite") options.url = this.links[pageNum];
	
	      return this.fetch(_omit(options, "fetch"));
	    },
	
	    /**
	       Fetch the page for the provided item offset in server mode, or reset the
	       current page of this collection to the page for the provided item offset
	       in client mode.
	
	       @param {Object} options {@linkPageableCollection#getPage} options.
	
	       @chainable
	       @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
	       from fetch or this.
	    */
	    getPageByOffset: function (offset, options) {
	      if (offset < 0) {
	        throw new RangeError("`offset must be > 0`");
	      }
	      offset = finiteInt(offset);
	
	      var page = floor(offset / this.state.pageSize);
	      if (this.state.firstPage !== 0) page++;
	      if (page > this.state.lastPage) page = this.state.lastPage;
	      return this.getPage(page, options);
	    },
	
	    /**
	       Overidden to make `getPage` compatible with Zepto.
	
	       @param {string} method
	       @param {Backbone.Model|Backbone.Collection} model
	       @param {Object} options
	
	       @return {XMLHttpRequest}
	    */
	    sync: function (method, model, options) {
	      var self = this;
	      if (self.mode == "infinite") {
	        var success = options.success;
	        var currentPage = self.state.currentPage;
	        options.success = function (resp, status, xhr) {
	          var links = self.links;
	          var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
	          if (newLinks.first) links[self.state.firstPage] = newLinks.first;
	          if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
	          if (newLinks.next) links[currentPage + 1] = newLinks.next;
	          if (success) success(resp, status, xhr);
	        };
	      }
	
	      return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
	    },
	
	    /**
	       Parse pagination links from the server response. Only valid under
	       infinite mode.
	
	       Given a response body and a XMLHttpRequest object, extract pagination
	       links from them for infinite paging.
	
	       This default implementation parses the RFC 5988 `Link` header and extract
	       3 links from it - `first`, `prev`, `next`. Any subclasses overriding this
	       method __must__ return an object hash having only the keys
	       above. However, simply returning a `next` link or an empty hash if there
	       are no more links should be enough for most implementations.
	
	       @param {*} resp The deserialized response body.
	       @param {Object} options
	       @param {XMLHttpRequest} options.xhr - The XMLHttpRequest object for this
	       response.
	       @return {Object}
	    */
	    parseLinks: function (resp, options) {
	      var links = {};
	      var linkHeader = options.xhr.getResponseHeader("Link");
	      if (linkHeader) {
	        var relations = ["first", "prev", "next"];
	        _each(linkHeader.split(","), function (linkValue) {
	          var linkParts = linkValue.split(";");
	          var url = linkParts[0].replace(URL_TRIM_RE, '');
	          var params = linkParts.slice(1);
	          _each(params, function (param) {
	            var paramParts = param.split("=");
	            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
	            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
	            if (key == "rel" && _contains(relations, value)) links[value] = url;
	          });
	        });
	      }
	
	      return links;
	    },
	
	    /**
	       Parse server response data.
	
	       This default implementation assumes the response data is in one of two
	       structures:
	
	           [
	             {}, // Your new pagination state
	             [{}, ...] // An array of JSON objects
	           ]
	
	       Or,
	
	           [{}] // An array of JSON objects
	
	       The first structure is the preferred form because the pagination states
	       may have been updated on the server side, sending them down again allows
	       this collection to update its states. If the response has a pagination
	       state object, it is checked for errors.
	
	       The second structure is the
	       [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
	       default.
	
	       **Note:** this method has been further simplified since 1.1.7. While
	       existingPageableCollection#parse implementations will continue to work,
	       new code is encouraged to overridePageableCollection#parseState
	       andPageableCollection#parseRecords instead.
	
	       @param {Object} resp The deserialized response data from the server.
	       @param {Object} the options for the ajax request
	
	       @return {Array.<Object>} An array of model objects
	    */
	    parse: function (resp, options) {
	      var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
	      if (newState) this.state = this._checkState(_extend({}, this.state, newState));
	      return this.parseRecords(resp, options);
	    },
	
	    /**
	       Parse server response for server pagination state updates. Not applicable
	       under infinite mode.
	
	       This default implementation first checks whether the response has any
	       state object as documented inPageableCollection#parse. If it exists, a
	       state object is returned by mapping the server state keys to this
	       pageable collection instance's query parameter keys using `queryParams`.
	
	       It is __NOT__ neccessary to return a full state object complete with all
	       the mappings defined inPageableCollection#queryParams. Any state object
	       resulted is merged with a copy of the current pageable collection state
	       and checked for sanity before actually updating. Most of the time, simply
	       providing a new `totalRecords` value is enough to trigger a full
	       pagination state recalculation.
	
	           parseState: function (resp, queryParams, state, options) {
	             return {totalRecords: resp.total_entries};
	           }
	
	       If you want to use header fields use:
	
	           parseState: function (resp, queryParams, state, options) {
	               return {totalRecords: options.xhr.getResponseHeader("X-total")};
	           }
	
	       This method __MUST__ return a new state object instead of directly
	       modifying the PageableCollection#state object. The behavior of directly
	       modifying PageableCollection#state is undefined.
	
	       @param {Object} resp - The deserialized response data from the server.
	       @param {Object} queryParams - A copy of PageableCollection#queryParams.
	       @param {Object} state - A copy of PageableCollection#state.
	       @param {Object} options - The options passed through from
	       `parse`. (backbone >= 0.9.10 only)
	
	       @return {Object} A new (partial) state object.
	     */
	    parseState: function (resp, queryParams, state, options) {
	      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
	
	        var newState = _clone(state);
	        var serverState = resp[0];
	
	        _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
	          var k = kvp[0], v = kvp[1];
	          var serverVal = serverState[v];
	          if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
	        });
	
	        if (serverState.order) {
	          newState.order = _invert(queryParams.directions)[serverState.order] * 1;
	        }
	
	        return newState;
	      }
	    },
	
	    /**
	       Parse server response for an array of model objects.
	
	       This default implementation first checks whether the response has any
	       state object as documented inPageableCollection#parse. If it exists, the
	       array of model objects is assumed to be the second element, otherwise the
	       entire response is returned directly.
	
	       @param {Object} resp - The deserialized response data from the server.
	       @param {Object} options - The options passed through from the
	       `parse`. (backbone >= 0.9.10 only)
	
	       @return {Array.<Object>} An array of model objects
	     */
	    parseRecords: function (resp, options) {
	      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
	        return resp[1];
	      }
	
	      return resp;
	    },
	
	    /**
	       Fetch a page from the server in server mode, or all the pages in client
	       mode. Under infinite mode, the current page is refetched by default and
	       then reset.
	
	       The query string is constructed by translating the current pagination
	       state to your server API query parameter
	       usingPageableCollection#queryParams. The current page will reset after
	       fetch.
	
	       @param {Object} options - Accepts all
	       [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
	       options.
	
	       @return {XMLHttpRequest}
	    */
	    fetch: function (options) {
	
	      options = options || {};
	
	      var state = this._checkState(this.state);
	
	      var mode = this.mode;
	
	      if (mode == "infinite" && !options.url) {
	        options.url = this.links[state.currentPage];
	      }
	
	      var data = options.data || {};
	
	      // dedup query params
	      var url = options.url || this.url || "";
	      if (_isFunction(url)) url = url.call(this);
	      var qsi = url.indexOf('?');
	      if (qsi != -1) {
	        _extend(data, queryStringToParams(url.slice(qsi + 1)));
	        url = url.slice(0, qsi);
	      }
	
	      options.url = url;
	      options.data = data;
	
	      // map params except directions
	      var queryParams = this.mode == "client" ?
	        _pick(this.queryParams, "sortKey", "order") :
	        _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
	              "directions");
	
	      var thisCopy = _.clone(this);
	      _.each(queryParams, function (v, k) {
	        v = _isFunction(v) ? v.call(thisCopy) : v;
	        if (state[k] != null && v != null && _.isUndefined(data[v])) {
	          data[v] = state[k];
	        }
	      }, this);
	
	      // fix up sorting parameters
	      var i;
	      if (state.sortKey && state.order) {
	        var o = _isFunction(queryParams.order) ?
	          queryParams.order.call(thisCopy) :
	          queryParams.order;
	          if (!_isArray(state.order)) {
	              data[o] = this.queryParams.directions[state.order + ""];
	          }
	          else {
	              data[o] = [];
	              for (i = 0; i < state.order.length; i += 1) {
	                  data[o].push(this.queryParams.directions[state.order[i]]);
	              }
	          }
	      }
	      else if (!state.sortKey) delete data[queryParams.order];
	
	      // map extra query parameters
	      var extraKvps = _pairs(_omit(this.queryParams,
	                                   _keys(PageableProto.queryParams))),
	          kvp,
	          v;
	      for (i = 0; i < extraKvps.length; i++) {
	        kvp = extraKvps[i];
	        v = kvp[1];
	        v = _isFunction(v) ? v.call(thisCopy) : v;
	        if (v != null) data[kvp[0]] = v;
	      }
	
	      if (mode != "server") {
	        var self = this, fullCol = this.fullCollection;
	        var success = options.success;
	        options.success = function (col, resp, opts) {
	
	          // make sure the caller's intent is obeyed
	          opts = opts || {};
	          if (_isUndefined(options.silent)) delete opts.silent;
	          else opts.silent = options.silent;
	
	          var models = col.models;
	          if (mode == "client") fullCol.reset(models, opts);
	          else {
	            fullCol.add(models, _extend({at: fullCol.length},
	                                        _extend(opts, {parse: false})));
	            self.trigger("reset", self, opts);
	          }
	
	          if (success) success(col, resp, opts);
	        };
	
	        // silent the first reset from backbone
	        return BBColProto.fetch.call(this, _extend({}, options, {silent: true}));
	      }
	
	      return BBColProto.fetch.call(this, options);
	    },
	
	    /**
	       Convenient method for making a `comparator` sorted by a model attribute
	       identified by `sortKey` and ordered by `order`.
	
	       Like a Backbone.Collection, a PageableCollection will maintain the
	       __current page__ in sorted order on the client side if a `comparator` is
	       attached to it. If the collection is in client mode, you can attach a
	       comparator toPageableCollection#fullCollection to have all the pages
	       reflect the global sorting order by specifying an option `full` to
	       `true`. You __must__ call `sort` manually
	       orPageableCollection#fullCollection.sort after calling this method to
	       force a resort.
	
	       While you can use this method to sort the current page in server mode,
	       the sorting order may not reflect the global sorting order due to the
	       additions or removals of the records on the server since the last
	       fetch. If you want the most updated page in a global sorting order, it is
	       recommended that you set PageableCollection#state.sortKey and optionally
	       PageableCollection#state.order, and then callPageableCollection#fetch.
	
	       @protected
	
	       @param {string} sortKey = this.state.sortKey - See `state.sortKey`.
	       @param {number} order = this.state.order - See `state.order`.
	       @param {(function(Backbone.Model, string): Object) | string} sortValue -
	       See PageableCollection#setSorting.
	
	       See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
	    */
	    _makeComparator: function (sortKey, order, sortValue) {
	      var state = this.state;
	
	      sortKey = sortKey || state.sortKey;
	      order = order || state.order;
	
	      if (!sortKey || !order) return;
	
	      if (!sortValue) sortValue = function (model, attr) {
	        return model.get(attr);
	      };
	
	      return function (left, right) {
	        var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
	        if (order === 1) t = l, l = r, r = t;
	        if (l === r) return 0;
	        else if (l < r) return -1;
	        return 1;
	      };
	    },
	
	    /**
	       Adjusts the sorting for this pageable collection.
	
	       Given a `sortKey` and an `order`, sets `state.sortKey` and
	       `state.order`. A comparator can be applied on the client side to sort in
	       the order defined if `options.side` is `"client"`. By default the
	       comparator is applied to thePageableCollection#fullCollection. Set
	       `options.full` to `false` to apply a comparator to the current page under
	       any mode. Setting `sortKey` to `null` removes the comparator from both
	       the current page and the full collection.
	
	       If a `sortValue` function is given, it will be passed the `(model,
	       sortKey)` arguments and is used to extract a value from the model during
	       comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
	       used for sorting.
	
	       @chainable
	
	       @param {string} sortKey - See `state.sortKey`.
	       @param {number} order=this.state.order - See `state.order`.
	       @param {Object} options
	       @param {string} options.side - By default, `"client"` if `mode` is
	       `"client"`, `"server"` otherwise.
	       @param {boolean} options.full = true
	       @param {(function(Backbone.Model, string): Object) | string} options.sortValue
	    */
	    setSorting: function (sortKey, order, options) {
	
	      var state = this.state;
	
	      state.sortKey = sortKey;
	      state.order = order = order || state.order;
	
	      var fullCollection = this.fullCollection;
	
	      var delComp = false, delFullComp = false;
	
	      if (!sortKey) delComp = delFullComp = true;
	
	      var mode = this.mode;
	      options = _extend({side: mode == "client" ? mode : "server", full: true},
	                        options);
	
	      var comparator = this._makeComparator(sortKey, order, options.sortValue);
	
	      var full = options.full, side = options.side;
	
	      if (side == "client") {
	        if (full) {
	          if (fullCollection) fullCollection.comparator = comparator;
	          delComp = true;
	        }
	        else {
	          this.comparator = comparator;
	          delFullComp = true;
	        }
	      }
	      else if (side == "server" && !full) {
	        this.comparator = comparator;
	      }
	
	      if (delComp) this.comparator = null;
	      if (delFullComp && fullCollection) fullCollection.comparator = null;
	
	      return this;
	    }
	
	  });
	
	  var PageableProto = PageableCollection.prototype;
	
	  return PageableCollection;
	
	}));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Backbone.Wreqr (Backbone.Marionette)
	// ----------------------------------
	// v1.3.6
	//
	// Copyright (c)2016 Derick Bailey, Muted Solutions, LLC.
	// Distributed under MIT license
	//
	// http://github.com/marionettejs/backbone.wreqr
	
	
	(function(root, factory) {
	
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Backbone, _) {
	      return factory(Backbone, _);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    var Backbone = require('backbone');
	    var _ = require('underscore');
	    module.exports = factory(Backbone, _);
	  } else {
	    factory(root.Backbone, root._);
	  }
	
	}(this, function(Backbone, _) {
	  "use strict";
	
	  var previousWreqr = Backbone.Wreqr;
	
	  var Wreqr = Backbone.Wreqr = {};
	
	  Backbone.Wreqr.VERSION = '1.3.6';
	
	  Backbone.Wreqr.noConflict = function () {
	    Backbone.Wreqr = previousWreqr;
	    return this;
	  };
	
	  // Handlers
	  // --------
	  // A registry of functions to call, given a name
	  
	  Wreqr.Handlers = (function(Backbone, _){
	    "use strict";
	    
	    // Constructor
	    // -----------
	  
	    var Handlers = function(options){
	      this.options = options;
	      this._wreqrHandlers = {};
	      
	      if (_.isFunction(this.initialize)){
	        this.initialize(options);
	      }
	    };
	  
	    Handlers.extend = Backbone.Model.extend;
	  
	    // Instance Members
	    // ----------------
	  
	    _.extend(Handlers.prototype, Backbone.Events, {
	  
	      // Add multiple handlers using an object literal configuration
	      setHandlers: function(handlers){
	        _.each(handlers, function(handler, name){
	          var context = null;
	  
	          if (_.isObject(handler) && !_.isFunction(handler)){
	            context = handler.context;
	            handler = handler.callback;
	          }
	  
	          this.setHandler(name, handler, context);
	        }, this);
	      },
	  
	      // Add a handler for the given name, with an
	      // optional context to run the handler within
	      setHandler: function(name, handler, context){
	        var config = {
	          callback: handler,
	          context: context
	        };
	  
	        this._wreqrHandlers[name] = config;
	  
	        this.trigger("handler:add", name, handler, context);
	      },
	  
	      // Determine whether or not a handler is registered
	      hasHandler: function(name){
	        return !! this._wreqrHandlers[name];
	      },
	  
	      // Get the currently registered handler for
	      // the specified name. Throws an exception if
	      // no handler is found.
	      getHandler: function(name){
	        var config = this._wreqrHandlers[name];
	  
	        if (!config){
	          return;
	        }
	  
	        return function(){
	          return config.callback.apply(config.context, arguments);
	        };
	      },
	  
	      // Remove a handler for the specified name
	      removeHandler: function(name){
	        delete this._wreqrHandlers[name];
	      },
	  
	      // Remove all handlers from this registry
	      removeAllHandlers: function(){
	        this._wreqrHandlers = {};
	      }
	    });
	  
	    return Handlers;
	  })(Backbone, _);
	  
	  // Wreqr.CommandStorage
	  // --------------------
	  //
	  // Store and retrieve commands for execution.
	  Wreqr.CommandStorage = (function(){
	    "use strict";
	  
	    // Constructor function
	    var CommandStorage = function(options){
	      this.options = options;
	      this._commands = {};
	  
	      if (_.isFunction(this.initialize)){
	        this.initialize(options);
	      }
	    };
	  
	    // Instance methods
	    _.extend(CommandStorage.prototype, Backbone.Events, {
	  
	      // Get an object literal by command name, that contains
	      // the `commandName` and the `instances` of all commands
	      // represented as an array of arguments to process
	      getCommands: function(commandName){
	        var commands = this._commands[commandName];
	  
	        // we don't have it, so add it
	        if (!commands){
	  
	          // build the configuration
	          commands = {
	            command: commandName, 
	            instances: []
	          };
	  
	          // store it
	          this._commands[commandName] = commands;
	        }
	  
	        return commands;
	      },
	  
	      // Add a command by name, to the storage and store the
	      // args for the command
	      addCommand: function(commandName, args){
	        var command = this.getCommands(commandName);
	        command.instances.push(args);
	      },
	  
	      // Clear all commands for the given `commandName`
	      clearCommands: function(commandName){
	        var command = this.getCommands(commandName);
	        command.instances = [];
	      }
	    });
	  
	    return CommandStorage;
	  })();
	  
	  // Wreqr.Commands
	  // --------------
	  //
	  // A simple command pattern implementation. Register a command
	  // handler and execute it.
	  Wreqr.Commands = (function(Wreqr, _){
	    "use strict";
	  
	    return Wreqr.Handlers.extend({
	      // default storage type
	      storageType: Wreqr.CommandStorage,
	  
	      constructor: function(options){
	        this.options = options || {};
	  
	        this._initializeStorage(this.options);
	        this.on("handler:add", this._executeCommands, this);
	  
	        Wreqr.Handlers.prototype.constructor.apply(this, arguments);
	      },
	  
	      // Execute a named command with the supplied args
	      execute: function(name){
	        name = arguments[0];
	        var args = _.rest(arguments);
	  
	        if (this.hasHandler(name)){
	          this.getHandler(name).apply(this, args);
	        } else {
	          this.storage.addCommand(name, args);
	        }
	  
	      },
	  
	      // Internal method to handle bulk execution of stored commands
	      _executeCommands: function(name, handler, context){
	        var command = this.storage.getCommands(name);
	  
	        // loop through and execute all the stored command instances
	        _.each(command.instances, function(args){
	          handler.apply(context, args);
	        });
	  
	        this.storage.clearCommands(name);
	      },
	  
	      // Internal method to initialize storage either from the type's
	      // `storageType` or the instance `options.storageType`.
	      _initializeStorage: function(options){
	        var storage;
	  
	        var StorageType = options.storageType || this.storageType;
	        if (_.isFunction(StorageType)){
	          storage = new StorageType();
	        } else {
	          storage = StorageType;
	        }
	  
	        this.storage = storage;
	      }
	    });
	  
	  })(Wreqr, _);
	  
	  // Wreqr.RequestResponse
	  // ---------------------
	  //
	  // A simple request/response implementation. Register a
	  // request handler, and return a response from it
	  Wreqr.RequestResponse = (function(Wreqr, _){
	    "use strict";
	  
	    return Wreqr.Handlers.extend({
	      request: function(name){
	        if (this.hasHandler(name)) {
	          return this.getHandler(name).apply(this, _.rest(arguments));
	        }
	      }
	    });
	  
	  })(Wreqr, _);
	  
	  // Event Aggregator
	  // ----------------
	  // A pub-sub object that can be used to decouple various parts
	  // of an application through event-driven architecture.
	  
	  Wreqr.EventAggregator = (function(Backbone, _){
	    "use strict";
	    var EA = function(){};
	  
	    // Copy the `extend` function used by Backbone's classes
	    EA.extend = Backbone.Model.extend;
	  
	    // Copy the basic Backbone.Events on to the event aggregator
	    _.extend(EA.prototype, Backbone.Events);
	  
	    return EA;
	  })(Backbone, _);
	  
	  // Wreqr.Channel
	  // --------------
	  //
	  // An object that wraps the three messaging systems:
	  // EventAggregator, RequestResponse, Commands
	  Wreqr.Channel = (function(Wreqr){
	    "use strict";
	  
	    var Channel = function(channelName) {
	      this.vent        = new Backbone.Wreqr.EventAggregator();
	      this.reqres      = new Backbone.Wreqr.RequestResponse();
	      this.commands    = new Backbone.Wreqr.Commands();
	      this.channelName = channelName;
	    };
	  
	    _.extend(Channel.prototype, {
	  
	      // Remove all handlers from the messaging systems of this channel
	      reset: function() {
	        this.vent.off();
	        this.vent.stopListening();
	        this.reqres.removeAllHandlers();
	        this.commands.removeAllHandlers();
	        return this;
	      },
	  
	      // Connect a hash of events; one for each messaging system
	      connectEvents: function(hash, context) {
	        this._connect('vent', hash, context);
	        return this;
	      },
	  
	      connectCommands: function(hash, context) {
	        this._connect('commands', hash, context);
	        return this;
	      },
	  
	      connectRequests: function(hash, context) {
	        this._connect('reqres', hash, context);
	        return this;
	      },
	  
	      // Attach the handlers to a given message system `type`
	      _connect: function(type, hash, context) {
	        if (!hash) {
	          return;
	        }
	  
	        context = context || this;
	        var method = (type === 'vent') ? 'on' : 'setHandler';
	  
	        _.each(hash, function(fn, eventName) {
	          this[type][method](eventName, _.bind(fn, context));
	        }, this);
	      }
	    });
	  
	  
	    return Channel;
	  })(Wreqr);
	  
	  // Wreqr.Radio
	  // --------------
	  //
	  // An object that lets you communicate with many channels.
	  Wreqr.radio = (function(Wreqr, _){
	    "use strict";
	  
	    var Radio = function() {
	      this._channels = {};
	      this.vent = {};
	      this.commands = {};
	      this.reqres = {};
	      this._proxyMethods();
	    };
	  
	    _.extend(Radio.prototype, {
	  
	      channel: function(channelName) {
	        if (!channelName) {
	          throw new Error('Channel must receive a name');
	        }
	  
	        return this._getChannel( channelName );
	      },
	  
	      _getChannel: function(channelName) {
	        var channel = this._channels[channelName];
	  
	        if(!channel) {
	          channel = new Wreqr.Channel(channelName);
	          this._channels[channelName] = channel;
	        }
	  
	        return channel;
	      },
	  
	      _proxyMethods: function() {
	        _.each(['vent', 'commands', 'reqres'], function(system) {
	          _.each( messageSystems[system], function(method) {
	            this[system][method] = proxyMethod(this, system, method);
	          }, this);
	        }, this);
	      }
	    });
	  
	  
	    var messageSystems = {
	      vent: [
	        'on',
	        'off',
	        'trigger',
	        'once',
	        'stopListening',
	        'listenTo',
	        'listenToOnce'
	      ],
	  
	      commands: [
	        'execute',
	        'setHandler',
	        'setHandlers',
	        'removeHandler',
	        'removeAllHandlers'
	      ],
	  
	      reqres: [
	        'request',
	        'setHandler',
	        'setHandlers',
	        'removeHandler',
	        'removeAllHandlers'
	      ]
	    };
	  
	    var proxyMethod = function(radio, system, method) {
	      return function(channelName) {
	        var messageSystem = radio._getChannel(channelName)[system];
	  
	        return messageSystem[method].apply(messageSystem, _.rest(arguments));
	      };
	    };
	  
	    return new Radio();
	  
	  })(Wreqr, _);
	  
	
	  return Backbone.Wreqr;
	
	}));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  backgrid 0.3.7
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2016 Jimmy Yuen Ho Wong and contributors <wyuenho@gmail.com>
	  Licensed under the MIT license.
	*/
	
	(function (root, factory) {
	
	  if (true) {
	    // AMD (+ global for extensions)
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone) {
	      return (root.Backgrid = factory(_, Backbone));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === "object") {
	    // CommonJS
	    var Backbone = require("backbone");
	    Backbone.$ = Backbone.$ || require("jquery");
	    module.exports = factory(require("underscore"), Backbone);
	  } else {
	    // Browser
	    root.Backgrid = factory(root._, root.Backbone);
	  }}(this, function (_, Backbone) {
	
	  "use strict";
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	// Copyright 2009, 2010 Kristopher Michael Kowal
	// https://github.com/kriskowal/es5-shim
	// ES5 15.5.4.20
	// http://es5.github.com/#x15.5.4.20
	var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
	  "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
	  "\u2029\uFEFF";
	if (!String.prototype.trim || ws.trim()) {
	  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
	  // http://perfectionkills.com/whitespace-deviations/
	  ws = "[" + ws + "]";
	  var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
	  trimEndRegexp = new RegExp(ws + ws + "*$");
	  String.prototype.trim = function trim() {
	    if (this === undefined || this === null) {
	      throw new TypeError("can't convert " + this + " to object");
	    }
	    return String(this)
	      .replace(trimBeginRegexp, "")
	      .replace(trimEndRegexp, "");
	  };
	}
	
	function lpad(str, length, padstr) {
	  var paddingLen = length - (str + '').length;
	  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
	  var padding = '';
	  for (var i = 0; i < paddingLen; i++) {
	    padding = padding + padstr;
	  }
	  return padding + str;
	}
	
	var $ = Backbone.$;
	
	var Backgrid = {
	
	  Extension: {},
	
	  resolveNameToClass: function (name, suffix) {
	    if (_.isString(name)) {
	      var key = _.map(name.split('-'), function (e) {
	        return e.slice(0, 1).toUpperCase() + e.slice(1);
	      }).join('') + suffix;
	      var klass = Backgrid[key] || Backgrid.Extension[key];
	      if (_.isUndefined(klass)) {
	        throw new ReferenceError("Class '" + key + "' not found");
	      }
	      return klass;
	    }
	
	    return name;
	  },
	
	  callByNeed: function () {
	    var value = arguments[0];
	    if (!_.isFunction(value)) return value;
	
	    var context = arguments[1];
	    var args = [].slice.call(arguments, 2);
	    return value.apply(context, !!(args + '') ? args : []);
	  }
	
	};
	_.extend(Backgrid, Backbone.Events);
	
	/**
	   Command translates a DOM Event into commands that Backgrid
	   recognizes. Interested parties can listen on selected Backgrid events that
	   come with an instance of this class and act on the commands.
	
	   It is also possible to globally rebind the keyboard shortcuts by replacing
	   the methods in this class' prototype.
	
	   @class Backgrid.Command
	   @constructor
	 */
	var Command = Backgrid.Command = function (evt) {
	  _.extend(this, {
	    altKey: !!evt.altKey,
	    "char": evt["char"],
	    charCode: evt.charCode,
	    ctrlKey: !!evt.ctrlKey,
	    key: evt.key,
	    keyCode: evt.keyCode,
	    locale: evt.locale,
	    location: evt.location,
	    metaKey: !!evt.metaKey,
	    repeat: !!evt.repeat,
	    shiftKey: !!evt.shiftKey,
	    which: evt.which
	  });
	};
	_.extend(Command.prototype, {
	  /**
	     Up Arrow
	
	     @member Backgrid.Command
	   */
	  moveUp: function () { return this.keyCode == 38; },
	  /**
	     Down Arrow
	
	     @member Backgrid.Command
	   */
	  moveDown: function () { return this.keyCode === 40; },
	  /**
	     Shift Tab
	
	     @member Backgrid.Command
	   */
	  moveLeft: function () { return this.shiftKey && this.keyCode === 9; },
	  /**
	     Tab
	
	     @member Backgrid.Command
	   */
	  moveRight: function () { return !this.shiftKey && this.keyCode === 9; },
	  /**
	     Enter
	
	     @member Backgrid.Command
	   */
	  save: function () { return this.keyCode === 13; },
	  /**
	     Esc
	
	     @member Backgrid.Command
	   */
	  cancel: function () { return this.keyCode === 27; },
	  /**
	     None of the above.
	
	     @member Backgrid.Command
	   */
	  passThru: function () {
	    return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
	             this.moveRight() || this.save() || this.cancel());
	  }
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   Just a convenient class for interested parties to subclass.
	
	   The default Cell classes don't require the formatter to be a subclass of
	   Formatter as long as the fromRaw(rawData) and toRaw(formattedData) methods
	   are defined.
	
	   @abstract
	   @class Backgrid.CellFormatter
	   @constructor
	*/
	var CellFormatter = Backgrid.CellFormatter = function () {};
	_.extend(CellFormatter.prototype, {
	
	  /**
	     Takes a raw value from a model and returns an optionally formatted string
	     for display. The default implementation simply returns the supplied value
	     as is without any type conversion.
	
	     @member Backgrid.CellFormatter
	     @param {*} rawData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {*}
	  */
	  fromRaw: function (rawData, model) {
	    return rawData;
	  },
	
	  /**
	     Takes a formatted string, usually from user input, and returns a
	     appropriately typed value for persistence in the model.
	
	     If the user input is invalid or unable to be converted to a raw value
	     suitable for persistence in the model, toRaw must return `undefined`.
	
	     @member Backgrid.CellFormatter
	     @param {string} formattedData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {*|undefined}
	  */
	  toRaw: function (formattedData, model) {
	    return formattedData;
	  }
	
	});
	
	/**
	   A floating point number formatter. Doesn't understand scientific notation at
	   the moment.
	
	   @class Backgrid.NumberFormatter
	   @extends Backgrid.CellFormatter
	   @constructor
	   @throws {RangeError} If decimals < 0 or > 20.
	*/
	var NumberFormatter = Backgrid.NumberFormatter = function (options) {
	  _.extend(this, this.defaults, options || {});
	
	  if (this.decimals < 0 || this.decimals > 20) {
	    throw new RangeError("decimals must be between 0 and 20");
	  }
	};
	NumberFormatter.prototype = new CellFormatter();
	_.extend(NumberFormatter.prototype, {
	
	  /**
	     @member Backgrid.NumberFormatter
	     @cfg {Object} options
	
	     @cfg {number} [options.decimals=2] Number of decimals to display. Must be an integer.
	
	     @cfg {string} [options.decimalSeparator='.'] The separator to use when
	     displaying decimals.
	
	     @cfg {string} [options.orderSeparator=','] The separator to use to
	     separator thousands. May be an empty string.
	   */
	  defaults: {
	    decimals: 2,
	    decimalSeparator: '.',
	    orderSeparator: ','
	  },
	
	  HUMANIZED_NUM_RE: /(\d)(?=(?:\d{3})+$)/g,
	
	  /**
	     Takes a floating point number and convert it to a formatted string where
	     every thousand is separated by `orderSeparator`, with a `decimal` number of
	     decimals separated by `decimalSeparator`. The number returned is rounded
	     the usual way.
	
	     @member Backgrid.NumberFormatter
	     @param {number} number
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string}
	  */
	  fromRaw: function (number, model) {
	    if (_.isNull(number) || _.isUndefined(number)) return '';
	
	    number = parseFloat(number).toFixed(~~this.decimals);
	
	    var parts = number.split('.');
	    var integerPart = parts[0];
	    var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';
	
	    return integerPart.replace(this.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
	  },
	
	  /**
	     Takes a string, possibly formatted with `orderSeparator` and/or
	     `decimalSeparator`, and convert it back to a number.
	
	     @member Backgrid.NumberFormatter
	     @param {string} formattedData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {number|undefined} Undefined if the string cannot be converted to
	     a number.
	  */
	  toRaw: function (formattedData, model) {
	    formattedData = formattedData.trim();
	
	    if (formattedData === '') return null;
	
	    var rawData = '';
	
	    var thousands = formattedData.split(this.orderSeparator);
	    for (var i = 0; i < thousands.length; i++) {
	      rawData += thousands[i];
	    }
	
	    var decimalParts = rawData.split(this.decimalSeparator);
	    rawData = '';
	    for (var i = 0; i < decimalParts.length; i++) {
	      rawData = rawData + decimalParts[i] + '.';
	    }
	
	    if (rawData[rawData.length - 1] === '.') {
	      rawData = rawData.slice(0, rawData.length - 1);
	    }
	
	    var result = (rawData * 1).toFixed(~~this.decimals) * 1;
	    if (_.isNumber(result) && !_.isNaN(result)) return result;
	  }
	
	});
	
	/**
	   A number formatter that converts a floating point number, optionally
	   multiplied by a multiplier, to a percentage string and vice versa.
	
	   @class Backgrid.PercentFormatter
	   @extends Backgrid.NumberFormatter
	   @constructor
	   @throws {RangeError} If decimals < 0 or > 20.
	 */
	var PercentFormatter = Backgrid.PercentFormatter = function () {
	  Backgrid.NumberFormatter.apply(this, arguments);
	};
	
	PercentFormatter.prototype = new Backgrid.NumberFormatter(),
	
	_.extend(PercentFormatter.prototype, {
	
	  /**
	     @member Backgrid.PercentFormatter
	     @cfg {Object} options
	
	     @cfg {number} [options.multiplier=1] The number used to multiply the model
	     value for display.
	
	     @cfg {string} [options.symbol='%'] The symbol to append to the percentage
	     string.
	   */
	  defaults: _.extend({}, NumberFormatter.prototype.defaults, {
	    multiplier: 1,
	    symbol: "%"
	  }),
	
	  /**
	     Takes a floating point number, where the number is first multiplied by
	     `multiplier`, then converted to a formatted string like
	     NumberFormatter#fromRaw, then finally append `symbol` to the end.
	
	     @member Backgrid.PercentFormatter
	     @param {number} rawValue
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string}
	  */
	  fromRaw: function (number, model) {
	    var args = [].slice.call(arguments, 1);
	    args.unshift(number * this.multiplier);
	    return (NumberFormatter.prototype.fromRaw.apply(this, args) || "0") + this.symbol;
	  },
	
	  /**
	     Takes a string, possibly appended with `symbol` and/or `decimalSeparator`,
	     and convert it back to a number for the model like NumberFormatter#toRaw,
	     and then dividing it by `multiplier`.
	
	     @member Backgrid.PercentFormatter
	     @param {string} formattedData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {number|undefined} Undefined if the string cannot be converted to
	     a number.
	  */
	  toRaw: function (formattedValue, model) {
	    var tokens = formattedValue.split(this.symbol);
	    if (tokens && tokens[0] && tokens[1] === "" || tokens[1] == null) {
	      var rawValue = NumberFormatter.prototype.toRaw.call(this, tokens[0]);
	      if (_.isUndefined(rawValue)) return rawValue;
	      return rawValue / this.multiplier;
	    }
	  }
	
	});
	
	/**
	   Formatter to converts between various datetime formats.
	
	   This class only understands ISO-8601 formatted datetime strings and UNIX
	   offset (number of milliseconds since UNIX Epoch). See
	   Backgrid.Extension.MomentFormatter if you need a much more flexible datetime
	   formatter.
	
	   @class Backgrid.DatetimeFormatter
	   @extends Backgrid.CellFormatter
	   @constructor
	   @throws {Error} If both `includeDate` and `includeTime` are false.
	*/
	var DatetimeFormatter = Backgrid.DatetimeFormatter = function (options) {
	  _.extend(this, this.defaults, options || {});
	
	  if (!this.includeDate && !this.includeTime) {
	    throw new Error("Either includeDate or includeTime must be true");
	  }
	};
	DatetimeFormatter.prototype = new CellFormatter();
	_.extend(DatetimeFormatter.prototype, {
	
	  /**
	     @member Backgrid.DatetimeFormatter
	
	     @cfg {Object} options
	
	     @cfg {boolean} [options.includeDate=true] Whether the values include the
	     date part.
	
	     @cfg {boolean} [options.includeTime=true] Whether the values include the
	     time part.
	
	     @cfg {boolean} [options.includeMilli=false] If `includeTime` is true,
	     whether to include the millisecond part, if it exists.
	   */
	  defaults: {
	    includeDate: true,
	    includeTime: true,
	    includeMilli: false
	  },
	
	  DATE_RE: /^([+\-]?\d{4})-(\d{2})-(\d{2})$/,
	  TIME_RE: /^(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?$/,
	  ISO_SPLITTER_RE: /T|Z| +/,
	
	  _convert: function (data, validate) {
	    if ((data + '').trim() === '') return null;
	
	    var date, time = null;
	    if (_.isNumber(data)) {
	      var jsDate = new Date(data);
	      date = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
	      time = lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);
	    }
	    else {
	      data = data.trim();
	      var parts = data.split(this.ISO_SPLITTER_RE) || [];
	      date = this.DATE_RE.test(parts[0]) ? parts[0] : '';
	      time = date && parts[1] ? parts[1] : this.TIME_RE.test(parts[0]) ? parts[0] : '';
	    }
	
	    var YYYYMMDD = this.DATE_RE.exec(date) || [];
	    var HHmmssSSS = this.TIME_RE.exec(time) || [];
	
	    if (validate) {
	      if (this.includeDate && _.isUndefined(YYYYMMDD[0])) return;
	      if (this.includeTime && _.isUndefined(HHmmssSSS[0])) return;
	      if (!this.includeDate && date) return;
	      if (!this.includeTime && time) return;
	    }
	
	    var jsDate = new Date(Date.UTC(YYYYMMDD[1] * 1 || 0,
	                                   YYYYMMDD[2] * 1 - 1 || 0,
	                                   YYYYMMDD[3] * 1 || 0,
	                                   HHmmssSSS[1] * 1 || null,
	                                   HHmmssSSS[2] * 1 || null,
	                                   HHmmssSSS[3] * 1 || null,
	                                   HHmmssSSS[5] * 1 || null));
	
	    var result = '';
	
	    if (this.includeDate) {
	      result = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
	    }
	
	    if (this.includeTime) {
	      result = result + (this.includeDate ? 'T' : '') + lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);
	
	      if (this.includeMilli) {
	        result = result + '.' + lpad(jsDate.getUTCMilliseconds(), 3, 0);
	      }
	    }
	
	    if (this.includeDate && this.includeTime) {
	      result += "Z";
	    }
	
	    return result;
	  },
	
	  /**
	     Converts an ISO-8601 formatted datetime string to a datetime string, date
	     string or a time string. The timezone is ignored if supplied.
	
	     @member Backgrid.DatetimeFormatter
	     @param {string} rawData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string|null|undefined} ISO-8601 string in UTC. Null and undefined
	     values are returned as is.
	  */
	  fromRaw: function (rawData, model) {
	    if (_.isNull(rawData) || _.isUndefined(rawData)) return '';
	    return this._convert(rawData);
	  },
	
	  /**
	     Converts an ISO-8601 formatted datetime string to a datetime string, date
	     string or a time string. The timezone is ignored if supplied. This method
	     parses the input values exactly the same way as
	     Backgrid.Extension.MomentFormatter#fromRaw(), in addition to doing some
	     sanity checks.
	
	     @member Backgrid.DatetimeFormatter
	     @param {string} formattedData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string|undefined} ISO-8601 string in UTC. Undefined if a date is
	     found when `includeDate` is false, or a time is found when `includeTime` is
	     false, or if `includeDate` is true and a date is not found, or if
	     `includeTime` is true and a time is not found.
	  */
	  toRaw: function (formattedData, model) {
	    return this._convert(formattedData, true);
	  }
	
	});
	
	/**
	   Formatter to convert any value to string.
	
	   @class Backgrid.StringFormatter
	   @extends Backgrid.CellFormatter
	   @constructor
	 */
	var StringFormatter = Backgrid.StringFormatter = function () {};
	StringFormatter.prototype = new CellFormatter();
	_.extend(StringFormatter.prototype, {
	  /**
	     Converts any value to a string using Ecmascript's implicit type
	     conversion. If the given value is `null` or `undefined`, an empty string is
	     returned instead.
	
	     @member Backgrid.StringFormatter
	     @param {*} rawValue
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string}
	   */
	  fromRaw: function (rawValue, model) {
	    if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';
	    return rawValue + '';
	  }
	});
	
	/**
	   Simple email validation formatter.
	
	   @class Backgrid.EmailFormatter
	   @extends Backgrid.CellFormatter
	   @constructor
	 */
	var EmailFormatter = Backgrid.EmailFormatter = function () {};
	EmailFormatter.prototype = new CellFormatter();
	_.extend(EmailFormatter.prototype, {
	  /**
	     Return the input if it is a string that contains an '@' character and if
	     the strings before and after '@' are non-empty. If the input does not
	     validate, `undefined` is returned.
	
	     @member Backgrid.EmailFormatter
	     @param {*} formattedData
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {string|undefined}
	   */
	  toRaw: function (formattedData, model) {
	    var parts = formattedData.trim().split("@");
	    if (parts.length === 2 && _.all(parts)) {
	      return formattedData;
	    }
	  }
	});
	
	/**
	   Formatter for SelectCell.
	
	   If the type of a model value is not a string, it is expected that a subclass
	   of this formatter is provided to the SelectCell, with #toRaw overridden to
	   convert the string value returned from the DOM back to whatever value is
	   expected in the model.
	
	   @class Backgrid.SelectFormatter
	   @extends Backgrid.CellFormatter
	   @constructor
	*/
	var SelectFormatter = Backgrid.SelectFormatter = function () {};
	SelectFormatter.prototype = new CellFormatter();
	_.extend(SelectFormatter.prototype, {
	
	  /**
	     Normalizes raw scalar or array values to an array.
	
	     @member Backgrid.SelectFormatter
	     @param {*} rawValue
	     @param {Backbone.Model} model Used for more complicated formatting
	     @return {Array.<*>}
	  */
	  fromRaw: function (rawValue, model) {
	    return _.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : [];
	  }
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   Generic cell editor base class. Only defines an initializer for a number of
	   required parameters.
	
	   @abstract
	   @class Backgrid.CellEditor
	   @extends Backbone.View
	*/
	var CellEditor = Backgrid.CellEditor = Backbone.View.extend({
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backgrid.CellFormatter} options.formatter
	     @param {Backgrid.Column} options.column
	     @param {Backbone.Model} options.model
	
	     @throws {TypeError} If `formatter` is not a formatter instance, or when
	     `model` or `column` are undefined.
	  */
	  initialize: function (options) {
	    this.formatter = options.formatter;
	    this.column = options.column;
	    if (!(this.column instanceof Column)) {
	      this.column = new Column(this.column);
	    }
	
	    this.listenTo(this.model, "backgrid:editing", this.postRender);
	  },
	
	  /**
	     Post-rendering setup and initialization. Focuses the cell editor's `el` in
	     this default implementation. **Should** be called by Cell classes after
	     calling Backgrid.CellEditor#render.
	  */
	  postRender: function (model, column) {
	    if (column == null || column.get("name") == this.column.get("name")) {
	      this.$el.focus();
	    }
	    return this;
	  }
	
	});
	
	/**
	   InputCellEditor the cell editor type used by most core cell types. This cell
	   editor renders a text input box as its editor. The input will render a
	   placeholder if the value is empty on supported browsers.
	
	   @class Backgrid.InputCellEditor
	   @extends Backgrid.CellEditor
	*/
	var InputCellEditor = Backgrid.InputCellEditor = CellEditor.extend({
	
	  /** @property */
	  tagName: "input",
	
	  /** @property */
	  attributes: {
	    type: "text"
	  },
	
	  /** @property */
	  events: {
	    "blur": "saveOrCancel",
	    "keydown": "saveOrCancel"
	  },
	
	  /**
	     Initializer. Removes this `el` from the DOM when a `done` event is
	     triggered.
	
	     @param {Object} options
	     @param {Backgrid.CellFormatter} options.formatter
	     @param {Backgrid.Column} options.column
	     @param {Backbone.Model} options.model
	     @param {string} [options.placeholder]
	  */
	  initialize: function (options) {
	    InputCellEditor.__super__.initialize.apply(this, arguments);
	
	    if (options.placeholder) {
	      this.$el.attr("placeholder", options.placeholder);
	    }
	  },
	
	  /**
	     Renders a text input with the cell value formatted for display, if it
	     exists.
	  */
	  render: function () {
	    var model = this.model;
	    this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model));
	    return this;
	  },
	
	  /**
	     If the key pressed is `enter`, `tab`, `up`, or `down`, converts the value
	     in the editor to a raw value for saving into the model using the formatter.
	
	     If the key pressed is `esc` the changes are undone.
	
	     If the editor goes out of focus (`blur`) but the value is invalid, the
	     event is intercepted and cancelled so the cell remains in focus pending for
	     further action. The changes are saved otherwise.
	
	     Triggers a Backbone `backgrid:edited` event from the model when successful,
	     and `backgrid:error` if the value cannot be converted. Classes listening to
	     the `error` event, usually the Cell classes, should respond appropriately,
	     usually by rendering some kind of error feedback.
	
	     @param {Event} e
	  */
	  saveOrCancel: function (e) {
	
	    var formatter = this.formatter;
	    var model = this.model;
	    var column = this.column;
	
	    var command = new Command(e);
	    var blurred = e.type === "blur";
	
	    if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
	        command.save() || blurred) {
	
	      e.preventDefault();
	      e.stopPropagation();
	
	      var val = this.$el.val();
	      var newValue = formatter.toRaw(val, model);
	      if (_.isUndefined(newValue)) {
	        model.trigger("backgrid:error", model, column, val);
	      }
	      else {
	        model.set(column.get("name"), newValue);
	        model.trigger("backgrid:edited", model, column, command);
	      }
	    }
	    // esc
	    else if (command.cancel()) {
	      // undo
	      e.stopPropagation();
	      model.trigger("backgrid:edited", model, column, command);
	    }
	  },
	
	  postRender: function (model, column) {
	    if (column == null || column.get("name") == this.column.get("name")) {
	      // move the cursor to the end on firefox if text is right aligned
	      if (this.$el.css("text-align") === "right") {
	        var val = this.$el.val();
	        this.$el.focus().val(null).val(val);
	      }
	      else this.$el.focus();
	    }
	    return this;
	  }
	
	});
	
	/**
	   The super-class for all Cell types. By default, this class renders a plain
	   table cell with the model value converted to a string using the
	   formatter. The table cell is clickable, upon which the cell will go into
	   editor mode, which is rendered by a Backgrid.InputCellEditor instance by
	   default. Upon encountering any formatting errors, this class will add an
	   `error` CSS class to the table cell.
	
	   @abstract
	   @class Backgrid.Cell
	   @extends Backbone.View
	*/
	var Cell = Backgrid.Cell = Backbone.View.extend({
	
	  /** @property */
	  tagName: "td",
	
	  /**
	     @property {Backgrid.CellFormatter|Object|string} [formatter=CellFormatter]
	  */
	  formatter: CellFormatter,
	
	  /**
	     @property {Backgrid.CellEditor} [editor=Backgrid.InputCellEditor] The
	     default editor for all cell instances of this class. This value must be a
	     class, it will be automatically instantiated upon entering edit mode.
	
	     See Backgrid.CellEditor
	  */
	  editor: InputCellEditor,
	
	  /** @property */
	  events: {
	    "click": "enterEditMode"
	  },
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backbone.Model} options.model
	     @param {Backgrid.Column} options.column
	
	     @throws {ReferenceError} If formatter is a string but a formatter class of
	     said name cannot be found in the Backgrid module.
	  */
	  initialize: function (options) {
	    this.column = options.column;
	    if (!(this.column instanceof Column)) {
	      this.column = new Column(this.column);
	    }
	
	    var column = this.column, model = this.model, $el = this.$el;
	
	    var formatter = Backgrid.resolveNameToClass(column.get("formatter") ||
	                                                this.formatter, "Formatter");
	
	    if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
	      formatter = new formatter();
	    }
	
	    this.formatter = formatter;
	
	    this.editor = Backgrid.resolveNameToClass(this.editor, "CellEditor");
	
	    this.listenTo(model, "change:" + column.get("name"), function () {
	      if (!$el.hasClass("editor")) this.render();
	    });
	
	    this.listenTo(model, "backgrid:error", this.renderError);
	
	    this.listenTo(column, "change:editable change:sortable change:renderable",
	                  function (column) {
	                    var changed = column.changedAttributes();
	                    for (var key in changed) {
	                      if (changed.hasOwnProperty(key)) {
	                        $el.toggleClass(key, changed[key]);
	                      }
	                    }
	                  });
	
	    this.updateStateClassesMaybe();
	  },
	
	  updateStateClassesMaybe: function () {
	    var model = this.model;
	    var column = this.column;
	    var $el = this.$el;
	    $el.toggleClass("editable", Backgrid.callByNeed(column.editable(), column, model));
	    $el.toggleClass("sortable", Backgrid.callByNeed(column.sortable(), column, model));
	    $el.toggleClass("renderable", Backgrid.callByNeed(column.renderable(), column, model));
	  },
	
	  /**
	     Render a text string in a table cell. The text is converted from the
	     model's raw value for this cell's column.
	  */
	  render: function () {
	    var $el = this.$el;
	    $el.empty();
	    var model = this.model;
	    var columnName = this.column.get("name");
	    $el.text(this.formatter.fromRaw(model.get(columnName), model));
	    $el.addClass(columnName);
	    this.updateStateClassesMaybe();
	    this.delegateEvents();
	    return this;
	  },
	
	  /**
	     If this column is editable, a new CellEditor instance is instantiated with
	     its required parameters. An `editor` CSS class is added to the cell upon
	     entering edit mode.
	
	     This method triggers a Backbone `backgrid:edit` event from the model when
	     the cell is entering edit mode and an editor instance has been constructed,
	     but before it is rendered and inserted into the DOM. The cell and the
	     constructed cell editor instance are sent as event parameters when this
	     event is triggered.
	
	     When this cell has finished switching to edit mode, a Backbone
	     `backgrid:editing` event is triggered from the model. The cell and the
	     constructed cell instance are also sent as parameters in the event.
	
	     When the model triggers a `backgrid:error` event, it means the editor is
	     unable to convert the current user input to an apprpriate value for the
	     model's column, and an `error` CSS class is added to the cell accordingly.
	  */
	  enterEditMode: function () {
	    var model = this.model;
	    var column = this.column;
	
	    var editable = Backgrid.callByNeed(column.editable(), column, model);
	    if (editable) {
	
	      this.currentEditor = new this.editor({
	        column: this.column,
	        model: this.model,
	        formatter: this.formatter
	      });
	
	      model.trigger("backgrid:edit", model, column, this, this.currentEditor);
	
	      // Need to redundantly undelegate events for Firefox
	      this.undelegateEvents();
	      this.$el.empty();
	      this.$el.append(this.currentEditor.$el);
	      this.currentEditor.render();
	      this.$el.addClass("editor");
	
	      model.trigger("backgrid:editing", model, column, this, this.currentEditor);
	    }
	  },
	
	  /**
	     Put an `error` CSS class on the table cell.
	  */
	  renderError: function (model, column) {
	    if (column == null || column.get("name") == this.column.get("name")) {
	      this.$el.addClass("error");
	    }
	  },
	
	  /**
	     Removes the editor and re-render in display mode.
	  */
	  exitEditMode: function () {
	    this.$el.removeClass("error");
	    this.currentEditor.remove();
	    this.stopListening(this.currentEditor);
	    delete this.currentEditor;
	    this.$el.removeClass("editor");
	    this.render();
	  },
	
	  /**
	     Clean up this cell.
	
	     @chainable
	  */
	  remove: function () {
	    if (this.currentEditor) {
	      this.currentEditor.remove.apply(this.currentEditor, arguments);
	      delete this.currentEditor;
	    }
	    return Cell.__super__.remove.apply(this, arguments);
	  }
	
	});
	
	/**
	   StringCell displays HTML escaped strings and accepts anything typed in.
	
	   @class Backgrid.StringCell
	   @extends Backgrid.Cell
	*/
	var StringCell = Backgrid.StringCell = Cell.extend({
	
	  /** @property */
	  className: "string-cell",
	
	  formatter: StringFormatter
	
	});
	
	/**
	   UriCell renders an HTML `<a>` anchor for the value and accepts URIs as user
	   input values. No type conversion or URL validation is done by the formatter
	   of this cell. Users who need URL validation are encourage to subclass UriCell
	   to take advantage of the parsing capabilities of the HTMLAnchorElement
	   available on HTML5-capable browsers or using a third-party library like
	   [URI.js](https://github.com/medialize/URI.js).
	
	   @class Backgrid.UriCell
	   @extends Backgrid.Cell
	*/
	var UriCell = Backgrid.UriCell = Cell.extend({
	
	  /** @property */
	  className: "uri-cell",
	
	  /**
	     @property {string} [title] The title attribute of the generated anchor. It
	     uses the display value formatted by the `formatter.fromRaw` by default.
	  */
	  title: null,
	
	  /**
	     @property {string} [target="_blank"] The target attribute of the generated
	     anchor.
	  */
	  target: "_blank",
	
	  initialize: function (options) {
	    UriCell.__super__.initialize.apply(this, arguments);
	    this.title = options.title || this.title;
	    this.target = options.target || this.target;
	  },
	
	  render: function () {
	    this.$el.empty();
	    var rawValue = this.model.get(this.column.get("name"));
	    var formattedValue = this.formatter.fromRaw(rawValue, this.model);
	    this.$el.append($("<a>", {
	      tabIndex: -1,
	      href: rawValue,
	      title: this.title || formattedValue,
	      target: this.target
	    }).text(formattedValue));
	    this.delegateEvents();
	    return this;
	  }
	
	});
	
	/**
	   Like Backgrid.UriCell, EmailCell renders an HTML `<a>` anchor for the
	   value. The `href` in the anchor is prefixed with `mailto:`. EmailCell will
	   complain if the user enters a string that doesn't contain the `@` sign.
	
	   @class Backgrid.EmailCell
	   @extends Backgrid.StringCell
	*/
	var EmailCell = Backgrid.EmailCell = StringCell.extend({
	
	  /** @property */
	  className: "email-cell",
	
	  formatter: EmailFormatter,
	
	  render: function () {
	    this.$el.empty();
	    var model = this.model;
	    var formattedValue = this.formatter.fromRaw(model.get(this.column.get("name")), model);
	    this.$el.append($("<a>", {
	      tabIndex: -1,
	      href: "mailto:" + formattedValue,
	      title: formattedValue
	    }).text(formattedValue));
	    this.delegateEvents();
	    return this;
	  }
	
	});
	
	/**
	   NumberCell is a generic cell that renders all numbers. Numbers are formatted
	   using a Backgrid.NumberFormatter.
	
	   @class Backgrid.NumberCell
	   @extends Backgrid.Cell
	*/
	var NumberCell = Backgrid.NumberCell = Cell.extend({
	
	  /** @property */
	  className: "number-cell",
	
	  /**
	     @property {number} [decimals=2] Must be an integer.
	  */
	  decimals: NumberFormatter.prototype.defaults.decimals,
	
	  /** @property {string} [decimalSeparator='.'] */
	  decimalSeparator: NumberFormatter.prototype.defaults.decimalSeparator,
	
	  /** @property {string} [orderSeparator=','] */
	  orderSeparator: NumberFormatter.prototype.defaults.orderSeparator,
	
	  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.NumberFormatter] */
	  formatter: NumberFormatter,
	
	  /**
	     Initializes this cell and the number formatter.
	
	     @param {Object} options
	     @param {Backbone.Model} options.model
	     @param {Backgrid.Column} options.column
	  */
	  initialize: function (options) {
	    NumberCell.__super__.initialize.apply(this, arguments);
	    var formatter = this.formatter;
	    formatter.decimals = this.decimals;
	    formatter.decimalSeparator = this.decimalSeparator;
	    formatter.orderSeparator = this.orderSeparator;
	  }
	
	});
	
	/**
	   An IntegerCell is just a Backgrid.NumberCell with 0 decimals. If a floating
	   point number is supplied, the number is simply rounded the usual way when
	   displayed.
	
	   @class Backgrid.IntegerCell
	   @extends Backgrid.NumberCell
	*/
	var IntegerCell = Backgrid.IntegerCell = NumberCell.extend({
	
	  /** @property */
	  className: "integer-cell",
	
	  /**
	     @property {number} decimals Must be an integer.
	  */
	  decimals: 0
	});
	
	/**
	   A PercentCell is another Backgrid.NumberCell that takes a floating number,
	   optionally multiplied by a multiplier and display it as a percentage.
	
	   @class Backgrid.PercentCell
	   @extends Backgrid.NumberCell
	 */
	var PercentCell = Backgrid.PercentCell = NumberCell.extend({
	
	  /** @property */
	  className: "percent-cell",
	
	  /** @property {number} [multiplier=1] */
	  multiplier: PercentFormatter.prototype.defaults.multiplier,
	
	  /** @property {string} [symbol='%'] */
	  symbol: PercentFormatter.prototype.defaults.symbol,
	
	  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.PercentFormatter] */
	  formatter: PercentFormatter,
	
	  /**
	     Initializes this cell and the percent formatter.
	
	     @param {Object} options
	     @param {Backbone.Model} options.model
	     @param {Backgrid.Column} options.column
	  */
	  initialize: function () {
	    PercentCell.__super__.initialize.apply(this, arguments);
	    var formatter = this.formatter;
	    formatter.multiplier = this.multiplier;
	    formatter.symbol = this.symbol;
	  }
	
	});
	
	/**
	   DatetimeCell is a basic cell that accepts datetime string values in RFC-2822
	   or W3C's subset of ISO-8601 and displays them in ISO-8601 format. For a much
	   more sophisticated date time cell with better datetime formatting, take a
	   look at the Backgrid.Extension.MomentCell extension.
	
	   @class Backgrid.DatetimeCell
	   @extends Backgrid.Cell
	
	   See:
	
	   - Backgrid.Extension.MomentCell
	   - Backgrid.DatetimeFormatter
	*/
	var DatetimeCell = Backgrid.DatetimeCell = Cell.extend({
	
	  /** @property */
	  className: "datetime-cell",
	
	  /**
	     @property {boolean} [includeDate=true]
	  */
	  includeDate: DatetimeFormatter.prototype.defaults.includeDate,
	
	  /**
	     @property {boolean} [includeTime=true]
	  */
	  includeTime: DatetimeFormatter.prototype.defaults.includeTime,
	
	  /**
	     @property {boolean} [includeMilli=false]
	  */
	  includeMilli: DatetimeFormatter.prototype.defaults.includeMilli,
	
	  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.DatetimeFormatter] */
	  formatter: DatetimeFormatter,
	
	  /**
	     Initializes this cell and the datetime formatter.
	
	     @param {Object} options
	     @param {Backbone.Model} options.model
	     @param {Backgrid.Column} options.column
	  */
	  initialize: function (options) {
	    DatetimeCell.__super__.initialize.apply(this, arguments);
	    var formatter = this.formatter;
	    formatter.includeDate = this.includeDate;
	    formatter.includeTime = this.includeTime;
	    formatter.includeMilli = this.includeMilli;
	
	    var placeholder = this.includeDate ? "YYYY-MM-DD" : "";
	    placeholder += (this.includeDate && this.includeTime) ? "T" : "";
	    placeholder += this.includeTime ? "HH:mm:ss" : "";
	    placeholder += (this.includeTime && this.includeMilli) ? ".SSS" : "";
	
	    this.editor = this.editor.extend({
	      attributes: _.extend({}, this.editor.prototype.attributes, this.editor.attributes, {
	        placeholder: placeholder
	      })
	    });
	  }
	
	});
	
	/**
	   DateCell is a Backgrid.DatetimeCell without the time part.
	
	   @class Backgrid.DateCell
	   @extends Backgrid.DatetimeCell
	*/
	var DateCell = Backgrid.DateCell = DatetimeCell.extend({
	
	  /** @property */
	  className: "date-cell",
	
	  /** @property */
	  includeTime: false
	
	});
	
	/**
	   TimeCell is a Backgrid.DatetimeCell without the date part.
	
	   @class Backgrid.TimeCell
	   @extends Backgrid.DatetimeCell
	*/
	var TimeCell = Backgrid.TimeCell = DatetimeCell.extend({
	
	  /** @property */
	  className: "time-cell",
	
	  /** @property */
	  includeDate: false
	
	});
	
	/**
	   BooleanCellEditor renders a checkbox as its editor.
	
	   @class Backgrid.BooleanCellEditor
	   @extends Backgrid.CellEditor
	*/
	var BooleanCellEditor = Backgrid.BooleanCellEditor = CellEditor.extend({
	
	  /** @property */
	  tagName: "input",
	
	  /** @property */
	  attributes: {
	    tabIndex: -1,
	    type: "checkbox"
	  },
	
	  /** @property */
	  events: {
	    "mousedown": function () {
	      this.mouseDown = true;
	    },
	    "blur": "enterOrExitEditMode",
	    "mouseup": function () {
	      this.mouseDown = false;
	    },
	    "change": "saveOrCancel",
	    "keydown": "saveOrCancel"
	  },
	
	  /**
	     Renders a checkbox and check it if the model value of this column is true,
	     uncheck otherwise.
	  */
	  render: function () {
	    var model = this.model;
	    var val = this.formatter.fromRaw(model.get(this.column.get("name")), model);
	    this.$el.prop("checked", val);
	    return this;
	  },
	
	  /**
	     Event handler. Hack to deal with the case where `blur` is fired before
	     `change` and `click` on a checkbox.
	  */
	  enterOrExitEditMode: function (e) {
	    if (!this.mouseDown) {
	      var model = this.model;
	      model.trigger("backgrid:edited", model, this.column, new Command(e));
	    }
	  },
	
	  /**
	     Event handler. Save the value into the model if the event is `change` or
	     one of the keyboard navigation key presses. Exit edit mode without saving
	     if `escape` was pressed.
	  */
	  saveOrCancel: function (e) {
	    var model = this.model;
	    var column = this.column;
	    var formatter = this.formatter;
	    var command = new Command(e);
	    // skip ahead to `change` when space is pressed
	    if (command.passThru() && e.type != "change") return true;
	    if (command.cancel()) {
	      e.stopPropagation();
	      model.trigger("backgrid:edited", model, column, command);
	    }
	
	    var $el = this.$el;
	    if (command.save() || command.moveLeft() || command.moveRight() || command.moveUp() ||
	        command.moveDown()) {
	      e.preventDefault();
	      e.stopPropagation();
	      var val = formatter.toRaw($el.prop("checked"), model);
	      model.set(column.get("name"), val);
	      model.trigger("backgrid:edited", model, column, command);
	    }
	    else if (e.type == "change") {
	      var val = formatter.toRaw($el.prop("checked"), model);
	      model.set(column.get("name"), val);
	      $el.focus();
	    }
	  }
	
	});
	
	/**
	   BooleanCell renders a checkbox both during display mode and edit mode. The
	   checkbox is checked if the model value is true, unchecked otherwise.
	
	   @class Backgrid.BooleanCell
	   @extends Backgrid.Cell
	*/
	var BooleanCell = Backgrid.BooleanCell = Cell.extend({
	
	  /** @property */
	  className: "boolean-cell",
	
	  /** @property */
	  editor: BooleanCellEditor,
	
	  /** @property */
	  events: {
	    "click": "enterEditMode"
	  },
	
	  /**
	     Renders a checkbox and check it if the model value of this column is true,
	     uncheck otherwise.
	  */
	  render: function () {
	    this.$el.empty();
	    var model = this.model, column = this.column;
	    var editable = Backgrid.callByNeed(column.editable(), column, model);
	    this.$el.append($("<input>", {
	      tabIndex: -1,
	      type: "checkbox",
	      checked: this.formatter.fromRaw(model.get(column.get("name")), model),
	      disabled: !editable
	    }));
	    this.delegateEvents();
	    return this;
	  }
	
	});
	
	/**
	   SelectCellEditor renders an HTML `<select>` fragment as the editor.
	
	   @class Backgrid.SelectCellEditor
	   @extends Backgrid.CellEditor
	*/
	var SelectCellEditor = Backgrid.SelectCellEditor = CellEditor.extend({
	
	  /** @property */
	  tagName: "select",
	
	  /** @property */
	  events: {
	    "change": "save",
	    "blur": "close",
	    "keydown": "close"
	  },
	
	  /** @property {function(Object, ?Object=): string} template */
	  template: _.template(
	    '<option value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- text %></option>',
	    null,
	    {
	        variable    : null,
	        evaluate    : /<%([\s\S]+?)%>/g,
	        interpolate : /<%=([\s\S]+?)%>/g,
	        escape      : /<%-([\s\S]+?)%>/g
	    }),
	
	  setOptionValues: function (optionValues) {
	    this.optionValues = optionValues;
	    this.optionValues = _.result(this, "optionValues");
	  },
	
	  setMultiple: function (multiple) {
	    this.multiple = multiple;
	    this.$el.prop("multiple", multiple);
	  },
	
	  _renderOptions: function (nvps, selectedValues) {
	    var options = '';
	    for (var i = 0; i < nvps.length; i++) {
	      options = options + this.template({
	        text: nvps[i][0],
	        value: nvps[i][1],
	        selected: _.indexOf(selectedValues, nvps[i][1]) > -1
	      });
	    }
	    return options;
	  },
	
	  /**
	     Renders the options if `optionValues` is a list of name-value pairs. The
	     options are contained inside option groups if `optionValues` is a list of
	     object hashes. The name is rendered at the option text and the value is the
	     option value. If `optionValues` is a function, it is called without a
	     parameter.
	  */
	  render: function () {
	    this.$el.empty();
	
	    var optionValues = _.result(this, "optionValues");
	    var model = this.model;
	    var selectedValues = this.formatter.fromRaw(model.get(this.column.get("name")), model);
	
	    if (!_.isArray(optionValues)) throw new TypeError("optionValues must be an array");
	
	    var optionValue = null;
	    var optionText = null;
	    var optionValue = null;
	    var optgroupName = null;
	    var optgroup = null;
	
	    for (var i = 0; i < optionValues.length; i++) {
	      var optionValue = optionValues[i];
	
	      if (_.isArray(optionValue)) {
	        optionText  = optionValue[0];
	        optionValue = optionValue[1];
	
	        this.$el.append(this.template({
	          text: optionText,
	          value: optionValue,
	          selected: _.indexOf(selectedValues, optionValue) > -1
	        }));
	      }
	      else if (_.isObject(optionValue)) {
	        optgroupName = optionValue.name;
	        optgroup = $("<optgroup></optgroup>", { label: optgroupName });
	        optgroup.append(this._renderOptions.call(this, optionValue.values, selectedValues));
	        this.$el.append(optgroup);
	      }
	      else {
	        throw new TypeError("optionValues elements must be a name-value pair or an object hash of { name: 'optgroup label', value: [option name-value pairs] }");
	      }
	    }
	
	    this.delegateEvents();
	
	    return this;
	  },
	
	  /**
	     Saves the value of the selected option to the model attribute.
	  */
	  save: function (e) {
	    var model = this.model;
	    var column = this.column;
	    model.set(column.get("name"), this.formatter.toRaw(this.$el.val(), model));
	  },
	
	  /**
	     Triggers a `backgrid:edited` event from the model so the body can close
	     this editor.
	  */
	  close: function (e) {
	    var model = this.model;
	    var column = this.column;
	    var command = new Command(e);
	    if (command.cancel()) {
	      e.stopPropagation();
	      model.trigger("backgrid:edited", model, column, new Command(e));
	    }
	    else if (command.save() || command.moveLeft() || command.moveRight() ||
	             command.moveUp() || command.moveDown() || e.type == "blur") {
	      e.preventDefault();
	      e.stopPropagation();
	      this.save(e);
	      model.trigger("backgrid:edited", model, column, new Command(e));
	    }
	  }
	
	});
	
	/**
	   SelectCell is also a different kind of cell in that upon going into edit mode
	   the cell renders a list of options to pick from, as opposed to an input box.
	
	   SelectCell cannot be referenced by its string name when used in a column
	   definition because it requires an `optionValues` class attribute to be
	   defined. `optionValues` can either be a list of name-value pairs, to be
	   rendered as options, or a list of object hashes which consist of a key *name*
	   which is the option group name, and a key *values* which is a list of
	   name-value pairs to be rendered as options under that option group.
	
	   In addition, `optionValues` can also be a parameter-less function that
	   returns one of the above. If the options are static, it is recommended the
	   returned values to be memoized. `_.memoize()` is a good function to help with
	   that.
	
	   During display mode, the default formatter will normalize the raw model value
	   to an array of values whether the raw model value is a scalar or an
	   array. Each value is compared with the `optionValues` values using
	   Ecmascript's implicit type conversion rules. When exiting edit mode, no type
	   conversion is performed when saving into the model. This behavior is not
	   always desirable when the value type is anything other than string. To
	   control type conversion on the client-side, you should subclass SelectCell to
	   provide a custom formatter or provide the formatter to your column
	   definition.
	
	   See:
	     [$.fn.val()](http://api.jquery.com/val/)
	
	   @class Backgrid.SelectCell
	   @extends Backgrid.Cell
	*/
	var SelectCell = Backgrid.SelectCell = Cell.extend({
	
	  /** @property */
	  className: "select-cell",
	
	  /** @property */
	  editor: SelectCellEditor,
	
	  /** @property */
	  multiple: false,
	
	  /** @property */
	  formatter: SelectFormatter,
	
	  /**
	     @property {Array.<Array>|Array.<{name: string, values: Array.<Array>}>} optionValues
	  */
	  optionValues: undefined,
	
	  /** @property */
	  delimiter: ', ',
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backbone.Model} options.model
	     @param {Backgrid.Column} options.column
	
	     @throws {TypeError} If `optionsValues` is undefined.
	  */
	  initialize: function (options) {
	    SelectCell.__super__.initialize.apply(this, arguments);
	    this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
	      if (column.get("name") == this.column.get("name")) {
	        editor.setOptionValues(this.optionValues);
	        editor.setMultiple(this.multiple);
	      }
	    });
	  },
	
	  /**
	     Renders the label using the raw value as key to look up from `optionValues`.
	
	     @throws {TypeError} If `optionValues` is malformed.
	  */
	  render: function () {
	    this.$el.empty();
	
	    var optionValues = _.result(this, "optionValues");
	    var model = this.model;
	    var rawData = this.formatter.fromRaw(model.get(this.column.get("name")), model);
	
	    var selectedText = [];
	
	    try {
	      if (!_.isArray(optionValues) || _.isEmpty(optionValues)) throw new TypeError;
	
	      for (var k = 0; k < rawData.length; k++) {
	        var rawDatum = rawData[k];
	
	        for (var i = 0; i < optionValues.length; i++) {
	          var optionValue = optionValues[i];
	
	          if (_.isArray(optionValue)) {
	            var optionText  = optionValue[0];
	            var optionValue = optionValue[1];
	
	            if (optionValue == rawDatum) selectedText.push(optionText);
	          }
	          else if (_.isObject(optionValue)) {
	            var optionGroupValues = optionValue.values;
	
	            for (var j = 0; j < optionGroupValues.length; j++) {
	              var optionGroupValue = optionGroupValues[j];
	              if (optionGroupValue[1] == rawDatum) {
	                selectedText.push(optionGroupValue[0]);
	              }
	            }
	          }
	          else {
	            throw new TypeError;
	          }
	        }
	      }
	
	      this.$el.append(selectedText.join(this.delimiter));
	    }
	    catch (ex) {
	      if (ex instanceof TypeError) {
	        throw new TypeError("'optionValues' must be of type {Array.<Array>|Array.<{name: string, values: Array.<Array>}>}");
	      }
	      throw ex;
	    }
	
	    this.delegateEvents();
	
	    return this;
	  }
	
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   A Column is a placeholder for column metadata.
	
	   You usually don't need to create an instance of this class yourself as a
	   collection of column instances will be created for you from a list of column
	   attributes in the Backgrid.js view class constructors.
	
	   @class Backgrid.Column
	   @extends Backbone.Model
	*/
	var Column = Backgrid.Column = Backbone.Model.extend({
	
	  /**
	     @cfg {Object} defaults Column defaults. To override any of these default
	     values, you can either change the prototype directly to override
	     Column.defaults globally or extend Column and supply the custom class to
	     Backgrid.Grid:
	
	         // Override Column defaults globally
	         Column.prototype.defaults.sortable = false;
	
	         // Override Column defaults locally
	         var MyColumn = Column.extend({
	           defaults: _.defaults({
	             editable: false
	           }, Column.prototype.defaults)
	         });
	
	         var grid = new Backgrid.Grid(columns: new Columns([{...}, {...}], {
	           model: MyColumn
	         }));
	
	     @cfg {string} [defaults.name] The default name of the model attribute.
	
	     @cfg {string} [defaults.label] The default label to show in the header.
	
	     @cfg {string|Backgrid.Cell} [defaults.cell] The default cell type. If this
	     is a string, the capitalized form will be used to look up a cell class in
	     Backbone, i.e.: string => StringCell. If a Cell subclass is supplied, it is
	     initialized with a hash of parameters. If a Cell instance is supplied, it
	     is used directly.
	
	     @cfg {string|Backgrid.HeaderCell} [defaults.headerCell] The default header
	     cell type.
	
	     @cfg {boolean|string|function(): boolean} [defaults.sortable=true] Whether
	     this column is sortable. If the value is a string, a method will the same
	     name will be looked up from the column instance to determine whether the
	     column should be sortable. The method's signature must be `function
	     (Backgrid.Column, Backbone.Model): boolean`.
	
	     @cfg {boolean|string|function(): boolean} [defaults.editable=true] Whether
	     this column is editable. If the value is a string, a method will the same
	     name will be looked up from the column instance to determine whether the
	     column should be editable. The method's signature must be `function
	     (Backgrid.Column, Backbone.Model): boolean`.
	
	     @cfg {boolean|string|function(): boolean} [defaults.renderable=true]
	     Whether this column is renderable. If the value is a string, a method will
	     the same name will be looked up from the column instance to determine
	     whether the column should be renderable. The method's signature must be
	     `function (Backrid.Column, Backbone.Model): boolean`.
	
	     @cfg {Backgrid.CellFormatter | Object | string} [defaults.formatter] The
	     formatter to use to convert between raw model values and user input.
	
	     @cfg {"toggle"|"cycle"} [defaults.sortType="cycle"] Whether sorting will
	     toggle between ascending and descending order, or cycle between insertion
	     order, ascending and descending order.
	
	     @cfg {(function(Backbone.Model, string): *) | string} [defaults.sortValue]
	     The function to use to extract a value from the model for comparison during
	     sorting. If this value is a string, a method with the same name will be
	     looked up from the column instance.
	
	     @cfg {"ascending"|"descending"|null} [defaults.direction=null] The initial
	     sorting direction for this column. The default is ordered by
	     Backbone.Model.cid, which usually means the collection is ordered by
	     insertion order.
	  */
	  defaults: {
	    name: undefined,
	    label: undefined,
	    sortable: true,
	    editable: true,
	    renderable: true,
	    formatter: undefined,
	    sortType: "cycle",
	    sortValue: undefined,
	    direction: null,
	    cell: undefined,
	    headerCell: undefined
	  },
	
	  /**
	     Initializes this Column instance.
	
	     @param {Object} attrs
	
	     @param {string} attrs.name The model attribute this column is responsible
	     for.
	
	     @param {string|Backgrid.Cell} attrs.cell The cell type to use to render
	     this column.
	
	     @param {string} [attrs.label]
	
	     @param {string|Backgrid.HeaderCell} [attrs.headerCell]
	
	     @param {boolean|string|function(): boolean} [attrs.sortable=true]
	
	     @param {boolean|string|function(): boolean} [attrs.editable=true]
	
	     @param {boolean|string|function(): boolean} [attrs.renderable=true]
	
	     @param {Backgrid.CellFormatter | Object | string} [attrs.formatter]
	
	     @param {"toggle"|"cycle"}  [attrs.sortType="cycle"]
	
	     @param {(function(Backbone.Model, string): *) | string} [attrs.sortValue]
	
	     @throws {TypeError} If attrs.cell or attrs.options are not supplied.
	
	     @throws {ReferenceError} If formatter is a string but a formatter class of
	     said name cannot be found in the Backgrid module.
	
	     See:
	
	     - Backgrid.Column.defaults
	     - Backgrid.Cell
	     - Backgrid.CellFormatter
	   */
	  initialize: function () {
	    if (!this.has("label")) {
	      this.set({ label: this.get("name") }, { silent: true });
	    }
	
	    var headerCell = Backgrid.resolveNameToClass(this.get("headerCell"), "HeaderCell");
	
	    var cell = Backgrid.resolveNameToClass(this.get("cell"), "Cell");
	
	    this.set({cell: cell, headerCell: headerCell}, { silent: true });
	  },
	
	  /**
	     Returns an appropriate value extraction function from a model for sorting.
	
	     If the column model contains an attribute `sortValue`, if it is a string, a
	     method from the column instance identifified by the `sortValue` string is
	     returned. If it is a function, it it returned as is. If `sortValue` isn't
	     found from the column model's attributes, a default value extraction
	     function is returned which will compare according to the natural order of
	     the value's type.
	
	     @return {function(Backbone.Model, string): *}
	   */
	  sortValue: function () {
	    var sortValue = this.get("sortValue");
	    if (_.isString(sortValue)) return this[sortValue];
	    else if (_.isFunction(sortValue)) return sortValue;
	
	    return function (model, colName) {
	      return model.get(colName);
	    };
	  }
	
	  /**
	     @member Backgrid.Column
	     @protected
	     @method sortable
	     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
	  */
	
	  /**
	     @member Backgrid.Column
	     @protected
	     @method editable
	     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
	  */
	
	  /**
	     @member Backgrid.Column
	     @protected
	     @method renderable
	     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
	  */
	});
	
	_.each(["sortable", "renderable", "editable"], function (key) {
	  Column.prototype[key] = function () {
	    var value = this.get(key);
	    if (_.isString(value)) return this[value];
	    else if (_.isFunction(value)) return value;
	
	    return !!value;
	  };
	});
	
	/**
	   A Backbone collection of Column instances.
	
	   @class Backgrid.Columns
	   @extends Backbone.Collection
	 */
	var Columns = Backgrid.Columns = Backbone.Collection.extend({
	
	  /**
	     @property {Backgrid.Column} model
	   */
	  model: Column
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   Row is a simple container view that takes a model instance and a list of
	   column metadata describing how each of the model's attribute is to be
	   rendered, and apply the appropriate cell to each attribute.
	
	   @class Backgrid.Row
	   @extends Backbone.View
	*/
	var Row = Backgrid.Row = Backbone.View.extend({
	
	  /** @property */
	  tagName: "tr",
	
	  /**
	     Initializes a row view instance.
	
	     @param {Object} options
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
	     @param {Backbone.Model} options.model The model instance to render.
	
	     @throws {TypeError} If options.columns or options.model is undefined.
	  */
	  initialize: function (options) {
	
	    var columns = this.columns = options.columns;
	    if (!(columns instanceof Backbone.Collection)) {
	      columns = this.columns = new Columns(columns);
	    }
	
	    var cells = this.cells = [];
	    for (var i = 0; i < columns.length; i++) {
	      cells.push(this.makeCell(columns.at(i), options));
	    }
	
	    this.listenTo(columns, "add", function (column, columns) {
	      var i = columns.indexOf(column);
	      var cell = this.makeCell(column, options);
	      cells.splice(i, 0, cell);
	
	      var $el = this.$el;
	      if (i === 0) {
	        $el.prepend(cell.render().$el);
	      }
	      else if (i === columns.length - 1) {
	        $el.append(cell.render().$el);
	      }
	      else {
	        $el.children().eq(i).before(cell.render().$el);
	      }
	    });
	
	    this.listenTo(columns, "remove", function (column, columns, opts) {
	      cells[opts.index].remove();
	      cells.splice(opts.index, 1);
	    });
	  },
	
	  /**
	     Factory method for making a cell. Used by #initialize internally. Override
	     this to provide an appropriate cell instance for a custom Row subclass.
	
	     @protected
	
	     @param {Backgrid.Column} column
	     @param {Object} options The options passed to #initialize.
	
	     @return {Backgrid.Cell}
	  */
	  makeCell: function (column) {
	    return new (column.get("cell"))({
	      column: column,
	      model: this.model
	    });
	  },
	
	  /**
	     Renders a row of cells for this row's model.
	  */
	  render: function () {
	    this.$el.empty();
	
	    var fragment = document.createDocumentFragment();
	    for (var i = 0; i < this.cells.length; i++) {
	      fragment.appendChild(this.cells[i].render().el);
	    }
	
	    this.el.appendChild(fragment);
	
	    this.delegateEvents();
	
	    return this;
	  },
	
	  /**
	     Clean up this row and its cells.
	
	     @chainable
	  */
	  remove: function () {
	    for (var i = 0; i < this.cells.length; i++) {
	      var cell = this.cells[i];
	      cell.remove.apply(cell, arguments);
	    }
	    return Backbone.View.prototype.remove.apply(this, arguments);
	  }
	
	});
	
	/**
	   EmptyRow is a simple container view that takes a list of column and render a
	   row with a single column.
	
	   @class Backgrid.EmptyRow
	   @extends Backbone.View
	*/
	var EmptyRow = Backgrid.EmptyRow = Backbone.View.extend({
	
	  /** @property */
	  tagName: "tr",
	
	  /** @property {string|function(): string} */
	  emptyText: null,
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {string|function(): string} options.emptyText
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
	   */
	  initialize: function (options) {
	    this.emptyText = options.emptyText;
	    this.columns =  options.columns;
	  },
	
	  /**
	     Renders an empty row.
	  */
	  render: function () {
	    this.$el.empty();
	
	    var td = document.createElement("td");
	    td.setAttribute("colspan", this.columns.length);
	    var span = document.createElement("span");
	    span.innerHTML = _.result(this, "emptyText");
	    td.appendChild(span);
	
	    this.el.className = "empty";
	    this.el.appendChild(td);
	
	    return this;
	  }
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   HeaderCell is a special cell class that renders a column header cell. If the
	   column is sortable, a sorter is also rendered and will trigger a table
	   refresh after sorting.
	
	   @class Backgrid.HeaderCell
	   @extends Backbone.View
	 */
	var HeaderCell = Backgrid.HeaderCell = Backbone.View.extend({
	
	  /** @property */
	  tagName: "th",
	
	  /** @property */
	  events: {
	    "click a": "onClick"
	  },
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backgrid.Column|Object} options.column
	
	     @throws {TypeError} If options.column or options.collection is undefined.
	   */
	  initialize: function (options) {
	    this.column = options.column;
	    if (!(this.column instanceof Column)) {
	      this.column = new Column(this.column);
	    }
	
	    var column = this.column, collection = this.collection, $el = this.$el;
	
	    this.listenTo(column, "change:editable change:sortable change:renderable",
	                  function (column) {
	                    var changed = column.changedAttributes();
	                    for (var key in changed) {
	                      if (changed.hasOwnProperty(key)) {
	                        $el.toggleClass(key, changed[key]);
	                      }
	                    }
	                  });
	    this.listenTo(column, "change:direction", this.setCellDirection);
	    this.listenTo(column, "change:name change:label", this.render);
	
	    if (Backgrid.callByNeed(column.editable(), column, collection)) $el.addClass("editable");
	    if (Backgrid.callByNeed(column.sortable(), column, collection)) $el.addClass("sortable");
	    if (Backgrid.callByNeed(column.renderable(), column, collection)) $el.addClass("renderable");
	
	    this.listenTo(collection.fullCollection || collection, "sort", this.removeCellDirection);
	  },
	
	  /**
	     Event handler for the collection's `sort` event. Removes all the CSS
	     direction classes.
	   */
	  removeCellDirection: function () {
	    this.$el.removeClass("ascending").removeClass("descending");
	    this.column.set("direction", null);
	  },
	
	  /**
	     Event handler for the column's `change:direction` event. If this
	     HeaderCell's column is being sorted on, it applies the direction given as a
	     CSS class to the header cell. Removes all the CSS direction classes
	     otherwise.
	   */
	  setCellDirection: function (column, direction) {
	    this.$el.removeClass("ascending").removeClass("descending");
	    if (column.cid == this.column.cid) this.$el.addClass(direction);
	  },
	
	  /**
	     Event handler for the `click` event on the cell's anchor. If the column is
	     sortable, clicking on the anchor will cycle through 3 sorting orderings -
	     `ascending`, `descending`, and default.
	   */
	  onClick: function (e) {
	    e.preventDefault();
	
	    var column = this.column;
	    var collection = this.collection;
	    var event = "backgrid:sort";
	
	    function cycleSort(header, col) {
	      if (column.get("direction") === "ascending") collection.trigger(event, col, "descending");
	      else if (column.get("direction") === "descending") collection.trigger(event, col, null);
	      else collection.trigger(event, col, "ascending");
	    }
	
	    function toggleSort(header, col) {
	      if (column.get("direction") === "ascending") collection.trigger(event, col, "descending");
	      else collection.trigger(event, col, "ascending");
	    }
	
	    var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
	    if (sortable) {
	      var sortType = column.get("sortType");
	      if (sortType === "toggle") toggleSort(this, column);
	      else cycleSort(this, column);
	    }
	  },
	
	  /**
	     Renders a header cell with a sorter, a label, and a class name for this
	     column.
	   */
	  render: function () {
	    this.$el.empty();
	    var column = this.column;
	    var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
	    var label;
	    if(sortable){
	      label = $("<a>").text(column.get("label")).append("<b class='sort-caret'></b>");
	    } else {
	      label = document.createTextNode(column.get("label"));
	    }
	
	    this.$el.append(label);
	    this.$el.addClass(column.get("name"));
	    this.$el.addClass(column.get("direction"));
	    this.delegateEvents();
	    return this;
	  }
	
	});
	
	/**
	   HeaderRow is a controller for a row of header cells.
	
	   @class Backgrid.HeaderRow
	   @extends Backgrid.Row
	 */
	var HeaderRow = Backgrid.HeaderRow = Backgrid.Row.extend({
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
	     @param {Backgrid.HeaderCell} [options.headerCell] Customized default
	     HeaderCell for all the columns. Supply a HeaderCell class or instance to a
	     the `headerCell` key in a column definition for column-specific header
	     rendering.
	
	     @throws {TypeError} If options.columns or options.collection is undefined.
	   */
	  initialize: function () {
	    Backgrid.Row.prototype.initialize.apply(this, arguments);
	  },
	
	  makeCell: function (column, options) {
	    var headerCell = column.get("headerCell") || options.headerCell || HeaderCell;
	    headerCell = new headerCell({
	      column: column,
	      collection: this.collection
	    });
	    return headerCell;
	  }
	
	});
	
	/**
	   Header is a special structural view class that renders a table head with a
	   single row of header cells.
	
	   @class Backgrid.Header
	   @extends Backbone.View
	 */
	var Header = Backgrid.Header = Backbone.View.extend({
	
	  /** @property */
	  tagName: "thead",
	
	  /**
	     Initializer. Initializes this table head view to contain a single header
	     row view.
	
	     @param {Object} options
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
	     @param {Backbone.Model} options.model The model instance to render.
	
	     @throws {TypeError} If options.columns or options.model is undefined.
	   */
	  initialize: function (options) {
	    this.columns = options.columns;
	    if (!(this.columns instanceof Backbone.Collection)) {
	      this.columns = new Columns(this.columns);
	    }
	
	    this.row = new Backgrid.HeaderRow({
	      columns: this.columns,
	      collection: this.collection
	    });
	  },
	
	  /**
	     Renders this table head with a single row of header cells.
	   */
	  render: function () {
	    this.$el.append(this.row.render().$el);
	    this.delegateEvents();
	    return this;
	  },
	
	  /**
	     Clean up this header and its row.
	
	     @chainable
	   */
	  remove: function () {
	    this.row.remove.apply(this.row, arguments);
	    return Backbone.View.prototype.remove.apply(this, arguments);
	  }
	
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   Body is the table body which contains the rows inside a table. Body is
	   responsible for refreshing the rows after sorting, insertion and removal.
	
	   @class Backgrid.Body
	   @extends Backbone.View
	*/
	var Body = Backgrid.Body = Backbone.View.extend({
	
	  /** @property */
	  tagName: "tbody",
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backbone.Collection} options.collection
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
	     Column metadata.
	     @param {Backgrid.Row} [options.row=Backgrid.Row] The Row class to use.
	     @param {string|function(): string} [options.emptyText] The text to display in the empty row.
	
	     @throws {TypeError} If options.columns or options.collection is undefined.
	
	     See Backgrid.Row.
	  */
	  initialize: function (options) {
	
	    this.columns = options.columns;
	    if (!(this.columns instanceof Backbone.Collection)) {
	      this.columns = new Columns(this.columns);
	    }
	
	    this.row = options.row || this.row || Row;
	    this.rows = this.collection.map(function (model) {
	      var row = new this.row({
	        columns: this.columns,
	        model: model
	      });
	
	      return row;
	    }, this);
	
	    this.emptyText = options.emptyText;
	    this._unshiftEmptyRowMayBe();
	
	    var collection = this.collection;
	    this.listenTo(collection, "add", this.insertRow);
	    this.listenTo(collection, "remove", this.removeRow);
	    this.listenTo(collection, "sort", this.refresh);
	    this.listenTo(collection, "reset", this.refresh);
	    this.listenTo(collection, "backgrid:sort", this.sort);
	    this.listenTo(collection, "backgrid:edited", this.moveToNextCell);
	
	    this.listenTo(this.columns, "add remove", this.updateEmptyRow);
	  },
	
	  _unshiftEmptyRowMayBe: function () {
	    if (this.rows.length === 0 && this.emptyText != null) {
	      this.emptyRow = new EmptyRow({
	        emptyText: this.emptyText,
	        columns: this.columns
	      });
	
	      this.rows.unshift(this.emptyRow);
	      return true
	    }
	  },
	
	  /**
	     This method can be called either directly or as a callback to a
	     [Backbone.Collecton#add](http://backbonejs.org/#Collection-add) event.
	
	     When called directly, it accepts a model or an array of models and an
	     option hash just like
	     [Backbone.Collection#add](http://backbonejs.org/#Collection-add) and
	     delegates to it. Once the model is added, a new row is inserted into the
	     body and automatically rendered.
	
	     When called as a callback of an `add` event, splices a new row into the
	     body and renders it.
	
	     @param {Backbone.Model} model The model to render as a row.
	     @param {Backbone.Collection} collection When called directly, this
	     parameter is actually the options to
	     [Backbone.Collection#add](http://backbonejs.org/#Collection-add).
	     @param {Object} options When called directly, this must be null.
	
	     See:
	
	     - [Backbone.Collection#add](http://backbonejs.org/#Collection-add)
	  */
	  insertRow: function (model, collection, options) {
	
	    if (this.rows[0] instanceof EmptyRow) this.rows.pop().remove();
	
	    // insertRow() is called directly
	    if (!(collection instanceof Backbone.Collection) && !options) {
	      this.collection.add(model, (options = collection));
	      return;
	    }
	
	    var row = new this.row({
	      columns: this.columns,
	      model: model
	    });
	
	    var index = collection.indexOf(model);
	    this.rows.splice(index, 0, row);
	
	    var $el = this.$el;
	    var $children = $el.children();
	    var $rowEl = row.render().$el;
	
	    if (index >= $children.length) {
	      $el.append($rowEl);
	    }
	    else {
	      $children.eq(index).before($rowEl);
	    }
	
	    return this;
	  },
	
	  /**
	     The method can be called either directly or as a callback to a
	     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
	     event.
	
	     When called directly, it accepts a model or an array of models and an
	     option hash just like
	     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove) and
	     delegates to it. Once the model is removed, a corresponding row is removed
	     from the body.
	
	     When called as a callback of a `remove` event, splices into the rows and
	     removes the row responsible for rendering the model.
	
	     @param {Backbone.Model} model The model to remove from the body.
	     @param {Backbone.Collection} collection When called directly, this
	     parameter is actually the options to
	     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove).
	     @param {Object} options When called directly, this must be null.
	
	     See:
	
	     - [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
	  */
	  removeRow: function (model, collection, options) {
	
	    // removeRow() is called directly
	    if (!options) {
	      this.collection.remove(model, (options = collection));
	      if (this._unshiftEmptyRowMayBe()) {
	        this.render();
	      }
	      return;
	    }
	
	    if (_.isUndefined(options.render) || options.render) {
	      this.rows[options.index].remove();
	    }
	
	    this.rows.splice(options.index, 1);
	    if (this._unshiftEmptyRowMayBe()) {
	      this.render();
	    }
	
	    return this;
	  },
	
	  /**
	     Rerender the EmptyRow which empties the DOM element, creates the td with the
	     updated colspan, and appends it back into the DOM
	  */
	
	  updateEmptyRow: function () {
	    if (this.emptyRow != null) {
	      this.emptyRow.render();
	    }
	  },
	
	  /**
	     Reinitialize all the rows inside the body and re-render them. Triggers a
	     Backbone `backgrid:refresh` event from the collection along with the body
	     instance as its sole parameter when done.
	  */
	  refresh: function () {
	    for (var i = 0; i < this.rows.length; i++) {
	      this.rows[i].remove();
	    }
	
	    this.rows = this.collection.map(function (model) {
	      var row = new this.row({
	        columns: this.columns,
	        model: model
	      });
	
	      return row;
	    }, this);
	    this._unshiftEmptyRowMayBe();
	
	    this.render();
	
	    this.collection.trigger("backgrid:refresh", this);
	
	    return this;
	  },
	
	  /**
	     Renders all the rows inside this body. If the collection is empty and
	     `options.emptyText` is defined and not null in the constructor, an empty
	     row is rendered, otherwise no row is rendered.
	  */
	  render: function () {
	    this.$el.empty();
	
	    var fragment = document.createDocumentFragment();
	    for (var i = 0; i < this.rows.length; i++) {
	      var row = this.rows[i];
	      fragment.appendChild(row.render().el);
	    }
	
	    this.el.appendChild(fragment);
	
	    this.delegateEvents();
	
	    return this;
	  },
	
	  /**
	     Clean up this body and it's rows.
	
	     @chainable
	  */
	  remove: function () {
	    for (var i = 0; i < this.rows.length; i++) {
	      var row = this.rows[i];
	      row.remove.apply(row, arguments);
	    }
	    return Backbone.View.prototype.remove.apply(this, arguments);
	  },
	
	  /**
	     If the underlying collection is a Backbone.PageableCollection in
	     server-mode or infinite-mode, a page of models is fetched after sorting is
	     done on the server.
	
	     If the underlying collection is a Backbone.PageableCollection in
	     client-mode, or any
	     [Backbone.Collection](http://backbonejs.org/#Collection) instance, sorting
	     is done on the client side. If the collection is an instance of a
	     Backbone.PageableCollection, sorting will be done globally on all the pages
	     and the current page will then be returned.
	
	     Triggers a Backbone `backgrid:sorted` event from the collection when done
	     with the column, direction and a reference to the collection.
	
	     @param {Backgrid.Column|string} column
	     @param {null|"ascending"|"descending"} direction
	
	     See [Backbone.Collection#comparator](http://backbonejs.org/#Collection-comparator)
	  */
	  sort: function (column, direction) {
	
	    if (!_.contains(["ascending", "descending", null], direction)) {
	      throw new RangeError('direction must be one of "ascending", "descending" or `null`');
	    }
	
	    if (_.isString(column)) column = this.columns.findWhere({name: column});
	
	    var collection = this.collection;
	
	    var order;
	    if (direction === "ascending") order = -1;
	    else if (direction === "descending") order = 1;
	    else order = null;
	
	    var comparator = this.makeComparator(column.get("name"), order,
	                                         order ?
	                                         column.sortValue() :
	                                         function (model) {
	                                           return model.cid.replace('c', '') * 1;
	                                         });
	
	    if (Backbone.PageableCollection &&
	        collection instanceof Backbone.PageableCollection) {
	
	      collection.setSorting(order && column.get("name"), order,
	                            {sortValue: column.sortValue()});
	
	      if (collection.fullCollection) {
	        // If order is null, pageable will remove the comparator on both sides,
	        // in this case the default insertion order comparator needs to be
	        // attached to get back to the order before sorting.
	        if (collection.fullCollection.comparator == null) {
	          collection.fullCollection.comparator = comparator;
	        }
	        collection.fullCollection.sort();
	        collection.trigger("backgrid:sorted", column, direction, collection);
	      }
	      else collection.fetch({reset: true, success: function () {
	        collection.trigger("backgrid:sorted", column, direction, collection);
	      }});
	    }
	    else {
	      collection.comparator = comparator;
	      collection.sort();
	      collection.trigger("backgrid:sorted", column, direction, collection);
	    }
	
	    column.set("direction", direction);
	
	    return this;
	  },
	
	  makeComparator: function (attr, order, func) {
	
	    return function (left, right) {
	      // extract the values from the models
	      var l = func(left, attr), r = func(right, attr), t;
	
	      // if descending order, swap left and right
	      if (order === 1) t = l, l = r, r = t;
	
	      // compare as usual
	      if (l === r) return 0;
	      else if (l < r) return -1;
	      return 1;
	    };
	  },
	
	  /**
	     Moves focus to the next renderable and editable cell and return the
	     currently editing cell to display mode.
	
	     Triggers a `backgrid:next` event on the model with the indices of the row
	     and column the user *intended* to move to, and whether the intended move
	     was going to go out of bounds. Note that *out of bound* always means an
	     attempt to go past the end of the last row.
	
	     @param {Backbone.Model} model The originating model
	     @param {Backgrid.Column} column The originating model column
	     @param {Backgrid.Command} command The Command object constructed from a DOM
	     event
	  */
	  moveToNextCell: function (model, column, command) {
	    var i = this.collection.indexOf(model);
	    var j = this.columns.indexOf(column);
	    var cell, renderable, editable, m, n;
	
	    // return if model being edited in a different grid
	    if (j === -1) return this;
	
	    this.rows[i].cells[j].exitEditMode();
	
	    if (command.moveUp() || command.moveDown() || command.moveLeft() ||
	        command.moveRight() || command.save()) {
	      var l = this.columns.length;
	      var maxOffset = l * this.collection.length;
	
	      if (command.moveUp() || command.moveDown()) {
	        m = i + (command.moveUp() ? -1 : 1);
	        var row = this.rows[m];
	        if (row) {
	          cell = row.cells[j];
	          if (Backgrid.callByNeed(cell.column.editable(), cell.column, model)) {
	            cell.enterEditMode();
	            model.trigger("backgrid:next", m, j, false);
	          }
	        }
	        else model.trigger("backgrid:next", m, j, true);
	      }
	      else if (command.moveLeft() || command.moveRight()) {
	        var right = command.moveRight();
	        for (var offset = i * l + j + (right ? 1 : -1);
	             offset >= 0 && offset < maxOffset;
	             right ? offset++ : offset--) {
	          m = ~~(offset / l);
	          n = offset - m * l;
	          cell = this.rows[m].cells[n];
	          renderable = Backgrid.callByNeed(cell.column.renderable(), cell.column, cell.model);
	          editable = Backgrid.callByNeed(cell.column.editable(), cell.column, model);
	          if (renderable && editable) {
	            cell.enterEditMode();
	            model.trigger("backgrid:next", m, n, false);
	            break;
	          }
	        }
	
	        if (offset == maxOffset) {
	          model.trigger("backgrid:next", ~~(offset / l), offset - m * l, true);
	        }
	      }
	    }
	
	    return this;
	  }
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   A Footer is a generic class that only defines a default tag `tfoot` and
	   number of required parameters in the initializer.
	
	   @abstract
	   @class Backgrid.Footer
	   @extends Backbone.View
	 */
	var Footer = Backgrid.Footer = Backbone.View.extend({
	
	  /** @property */
	  tagName: "tfoot",
	
	  /**
	     Initializer.
	
	     @param {Object} options
	     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
	     Column metadata.
	     @param {Backbone.Collection} options.collection
	
	     @throws {TypeError} If options.columns or options.collection is undefined.
	  */
	  initialize: function (options) {
	    this.columns = options.columns;
	    if (!(this.columns instanceof Backbone.Collection)) {
	      this.columns = new Backgrid.Columns(this.columns);
	    }
	  }
	
	});
	
	/*
	  backgrid
	  http://github.com/wyuenho/backgrid
	
	  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
	  Licensed under the MIT license.
	*/
	
	/**
	   Grid represents a data grid that has a header, body and an optional footer.
	
	   By default, a Grid treats each model in a collection as a row, and each
	   attribute in a model as a column. To render a grid you must provide a list of
	   column metadata and a collection to the Grid constructor. Just like any
	   Backbone.View class, the grid is rendered as a DOM node fragment when you
	   call render().
	
	       var grid = Backgrid.Grid({
	         columns: [{ name: "id", label: "ID", type: "string" },
	          // ...
	         ],
	         collections: books
	       });
	
	       $("#table-container").append(grid.render().el);
	
	   Optionally, if you want to customize the rendering of the grid's header and
	   footer, you may choose to extend Backgrid.Header and Backgrid.Footer, and
	   then supply that class or an instance of that class to the Grid constructor.
	   See the documentation for Header and Footer for further details.
	
	       var grid = Backgrid.Grid({
	         columns: [{ name: "id", label: "ID", type: "string" }],
	         collections: books,
	         header: Backgrid.Header.extend({
	              //...
	         }),
	         footer: Backgrid.Paginator
	       });
	
	   Finally, if you want to override how the rows are rendered in the table body,
	   you can supply a Body subclass as the `body` attribute that uses a different
	   Row class.
	
	   @class Backgrid.Grid
	   @extends Backbone.View
	
	   See:
	
	   - Backgrid.Column
	   - Backgrid.Header
	   - Backgrid.Body
	   - Backgrid.Row
	   - Backgrid.Footer
	*/
	var Grid = Backgrid.Grid = Backbone.View.extend({
	
	  /** @property */
	  tagName: "table",
	
	  /** @property */
	  className: "backgrid",
	
	  /** @property */
	  header: Header,
	
	  /** @property */
	  body: Body,
	
	  /** @property */
	  footer: null,
	
	  /**
	     Initializes a Grid instance.
	
	     @param {Object} options
	     @param {Backbone.Collection.<Backgrid.Columns>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
	     @param {Backbone.Collection} options.collection The collection of tabular model data to display.
	     @param {Backgrid.Header} [options.header=Backgrid.Header] An optional Header class to override the default.
	     @param {Backgrid.Body} [options.body=Backgrid.Body] An optional Body class to override the default.
	     @param {Backgrid.Row} [options.row=Backgrid.Row] An optional Row class to override the default.
	     @param {Backgrid.Footer} [options.footer=Backgrid.Footer] An optional Footer class.
	   */
	  initialize: function (options) {
	    // Convert the list of column objects here first so the subviews don't have
	    // to.
	    if (!(options.columns instanceof Backbone.Collection)) {
	      options.columns = new Columns(options.columns || this.columns);
	    }
	    this.columns = options.columns;
	
	    var filteredOptions = _.omit(options, ["el", "id", "attributes",
	                                           "className", "tagName", "events"]);
	
	    // must construct body first so it listens to backgrid:sort first
	    this.body = options.body || this.body;
	    this.body = new this.body(filteredOptions);
	
	    this.header = options.header || this.header;
	    if (this.header) {
	      this.header = new this.header(filteredOptions);
	    }
	
	    this.footer = options.footer || this.footer;
	    if (this.footer) {
	      this.footer = new this.footer(filteredOptions);
	    }
	
	    this.listenTo(this.columns, "reset", function () {
	      if (this.header) {
	        this.header = new (this.header.remove().constructor)(filteredOptions);
	      }
	      this.body = new (this.body.remove().constructor)(filteredOptions);
	      if (this.footer) {
	        this.footer = new (this.footer.remove().constructor)(filteredOptions);
	      }
	      this.render();
	    });
	  },
	
	  /**
	     Delegates to Backgrid.Body#insertRow.
	   */
	  insertRow: function () {
	    this.body.insertRow.apply(this.body, arguments);
	    return this;
	  },
	
	  /**
	     Delegates to Backgrid.Body#removeRow.
	   */
	  removeRow: function () {
	    this.body.removeRow.apply(this.body, arguments);
	    return this;
	  },
	
	  /**
	     Delegates to Backgrid.Columns#add for adding a column. Subviews can listen
	     to the `add` event from their internal `columns` if rerendering needs to
	     happen.
	
	     @param {Object} [options] Options for `Backgrid.Columns#add`.
	   */
	  insertColumn: function () {
	    this.columns.add.apply(this.columns, arguments);
	    return this;
	  },
	
	  /**
	     Delegates to Backgrid.Columns#remove for removing a column. Subviews can
	     listen to the `remove` event from the internal `columns` if rerendering
	     needs to happen.
	
	     @param {Object} [options] Options for `Backgrid.Columns#remove`.
	   */
	  removeColumn: function () {
	    this.columns.remove.apply(this.columns, arguments);
	    return this;
	  },
	
	  /**
	     Delegates to Backgrid.Body#sort.
	   */
	  sort: function () {
	    this.body.sort.apply(this.body, arguments);
	    return this;
	  },
	
	  /**
	     Renders the grid's header, then footer, then finally the body. Triggers a
	     Backbone `backgrid:rendered` event along with a reference to the grid when
	     the it has successfully been rendered.
	   */
	  render: function () {
	    this.$el.empty();
	
	    if (this.header) {
	      this.$el.append(this.header.render().$el);
	    }
	
	    if (this.footer) {
	      this.$el.append(this.footer.render().$el);
	    }
	
	    this.$el.append(this.body.render().$el);
	
	    this.delegateEvents();
	
	    this.trigger("backgrid:rendered", this);
	
	    return this;
	  },
	
	  /**
	     Clean up this grid and its subviews.
	
	     @chainable
	   */
	  remove: function () {
	    this.header && this.header.remove.apply(this.header, arguments);
	    this.body.remove.apply(this.body, arguments);
	    this.footer && this.footer.remove.apply(this.footer, arguments);
	    return Backbone.View.prototype.remove.apply(this, arguments);
	  }
	
	});
	  return Backgrid;
	}));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Marionette Service
	 *
	 * Adds a Service Object to Marionette which allows an Object to
	 * receive Backbone.Radio messages in a declarative fashion.
	 *
	 * @author Ben McCormick
	 *
	 */
	/* global define:false, require:false, module:false */
	(function(global, factory) {
	  'use strict';
	  if(true) {
	    module.exports = factory(__webpack_require__(3), __webpack_require__(4), __webpack_require__(2)); //jshint ignore:line
	  } else if(typeof define === 'function' && define.amd) {
	   define(['backbone.marionette', 'backbone.radio', 'underscore'], factory);
	  } else {
	   factory(global.Marionette, global.Backbone.Radio, global._);
	  }
	})(this, function (Mn, Radio, _) {
	  //Proxy Radio message handling to enable declarative interactions with radio channels
	  var radioAPI = {
	      radioEvents : {
	          startMethod: 'on',
	          stopMethod: 'off'
	      },
	
	      radioRequests : {
	          startMethod: 'reply',
	          stopMethod: 'stopReplying'
	      }
	  };
	
	  function proxyRadioHandlers() {
	      unproxyRadioHandlers.apply(this);
	      _.each(radioAPI, function(commands, radioType) {
	          var hash = _.result(this, radioType);
	          if (!hash) {
	              return;
	          }
	          _.each(hash, function(handler, radioMessage) {
	              handler = normalizeHandler.call(this, handler);
	              if (!handler) {
	                return;
	              }
	              var messageComponents = radioMessage.split(' '),
	                channel = messageComponents[0],
	                messageName = messageComponents[1];
	              proxyRadioHandler.call(this,channel, radioType, messageName, handler);
	          }, this);
	      }, this);
	  }
	
	  function proxyRadioHandler(channel, radioType, messageName, handler) {
	      var method = radioAPI[radioType].startMethod;
	      this._radioChannels = this._radioChannels || [];
	      if(!_.contains(this._radioChannels, channel)) {
	          this._radioChannels.push(channel);
	      }
	      Radio[method](channel, messageName, handler, this);
	  }
	
	  function unproxyRadioHandlers() {
	      _.each(this._radioChannels, function(channel) {
	          _.each(radioAPI,function(commands) {
	              Radio[commands.stopMethod](channel, null, null, this);
	          }, this);
	      }, this);
	  }
	
	  function normalizeHandler(handler) {
	      if (!_.isFunction(handler)) {
	          handler = this[handler];
	      }
	      return handler;
	  }
	
	  var Service = Mn.Object.extend({
	
	      constructor: function() {
	          Mn.Object.apply(this, [].slice.call(arguments));
	          proxyRadioHandlers.apply(this);
	      },
	
	      destroy: function() {
	          Mn.Object.prototype.destroy.apply(this);
	          unproxyRadioHandlers.apply(this);
	      }
	
	  });
	  Mn.Service = Service;
	  return Service;
	});


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<header id="header">\n</header>\n<main id="main"></main>\n<footer id="footer">\n</footer>';
	}
	return __p;
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<footer>\n	<p>This is the footer</p>\n</footer>';
	}
	return __p;
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<p>This is the header</p>';
	}
	return __p;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<div id="search-form-wrapper">\n	<p>Search form wrapper</p>\n</div>\n<div id="search-results-wrapper">\n	<p>Search results wrapper</p>\n</div>';
	}
	return __p;
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map