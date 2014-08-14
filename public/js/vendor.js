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
// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});

;/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
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
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
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
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
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
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
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

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

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
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
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
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
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
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
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
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
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
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
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
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

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
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
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

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
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
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
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
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
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
		i = attrs.length;

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
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
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
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
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
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
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

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
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

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
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

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
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
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
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

	return doc;
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
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
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

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
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
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
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
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

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
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

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
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
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
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
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
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
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
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
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
							idx = indexOf.call( seed, matched[i] );
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
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
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
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
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
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
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

function tokenize( selector, parseOnly ) {
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
			groups.push( tokens = [] );
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
}

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
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
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
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
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
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

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
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
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
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
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

			// Apply set filters to unmatched elements
			matchedCount += i;
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

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
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
						rsibling.test( tokens[0].type ) && context.parentNode || context
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
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

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
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
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
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
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
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
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
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
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
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

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
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
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
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
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
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

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
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
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
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
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

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
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

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
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
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
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
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
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

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

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
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
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

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

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
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
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
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
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
			elemData = data_priv.get( elem );

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
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

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
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
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

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

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
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
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
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
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
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

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

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
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

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
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

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
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
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

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
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
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
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
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
			return this;
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
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
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
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
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
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
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
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
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

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

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
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
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
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

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

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
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
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
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
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
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

		values[ index ] = data_priv.get( elem, "olddisplay" );
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
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
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

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
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

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
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
		"columnCount": true,
		"fillOpacity": true,
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
		// normalize float css property
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

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
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
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

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

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
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
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
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
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
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

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

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
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
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
		});

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
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

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
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

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
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

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
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

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
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
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
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
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
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
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
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
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
			xml: /xml/,
			html: /html/,
			json: /json/
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
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
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
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
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
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
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
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
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
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
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
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
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
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
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
				clearTimeout( timeoutTimer );
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
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
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
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
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
					jQuery.event.trigger("ajaxStop");
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
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
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
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
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
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
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
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
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
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
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
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
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
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
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

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
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

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
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

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
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
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
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

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
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

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
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

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

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
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
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

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

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
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
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

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

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
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
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


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
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

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
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
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );

;(function($, window, undefined) {
    //is onprogress supported by browser?
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    //If not supported, do nothing
    if (!hasOnProgress) {
        return;
    }
    
    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function() {
        var xhr = oldXHR();
        if(xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }
        
        if(xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        
        return xhr;
    };
})(jQuery, window);

;/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function() {
// handlebars/safe-string.js
var __module4__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module3__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module4__);

// handlebars/exception.js
var __module5__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) {
                data.key = key;
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module5__);

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module3__, __module5__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module4__, __module5__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;

  function LocationInfo(locInfo){
    locInfo = locInfo || {};
    this.firstLine   = locInfo.first_line;
    this.firstColumn = locInfo.first_column;
    this.lastColumn  = locInfo.last_column;
    this.lastLine    = locInfo.last_line;
  }

  var AST = {
    ProgramNode: function(statements, inverseStrip, inverse, locInfo) {
      var inverseLocationInfo, firstInverseNode;
      if (arguments.length === 3) {
        locInfo = inverse;
        inverse = null;
      } else if (arguments.length === 2) {
        locInfo = inverseStrip;
        inverseStrip = null;
      }

      LocationInfo.call(this, locInfo);
      this.type = "program";
      this.statements = statements;
      this.strip = {};

      if(inverse) {
        firstInverseNode = inverse[0];
        if (firstInverseNode) {
          inverseLocationInfo = {
            first_line: firstInverseNode.firstLine,
            last_line: firstInverseNode.lastLine,
            last_column: firstInverseNode.lastColumn,
            first_column: firstInverseNode.firstColumn
          };
          this.inverse = new AST.ProgramNode(inverse, inverseStrip, inverseLocationInfo);
        } else {
          this.inverse = new AST.ProgramNode(inverse, inverseStrip);
        }
        this.strip.right = inverseStrip.left;
      } else if (inverseStrip) {
        this.strip.left = inverseStrip.right;
      }
    },

    MustacheNode: function(rawParams, hash, open, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "mustache";
      this.strip = strip;

      // Open may be a string parsed from the parser or a passed boolean flag
      if (open != null && open.charAt) {
        // Must use charAt to support IE pre-10
        var escapeFlag = open.charAt(3) || open.charAt(2);
        this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
      } else {
        this.escaped = !!open;
      }

      if (rawParams instanceof AST.SexprNode) {
        this.sexpr = rawParams;
      } else {
        // Support old AST API
        this.sexpr = new AST.SexprNode(rawParams, hash);
      }

      this.sexpr.isRoot = true;

      // Support old AST API that stored this info in MustacheNode
      this.id = this.sexpr.id;
      this.params = this.sexpr.params;
      this.hash = this.sexpr.hash;
      this.eligibleHelper = this.sexpr.eligibleHelper;
      this.isHelper = this.sexpr.isHelper;
    },

    SexprNode: function(rawParams, hash, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = "sexpr";
      this.hash = hash;

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var eligibleHelper = this.eligibleHelper = id.isSimple;

      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      this.isHelper = eligibleHelper && (params.length || hash);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
    },

    PartialNode: function(partialName, context, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.strip = strip;
    },

    BlockNode: function(mustache, program, inverse, close, locInfo) {
      LocationInfo.call(this, locInfo);

      if(mustache.sexpr.id.original !== close.path.original) {
        throw new Exception(mustache.sexpr.id.original + " doesn't match " + close.path.original, this);
      }

      this.type = 'block';
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;

      this.strip = {
        left: mustache.strip.left,
        right: close.strip.right
      };

      (program || inverse).strip.left = mustache.strip.right;
      (inverse || program).strip.right = close.strip.left;

      if (inverse && !program) {
        this.isInverse = true;
      }
    },

    ContentNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "content";
      this.string = string;
    },

    HashNode: function(pairs, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "hash";
      this.pairs = pairs;
    },

    IdNode: function(parts, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0;

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) {
            throw new Exception("Invalid path: " + original, this);
          } else if (part === "..") {
            depth++;
          } else {
            this.isScoped = true;
          }
        } else {
          dig.push(part);
        }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    },

    PartialNameNode: function(name, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    },

    DataNode: function(id, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "DATA";
      this.id = id;
    },

    StringNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    },

    IntegerNode: function(integer, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "INTEGER";
      this.original =
        this.integer = integer;
      this.stringModeValue = Number(integer);
    },

    BooleanNode: function(bool, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    },

    CommentNode: function(comment, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "comment";
      this.comment = comment;
    }
  };

  // Must be exported as an object rather than the root of the module as the jison lexer
  // most modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})(__module5__);

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"statements":4,"EOF":5,"program":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"sexpr":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"CLOSE_UNESCAPED":24,"OPEN_PARTIAL":25,"partialName":26,"partial_option0":27,"sexpr_repetition0":28,"sexpr_option0":29,"dataName":30,"param":31,"STRING":32,"INTEGER":33,"BOOLEAN":34,"OPEN_SEXPR":35,"CLOSE_SEXPR":36,"hash":37,"hash_repetition_plus0":38,"hashSegment":39,"ID":40,"EQUALS":41,"DATA":42,"pathSegments":43,"SEP":44,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",32:"STRING",33:"INTEGER",34:"BOOLEAN",35:"OPEN_SEXPR",36:"CLOSE_SEXPR",40:"ID",41:"EQUALS",42:"DATA",44:"SEP"},
  productions_: [0,[3,2],[3,1],[6,2],[6,3],[6,2],[6,1],[6,1],[6,0],[4,1],[4,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,4],[7,2],[17,3],[17,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,3],[37,1],[39,3],[26,1],[26,1],[26,1],[30,2],[21,1],[43,3],[43,1],[27,0],[27,1],[28,0],[28,2],[29,0],[29,1],[38,1],[38,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: return new yy.ProgramNode($$[$0-1], this._$);
  break;
  case 2: return new yy.ProgramNode([], this._$);
  break;
  case 3:this.$ = new yy.ProgramNode([], $$[$0-1], $$[$0], this._$);
  break;
  case 4:this.$ = new yy.ProgramNode($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 5:this.$ = new yy.ProgramNode($$[$0-1], $$[$0], [], this._$);
  break;
  case 6:this.$ = new yy.ProgramNode($$[$0], this._$);
  break;
  case 7:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 8:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 9:this.$ = [$$[$0]];
  break;
  case 10: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
  break;
  case 11:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0], this._$);
  break;
  case 12:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0], this._$);
  break;
  case 13:this.$ = $$[$0];
  break;
  case 14:this.$ = $$[$0];
  break;
  case 15:this.$ = new yy.ContentNode($$[$0], this._$);
  break;
  case 16:this.$ = new yy.CommentNode($$[$0], this._$);
  break;
  case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 19:this.$ = {path: $$[$0-1], strip: stripFlags($$[$0-2], $$[$0])};
  break;
  case 20:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 21:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 22:this.$ = new yy.PartialNode($$[$0-2], $$[$0-1], stripFlags($$[$0-3], $$[$0]), this._$);
  break;
  case 23:this.$ = stripFlags($$[$0-1], $$[$0]);
  break;
  case 24:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
  break;
  case 25:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
  break;
  case 26:this.$ = $$[$0];
  break;
  case 27:this.$ = new yy.StringNode($$[$0], this._$);
  break;
  case 28:this.$ = new yy.IntegerNode($$[$0], this._$);
  break;
  case 29:this.$ = new yy.BooleanNode($$[$0], this._$);
  break;
  case 30:this.$ = $$[$0];
  break;
  case 31:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
  break;
  case 32:this.$ = new yy.HashNode($$[$0], this._$);
  break;
  case 33:this.$ = [$$[$0-2], $$[$0]];
  break;
  case 34:this.$ = new yy.PartialNameNode($$[$0], this._$);
  break;
  case 35:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
  break;
  case 36:this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0], this._$));
  break;
  case 37:this.$ = new yy.DataNode($$[$0], this._$);
  break;
  case 38:this.$ = new yy.IdNode($$[$0], this._$);
  break;
  case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2];
  break;
  case 40:this.$ = [{part: $$[$0]}];
  break;
  case 43:this.$ = [];
  break;
  case 44:$$[$0-1].push($$[$0]);
  break;
  case 47:this.$ = [$$[$0]];
  break;
  case 48:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[1,3],8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[3]},{5:[1,16],8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[2,2]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{4:20,6:18,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{4:20,6:22,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{17:23,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:29,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:30,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:31,21:24,30:25,40:[1,28],42:[1,27],43:26},{21:33,26:32,32:[1,34],33:[1,35],40:[1,28],43:26},{1:[2,1]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{10:36,20:[1,37]},{4:38,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,7],22:[1,13],23:[1,14],25:[1,15]},{7:39,8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,6],22:[1,13],23:[1,14],25:[1,15]},{17:23,18:[1,40],21:24,30:25,40:[1,28],42:[1,27],43:26},{10:41,20:[1,37]},{18:[1,42]},{18:[2,43],24:[2,43],28:43,32:[2,43],33:[2,43],34:[2,43],35:[2,43],36:[2,43],40:[2,43],42:[2,43]},{18:[2,25],24:[2,25],36:[2,25]},{18:[2,38],24:[2,38],32:[2,38],33:[2,38],34:[2,38],35:[2,38],36:[2,38],40:[2,38],42:[2,38],44:[1,44]},{21:45,40:[1,28],43:26},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],42:[2,40],44:[2,40]},{18:[1,46]},{18:[1,47]},{24:[1,48]},{18:[2,41],21:50,27:49,40:[1,28],43:26},{18:[2,34],40:[2,34]},{18:[2,35],40:[2,35]},{18:[2,36],40:[2,36]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{21:51,40:[1,28],43:26},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,3],22:[1,13],23:[1,14],25:[1,15]},{4:52,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,5],22:[1,13],23:[1,14],25:[1,15]},{14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]},{18:[2,45],21:56,24:[2,45],29:53,30:60,31:54,32:[1,57],33:[1,58],34:[1,59],35:[1,61],36:[2,45],37:55,38:62,39:63,40:[1,64],42:[1,27],43:26},{40:[1,65]},{18:[2,37],24:[2,37],32:[2,37],33:[2,37],34:[2,37],35:[2,37],36:[2,37],40:[2,37],42:[2,37]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,66]},{18:[2,42]},{18:[1,67]},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],25:[1,15]},{18:[2,24],24:[2,24],36:[2,24]},{18:[2,44],24:[2,44],32:[2,44],33:[2,44],34:[2,44],35:[2,44],36:[2,44],40:[2,44],42:[2,44]},{18:[2,46],24:[2,46],36:[2,46]},{18:[2,26],24:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26],36:[2,26],40:[2,26],42:[2,26]},{18:[2,27],24:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27],36:[2,27],40:[2,27],42:[2,27]},{18:[2,28],24:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28],36:[2,28],40:[2,28],42:[2,28]},{18:[2,29],24:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29],36:[2,29],40:[2,29],42:[2,29]},{18:[2,30],24:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30],36:[2,30],40:[2,30],42:[2,30]},{17:68,21:24,30:25,40:[1,28],42:[1,27],43:26},{18:[2,32],24:[2,32],36:[2,32],39:69,40:[1,70]},{18:[2,47],24:[2,47],36:[2,47],40:[2,47]},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],41:[1,71],42:[2,40],44:[2,40]},{18:[2,39],24:[2,39],32:[2,39],33:[2,39],34:[2,39],35:[2,39],36:[2,39],40:[2,39],42:[2,39],44:[2,39]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{36:[1,72]},{18:[2,48],24:[2,48],36:[2,48],40:[2,48]},{41:[1,71]},{21:56,30:60,31:73,32:[1,57],33:[1,58],34:[1,59],35:[1,61],40:[1,28],42:[1,27],43:26},{18:[2,31],24:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31],36:[2,31],40:[2,31],42:[2,31]},{18:[2,33],24:[2,33],36:[2,33],40:[2,33]}],
  defaultActions: {3:[2,2],16:[2,1],50:[2,42]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };


  function stripFlags(open, close) {
    return {
      left: open.charAt(2) === '~',
      right: close.charAt(0) === '~' || close.charAt(1) === '~'
    };
  }

  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 14;

  break;
  case 1:return 14;
  break;
  case 2:
                                     this.popState();
                                     return 14;

  break;
  case 3:strip(0,4); this.popState(); return 15;
  break;
  case 4:return 35;
  break;
  case 5:return 36;
  break;
  case 6:return 25;
  break;
  case 7:return 16;
  break;
  case 8:return 20;
  break;
  case 9:return 19;
  break;
  case 10:return 19;
  break;
  case 11:return 23;
  break;
  case 12:return 22;
  break;
  case 13:this.popState(); this.begin('com');
  break;
  case 14:strip(3,5); this.popState(); return 15;
  break;
  case 15:return 22;
  break;
  case 16:return 41;
  break;
  case 17:return 40;
  break;
  case 18:return 40;
  break;
  case 19:return 44;
  break;
  case 20:// ignore whitespace
  break;
  case 21:this.popState(); return 24;
  break;
  case 22:this.popState(); return 18;
  break;
  case 23:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 32;
  break;
  case 24:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 32;
  break;
  case 25:return 42;
  break;
  case 26:return 34;
  break;
  case 27:return 34;
  break;
  case 28:return 33;
  break;
  case 29:return 40;
  break;
  case 30:yy_.yytext = strip(1,2); return 40;
  break;
  case 31:return 'INVALID';
  break;
  case 32:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;

  __exports__.parser = parser;

  function parse(input) {
    // Just return if an already-compile AST was passed in.
    if(input.constructor === AST.ProgramNode) { return input; }

    parser.yy = AST;
    return parser.parse(input);
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__);

// handlebars/compiler/compiler.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
          return false;
        }
        for (var j = 0; j < opcode.args.length; j++) {
          if (opcode.args[j] !== otherOpcode.args[j]) {
            return false;
          }
        }
      }

      len = this.children.length;
      if (other.children.length !== len) {
        return false;
      }
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.opcodes = [];
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    accept: function(node) {
      var strip = node.strip || {},
          ret;
      if (strip.left) {
        this.opcode('strip');
      }

      ret = this[node.type](node);

      if (strip.right) {
        this.opcode('strip');
      }

      return ret;
    },

    program: function(program) {
      var statements = program.statements;

      for(var i=0, l=statements.length; i<l; i++) {
        this.accept(statements[i]);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var sexpr = mustache.sexpr;
      var type = this.classifySexpr(sexpr);

      if (type === "helper") {
        this.helperSexpr(sexpr, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(sexpr);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue');
      } else {
        this.ambiguousSexpr(sexpr, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('pushHash');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        if (this.options.stringParams) {
          if(val.depth) {
            this.addDepth(val.depth);
          }
          this.opcode('getContext', val.depth || 0);
          this.opcode('pushStringParam', val.stringModeValue, val.type);

          if (val.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(val);
          }
        } else {
          this.accept(val);
        }

        this.opcode('assignToHash', pair[0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', partialName.name);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      this.sexpr(mustache.sexpr);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousSexpr: function(sexpr, program, inverse) {
      var id = sexpr.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      var id = sexpr.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          name = sexpr.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        this.opcode('invokeHelper', params.length, name, sexpr.isRoot);
      }
    },

    sexpr: function(sexpr) {
      var type = this.classifySexpr(sexpr);

      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      if (data.id.isScoped || data.id.depth) {
        throw new Exception('Scoped data references are not supported: ' + data.original, data);
      }

      this.opcode('lookupData');
      var parts = data.id.parts;
      for(var i=0, l=parts.length; i<l; i++) {
        this.opcode('lookup', parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifySexpr: function(sexpr) {
      var isHelper   = sexpr.isHelper;
      var isEligible = sexpr.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = sexpr.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.stringModeValue, param.type);

          if (param.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(param);
          }
        } else {
          this[param.type](param);
        }
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.hash(sexpr.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }

    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    return function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
  }

  __exports__.compile = compile;
  return __exports__;
})(__module5__);

// handlebars/compiler/javascript-compiler.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var log = __dependency1__.log;
  var Exception = __dependency2__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      var wrap,
          ret;
      if (parent.indexOf('depth') === 0) {
        wrap = true;
      }

      if (/^[0-9]+$/.test(name)) {
        ret = parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        ret = parent + "." + name;
      }
      else {
        ret = parent + "['" + name + "']";
      }

      if (wrap) {
        return '(' + parent + ' && ' + ret + ')';
      } else {
        return ret;
      }
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return "this.compilerInfo = ["+revision+",'"+versions+"'];\n";
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      log('debug', this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(var l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }

        // Reset the stripNext flag if it was not set by this operation.
        if (opcode.opcode !== this.stripNext) {
          this.stripNext = false;
        }
      }

      // Flush any trailing content that might be pending.
      this.pushSource('');

      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      return this.createFunctionContext(asObject);
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;

        var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
        if (this.environment.usePartial) { copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        for (var alias in this.context.aliases) {
          if (this.context.aliases.hasOwnProperty(alias)) {
            this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
          }
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.pushSource("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource();

      if (!this.isChild) {
        source = this.compilerInfo()+source;
      }

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
        log('debug', functionSource + "\n\n");
        return functionSource;
      }
    },
    mergeSource: function() {
      // WARN: We are not handling the case where buffer is still populated as the source should
      // not have buffer append operations as their final action.
      var source = '',
          buffer;
      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            source += 'buffer += ' + buffer + ';\n  ';
            buffer = undefined;
          }
          source += line + '\n  ';
        }
      }
      return source;
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return "blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      }
      if (this.stripNext) {
        content = content.replace(/^\s+/, '');
      }

      this.pendingContent = content;
    },

    // [strip]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Removes any trailing whitespace from the prior content node and flags
    // the next operation for stripping if it is a content node.
    strip: function() {
      if (this.pendingContent) {
        this.pendingContent = this.pendingContent.replace(/\s+$/, '');
      }
      this.stripNext = 'strip';
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      // Force anything that is inlined onto the stack so we don't have duplication
      // when we examine local
      this.flushInline();
      var local = this.popStack();
      this.pushSource("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.pushSource("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function() {
      this.pushStackLiteral('data');
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushStackLiteral('depth' + this.lastContext);

      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'sexpr') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.options.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.options.stringParams) {
        this.push('{' + hash.contexts.join(',') + '}');
        this.push('{' + hash.types.join(',') + '}');
      }

      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isRoot) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';
      this.useRegister('helper');

      var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');

      var lookup = 'helper = ' + helper.name + ' || ' + nonHelper;
      if (helper.paramsInit) {
        lookup += ',' + helper.paramsInit;
      }

      this.push(
        '('
          + lookup
          + ',helper '
            + '? helper.call(' + helper.callParams + ') '
            + ': helperMissing.call(' + helper.helperMissingParams + '))');

      // Always flush subexpressions. This is both to prevent the compounding size issue that
      // occurs when the code has to be duplicated for inlining and also to prevent errors
      // due to the incorrect options object being passed due to the shared register.
      if (!isRoot) {
        this.flushInline();
      }
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.context.aliases.functionType = '"function"';
      this.useRegister('helper');

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      if (helper.paramsInit) {
        this.pushSource(helper.paramsInit);
      }
      this.pushSource('if (helper = ' + helperName + ') { ' + nextStack + ' = helper.call(' + helper.callParams + '); }');
      this.pushSource('else { helper = ' + nonHelper + '; ' + nextStack + ' = typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.push("self.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type;

      if (this.options.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts.push("'" + key + "': " + context);
      }
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context);
          this.context.environments[index] = child;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
    },

    register: function(name, val) {
      this.useRegister(name);
      this.pushSource(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      if (item) {
        this.pushSource(stack + " = " + item + ";");
      }
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack,
          createdStack,
          usedLiteral;

      // If we are currently inline then we want to merge the inline statement into the
      // replacement statement via ','
      if (inline) {
        var top = this.popStack(true);

        if (top instanceof Literal) {
          // Literals do not need to be inlined
          stack = top.value;
          usedLiteral = true;
        } else {
          // Get or create the current stack name for use by the inline
          createdStack = !this.stackSlot;
          var name = !createdStack ? this.topStackName() : this.incrStack();

          prefix = '(' + this.push(name) + ' = ' + top + '),';
          stack = this.topStack();
        }
      } else {
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (inline) {
        if (!usedLiteral) {
          this.popStack();
        }
        if (createdStack) {
          this.stackSlot--;
        }
        this.push('(' + prefix + item + ')');
      } else {
        // Prevent modification of the context depth variable. Through replaceStack
        if (!/^stack/.test(stack)) {
          stack = this.nextStack();
        }

        this.pushSource(stack + " = (" + prefix + item + ");");
      }
      return stack;
    },

    nextStack: function() {
      return this.pushStack();
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function(wrapped) {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    setupHelper: function(paramSize, name, missingParams) {
      var params = [],
          paramsInit = this.setupParams(paramSize, params, missingParams);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    setupOptions: function(paramSize, params) {
      var options = [], contexts = [], types = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      if (this.options.stringParams) {
        options.push("hashTypes:" + this.popStack());
        options.push("hashContexts:" + this.popStack());
      }

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
          this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          types.push(this.popStack());
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
        options.push("types:[" + types.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      return options;
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params, useRegister) {
      var options = '{' + this.setupOptions(paramSize, params).join(',') + '}';

      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return 'options=' + options;
      } else {
        params.push(options);
        return '';
      }
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) {
      return true;
    }
    return false;
  };

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module5__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module10__, __module11__);

  return __module0__;
})();

;//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
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
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
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
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
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
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
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

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
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
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
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
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
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
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

;//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

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
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
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

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

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
    this.cid = _.uniqueId('c');
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

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
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
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
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
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
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

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
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
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
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
      return this._validate({}, _.extend(options || {}, { validate: true }));
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

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
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
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
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
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
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
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
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
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
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
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
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
      return new this.constructor(this.models);
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
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
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
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

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
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
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
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
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
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
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
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
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

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

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
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
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
    _.bindAll(this, 'checkUrl');

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

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

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
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
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
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
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

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
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

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
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
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

;(function(q,f){if("function"===typeof define&&define.amd)define(["underscore","backbone"],function(g,i){return f(q,i,g)});else if("undefined"!==typeof exports){var g=require("underscore"),i=require("backbone");f(q,i,g);"undefined"!==typeof module&&module.exports&&(module.exports=i);exports=i}else f(q,q.Backbone,q._)})(this,function(q,f,g){var i,p,t,w,n,v,D,E,k,z,F,s={};i=f.Model;p=f.Collection;t=i.prototype;n=p.prototype;w=f.Events;f.Associations={VERSION:"0.6.2"};f.Associations.scopes=[];var G=function(){return k},
A=function(a){if(!g.isString(a)||1>g.size(a))a=".";k=a;D=RegExp("[\\"+k+"\\[\\]]+","g");E=RegExp("[^\\"+k+"\\[\\]]+","g")};try{Object.defineProperty(f.Associations,"SEPARATOR",{enumerable:!0,get:G,set:A})}catch(J){}f.Associations.Many=f.Many="Many";f.Associations.One=f.One="One";f.Associations.Self=f.Self="Self";f.Associations.SEPARATOR=".";f.Associations.getSeparator=G;f.Associations.setSeparator=A;f.Associations.EVENTS_BUBBLE=!0;f.Associations.EVENTS_WILDCARD=!0;f.Associations.EVENTS_NC=!1;A();
v=f.AssociatedModel=f.Associations.AssociatedModel=i.extend({relations:void 0,_proxyCalls:void 0,constructor:function(a,c){c&&c.__parents__&&(this.parents=[c.__parents__]);i.apply(this,arguments)},on:function(a,c,d){var b=w.on.apply(this,arguments);if(f.Associations.EVENTS_NC)return b;var l=/\s+/;g.isString(a)&&a&&!l.test(a)&&c&&(l=B(a))&&(s[l]="undefined"===typeof s[l]?1:s[l]+1);return b},off:function(a,c,d){if(f.Associations.EVENTS_NC)return w.off.apply(this,arguments);var b=/\s+/,l=this._events,
e={},h=l?g.keys(l):[],m=!a&&!c&&!d,i=g.isString(a)&&!b.test(a);if(m||i)for(var b=0,j=h.length;b<j;b++)e[h[b]]=l[h[b]]?l[h[b]].length:0;var p=w.off.apply(this,arguments);if(m||i){b=0;for(j=h.length;b<j;b++)(m=B(h[b]))&&(s[m]=l[h[b]]?s[m]-(e[h[b]]-l[h[b]].length):s[m]-e[h[b]])}return p},get:function(a){var c=this.__attributes__,d=t.get.call(this,a),c=c?x(d)?d:c[a]:d;return x(c)?c:this._getAttr.apply(this,arguments)},set:function(a,c,d){var b;g.isObject(a)||null==a?(b=a,d=c):(b={},b[a]=c);a=this._set(b,
d);this._processPendingEvents();return a},_set:function(a,c){var d,b,l,e,h=this;if(!a)return this;this.__attributes__=a;for(d in a)if(b||(b={}),d.match(D)){var f=H(d);e=g.initial(f);f=f[f.length-1];e=this.get(e);e instanceof i&&(e=b[e.cid]||(b[e.cid]={model:e,data:{}}),e.data[f]=a[d])}else e=b[this.cid]||(b[this.cid]={model:this,data:{}}),e.data[d]=a[d];if(b)for(l in b)e=b[l],this._setAttr.call(e.model,e.data,c)||(h=!1);else h=this._setAttr.call(this,a,c);delete this.__attributes__;return h},_setAttr:function(a,
c){var d;c||(c={});if(c.unset)for(d in a)a[d]=void 0;this.parents=this.parents||[];this.relations&&g.each(this.relations,function(b){var d=b.key,e=b.scope||q,h=this._transformRelatedModel(b,a),m=this._transformCollectionType(b,h,a),u=g.isString(b.map)?C(b.map,e):b.map,j=this.attributes[d],k=j&&j.idAttribute,o,r,n=!1;o=b.options?g.extend({},b.options,c):c;if(a[d]){e=g.result(a,d);e=u?u.call(this,e,m?m:h):e;if(x(e))if(b.type===f.Many)j?(j._deferEvents=!0,j[o.reset?"reset":"set"](e instanceof p?e.models:
e,o),h=j):(n=!0,e instanceof p?h=e:(h=this._createCollection(m||p,b.collectionOptions||(h?{model:h}:{})),h[o.reset?"reset":"set"](e,o)));else if(b.type===f.One)b=e instanceof i?e.attributes.hasOwnProperty(k):e.hasOwnProperty(k),m=e instanceof i?e.attributes[k]:e[k],j&&b&&j.attributes[k]===m?(j._deferEvents=!0,j._set(e instanceof i?e.attributes:e,o),h=j):(n=!0,e instanceof i?h=e:(o.__parents__=this,h=new h(e,o),delete o.__parents__));else throw Error("type attribute must be specified and have the values Backbone.One or Backbone.Many");
else h=e;r=a[d]=h;if(n||r&&!r._proxyCallback)r._proxyCallback||(r._proxyCallback=function(){return f.Associations.EVENTS_BUBBLE&&this._bubbleEvent.call(this,d,r,arguments)}),r.on("all",r._proxyCallback,this)}a.hasOwnProperty(d)&&this._setupParents(a[d],this.attributes[d])},this);return t.set.call(this,a,c)},_bubbleEvent:function(a,c,d){var b=d[0].split(":"),g=b[0],e="nested-change"==d[0],h="change"===g,m=d[1],u=-1,j=c._proxyCalls,b=b[1],n=!b||-1==b.indexOf(k),o;if(!e&&(n&&(F=B(d[0])||a),f.Associations.EVENTS_NC||
s[F])){if(f.Associations.EVENTS_WILDCARD&&/\[\*\]/g.test(b))return this;if(c instanceof p&&(h||b))u=c.indexOf(z||m);this instanceof i&&(z=this);b=a+(-1!==u&&(h||b)?"["+u+"]":"")+(b?k+b:"");f.Associations.EVENTS_WILDCARD&&(o=b.replace(/\[\d+\]/g,"[*]"));e=[];e.push.apply(e,d);e[0]=g+":"+b;f.Associations.EVENTS_WILDCARD&&b!==o&&(e[0]=e[0]+" "+g+":"+o);j=c._proxyCalls=j||{};if(this._isEventAvailable.call(this,j,b))return this;j[b]=!0;h&&(this._previousAttributes[a]=c._previousAttributes,this.changed[a]=
c);this.trigger.apply(this,e);f.Associations.EVENTS_NC&&(h&&this.get(b)!=d[2])&&(a=["nested-change",b,d[1]],d[2]&&a.push(d[2]),this.trigger.apply(this,a));j&&b&&delete j[b];z=void 0;return this}},_isEventAvailable:function(a,c){return g.find(a,function(a,b){return-1!==c.indexOf(b,c.length-b.length)})},_setupParents:function(a,c){a&&(a.parents=a.parents||[],-1==g.indexOf(a.parents,this)&&a.parents.push(this));c&&(0<c.parents.length&&c!=a)&&(c.parents=g.difference(c.parents,[this]),c._proxyCallback&&
c.off("all",c._proxyCallback,this))},_createCollection:function(a,c){var c=g.defaults(c,{model:a.model}),d=new a([],g.isFunction(c)?c.call(this):c);d.parents=[this];return d},_processPendingEvents:function(){this._processedEvents||(this._processedEvents=!0,this._deferEvents=!1,g.each(this._pendingEvents,function(a){a.c.trigger.apply(a.c,a.a)}),this._pendingEvents=[],g.each(this.relations,function(a){(a=this.attributes[a.key])&&a._processPendingEvents&&a._processPendingEvents()},this),delete this._processedEvents)},
_transformRelatedModel:function(a,c){var d=a.relatedModel,b=a.scope||q;d&&!(d.prototype instanceof i)&&(d=g.isFunction(d)?d.call(this,a,c):d);d&&g.isString(d)&&(d=d===f.Self?this.constructor:C(d,b));if(a.type===f.One){if(!d)throw Error("specify a relatedModel for Backbone.One type");if(!(d.prototype instanceof f.Model))throw Error("specify an AssociatedModel or Backbone.Model for Backbone.One type");}return d},_transformCollectionType:function(a,c,d){var b=a.collectionType,l=a.scope||q;if(b&&g.isFunction(b)&&
b.prototype instanceof i)throw Error("type is of Backbone.Model. Specify derivatives of Backbone.Collection");b&&!(b.prototype instanceof p)&&(b=g.isFunction(b)?b.call(this,a,d):b);b&&g.isString(b)&&(b=C(b,l));if(b&&!b.prototype instanceof p)throw Error("collectionType must inherit from Backbone.Collection");if(a.type===f.Many&&!c&&!b)throw Error("specify either a relatedModel or collectionType");return b},trigger:function(a){this._deferEvents?(this._pendingEvents=this._pendingEvents||[],this._pendingEvents.push({c:this,
a:arguments})):t.trigger.apply(this,arguments)},toJSON:function(a){var c={},d;c[this.idAttribute]=this.id;this.visited||(this.visited=!0,c=t.toJSON.apply(this,arguments),a&&a.serialize_keys&&(c=g.pick(c,a.serialize_keys)),this.relations&&g.each(this.relations,function(b){var f=b.key,e=b.remoteKey,h=this.attributes[f],i=!b.isTransient,b=b.serialize||[],k=g.clone(a);delete c[f];i&&(b.length&&(k?k.serialize_keys=b:k={serialize_keys:b}),d=h&&h.toJSON?h.toJSON(k):h,c[e||f]=g.isArray(d)?g.compact(d):d)},
this),delete this.visited);return c},clone:function(a){return new this.constructor(this.toJSON(a))},cleanup:function(a){a=a||{};g.each(this.relations,function(a){if(a=this.attributes[a.key])a._proxyCallback&&a.off("all",a._proxyCallback,this),a.parents=g.difference(a.parents,[this])},this);!a.listen&&this.off()},destroy:function(a){var a=a?g.clone(a):{},a=g.defaults(a,{remove_references:!0,listen:!0}),c=this;if(a.remove_references&&a.wait){var d=a.success;a.success=function(b){d&&d(c,b,a);c.cleanup(a)}}var b=
t.destroy.apply(this,[a]);a.remove_references&&!a.wait&&c.cleanup(a);return b},_getAttr:function(a){var c=this,d=this.__attributes__,a=H(a),b,f;if(!(1>g.size(a))){for(f=0;f<a.length;f++){b=a[f];if(!c)break;c=c instanceof p?isNaN(b)?void 0:c.at(b):d?x(c.attributes[b])?c.attributes[b]:d[b]:c.attributes[b]}return c}}});var H=function(a){return""===a?[""]:g.isString(a)?a.match(E):a||[]},B=function(a){if(!a)return a;a=a.split(":");return 1<a.length?(a=a[a.length-1],a=a.split(k),1<a.length?a[a.length-1].split("[")[0]:
a[0].split("[")[0]):""},C=function(a,c){var d,b=[c];b.push.apply(b,f.Associations.scopes);for(var i,e=0,h=b.length;e<h;++e)if(i=b[e])if(d=g.reduce(a.split(k),function(a,b){return a[b]},i))break;return d},I=function(a,c,d){var b,f;g.find(a,function(a){if(b=g.find(a.relations,function(b){return a.get(b.key)===c},this))return f=a,!0},this);return b&&b.map?b.map.call(f,d,c):d},x=function(a){return!g.isUndefined(a)&&!g.isNull(a)},y={};g.each(["set","remove","reset"],function(a){y[a]=p.prototype[a];n[a]=
function(c,d){this.model.prototype instanceof v&&this.parents&&(arguments[0]=I(this.parents,this,c));return y[a].apply(this,arguments)}});y.trigger=n.trigger;n.trigger=function(a){this._deferEvents?(this._pendingEvents=this._pendingEvents||[],this._pendingEvents.push({c:this,a:arguments})):y.trigger.apply(this,arguments)};n._processPendingEvents=v.prototype._processPendingEvents;n.on=v.prototype.on;n.off=v.prototype.off;return f});

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else if (typeof require === 'function' && ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    return module.exports = factory(require('backbone'));
  } else {
    factory(root.Backbone);
  }
})(this, function(Backbone) {
// Generated by CoffeeScript 1.7.1

/*
Backbone dualStorage Adapter v1.3.1

A simple module to replace `Backbone.sync` with *localStorage*-based
persistence. Models are given GUIDS, and saved into a JSON object. Simple
as that.
 */
var S4, backboneSync, callbackTranslator, dualsync, getStoreName, localsync, modelUpdatedWithResponse, onlineSync, parseRemoteResponse,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Backbone.DualStorage = {
  offlineStatusCodes: [408, 502]
};

Backbone.Model.prototype.hasTempId = function() {
  return _.isString(this.id) && this.id.length === 36 && this.id.indexOf('t') === 0;
};

getStoreName = function(collection, model) {
  model || (model = collection.model.prototype);
  return _.result(collection, 'storeName') || _.result(model, 'storeName') || _.result(collection, 'url') || _.result(model, 'urlRoot') || _.result(model, 'url');
};

Backbone.Collection.prototype.syncDirty = function(options) {
  var id, ids, store, _i, _len, _ref, _results;
  store = localStorage.getItem("" + (getStoreName(this)) + "_dirty");
  ids = (store && store.split(',')) || [];
  _results = [];
  for (_i = 0, _len = ids.length; _i < _len; _i++) {
    id = ids[_i];
    _results.push((_ref = this.get(id)) != null ? _ref.save(null, options) : void 0);
  }
  return _results;
};

Backbone.Collection.prototype.dirtyModels = function() {
  var id, ids, models, store;
  store = localStorage.getItem("" + (getStoreName(this)) + "_dirty");
  ids = (store && store.split(',')) || [];
  models = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = ids.length; _i < _len; _i++) {
      id = ids[_i];
      _results.push(this.get(id));
    }
    return _results;
  }).call(this);
  return _.compact(models);
};

Backbone.Collection.prototype.syncDestroyed = function(options) {
  var id, ids, model, store, _i, _len, _results;
  store = localStorage.getItem("" + (getStoreName(this)) + "_destroyed");
  ids = (store && store.split(',')) || [];
  _results = [];
  for (_i = 0, _len = ids.length; _i < _len; _i++) {
    id = ids[_i];
    model = new this.model;
    model.set(model.idAttribute, id);
    model.collection = this;
    _results.push(model.destroy(options));
  }
  return _results;
};

Backbone.Collection.prototype.destroyedModelIds = function() {
  var ids, store;
  store = localStorage.getItem("" + (getStoreName(this)) + "_destroyed");
  return ids = (store && store.split(',')) || [];
};

Backbone.Collection.prototype.syncDirtyAndDestroyed = function(options) {
  this.syncDirty(options);
  return this.syncDestroyed(options);
};

S4 = function() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

window.Store = (function() {
  Store.prototype.sep = '';

  function Store(name) {
    this.name = name;
    this.records = this.recordsOn(this.name);
  }

  Store.prototype.generateId = function() {
    return 't' + S4().substring(1) + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  };

  Store.prototype.save = function() {
    return localStorage.setItem(this.name, this.records.join(','));
  };

  Store.prototype.recordsOn = function(key) {
    var store;
    store = localStorage.getItem(key);
    return (store && store.split(',')) || [];
  };

  Store.prototype.dirty = function(model) {
    var dirtyRecords;
    dirtyRecords = this.recordsOn(this.name + '_dirty');
    if (!_.include(dirtyRecords, model.id.toString())) {
      dirtyRecords.push(model.id);
      localStorage.setItem(this.name + '_dirty', dirtyRecords.join(','));
    }
    return model;
  };

  Store.prototype.clean = function(model, from) {
    var dirtyRecords, store;
    store = "" + this.name + "_" + from;
    dirtyRecords = this.recordsOn(store);
    if (_.include(dirtyRecords, model.id.toString())) {
      localStorage.setItem(store, _.without(dirtyRecords, model.id.toString()).join(','));
    }
    return model;
  };

  Store.prototype.destroyed = function(model) {
    var destroyedRecords;
    destroyedRecords = this.recordsOn(this.name + '_destroyed');
    if (!_.include(destroyedRecords, model.id.toString())) {
      destroyedRecords.push(model.id);
      localStorage.setItem(this.name + '_destroyed', destroyedRecords.join(','));
    }
    return model;
  };

  Store.prototype.create = function(model) {
    if (!_.isObject(model)) {
      return model;
    }
    if (!model.id) {
      model.set(model.idAttribute, this.generateId());
    }
    localStorage.setItem(this.name + this.sep + model.id, JSON.stringify(model));
    this.records.push(model.id.toString());
    this.save();
    return model;
  };

  Store.prototype.update = function(model) {
    localStorage.setItem(this.name + this.sep + model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString())) {
      this.records.push(model.id.toString());
    }
    this.save();
    return model;
  };

  Store.prototype.clear = function() {
    var id, _i, _len, _ref;
    _ref = this.records;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      localStorage.removeItem(this.name + this.sep + id);
    }
    this.records = [];
    return this.save();
  };

  Store.prototype.hasDirtyOrDestroyed = function() {
    return !_.isEmpty(localStorage.getItem(this.name + '_dirty')) || !_.isEmpty(localStorage.getItem(this.name + '_destroyed'));
  };

  Store.prototype.find = function(model) {
    var modelAsJson;
    modelAsJson = localStorage.getItem(this.name + this.sep + model.id);
    if (modelAsJson === null) {
      return null;
    }
    return JSON.parse(modelAsJson);
  };

  Store.prototype.findAll = function() {
    var id, _i, _len, _ref, _results;
    _ref = this.records;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      _results.push(JSON.parse(localStorage.getItem(this.name + this.sep + id)));
    }
    return _results;
  };

  Store.prototype.destroy = function(model) {
    localStorage.removeItem(this.name + this.sep + model.id);
    this.records = _.reject(this.records, function(record_id) {
      return record_id === model.id.toString();
    });
    this.save();
    return model;
  };

  return Store;

})();

window.Store.exists = function(storeName) {
  return localStorage.getItem(storeName) !== null;
};

callbackTranslator = {
  needsTranslation: Backbone.VERSION === '0.9.10',
  forBackboneCaller: function(callback) {
    if (this.needsTranslation) {
      return function(model, resp, options) {
        return callback.call(null, resp);
      };
    } else {
      return callback;
    }
  },
  forDualstorageCaller: function(callback, model, options) {
    if (this.needsTranslation) {
      return function(resp) {
        return callback.call(null, model, resp, options);
      };
    } else {
      return callback;
    }
  }
};

localsync = function(method, model, options) {
  var isValidModel, preExisting, response, store;
  isValidModel = (method === 'clear') || (method === 'hasDirtyOrDestroyed');
  isValidModel || (isValidModel = model instanceof Backbone.Model);
  isValidModel || (isValidModel = model instanceof Backbone.Collection);
  if (!isValidModel) {
    throw new Error('model parameter is required to be a backbone model or collection.');
  }
  store = new Store(options.storeName);
  response = (function() {
    switch (method) {
      case 'read':
        if (model instanceof Backbone.Model) {
          return store.find(model);
        } else {
          return store.findAll();
        }
        break;
      case 'hasDirtyOrDestroyed':
        return store.hasDirtyOrDestroyed();
      case 'clear':
        return store.clear();
      case 'create':
        if (options.add && !options.merge && (preExisting = store.find(model))) {
          return preExisting;
        } else {
          model = store.create(model);
          if (options.dirty) {
            store.dirty(model);
          }
          return model;
        }
        break;
      case 'update':
        store.update(model);
        if (options.dirty) {
          return store.dirty(model);
        } else {
          return store.clean(model, 'dirty');
        }
        break;
      case 'delete':
        store.destroy(model);
        if (options.dirty && !model.hasTempId()) {
          return store.destroyed(model);
        } else {
          if (model.hasTempId()) {
            return store.clean(model, 'dirty');
          } else {
            return store.clean(model, 'destroyed');
          }
        }
    }
  })();
  if (response != null ? response.attributes : void 0) {
    response = response.attributes;
  }
  if (!options.ignoreCallbacks) {
    if (response) {
      options.success(response);
    } else {
      options.error('Record not found');
    }
  }
  return response;
};

parseRemoteResponse = function(object, response) {
  if (!(object && object.parseBeforeLocalSave)) {
    return response;
  }
  if (_.isFunction(object.parseBeforeLocalSave)) {
    return object.parseBeforeLocalSave(response);
  }
};

modelUpdatedWithResponse = function(model, response) {
  var modelClone;
  modelClone = new Backbone.Model;
  modelClone.idAttribute = model.idAttribute;
  modelClone.set(model.attributes);
  modelClone.set(model.parse(response));
  return modelClone;
};

backboneSync = Backbone.sync;

onlineSync = function(method, model, options) {
  options.success = callbackTranslator.forBackboneCaller(options.success);
  options.error = callbackTranslator.forBackboneCaller(options.error);
  return backboneSync(method, model, options);
};

dualsync = function(method, model, options) {
  var error, hasOfflineStatusCode, local, relayErrorCallback, success, temporaryId, useOfflineStorage;
  options.storeName = getStoreName(model.collection, model);
  options.storeExists = Store.exists(options.storeName);
  options.success = callbackTranslator.forDualstorageCaller(options.success, model, options);
  options.error = callbackTranslator.forDualstorageCaller(options.error, model, options);
  if (_.result(model, 'remote') || _.result(model.collection, 'remote')) {
    return onlineSync(method, model, options);
  }
  local = _.result(model, 'local') || _.result(model.collection, 'local');
  options.dirty = options.remote === false && !local;
  if (options.remote === false || local) {
    return localsync(method, model, options);
  }
  options.ignoreCallbacks = true;
  success = options.success;
  error = options.error;
  useOfflineStorage = function() {
    options.dirty = true;
    options.ignoreCallbacks = false;
    options.success = success;
    options.error = error;
    return localsync(method, model, options);
  };
  hasOfflineStatusCode = function(xhr) {
    var offlineStatusCodes, _ref;
    offlineStatusCodes = Backbone.DualStorage.offlineStatusCodes;
    if (_.isFunction(offlineStatusCodes)) {
      offlineStatusCodes = offlineStatusCodes(xhr);
    }
    return xhr.status === 0 || (_ref = xhr.status, __indexOf.call(offlineStatusCodes, _ref) >= 0);
  };
  relayErrorCallback = function(xhr) {
    var online;
    online = !hasOfflineStatusCode(xhr);
    if (online || method === 'read' && !options.storeExists) {
      return error(xhr);
    } else {
      return useOfflineStorage();
    }
  };
  switch (method) {
    case 'read':
      if (localsync('hasDirtyOrDestroyed', model, options)) {
        return useOfflineStorage();
      } else {
        options.success = function(resp, _status, _xhr) {
          var collection, idAttribute, modelAttributes, responseModel, _i, _len;
          if (hasOfflineStatusCode(options.xhr)) {
            return useOfflineStorage();
          }
          resp = parseRemoteResponse(model, resp);
          if (model instanceof Backbone.Collection) {
            collection = model;
            idAttribute = collection.model.prototype.idAttribute;
            if (!options.add) {
              localsync('clear', collection, options);
            }
            for (_i = 0, _len = resp.length; _i < _len; _i++) {
              modelAttributes = resp[_i];
              model = collection.get(modelAttributes[idAttribute]);
              if (model) {
                responseModel = modelUpdatedWithResponse(model, modelAttributes);
              } else {
                responseModel = new collection.model(modelAttributes);
              }
              localsync('update', responseModel, options);
            }
          } else {
            responseModel = modelUpdatedWithResponse(model, resp);
            localsync('update', responseModel, options);
          }
          return success(resp, _status, _xhr);
        };
        options.error = function(xhr) {
          return relayErrorCallback(xhr);
        };
        return options.xhr = onlineSync(method, model, options);
      }
      break;
    case 'create':
      options.success = function(resp, _status, _xhr) {
        var updatedModel;
        if (hasOfflineStatusCode(options.xhr)) {
          return useOfflineStorage();
        }
        updatedModel = modelUpdatedWithResponse(model, resp);
        localsync(method, updatedModel, options);
        return success(resp, _status, _xhr);
      };
      options.error = function(xhr) {
        return relayErrorCallback(xhr);
      };
      return options.xhr = onlineSync(method, model, options);
    case 'update':
      if (model.hasTempId()) {
        temporaryId = model.id;
        options.success = function(resp, _status, _xhr) {
          var updatedModel;
          if (hasOfflineStatusCode(options.xhr)) {
            return useOfflineStorage();
          }
          updatedModel = modelUpdatedWithResponse(model, resp);
          model.set(model.idAttribute, temporaryId, {
            silent: true
          });
          localsync('delete', model, options);
          localsync('create', updatedModel, options);
          return success(resp, _status, _xhr);
        };
        options.error = function(xhr) {
          model.set(model.idAttribute, temporaryId, {
            silent: true
          });
          return relayErrorCallback(xhr);
        };
        model.set(model.idAttribute, null, {
          silent: true
        });
        return options.xhr = onlineSync('create', model, options);
      } else {
        options.success = function(resp, _status, _xhr) {
          var updatedModel;
          if (hasOfflineStatusCode(options.xhr)) {
            return useOfflineStorage();
          }
          updatedModel = modelUpdatedWithResponse(model, resp);
          localsync(method, updatedModel, options);
          return success(resp, _status, _xhr);
        };
        options.error = function(xhr) {
          return relayErrorCallback(xhr);
        };
        return options.xhr = onlineSync(method, model, options);
      }
      break;
    case 'delete':
      if (model.hasTempId()) {
        options.ignoreCallbacks = false;
        return localsync(method, model, options);
      } else {
        options.success = function(resp, _status, _xhr) {
          if (hasOfflineStatusCode(options.xhr)) {
            return useOfflineStorage();
          }
          localsync(method, model, options);
          return success(resp, _status, _xhr);
        };
        options.error = function(xhr) {
          return relayErrorCallback(xhr);
        };
        return options.xhr = onlineSync(method, model, options);
      }
  }
};

Backbone.sync = dualsync;

//# sourceMappingURL=backbone.dualstorage.map
});
;/*!
* @license PreloadJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.4.1",a.buildDate="Thu, 12 Dec 2013 23:33:38 GMT"}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){this.init()};a.prototype=new createjs.EventDispatcher;var b=a.prototype,c=a;c.FILE_PATTERN=/^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?)|(.{0,2}\/{1}))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,c.PATH_PATTERN=/^(?:(\w+:)\/{2})|(.{0,2}\/{1})?([/.]*?(?:[^?]+)?\/?)?$/,b.loaded=!1,b.canceled=!1,b.progress=0,b._item=null,b.getItem=function(){return this._item},b.init=function(){},b.load=function(){},b.close=function(){},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.Event("progress"),b.loaded=this.progress,b.total=1):(b=a,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),b.progress=this.progress,this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){this._isCanceled()||this.dispatchEvent("complete")},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.Event("error")),this.dispatchEvent(a))},b._isCanceled=function(){return null==window.createjs||this.canceled?!0:!1},b._parseURI=function(a){return a?a.match(c.FILE_PATTERN):null},b._parsePath=function(a){return a?a.match(c.PATH_PATTERN):null},b._formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},b.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},b._isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},b._isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},b.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.init(a,b,c)},b=a.prototype=new createjs.AbstractLoader,c=a;c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.SVG="svg",c.TEXT="text",c.XML="xml",c.POST="POST",c.GET="GET",b._basePath=null,b._crossOrigin="",b.useXHR=!0,b.stopOnError=!1,b.maintainScriptOrder=!0,b.next=null,b._typeCallbacks=null,b._extensionCallbacks=null,b._loadStartWasDispatched=!1,b._maxConnections=1,b._currentlyLoadingScript=null,b._currentLoads=null,b._loadQueue=null,b._loadQueueBackup=null,b._loadItemsById=null,b._loadItemsBySrc=null,b._loadedResults=null,b._loadedRawResults=null,b._numItems=0,b._numItemsLoaded=0,b._scriptOrder=null,b._loadedScripts=null,b.init=function(a,b,c){this._numItems=this._numItemsLoaded=0,this._paused=!1,this._loadStartWasDispatched=!1,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._scriptOrder=[],this._loadedScripts=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._typeCallbacks={},this._extensionCallbacks={},this._basePath=b,this.setUseXHR(a),this._crossOrigin=c===!0?"Anonymous":c===!1||null==c?"":c},b.setUseXHR=function(a){return this.useXHR=0!=a&&null!=window.XMLHttpRequest,this.useXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)delete this._loadItemsById[e.id],delete this._loadItemsBySrc[e.src],this._disposeItem(e);else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.useXHR)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},c.isBinary=function(a){switch(a){case createjs.LoadQueue.IMAGE:case createjs.LoadQueue.BINARY:return!0;default:return!1}},c.isText=function(a){switch(a){case createjs.LoadQueue.TEXT:case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:case createjs.LoadQueue.XML:case createjs.LoadQueue.HTML:case createjs.LoadQueue.CSS:case createjs.LoadQueue.SVG:case createjs.LoadQueue.JAVASCRIPT:return!0;default:return!1}},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new createjs.Event("error");return d.text="PRELOAD_NO_FILE",this._sendError(d),void 0}this._addItem(a,null,c),b!==!1?this.setPaused(!1):this.setPaused(!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new createjs.Event("error");return g.text="PRELOAD_MANIFEST_EMPTY",this._sendError(g),void 0}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.Event("error");return g.text="PRELOAD_MANIFEST_NULL",this._sendError(g),void 0}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new createjs.Event("error");g.text="PRELOAD_MANIFEST_ERROR",this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);b!==!1?this.setPaused(!1):this.setPaused(!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&(this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT&&e instanceof createjs.XHRLoader&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,c){var d=null;switch(typeof a){case"string":d={src:a};break;case"object":d=window.HTMLAudioElement&&a instanceof window.HTMLAudioElement?{tag:a,src:d.tag.src,type:createjs.LoadQueue.SOUND}:a;break;default:return null}var e=this._parseURI(d.src);null!=e&&(d.ext=e[6]),null==d.type&&(d.type=this._getTypeByExtension(d.ext));var f="",g=c||this._basePath,h=d.src;if(e&&null==e[1]&&null==e[3])if(b){f=b;var i=this._parsePath(b);h=b+h,null!=g&&i&&null==i[1]&&null==i[2]&&(f=g+f)}else null!=g&&(f=g);if(d.src=f+d.src,d.path=f,(d.type==createjs.LoadQueue.JSON||d.type==createjs.LoadQueue.MANIFEST)&&(d._loadAsJSONP=null!=d.callback),d.type==createjs.LoadQueue.JSONP&&null==d.callback)throw new Error("callback is required for loading JSONP requests.");(void 0===d.tag||null===d.tag)&&(d.tag=this._createTag(d)),(void 0===d.id||null===d.id||""===d.id)&&(d.id=h);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d.src,d.type,d.id,d.data,f,this);if(k===!1)return null;k===!0||(null!=k.src&&(d.src=k.src),null!=k.id&&(d.id=k.id),null!=k.tag&&(d.tag=k.tag),null!=k.completeHandler&&(d.completeHandler=k.completeHandler),k.type&&(d.type=k.type),e=this._parseURI(d.src),null!=e&&null!=e[6]&&(d.ext=e[6].toLowerCase()))}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,d},b._createLoader=function(a){var b=this.useXHR;switch(a.type){case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:b=!a._loadAsJSONP;break;case createjs.LoadQueue.XML:case createjs.LoadQueue.TEXT:b=!0;break;case createjs.LoadQueue.SOUND:case createjs.LoadQueue.JSONP:b=!1;break;case null:return null}return b?new createjs.XHRLoader(a,this._crossOrigin):new createjs.TagLoader(a)},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];if(this.maintainScriptOrder&&b instanceof createjs.TagLoader&&b.getItem().type==createjs.LoadQueue.JAVASCRIPT){if(this._currentlyLoadingScript)continue;this._currentlyLoadingScript=!0}this._loadQueue.splice(a,1),a--,this._loadItem(b)}}},b._loadItem=function(a){a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileError=function(a){var b=a.target;this._numItemsLoaded++,this._updateProgress();var c=new createjs.Event("error");c.text="FILE_LOAD_ERROR",c.item=b.getItem(),this._sendError(c),this.stopOnError||(this._removeLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem();if(this._loadedResults[c.id]=b.getResult(),b instanceof createjs.XHRLoader&&(this._loadedRawResults[c.id]=b.getResult(!0)),this._removeLoadItem(b),this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT){if(!(b instanceof createjs.TagLoader))return this._loadedScripts[createjs.indexOf(this._scriptOrder,c)]=c,this._checkScriptLoadOrder(b),void 0;this._currentlyLoadingScript=!1}if(delete c._loadAsJSONP,c.type==createjs.LoadQueue.MANIFEST){var d=b.getResult();null!=d&&void 0!==d.manifest&&this.loadManifest(d,!0)}this._processFinishedLoad(c,b)},b._processFinishedLoad=function(a,b){this._numItemsLoaded++,this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];(document.body||document.getElementsByTagName("body")[0]).appendChild(d),this._processFinishedLoad(c),this._loadedScripts[b]=!0}}},b._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;b>c;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._sendProgress(a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._createTag=function(a){var b=null;switch(a.type){case createjs.LoadQueue.IMAGE:return b=document.createElement("img"),""==this._crossOrigin||this._isLocal(a)||(b.crossOrigin=this._crossOrigin),b;case createjs.LoadQueue.SOUND:return b=document.createElement("audio"),b.autoplay=!1,b;case createjs.LoadQueue.JSON:case createjs.LoadQueue.JSONP:case createjs.LoadQueue.JAVASCRIPT:case createjs.LoadQueue.MANIFEST:return b=document.createElement("script"),b.type="text/javascript",b;case createjs.LoadQueue.CSS:return b=this.useXHR?document.createElement("style"):document.createElement("link"),b.rel="stylesheet",b.type="text/css",b;case createjs.LoadQueue.SVG:return this.useXHR?b=document.createElement("svg"):(b=document.createElement("object"),b.type="image/svg+xml"),b}return null},b._getTypeByExtension=function(a){if(null==a)return createjs.LoadQueue.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.LoadQueue.IMAGE;case"ogg":case"mp3":case"wav":return createjs.LoadQueue.SOUND;case"json":return createjs.LoadQueue.JSON;case"xml":return createjs.LoadQueue.XML;case"css":return createjs.LoadQueue.CSS;case"js":return createjs.LoadQueue.JAVASCRIPT;case"svg":return createjs.LoadQueue.SVG;default:return createjs.LoadQueue.TEXT}},b._sendFileProgress=function(a,b){if(this._isCanceled())return this._cleanUp(),void 0;if(this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=a;var d=function(){};d.init=function(){var a=navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1},d.init(),createjs.LoadQueue.BrowserDetect=d}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.init(a)},b=a.prototype=new createjs.AbstractLoader;b._loadTimeout=null,b._tagCompleteProxy=null,b._isAudio=!1,b._tag=null,b._jsonResult=null,b.init=function(a){this._item=a,this._tag=a.tag,this._isAudio=window.HTMLAudioElement&&a.tag instanceof window.HTMLAudioElement,this._tagCompleteProxy=createjs.proxy(this._handleLoad,this)},b.getResult=function(){return this._item.type==createjs.LoadQueue.JSONP||this._item.type==createjs.LoadQueue.MANIFEST?this._jsonResult:this._tag},b.cancel=function(){this.canceled=!0,this._clean()},b.load=function(){var a=this._item,b=this._tag;clearTimeout(this._loadTimeout);var c=createjs.LoadQueue.LOAD_TIMEOUT;0==c&&(c=createjs.LoadQueue.loadTimeout),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),c),this._isAudio&&(b.src=null,b.preload="auto"),b.onerror=createjs.proxy(this._handleError,this),this._isAudio?(b.onstalled=createjs.proxy(this._handleStalled,this),b.addEventListener("canplaythrough",this._tagCompleteProxy,!1)):(b.onload=createjs.proxy(this._handleLoad,this),b.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this));var d=this.buildPath(a.src,a.values);switch(a.type){case createjs.LoadQueue.CSS:b.href=d;break;case createjs.LoadQueue.SVG:b.data=d;break;default:b.src=d}if(a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.JSON||a.type==createjs.LoadQueue.MANIFEST){if(null==a.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[a.callback])throw new Error('JSONP callback "'+a.callback+'" already exists on window. You need to specify a different callback. Or re-name the current one.');window[a.callback]=createjs.proxy(this._handleJSONPLoad,this)}(a.type==createjs.LoadQueue.SVG||a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.JSON||a.type==createjs.LoadQueue.MANIFEST||a.type==createjs.LoadQueue.JAVASCRIPT||a.type==createjs.LoadQueue.CSS)&&(this._startTagVisibility=b.style.visibility,b.style.visibility="hidden",(document.body||document.getElementsByTagName("body")[0]).appendChild(b)),null!=b.load&&b.load()},b._handleJSONPLoad=function(a){this._jsonResult=a},b._handleTimeout=function(){this._clean();var a=new createjs.Event("error");a.text="PRELOAD_TIMEOUT",this._sendError(a)},b._handleStalled=function(){},b._handleError=function(){this._clean();var a=new createjs.Event("error");this._sendError(a)},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this.getItem().tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleLoad()},b._handleLoad=function(){if(!this._isCanceled()){var a=this.getItem(),b=a.tag;if(!(this.loaded||this._isAudio&&4!==b.readyState)){switch(this.loaded=!0,a.type){case createjs.LoadQueue.SVG:case createjs.LoadQueue.JSON:case createjs.LoadQueue.JSONP:case createjs.LoadQueue.MANIFEST:case createjs.LoadQueue.CSS:b.style.visibility=this._startTagVisibility,(document.body||document.getElementsByTagName("body")[0]).removeChild(b)}this._clean(),this._sendComplete()}}},b._clean=function(){clearTimeout(this._loadTimeout);var a=this.getItem(),b=a.tag;null!=b&&(b.onload=null,b.removeEventListener&&b.removeEventListener("canplaythrough",this._tagCompleteProxy,!1),b.onstalled=null,b.onprogress=null,b.onerror=null,null!=b.parentNode&&a.type==createjs.LoadQueue.SVG&&a.type==createjs.LoadQueue.JSON&&a.type==createjs.LoadQueue.MANIFEST&&a.type==createjs.LoadQueue.CSS&&a.type==createjs.LoadQueue.JSONP&&b.parentNode.removeChild(b));var a=this.getItem();(a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.MANIFEST)&&(window[a.callback]=null)},b.toString=function(){return"[PreloadJS TagLoader]"},createjs.TagLoader=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b){this.init(a,b)},b=a.prototype=new createjs.AbstractLoader;b._request=null,b._loadTimeout=null,b._xhrLevel=1,b._response=null,b._rawResponse=null,b._crossOrigin="",b.init=function(a,b){this._item=a,this._crossOrigin=b,!this._createXHR(a)},b.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},b.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},b.load=function(){if(null==this._request)return this._handleError(),void 0;if(this._request.onloadstart=createjs.proxy(this._handleLoadStart,this),this._request.onprogress=createjs.proxy(this._handleProgress,this),this._request.onabort=createjs.proxy(this._handleAbort,this),this._request.onerror=createjs.proxy(this._handleError,this),this._request.ontimeout=createjs.proxy(this._handleTimeout,this),1==this._xhrLevel){var a=createjs.LoadQueue.LOAD_TIMEOUT;if(0==a)a=createjs.LoadQueue.loadTimeout;else try{console.warn("LoadQueue.LOAD_TIMEOUT has been deprecated in favor of LoadQueue.loadTimeout")}catch(b){}this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),a)}this._request.onload=createjs.proxy(this._handleLoad,this),this._request.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this);try{this._item.values&&this._item.method!=createjs.LoadQueue.GET?this._item.method==createjs.LoadQueue.POST&&this._request.send(this._formatQueryString(this._item.values)):this._request.send()}catch(c){var d=new createjs.Event("error");d.error=c,this._sendError(d)}},b.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},b.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.Event("progress");b.loaded=a.loaded,b.total=a.total,this._sendProgress(b)}},b._handleLoadStart=function(){clearTimeout(this._loadTimeout),this._sendLoadStart()},b._handleAbort=function(){this._clean();var a=new createjs.Event("error");a.text="XHR_ABORTED",this._sendError(a)},b._handleError=function(){this._clean();var a=new createjs.Event("error");this._sendError(a)},b._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},b._handleLoad=function(){if(!this.loaded){if(this.loaded=!0,!this._checkError())return this._handleError(),void 0;this._response=this._getResponse(),this._clean();var a=this._generateTag();a&&this._sendComplete()}},b._handleTimeout=function(a){this._clean();var b=new createjs.Event("error");b.text="PRELOAD_TIMEOUT",this._sendError(a)},b._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return!1}return!0},b._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},b._createXHR=function(a){var b=this._isCrossDomain(a),c=null;if(b&&window.XDomainRequest)c=new XDomainRequest;else if(window.XMLHttpRequest)c=new XMLHttpRequest;else try{c=new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(d){try{c=new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(d){try{c=new ActiveXObject("Msxml2.XMLHTTP")}catch(d){return!1}}}createjs.LoadQueue.isText(a.type)&&c.overrideMimeType&&c.overrideMimeType("text/plain; charset=utf-8"),this._xhrLevel="string"==typeof c.responseType?2:1;var e=null;return e=a.method==createjs.LoadQueue.GET?this.buildPath(a.src,a.values):a.src,c.open(a.method||createjs.LoadQueue.GET,e,!0),b&&c instanceof XMLHttpRequest&&1==this._xhrLevel&&c.setRequestHeader("Origin",location.origin),a.values&&a.method==createjs.LoadQueue.POST&&c.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),createjs.LoadQueue.isBinary(a.type)&&(c.responseType="arraybuffer"),this._request=c,!0},b._clean=function(){clearTimeout(this._loadTimeout);var a=this._request;a.onloadstart=null,a.onprogress=null,a.onabort=null,a.onerror=null,a.onload=null,a.ontimeout=null,a.onloadend=null,a.onreadystatechange=null},b._generateTag=function(){var a=this._item.type,b=this._item.tag;switch(a){case createjs.LoadQueue.IMAGE:return b.onload=createjs.proxy(this._handleTagReady,this),""!=this._crossOrigin&&(b.crossOrigin="Anonymous"),b.src=this.buildPath(this._item.src,this._item.values),this._rawResponse=this._response,this._response=b,!1;case createjs.LoadQueue.JAVASCRIPT:return b=document.createElement("script"),b.text=this._response,this._rawResponse=this._response,this._response=b,!0;case createjs.LoadQueue.CSS:var c=document.getElementsByTagName("head")[0];if(c.appendChild(b),b.styleSheet)b.styleSheet.cssText=this._response;else{var d=document.createTextNode(this._response);b.appendChild(d)}return this._rawResponse=this._response,this._response=b,!0;case createjs.LoadQueue.XML:var e=this._parseXML(this._response,"text/xml");return this._rawResponse=this._response,this._response=e,!0;case createjs.LoadQueue.SVG:var e=this._parseXML(this._response,"image/svg+xml");return this._rawResponse=this._response,null!=e.documentElement?(b.appendChild(e.documentElement),this._response=b):this._response=e,!0;case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:var f={};try{f=JSON.parse(this._response)}catch(g){f=g}return this._rawResponse=this._response,this._response=f,!0}return!0},b._parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}else c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){}return c},b._handleTagReady=function(){this._sendComplete()},b.toString=function(){return"[PreloadJS XHRLoader]"},createjs.XHRLoader=a}(),"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

;/*!
* @license SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

this.createjs=this.createjs||{},function(){var a=createjs.SoundJS=createjs.SoundJS||{};a.version="0.5.2",a.buildDate="Thu, 12 Dec 2013 23:33:37 GMT"}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"Sound cannot be instantiated"}function b(a,b){this.init(a,b)}function c(){this.isDefault=!0,this.addEventListener=this.removeEventListener=this.removeAllEventListeners=this.dispatchEvent=this.hasEventListener=this._listeners=this._interrupt=this._playFailed=this.pause=this.resume=this.play=this._beginPlaying=this._cleanUp=this.stop=this.setMasterVolume=this.setVolume=this.mute=this.setMute=this.getMute=this.setPan=this.getPosition=this.setPosition=this.playFailed=function(){return!1},this.getVolume=this.getPan=this.getDuration=function(){return 0},this.playState=a.PLAY_FAILED,this.toString=function(){return"[Sound Default Sound Instance]"}}function d(){}var e=a;e.DELIMITER="|",e.INTERRUPT_ANY="any",e.INTERRUPT_EARLY="early",e.INTERRUPT_LATE="late",e.INTERRUPT_NONE="none",e.PLAY_INITED="playInited",e.PLAY_SUCCEEDED="playSucceeded",e.PLAY_INTERRUPTED="playInterrupted",e.PLAY_FINISHED="playFinished",e.PLAY_FAILED="playFailed",e.SUPPORTED_EXTENSIONS=["mp3","ogg","mpeg","wav","m4a","mp4","aiff","wma","mid"],e.EXTENSION_MAP={m4a:"mp4"},e.FILE_PATTERN=/^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,e.defaultInterruptBehavior=e.INTERRUPT_NONE,e.alternateExtensions=[],e._lastID=0,e.activePlugin=null,e._pluginsRegistered=!1,e._masterVolume=1,e._masterMute=!1,e._instances=[],e._idHash={},e._preloadHash={},e._defaultSoundInstance=null,e.addEventListener=null,e.removeEventListener=null,e.removeAllEventListeners=null,e.dispatchEvent=null,e.hasEventListener=null,e._listeners=null,createjs.EventDispatcher.initialize(e),e._sendFileLoadEvent=function(a){if(e._preloadHash[a])for(var b=0,c=e._preloadHash[a].length;c>b;b++){var d=e._preloadHash[a][b];if(e._preloadHash[a][b]=!0,e.hasEventListener("fileload")){var f=new createjs.Event("fileload");f.src=d.src,f.id=d.id,f.data=d.data,e.dispatchEvent(f)}}},e.getPreloadHandlers=function(){return{callback:createjs.proxy(e.initLoad,e),types:["sound"],extensions:e.SUPPORTED_EXTENSIONS}},e.registerPlugin=function(a){try{console.log("createjs.Sound.registerPlugin has been deprecated. Please use registerPlugins.")}catch(b){}return e._registerPlugin(a)},e._registerPlugin=function(a){return e._pluginsRegistered=!0,null==a?!1:a.isSupported()?(e.activePlugin=new a,!0):!1},e.registerPlugins=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];if(e._registerPlugin(d))return!0}return!1},e.initializeDefaultPlugins=function(){return null!=e.activePlugin?!0:e._pluginsRegistered?!1:e.registerPlugins([createjs.WebAudioPlugin,createjs.HTMLAudioPlugin])?!0:!1},e.isReady=function(){return null!=e.activePlugin},e.getCapabilities=function(){return null==e.activePlugin?null:e.activePlugin._capabilities},e.getCapability=function(a){return null==e.activePlugin?null:e.activePlugin._capabilities[a]},e.initLoad=function(a,b,c,d,f){a=a.replace(f,"");var g=e.registerSound(a,c,d,!1,f);return null==g?!1:g},e.registerSound=function(a,c,d,f,g){if(!e.initializeDefaultPlugins())return!1;if(a instanceof Object&&(g=c,c=a.id,d=a.data,a=a.src),e.alternateExtensions.length)var h=e._parsePath2(a,"sound",c,d);else var h=e._parsePath(a,"sound",c,d);if(null==h)return!1;null!=g&&(a=g+a,h.src=g+h.src),null!=c&&(e._idHash[c]=h.src);var i=null;null!=d&&(isNaN(d.channels)?isNaN(d)||(i=parseInt(d)):i=parseInt(d.channels));var j=e.activePlugin.register(h.src,i);if(null!=j&&(null!=j.numChannels&&(i=j.numChannels),b.create(h.src,i),null!=d&&isNaN(d)?d.channels=h.data.channels=i||b.maxPerChannel():d=h.data=i||b.maxPerChannel(),null!=j.tag?h.tag=j.tag:j.src&&(h.src=j.src),null!=j.completeHandler&&(h.completeHandler=j.completeHandler),j.type&&(h.type=j.type)),0!=f)if(e._preloadHash[h.src]||(e._preloadHash[h.src]=[]),e._preloadHash[h.src].push({src:a,id:c,data:d}),1==e._preloadHash[h.src].length)e.activePlugin.preload(h.src,j);else if(1==e._preloadHash[h.src][0])return!0;return h},e.registerManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.registerSound(a[d].src,a[d].id,a[d].data,a[d].preload,b);return c},e.removeSound=function(a,c){if(null==e.activePlugin)return!1;if(a instanceof Object&&(a=a.src),a=e._getSrcById(a),e.alternateExtensions.length)var d=e._parsePath2(a);else var d=e._parsePath(a);if(null==d)return!1;null!=c&&(d.src=c+d.src),a=d.src;for(var f in e._idHash)e._idHash[f]==a&&delete e._idHash[f];return b.removeSrc(a),delete e._preloadHash[a],e.activePlugin.removeSound(a),!0},e.removeManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.removeSound(a[d].src,b);return c},e.removeAllSounds=function(){e._idHash={},e._preloadHash={},b.removeAll(),e.activePlugin.removeAllSounds()},e.loadComplete=function(a){if(e.alternateExtensions.length)var b=e._parsePath2(a,"sound");else var b=e._parsePath(a,"sound");return a=b?e._getSrcById(b.src):e._getSrcById(a),1==e._preloadHash[a][0]},e._parsePath=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.split(e.DELIMITER);if(f.length>1)try{console.log('createjs.Sound.DELIMITER "|" loading approach has been deprecated. Please use the new alternateExtensions property.')}catch(g){}for(var h={type:b||"sound",id:c,data:d},i=e.getCapabilities(),j=0,k=f.length;k>j;j++){var l=f[j],m=l.match(e.FILE_PATTERN);if(null==m)return!1;var n=m[4],o=m[5];if(i[o]&&createjs.indexOf(e.SUPPORTED_EXTENSIONS,o)>-1)return h.name=n,h.src=l,h.extension=o,h}return null},e._parsePath2=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.match(e.FILE_PATTERN);if(null==f)return!1;for(var g=f[4],h=f[5],i=e.getCapabilities(),j=0;!i[h];)if(h=e.alternateExtensions[j++],j>e.alternateExtensions.length)return null;a=a.replace("."+f[5],"."+h);var k={type:b||"sound",id:c,data:d};return k.name=g,k.src=a,k.extension=h,k},e.play=function(a,b,c,d,f,g,h){var i=e.createInstance(a),j=e._playInstance(i,b,c,d,f,g,h);return j||i.playFailed(),i},e.createInstance=function(c){if(!e.initializeDefaultPlugins())return e._defaultSoundInstance;if(c=e._getSrcById(c),e.alternateExtensions.length)var d=e._parsePath2(c,"sound");else var d=e._parsePath(c,"sound");var f=null;return null!=d&&null!=d.src?(b.create(d.src),f=e.activePlugin.create(d.src)):f=a._defaultSoundInstance,f.uniqueId=e._lastID++,f},e.setVolume=function(a){if(null==Number(a))return!1;if(a=Math.max(0,Math.min(1,a)),e._masterVolume=a,!this.activePlugin||!this.activePlugin.setVolume||!this.activePlugin.setVolume(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterVolume(a)},e.getVolume=function(){return e._masterVolume},e.setMute=function(a){if(null==a||void 0==a)return!1;if(this._masterMute=a,!this.activePlugin||!this.activePlugin.setMute||!this.activePlugin.setMute(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterMute(a);return!0},e.getMute=function(){return this._masterMute},e.stop=function(){for(var a=this._instances,b=a.length;b--;)a[b].stop()},e._playInstance=function(a,b,c,d,f,g,h){if(b instanceof Object&&(c=b.delay,d=b.offset,f=b.loop,g=b.volume,h=b.pan,b=b.interrupt),b=b||e.defaultInterruptBehavior,null==c&&(c=0),null==d&&(d=a.getPosition()),null==f&&(f=0),null==g&&(g=a.volume),null==h&&(h=a.pan),0==c){var i=e._beginPlaying(a,b,d,f,g,h);if(!i)return!1}else{var j=setTimeout(function(){e._beginPlaying(a,b,d,f,g,h)},c);a._delayTimeoutId=j}return this._instances.push(a),!0},e._beginPlaying=function(a,c,d,e,f,g){if(!b.add(a,c))return!1;var h=a._beginPlaying(d,e,f,g);if(!h){var i=createjs.indexOf(this._instances,a);return i>-1&&this._instances.splice(i,1),!1}return!0},e._getSrcById=function(a){return null==e._idHash||null==e._idHash[a]?a:e._idHash[a]},e._playFinished=function(a){b.remove(a);var c=createjs.indexOf(this._instances,a);c>-1&&this._instances.splice(c,1)},createjs.Sound=a,b.channels={},b.create=function(a,c){var d=b.get(a);return null==d?(b.channels[a]=new b(a,c),!0):!1},b.removeSrc=function(a){var c=b.get(a);return null==c?!1:(c.removeAll(),delete b.channels[a],!0)},b.removeAll=function(){for(var a in b.channels)b.channels[a].removeAll();b.channels={}},b.add=function(a,c){var d=b.get(a.src);return null==d?!1:d.add(a,c)},b.remove=function(a){var c=b.get(a.src);return null==c?!1:(c.remove(a),!0)},b.maxPerChannel=function(){return f.maxDefault},b.get=function(a){return b.channels[a]};var f=b.prototype;f.src=null,f.max=null,f.maxDefault=100,f.length=0,f.init=function(a,b){this.src=a,this.max=b||this.maxDefault,-1==this.max&&(this.max=this.maxDefault),this._instances=[]},f.get=function(a){return this._instances[a]},f.add=function(a,b){return this.getSlot(b,a)?(this._instances.push(a),this.length++,!0):!1},f.remove=function(a){var b=createjs.indexOf(this._instances,a);return-1==b?!1:(this._instances.splice(b,1),this.length--,!0)},f.removeAll=function(){for(var a=this.length-1;a>=0;a--)this._instances[a].stop()},f.getSlot=function(b){for(var c,d,e=0,f=this.max;f>e;e++){if(c=this.get(e),null==c)return!0;(b!=a.INTERRUPT_NONE||c.playState==a.PLAY_FINISHED)&&(0!=e?c.playState==a.PLAY_FINISHED||c.playState==a.PLAY_INTERRUPTED||c.playState==a.PLAY_FAILED?d=c:(b==a.INTERRUPT_EARLY&&c.getPosition()<d.getPosition()||b==a.INTERRUPT_LATE&&c.getPosition()>d.getPosition())&&(d=c):d=c)}return null!=d?(d._interrupt(),this.remove(d),!0):!1},f.toString=function(){return"[Sound SoundChannel]"},a._defaultSoundInstance=new c,d.init=function(){var a=window.navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1,d.isAndroid=a.indexOf("Android")>-1,d.isBlackberry=a.indexOf("Blackberry")>-1},d.init(),createjs.Sound.BrowserDetect=d}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b._capabilities=null,b.isSupported=function(){var a=createjs.Sound.BrowserDetect.isIOS||createjs.Sound.BrowserDetect.isAndroid||createjs.Sound.BrowserDetect.isBlackberry;return"file:"!=location.protocol||a||this._isFileXHRSupported()?(b._generateCapabilities(),null==b.context?!1:!0):!1},b._isFileXHRSupported=function(){var a=!0,b=new XMLHttpRequest;try{b.open("GET","fail.fail",!1)}catch(c){return a=!1}b.onerror=function(){a=!1},b.onload=function(){a=404==this.status||200==this.status||0==this.status&&""!=this.response};try{b.send()}catch(c){a=!1}return a},b._generateCapabilities=function(){if(null==b._capabilities){var a=document.createElement("audio");if(null==a.canPlayType)return null;if(window.webkitAudioContext)b.context=new webkitAudioContext;else{if(!window.AudioContext)return null;b.context=new AudioContext}b._compatibilitySetUp(),b.playEmptySound(),b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}b.context.destination.numberOfChannels<2&&(b._capabilities.panning=!1),b.dynamicsCompressorNode=b.context.createDynamicsCompressor(),b.dynamicsCompressorNode.connect(b.context.destination),b.gainNode=b.context.createGain(),b.gainNode.connect(b.dynamicsCompressorNode)}},b._compatibilitySetUp=function(){if(!b.context.createGain){b.context.createGain=b.context.createGainNode;var a=b.context.createBufferSource();a.__proto__.start=a.__proto__.noteGrainOn,a.__proto__.stop=a.__proto__.noteOff,this._panningModel=0}},b.playEmptySound=function(){var a=this.context.createBuffer(1,1,22050),b=this.context.createBufferSource();b.buffer=a,b.connect(this.context.destination),b.start(0,0,0)};var c=a.prototype;c._capabilities=null,c._volume=1,c.context=null,c._panningModel="equalpower",c.dynamicsCompressorNode=null,c.gainNode=null,c._arrayBuffers=null,c._init=function(){this._capabilities=b._capabilities,this._arrayBuffers={},this.context=b.context,this.gainNode=b.gainNode,this.dynamicsCompressorNode=b.dynamicsCompressorNode},c.register=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);return{tag:b}},c.isPreloadStarted=function(a){return null!=this._arrayBuffers[a]},c.isPreloadComplete=function(a){return!(null==this._arrayBuffers[a]||1==this._arrayBuffers[a])},c.removeSound=function(a){delete this._arrayBuffers[a]},c.removeAllSounds=function(){this._arrayBuffers={}},c.addPreloadResults=function(a,b){this._arrayBuffers[a]=b},c._handlePreloadComplete=function(){createjs.Sound._sendFileLoadEvent(this.src)},c.preload=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);b.onload=this._handlePreloadComplete,b.load()},c.create=function(a){return this.isPreloadStarted(a)||this.preload(a),new createjs.WebAudioPlugin.SoundInstance(a,this)},c.setVolume=function(a){return this._volume=a,this._updateVolume(),!0},c._updateVolume=function(){var a=createjs.Sound._masterMute?0:this._volume;a!=this.gainNode.gain.value&&(this.gainNode.gain.value=a)},c.getVolume=function(){return this._volume},c.setMute=function(){return this._updateVolume(),!0},c.toString=function(){return"[WebAudioPlugin]"},createjs.WebAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){return null==Number(a)?!1:(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume(),void 0)}})}catch(c){}b._pan=0;try{Object.defineProperty(b,"pan",{get:function(){return this._pan},set:function(a){return this._owner._capabilities.panning&&null!=Number(a)?(a=Math.max(-1,Math.min(1,a)),this._pan=a,this.panNode.setPosition(a,0,-.5),void 0):!1}})}catch(c){}b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b._soundCompleteTimeout=null,b.gainNode=null,b.panNode=null,b.sourceNode=null,b._sourceNodeNext=null,b._muted=!1,b._paused=!1,b._startTime=0,b._endedHandler=null,b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._init=function(a,b){this._owner=b,this.src=a,this.gainNode=this._owner.context.createGain(),this.panNode=this._owner.context.createPanner(),this.panNode.panningModel=this._owner._panningModel,this.panNode.connect(this.gainNode),this._owner.isPreloadComplete(this.src)&&(this._duration=1e3*this._owner._arrayBuffers[this.src].duration),this._endedHandler=createjs.proxy(this._handleSoundComplete,this)},b._cleanUp=function(){this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this.sourceNode=this._cleanUpAudioNode(this.sourceNode),this._sourceNodeNext=this._cleanUpAudioNode(this._sourceNodeNext)),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(0),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),this._startTime=0,null!=window.createjs&&createjs.Sound._playFinished(this)},b._cleanUpAudioNode=function(a){return a&&(a.stop(0),a.disconnect(this.panNode),a=null),a},b._interrupt=function(){this._cleanUp(),this.playState=createjs.Sound.PLAY_INTERRUPTED,this._paused=!1,this._sendEvent("interrupted")},b._handleSoundReady=function(){if(null!=window.createjs){if(1e3*this._offset>this.getDuration())return this.playFailed(),void 0;this._offset<0&&(this._offset=0),this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.gainNode.connect(this._owner.gainNode);var a=this._owner._arrayBuffers[this.src].duration;this.sourceNode=this._createAndPlayAudioNode(this._owner.context.currentTime-a,this._offset),this._duration=1e3*a,this._startTime=this.sourceNode.startTime-this._offset,this._soundCompleteTimeout=setTimeout(this._endedHandler,1e3*(a-this._offset)),0!=this._remainingLoops&&(this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0))}},b._createAndPlayAudioNode=function(a,b){var c=this._owner.context.createBufferSource();return c.buffer=this._owner._arrayBuffers[this.src],c.connect(this.panNode),this._owner.context.currentTime,c.startTime=a+c.buffer.duration,c.start(c.startTime,b,c.buffer.duration-b),c},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){return null!=window.createjs&&this.src?(this._offset=a/1e3,this._remainingLoops=b,this.volume=c,this.pan=d,this._owner.isPreloadComplete(this.src)?(this._handleSoundReady(null),this._sendEvent("succeeded"),1):(this.playFailed(),void 0)):void 0},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED?!1:(this._paused=!0,this._offset=this._owner.context.currentTime-this._startTime,this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),!0)},b.resume=function(){return this._paused?(this._handleSoundReady(null),!0):!1},b.stop=function(){return this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._offset=0,!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){var a=this._muted?0:this._volume;return a!=this.gainNode.gain.value?(this.gainNode.gain.value=a,!0):!1},b.getVolume=function(){return this.volume},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(a){return this.pan=a,this.pan!=a?!1:void 0},b.getPan=function(){return this.pan},b.getPosition=function(){if(this._paused||null==this.sourceNode)var a=this._offset;else var a=this._owner.context.currentTime-this._startTime;return 1e3*a},b.setPosition=function(a){return this._offset=a/1e3,this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),clearTimeout(this._soundCompleteTimeout)),this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||this._handleSoundReady(null),!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){return this._offset=0,0!=this._remainingLoops?(this._remainingLoops--,this._sourceNodeNext?(this._cleanUpAudioNode(this.sourceNode),this.sourceNode=this._sourceNodeNext,this._startTime=this.sourceNode.startTime,this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0),this._soundCompleteTimeout=setTimeout(this._endedHandler,this._duration)):this._handleSoundReady(null),this._sendEvent("loop"),void 0):(null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._sendEvent("complete")),void 0)},b.playFailed=function(){null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FAILED,this._sendEvent("failed"))},b.toString=function(){return"[WebAudioPlugin SoundInstance]"},createjs.WebAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.request=null,b.owner=null,b.progress=-1,b.src=null,b.originalSrc=null,b.result=null,b.onload=null,b.onprogress=null,b.onError=null,b._init=function(a,b){this.src=a,this.originalSrc=a,this.owner=b},b.load=function(a){null!=a&&(this.src=a),this.request=new XMLHttpRequest,this.request.open("GET",this.src,!0),this.request.responseType="arraybuffer",this.request.onload=createjs.proxy(this.handleLoad,this),this.request.onError=createjs.proxy(this.handleError,this),this.request.onprogress=createjs.proxy(this.handleProgress,this),this.request.send()},b.handleProgress=function(a,b){this.progress=a/b,null!=this.onprogress&&this.onprogress({loaded:a,total:b,progress:this.progress})},b.handleLoad=function(){this.owner.context.decodeAudioData(this.request.response,createjs.proxy(this.handleAudioDecoded,this),createjs.proxy(this.handleError,this))},b.handleAudioDecoded=function(a){this.progress=1,this.result=a,this.src=this.originalSrc,this.owner.addPreloadResults(this.src,this.result),this.onload&&this.onload()},b.handleError=function(a){this.owner.removeSound(this.src),this.onerror&&this.onerror(a)},b.toString=function(){return"[WebAudioPlugin Loader]"},createjs.WebAudioPlugin.Loader=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b.MAX_INSTANCES=30,b._AUDIO_READY="canplaythrough",b._AUDIO_ENDED="ended",b._AUDIO_SEEKED="seeked",b._AUDIO_STALLED="stalled",b._capabilities=null,b.enableIOS=!1,b.isSupported=function(){if(createjs.Sound.BrowserDetect.isIOS&&!b.enableIOS)return!1;b._generateCapabilities();var a=b.tag;return null==a||null==b._capabilities?!1:!0},b._generateCapabilities=function(){if(null==b._capabilities){var a=b.tag=document.createElement("audio");if(null==a.canPlayType)return null;b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}}};var c=a.prototype;c._capabilities=null,c._audioSources=null,c.defaultNumChannels=2,c.loadedHandler=null,c._init=function(){this._capabilities=b._capabilities,this._audioSources={}},c.register=function(a,b){this._audioSources[a]=!0;for(var c=createjs.HTMLAudioPlugin.TagPool.get(a),d=null,e=b||this.defaultNumChannels,f=0;e>f;f++)d=this._createTag(a),c.add(d);if(d.id=a,this.loadedHandler=createjs.proxy(this._handleTagLoad,this),d.addEventListener&&d.addEventListener("canplaythrough",this.loadedHandler),null==d.onreadystatechange)d.onreadystatechange=this.loadedHandler;else{var g=d.onreadystatechange;d.onreadystatechange=function(){g(),this.loadedHandler()}}return{tag:d,numChannels:e}},c._handleTagLoad=function(a){a.target.removeEventListener&&a.target.removeEventListener("canplaythrough",this.loadedHandler),a.target.onreadystatechange=null,a.target.src!=a.target.id&&createjs.HTMLAudioPlugin.TagPool.checkSrc(a.target.id)},c._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},c.removeSound=function(a){delete this._audioSources[a],createjs.HTMLAudioPlugin.TagPool.remove(a)},c.removeAllSounds=function(){this._audioSources={},createjs.HTMLAudioPlugin.TagPool.removeAll()},c.create=function(a){if(!this.isPreloadStarted(a)){var b=createjs.HTMLAudioPlugin.TagPool.get(a),c=this._createTag(a);c.id=a,b.add(c),this.preload(a,{tag:c})}return new createjs.HTMLAudioPlugin.SoundInstance(a,this)},c.isPreloadStarted=function(a){return null!=this._audioSources[a]},c.preload=function(a,b){this._audioSources[a]=!0,new createjs.HTMLAudioPlugin.Loader(a,b.tag)},c.toString=function(){return"[HTMLAudioPlugin]"},createjs.HTMLAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b.loaded=!1,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){null!=Number(a)&&(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume())}})}catch(c){}b.pan=0,b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b.tag=null,b._muted=!1,b._paused=!1,b._endedHandler=null,b._readyHandler=null,b._stalledHandler=null,b.loopHandler=null,b._init=function(a,b){this.src=a,this._owner=b,this._endedHandler=createjs.proxy(this._handleSoundComplete,this),this._readyHandler=createjs.proxy(this._handleSoundReady,this),this._stalledHandler=createjs.proxy(this._handleSoundStalled,this),this.loopHandler=createjs.proxy(this.handleSoundLoop,this)},b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._cleanUp=function(){var a=this.tag;if(null!=a){a.pause(),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{a.currentTime=0}catch(b){}createjs.HTMLAudioPlugin.TagPool.setInstance(this.src,a),this.tag=null}clearTimeout(this._delayTimeoutId),null!=window.createjs&&createjs.Sound._playFinished(this)},b._interrupt=function(){null!=this.tag&&(this.playState=createjs.Sound.PLAY_INTERRUPTED,this._cleanUp(),this._paused=!1,this._sendEvent("interrupted"))},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){if(null==window.createjs)return-1;var e=this.tag=createjs.HTMLAudioPlugin.TagPool.getInstance(this.src);return null==e?(this.playFailed(),-1):(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),this._offset=a,this.volume=c,this.pan=d,this._updateVolume(),this._remainingLoops=b,4!==e.readyState?(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED,this._stalledHandler,!1),e.preload="auto",e.load()):this._handleSoundReady(null),this._sendEvent("succeeded"),1)},b._handleSoundStalled=function(){this._cleanUp(),this._sendEvent("failed")},b._handleSoundReady=function(){if(null!=window.createjs){if(this._duration=1e3*this.tag.duration,this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),this._offset>=this.getDuration())return this.playFailed(),void 0;this._offset>0&&(this.tag.currentTime=.001*this._offset),-1==this._remainingLoops&&(this.tag.loop=!0),0!=this._remainingLoops&&(this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1),this.tag.loop=!0),this.tag.play()}},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||null==this.tag?!1:(this._paused=!0,this.tag.pause(),clearTimeout(this._delayTimeoutId),!0)},b.resume=function(){return this._paused&&null!=this.tag?(this._paused=!1,this.tag.play(),!0):!1},b.stop=function(){return this._offset=0,this.pause(),this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),!0},b.setMasterVolume=function(){return this._updateVolume(),!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){if(null!=this.tag){var a=this._muted||createjs.Sound._masterMute?0:this._volume*createjs.Sound._masterVolume;return a!=this.tag.volume&&(this.tag.volume=a),!0}return!1},b.getVolume=function(){return this.volume},b.setMasterMute=function(){return this._updateVolume(),!0},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(){return!1},b.getPan=function(){return 0},b.getPosition=function(){return null==this.tag?this._offset:1e3*this.tag.currentTime},b.setPosition=function(a){if(null==this.tag)this._offset=a;else{this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{this.tag.currentTime=.001*a}catch(b){return!1}this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)}return!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){this._offset=0,null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),this._sendEvent("complete"))},b.handleSoundLoop=function(){this._offset=0,this._remainingLoops--,0==this._remainingLoops&&(this.tag.loop=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)),this._sendEvent("loop")},b.playFailed=function(){null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FAILED,this._cleanUp(),this._sendEvent("failed"))},b.toString=function(){return"[HTMLAudioPlugin SoundInstance]"},createjs.HTMLAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.src=null,b.tag=null,b.preloadTimer=null,b.loadedHandler=null,b._init=function(a,b){if(this.src=a,this.tag=b,this.preloadTimer=setInterval(createjs.proxy(this.preloadTick,this),200),this.loadedHandler=createjs.proxy(this.sendLoadedEvent,this),this.tag.addEventListener&&this.tag.addEventListener("canplaythrough",this.loadedHandler),null==this.tag.onreadystatechange)this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this);else{var c=this.tag.onreadystatechange;this.tag.onreadystatechange=function(){c(),this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this)}
}this.tag.preload="auto",this.tag.load()},b.preloadTick=function(){var a=this.tag.buffered,b=this.tag.duration;a.length>0&&a.end(0)>=b-1&&this.handleTagLoaded()},b.handleTagLoaded=function(){clearInterval(this.preloadTimer)},b.sendLoadedEvent=function(){this.tag.removeEventListener&&this.tag.removeEventListener("canplaythrough",this.loadedHandler),this.tag.onreadystatechange=null,createjs.Sound._sendFileLoadEvent(this.src)},b.toString=function(){return"[HTMLAudioPlugin Loader]"},createjs.HTMLAudioPlugin.Loader=a}(),function(){"use strict";function a(a){this._init(a)}var b=a;b.tags={},b.get=function(c){var d=b.tags[c];return null==d&&(d=b.tags[c]=new a(c)),d},b.remove=function(a){var c=b.tags[a];return null==c?!1:(c.removeAll(),delete b.tags[a],!0)},b.removeAll=function(){for(var a in b.tags)b.tags[a].removeAll();b.tags={}},b.getInstance=function(a){var c=b.tags[a];return null==c?null:c.get()},b.setInstance=function(a,c){var d=b.tags[a];return null==d?null:d.set(c)},b.checkSrc=function(a){var c=b.tags[a];return null==c?null:(c.checkSrcChange(),void 0)};var c=a.prototype;c.src=null,c.length=0,c.available=0,c.tags=null,c._init=function(a){this.src=a,this.tags=[]},c.add=function(a){this.tags.push(a),this.length++,this.available++},c.removeAll=function(){for(;this.length--;)delete this.tags[this.length];this.src=null,this.tags.length=0},c.get=function(){if(0==this.tags.length)return null;this.available=this.tags.length;var a=this.tags.pop();return null==a.parentNode&&document.body.appendChild(a),a},c.set=function(a){var b=createjs.indexOf(this.tags,a);-1==b&&this.tags.push(a),this.available=this.tags.length},c.checkSrcChange=function(){for(var a=this.tags.length-1,b=this.tags[a].src;a--;)this.tags[a].src=b},c.toString=function(){return"[HTMLAudioPlugin TagPool]"},createjs.HTMLAudioPlugin.TagPool=a}();

;/*!
* @license SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){function a(){if(!R){try{var a=K.getElementsByTagName("body")[0].appendChild(q("span"));a.parentNode.removeChild(a)}catch(b){return}R=!0;for(var c=N.length,d=0;c>d;d++)N[d]()}}function b(a){R?a():N[N.length]=a}function c(a){if(typeof J.addEventListener!=C)J.addEventListener("load",a,!1);else if(typeof K.addEventListener!=C)K.addEventListener("load",a,!1);else if(typeof J.attachEvent!=C)r(J,"onload",a);else if("function"==typeof J.onload){var b=J.onload;J.onload=function(){b(),a()}}else J.onload=a}function d(){M?e():f()}function e(){var a=K.getElementsByTagName("body")[0],b=q(D);b.setAttribute("type",G);var c=a.appendChild(b);if(c){var d=0;!function(){if(typeof c.GetVariable!=C){var e=c.GetVariable("$version");e&&(e=e.split(" ")[1].split(","),U.pv=[parseInt(e[0],10),parseInt(e[1],10),parseInt(e[2],10)])}else if(10>d)return d++,setTimeout(arguments.callee,10),void 0;a.removeChild(b),c=null,f()}()}else f()}function f(){var a=O.length;if(a>0)for(var b=0;a>b;b++){var c=O[b].id,d=O[b].callbackFn,e={success:!1,id:c};if(U.pv[0]>0){var f=p(c);if(f)if(!s(O[b].swfVersion)||U.wk&&U.wk<312)if(O[b].expressInstall&&h()){var k={};k.data=O[b].expressInstall,k.width=f.getAttribute("width")||"0",k.height=f.getAttribute("height")||"0",f.getAttribute("class")&&(k.styleclass=f.getAttribute("class")),f.getAttribute("align")&&(k.align=f.getAttribute("align"));for(var l={},m=f.getElementsByTagName("param"),n=m.length,o=0;n>o;o++)"movie"!=m[o].getAttribute("name").toLowerCase()&&(l[m[o].getAttribute("name")]=m[o].getAttribute("value"));i(k,l,c,d)}else j(f),d&&d(e);else u(c,!0),d&&(e.success=!0,e.ref=g(c),d(e))}else if(u(c,!0),d){var q=g(c);q&&typeof q.SetVariable!=C&&(e.success=!0,e.ref=q),d(e)}}}function g(a){var b=null,c=p(a);if(c&&"OBJECT"==c.nodeName)if(typeof c.SetVariable!=C)b=c;else{var d=c.getElementsByTagName(D)[0];d&&(b=d)}return b}function h(){return!S&&s("6.0.65")&&(U.win||U.mac)&&!(U.wk&&U.wk<312)}function i(a,b,c,d){S=!0,y=d||null,z={success:!1,id:c};var e=p(c);if(e){"OBJECT"==e.nodeName?(w=k(e),x=null):(w=e,x=c),a.id=H,(typeof a.width==C||!/%$/.test(a.width)&&parseInt(a.width,10)<310)&&(a.width="310"),(typeof a.height==C||!/%$/.test(a.height)&&parseInt(a.height,10)<137)&&(a.height="137"),K.title=K.title.slice(0,47)+" - Flash Player Installation";var f=U.ie&&U.win?"ActiveX":"PlugIn",g="MMredirectURL="+encodeURI(window.location).toString().replace(/&/g,"%26")+"&MMplayerType="+f+"&MMdoctitle="+K.title;if(typeof b.flashvars!=C?b.flashvars+="&"+g:b.flashvars=g,U.ie&&U.win&&4!=e.readyState){var h=q("div");c+="SWFObjectNew",h.setAttribute("id",c),e.parentNode.insertBefore(h,e),e.style.display="none",function(){4==e.readyState?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}l(a,b,c)}}function j(a){if(U.ie&&U.win&&4!=a.readyState){var b=q("div");a.parentNode.insertBefore(b,a),b.parentNode.replaceChild(k(a),b),a.style.display="none",function(){4==a.readyState?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)}()}else a.parentNode.replaceChild(k(a),a)}function k(a){var b=q("div");if(U.win&&U.ie)b.innerHTML=a.innerHTML;else{var c=a.getElementsByTagName(D)[0];if(c){var d=c.childNodes;if(d)for(var e=d.length,f=0;e>f;f++)1==d[f].nodeType&&"PARAM"==d[f].nodeName||8==d[f].nodeType||b.appendChild(d[f].cloneNode(!0))}}return b}function l(a,b,c){var d,e=p(c);if(U.wk&&U.wk<312)return d;if(e)if(typeof a.id==C&&(a.id=c),U.ie&&U.win){var f="";for(var g in a)a[g]!=Object.prototype[g]&&("data"==g.toLowerCase()?b.movie=a[g]:"styleclass"==g.toLowerCase()?f+=' class="'+a[g]+'"':"classid"!=g.toLowerCase()&&(f+=" "+g+'="'+a[g]+'"'));var h="";for(var i in b)b[i]!=Object.prototype[i]&&(h+='<param name="'+i+'" value="'+b[i]+'" />');e.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+f+">"+h+"</object>",P[P.length]=a.id,d=p(a.id)}else{var j=q(D);j.setAttribute("type",G);for(var k in a)a[k]!=Object.prototype[k]&&("styleclass"==k.toLowerCase()?j.setAttribute("class",a[k]):"classid"!=k.toLowerCase()&&j.setAttribute(k,a[k]));for(var l in b)b[l]!=Object.prototype[l]&&"movie"!=l.toLowerCase()&&m(j,l,b[l]);e.parentNode.replaceChild(j,e),d=j}return d}function m(a,b,c){var d=q("param");d.setAttribute("name",b),d.setAttribute("value",c),a.appendChild(d)}function n(a){var b=p(a);b&&"OBJECT"==b.nodeName&&(U.ie&&U.win?(b.style.display="none",function(){4==b.readyState?o(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function o(a){var b=p(a);if(b){for(var c in b)"function"==typeof b[c]&&(b[c]=null);b.parentNode.removeChild(b)}}function p(a){var b=null;try{b=K.getElementById(a)}catch(c){}return b}function q(a){return K.createElement(a)}function r(a,b,c){a.attachEvent(b,c),Q[Q.length]=[a,b,c]}function s(a){var b=U.pv,c=a.split(".");return c[0]=parseInt(c[0],10),c[1]=parseInt(c[1],10)||0,c[2]=parseInt(c[2],10)||0,b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function t(a,b,c,d){if(!U.ie||!U.mac){var e=K.getElementsByTagName("head")[0];if(e){var f=c&&"string"==typeof c?c:"screen";if(d&&(A=null,B=null),!A||B!=f){var g=q("style");g.setAttribute("type","text/css"),g.setAttribute("media",f),A=e.appendChild(g),U.ie&&U.win&&typeof K.styleSheets!=C&&K.styleSheets.length>0&&(A=K.styleSheets[K.styleSheets.length-1]),B=f}U.ie&&U.win?A&&typeof A.addRule==D&&A.addRule(a,b):A&&typeof K.createTextNode!=C&&A.appendChild(K.createTextNode(a+" {"+b+"}"))}}}function u(a,b){if(T){var c=b?"visible":"hidden";R&&p(a)?p(a).style.visibility=c:t("#"+a,"visibility:"+c)}}function v(a){var b=/[\\\"<>\.;]/,c=null!=b.exec(a);return c&&typeof encodeURIComponent!=C?encodeURIComponent(a):a}var w,x,y,z,A,B,C="undefined",D="object",E="Shockwave Flash",F="ShockwaveFlash.ShockwaveFlash",G="application/x-shockwave-flash",H="SWFObjectExprInst",I="onreadystatechange",J=window,K=document,L=navigator,M=!1,N=[d],O=[],P=[],Q=[],R=!1,S=!1,T=!0,U=function(){var a=typeof K.getElementById!=C&&typeof K.getElementsByTagName!=C&&typeof K.createElement!=C,b=L.userAgent.toLowerCase(),c=L.platform.toLowerCase(),d=c?/win/.test(c):/win/.test(b),e=c?/mac/.test(c):/mac/.test(b),f=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,g=!1,h=[0,0,0],i=null;if(typeof L.plugins!=C&&typeof L.plugins[E]==D)i=L.plugins[E].description,!i||typeof L.mimeTypes!=C&&L.mimeTypes[G]&&!L.mimeTypes[G].enabledPlugin||(M=!0,g=!1,i=i.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),h[0]=parseInt(i.replace(/^(.*)\..*$/,"$1"),10),h[1]=parseInt(i.replace(/^.*\.(.*)\s.*$/,"$1"),10),h[2]=/[a-zA-Z]/.test(i)?parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof J.ActiveXObject!=C)try{var j=new ActiveXObject(F);j&&(i=j.GetVariable("$version"),i&&(g=!0,i=i.split(" ")[1].split(","),h=[parseInt(i[0],10),parseInt(i[1],10),parseInt(i[2],10)]))}catch(k){}return{w3:a,pv:h,wk:f,ie:g,win:d,mac:e}}();return function(){U.w3&&((typeof K.readyState!=C&&"complete"==K.readyState||typeof K.readyState==C&&(K.getElementsByTagName("body")[0]||K.body))&&a(),R||(typeof K.addEventListener!=C&&K.addEventListener("DOMContentLoaded",a,!1),U.ie&&U.win&&(K.attachEvent(I,function(){"complete"==K.readyState&&(K.detachEvent(I,arguments.callee),a())}),J==top&&function(){if(!R){try{K.documentElement.doScroll("left")}catch(b){return setTimeout(arguments.callee,0),void 0}a()}}()),U.wk&&function(){return R?void 0:/loaded|complete/.test(K.readyState)?(a(),void 0):(setTimeout(arguments.callee,0),void 0)}(),c(a)))}(),function(){U.ie&&U.win&&window.attachEvent("onunload",function(){for(var a=Q.length,b=0;a>b;b++)Q[b][0].detachEvent(Q[b][1],Q[b][2]);for(var c=P.length,d=0;c>d;d++)n(P[d]);for(var e in U)U[e]=null;U=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})}(),{registerObject:function(a,b,c,d){if(U.w3&&a&&b){var e={};e.id=a,e.swfVersion=b,e.expressInstall=c,e.callbackFn=d,O[O.length]=e,u(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){return U.w3?g(a):void 0},embedSWF:function(a,c,d,e,f,g,j,k,m,n){var o={success:!1,id:c};U.w3&&!(U.wk&&U.wk<312)&&a&&c&&d&&e&&f?(u(c,!1),b(function(){d+="",e+="";var b={};if(m&&typeof m===D)for(var p in m)b[p]=m[p];b.data=a,b.width=d,b.height=e;var q={};if(k&&typeof k===D)for(var r in k)q[r]=k[r];if(j&&typeof j===D)for(var t in j)typeof q.flashvars!=C?q.flashvars+="&"+t+"="+j[t]:q.flashvars=t+"="+j[t];if(s(f)){var v=l(b,q,c);b.id==c&&u(c,!0),o.success=!0,o.ref=v}else{if(g&&h())return b.data=g,i(b,q,c,n),void 0;u(c,!0)}n&&n(o)})):n&&n(o)},switchOffAutoHideShow:function(){T=!1},ua:U,getFlashPlayerVersion:function(){return{major:U.pv[0],minor:U.pv[1],release:U.pv[2]}},hasFlashPlayerVersion:s,createSWF:function(a,b,c){return U.w3?l(a,b,c):void 0},showExpressInstall:function(a,b,c,d){U.w3&&h()&&i(a,b,c,d)},removeSWF:function(a){U.w3&&n(a)},createCSS:function(a,b,c,d){U.w3&&t(a,b,c,d)},addDomLoadEvent:b,addLoadEvent:c,getQueryParamValue:function(a){var b=K.location.search||K.location.hash;if(b){if(/\?/.test(b)&&(b=b.split("?")[1]),null==a)return v(b);for(var c=b.split("&"),d=0;d<c.length;d++)if(c[d].substring(0,c[d].indexOf("="))==a)return v(c[d].substring(c[d].indexOf("=")+1))}return""},expressInstallCallback:function(){if(S){var a=p(H);a&&w&&(a.parentNode.replaceChild(w,a),x&&(u(x,!0),U.ie&&U.win&&(w.style.display="block")),y&&y(z)),S=!1}}}}();this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b._capabilities=null,b.BASE_PATH=null,b.swfPath="src/SoundJS/",b.isSupported=function(){return createjs.Sound.BrowserDetect.isIOS||createjs.Sound.BrowserDetect.isAndroid||createjs.Sound.BrowserDetect.isBlackberry?!1:(b._generateCapabilities(),null==swfobject?!1:swfobject.hasFlashPlayerVersion("9.0.0"))},b._generateCapabilities=function(){null==b._capabilities&&(b._capabilities={panning:!0,volume:!0,tracks:-1,mp3:!0,ogg:!1,mpeg:!0,wav:!0,m4a:!1,mp4:!1,aiff:!1,wma:!1,mid:!1})},b.prototype={_audioSources:null,_volume:1,_CONTAINER_ID:"flashAudioContainer",_WRAPPER_ID:"SoundJSFlashContainer",_capabilities:null,_container:null,_flash:null,flashReady:!1,_flashInstances:null,_flashPreloadInstances:null,_preloadInstances:null,_queuedInstances:null,showOutput:!1,_init:function(){this._capabilities=b._capabilities,this._audioSources={},this._flashInstances={},this._flashPreloadInstances={},this._preloadInstances={},this._queuedInstances=[];var a=this.wrapper=document.createElement("div");a.id=this._WRAPPER_ID,a.style.position="absolute",a.style.marginLeft="-1px",a.className=this._WRAPPER_ID,document.body.appendChild(a);var c=this._container=document.createElement("div");if(c.id=this._CONTAINER_ID,c.appendChild(document.createTextNode("SoundJS Flash Container")),a.appendChild(c),b.BASE_PATH)try{console.log("createjs.FlashPlugin.BASE_PATH has been deprecated, please use swfPath")}catch(d){}var e=b.BASE_PATH||b.swfPath;swfobject.embedSWF(e+"FlashAudioPlugin.swf",this._CONTAINER_ID,"1","1","9.0.0",null,null,{AllowScriptAccess:"always"},null,createjs.proxy(this._handleSWFReady,this))},_handleSWFReady:function(a){this._flash=a.ref},_handleFlashReady:function(){this.flashReady=!0;for(var a=0,b=this._queuedInstances.length;b>a;a++)this._flash.register(this._queuedInstances[a]);this._queuedInstances.length=0;for(var c in this._flashPreloadInstances)this._flashPreloadInstances[c].initialize(this._flash);for(var c in this._preloadInstances)this._preloadInstances[c].initialize(this._flash);this._preloadInstances={};for(var c in this._flashInstances)this._flashInstances[c].initialize(this._flash)},register:function(a){this._audioSources[a]=!0,this.flashReady?this._flash.register(a):this._queuedInstances.push(a);var b=new createjs.FlashPlugin.Loader(a,this,this._flash);return{tag:b}},removeSound:function(a){delete this._audioSources[a];var b=createjs.indexOf(this._queuedInstances,a);-1!=b&&this._queuedInstances.splice(b,1)},removeAllSounds:function(){this._audioSources={},this._queuedInstances.length=0,this._flashInstances={},this._flashPreloadInstances={},this._preloadInstances={}},create:function(a){this.isPreloadStarted(a)||this.preload(a);try{var b=new createjs.FlashPlugin.SoundInstance(a,this,this._flash,this._audioSources[a]);return b}catch(c){}return null},isPreloadStarted:function(a){return null!=this._audioSources[a]},preload:function(a){this._audioSources[a]=!0;var b=new createjs.FlashPlugin.Loader(a,this,this._flash);b.load()},_registerLoadedSrc:function(a,b){this._audioSources[b]=a},setVolume:function(a){return this._volume=a,this._updateVolume()},_updateVolume:function(){var a=createjs.Sound._masterMute?0:this._volume;return this._flash.setMasterVolume(a)},getVolume:function(){return this._volume},setMute:function(){return this._updateVolume()},registerPreloadInstance:function(a,b){this._flashPreloadInstances[a]=b},unregisterPreloadInstance:function(a){delete this._flashPreloadInstances[a]},registerSoundInstance:function(a,b){this._flashInstances[a]=b},unregisterSoundInstance:function(a){delete this._flashInstances[a]},flashLog:function(a){try{this.showOutput&&console.log(a)}catch(b){}},handleSoundEvent:function(a,b){var c=this._flashInstances[a];if(null!=c){for(var d=[],e=2,f=arguments.length;f>e;e++)d.push(arguments[e]);try{0==d.length?c[b]():c[b].apply(c,d)}catch(g){}}},handlePreloadEvent:function(a,b){var c=this._flashPreloadInstances[a];if(null!=c){for(var d=[],e=2,f=arguments.length;f>e;e++)d.push(arguments[e]);try{0==d.length?c[b]():c[b].apply(c,d)}catch(g){}}},handleEvent:function(a){switch(a){case"ready":clearTimeout(this.loadTimeout),this._handleFlashReady()}},handleErrorEvent:function(){},toString:function(){return"[FlashPlugin]"}},createjs.FlashPlugin=a}(),function(){"use strict";function a(a,b,c,d){this._init(a,b,c,d)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.flashSrc=null,b.uniqueId=-1,b._owner=null,b._capabilities=null,b._flash=null,b.flashId=null,b.loop=0,b._volume=1,b._pan=0,b._offset=0,b._delay=0,b._duration=0,b._delayTimeoutId=null,b._muted=!1,b._paused=!1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){return null!=Number(a)?(a=Math.max(0,Math.min(1,a)),this._volume=a,this._flash.setVolume(this.flashId,a)):void 0}}),Object.defineProperty(b,"pan",{get:function(){return this._pan},set:function(a){return null!=Number(a)?(a=Math.max(-1,Math.min(1,a)),this._pan=a,this._flash.setPan(this.flashId,a)):void 0}})}catch(c){}b._init=function(a,b,c,d){this.src=a,this.flashSrc=d,this._owner=b,this._flash=c},b.initialize=function(a){this._flash=a},b._interrupt=function(){this.playState=createjs.Sound.PLAY_INTERRUPTED,this._flash.interrupt(this.flashId),this._cleanUp(),this._paused=!1,this._sendEvent("interrupted")},b._cleanUp=function(){clearTimeout(this._delayTimeoutId),this._owner.unregisterSoundInstance(this.flashId),createjs.Sound._playFinished(this)},b.play=function(a,b,c,d,e,f){createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){return this.loop=b,this._paused=!1,this._owner.flashReady?(this._offset=a,this.flashId=this._flash.playSound(this.flashSrc,a,b,c,d),null==this.flashId?(this._cleanUp(),!1):(this._muted&&this.setMute(!0),this.playState=createjs.Sound.PLAY_SUCCEEDED,this._owner.registerSoundInstance(this.flashId,this),this._sendEvent("succeeded"),!0)):!1},b.playFailed=function(){this.playState=createjs.Sound.PLAY_FAILED,this._cleanUp(),this._sendEvent("failed")},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED?!1:(this._paused=!0,clearTimeout(this._delayTimeoutId),this._flash.pauseSound(this.flashId))},b.resume=function(){return this._paused?(this._paused=!1,this._flash.resumeSound(this.flashId)):!1},b.stop=function(){this.playState=createjs.Sound.PLAY_FINISHED,this._paused=!1,this._offset=0;var a=this._flash.stopSound(this.flashId);return this._cleanUp(),a},b.setVolume=function(a){return null!=Number(a)?(a=Math.max(0,Math.min(1,a)),this._volume=a,this._flash.setVolume(this.flashId,a)):void 0},b.getVolume=function(){return this._volume},b.setMute=function(a){return this._muted=a,a?this._flash.muteSound(this.flashId):this._flash.unmuteSound(this.flashId)},b.getMute=function(){return this._muted},b.getPan=function(){return this._pan},b.setPan=function(a){return null!=Number(a)?(a=Math.max(-1,Math.min(1,a)),this._pan=a,this._flash.setPan(this.flashId,a)):void 0},b.getPosition=function(){var a=-1;return this._flash&&this.flashId&&(a=this._flash.getPosition(this.flashId)),-1!=a&&(this._offset=a),this._offset},b.setPosition=function(a){return this._offset=a,this._flash&&this.flashId&&this._flash.setPosition(this.flashId,a),!0},b.getDuration=function(){var a=-1;return this._flash&&this.flashId&&(a=this._flash.getDuration(this.flashId)),-1!=a&&(this._duration=a),this._duration},b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b.handleSoundFinished=function(){this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),this._sendEvent("complete")},b.handleSoundLoop=function(){this._sendEvent("loop")},b.toString=function(){return"[FlashPlugin SoundInstance]"},createjs.FlashPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b,c){this._init(a,b,c)}var b=a.prototype;b._flash=null,b.src=null,b.originalSrc=null,b.flashId=null,b.progress=-1,b.readyState=0,b.loading=!1,b.owner=null,b.onload=null,b.onprogress=null,b.onerror=null,b._init=function(a,b,c){this.src=a,this.originalSrc=a,this.owner=b,this._flash=c},b.initialize=function(a){this._flash=a,this.loading&&(this.loading=!1,this.load(this.src))},b.load=function(a){return null!=a&&(this.src=a),null!=this._flash&&this.owner.flashReady?(this.flashId=this._flash.preload(this.src),this.owner.registerPreloadInstance(this.flashId,this),!0):(this.loading=!0,this.owner._preloadInstances[this.src]=this,!1)},b.handleProgress=function(a,b){this.progress=a/b,this.onprogress&&this.onprogress({loaded:a,total:b,progress:this.progress})},b.handleComplete=function(){this.progress=1,this.readyState=4,this.owner._registerLoadedSrc(this.src,this.originalSrc),createjs.Sound._sendFileLoadEvent(this.originalSrc),this.onload&&this.onload()},b.handleError=function(a){this.onerror&&this.onerror(a)},b.toString=function(){return"[FlashPlugin Loader]"},createjs.FlashPlugin.Loader=a}(),this.createjs=this.createjs||{},function(){var a=createjs.FlashPlugin=createjs.FlashPlugin||{};a.version="NEXT",a.buildDate="Fri, 11 Jan 2013 22:39:59 GMT"}();
;/* build: `node build.js modules=ALL exclude=gestures,cufon,json minifier=uglifyjs` *//*! Fabric.js Copyright 2008-2014, Printio (Juriy Zaytsev, Maxim Chernyak) */var fabric=fabric||{version:"1.4.10"};typeof exports!="undefined"&&(exports.fabric=fabric),typeof document!="undefined"&&typeof window!="undefined"?(fabric.document=document,fabric.window=window):(fabric.document=require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"),fabric.window=fabric.document.createWindow()),fabric.isTouchSupported="ontouchstart"in fabric.document.documentElement,fabric.isLikelyNode=typeof Buffer!="undefined"&&typeof window=="undefined",fabric.SHARED_ATTRIBUTES=["display","transform","fill","fill-opacity","fill-rule","opacity","stroke","stroke-dasharray","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width"],fabric.DPI=96,function(){function e(e,t){if(!this.__eventListeners[e])return;t?fabric.util.removeFromArray(this.__eventListeners[e],t):this.__eventListeners[e].length=0}function t(e,t){this.__eventListeners||(this.__eventListeners={});if(arguments.length===1)for(var n in e)this.on(n,e[n]);else this.__eventListeners[e]||(this.__eventListeners[e]=[]),this.__eventListeners[e].push(t);return this}function n(t,n){if(!this.__eventListeners)return;if(arguments.length===0)this.__eventListeners={};else if(arguments.length===1&&typeof arguments[0]=="object")for(var r in t)e.call(this,r,t[r]);else e.call(this,t,n);return this}function r(e,t){if(!this.__eventListeners)return;var n=this.__eventListeners[e];if(!n)return;for(var r=0,i=n.length;r<i;r++)n[r].call(this,t||{});return this}fabric.Observable={observe:t,stopObserving:n,fire:r,on:t,off:n,trigger:r}}(),fabric.Collection={add:function(){this._objects.push.apply(this._objects,arguments);for(var e=0,t=arguments.length;e<t;e++)this._onObjectAdded(arguments[e]);return this.renderOnAddRemove&&this.renderAll(),this},insertAt:function(e,t,n){var r=this.getObjects();return n?r[t]=e:r.splice(t,0,e),this._onObjectAdded(e),this.renderOnAddRemove&&this.renderAll(),this},remove:function(){var e=this.getObjects(),t;for(var n=0,r=arguments.length;n<r;n++)t=e.indexOf(arguments[n]),t!==-1&&(e.splice(t,1),this._onObjectRemoved(arguments[n]));return this.renderOnAddRemove&&this.renderAll(),this},forEachObject:function(e,t){var n=this.getObjects(),r=n.length;while(r--)e.call(t,n[r],r,n);return this},getObjects:function(e){return typeof e=="undefined"?this._objects:this._objects.filter(function(t){return t.type===e})},item:function(e){return this.getObjects()[e]},isEmpty:function(){return this.getObjects().length===0},size:function(){return this.getObjects().length},contains:function(e){return this.getObjects().indexOf(e)>-1},complexity:function(){return this.getObjects().reduce(function(e,t){return e+=t.complexity?t.complexity():0,e},0)}},function(e){var t=Math.sqrt,n=Math.atan2,r=Math.PI/180;fabric.util={removeFromArray:function(e,t){var n=e.indexOf(t);return n!==-1&&e.splice(n,1),e},getRandomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e},degreesToRadians:function(e){return e*r},radiansToDegrees:function(e){return e/r},rotatePoint:function(e,t,n){var r=Math.sin(n),i=Math.cos(n);e.subtractEquals(t);var s=e.x*i-e.y*r,o=e.x*r+e.y*i;return(new fabric.Point(s,o)).addEquals(t)},transformPoint:function(e,t,n){return n?new fabric.Point(t[0]*e.x+t[1]*e.y,t[2]*e.x+t[3]*e.y):new fabric.Point(t[0]*e.x+t[1]*e.y+t[4],t[2]*e.x+t[3]*e.y+t[5])},invertTransform:function(e){var t=e.slice(),n=1/(e[0]*e[3]-e[1]*e[2]);t=[n*e[3],-n*e[1],-n*e[2],n*e[0],0,0];var r=fabric.util.transformPoint({x:e[4],y:e[5]},t);return t[4]=-r.x,t[5]=-r.y,t},toFixed:function(e,t){return parseFloat(Number(e).toFixed(t))},parseUnit:function(e){var t=/\D{0,2}$/.exec(e),n=parseFloat(e);switch(t[0]){case"mm":return n*fabric.DPI/25.4;case"cm":return n*fabric.DPI/2.54;case"in":return n*fabric.DPI;case"pt":return n*fabric.DPI/72;case"pc":return n*fabric.DPI/72*12;default:return n}},falseFunction:function(){return!1},getKlass:function(e,t){return e=fabric.util.string.camelize(e.charAt(0).toUpperCase()+e.slice(1)),fabric.util.resolveNamespace(t)[e]},resolveNamespace:function(t){if(!t)return fabric;var n=t.split("."),r=n.length,i=e||fabric.window;for(var s=0;s<r;++s)i=i[n[s]];return i},loadImage:function(e,t,n,r){if(!e){t&&t.call(n,e);return}var i=fabric.util.createImage();i.onload=function(){t&&t.call(n,i),i=i.onload=i.onerror=null},i.onerror=function(){fabric.log("Error loading "+i.src),t&&t.call(n,null,!0),i=i.onload=i.onerror=null},e.indexOf("data")!==0&&typeof r!="undefined"&&(i.crossOrigin=r),i.src=e},enlivenObjects:function(e,t,n,r){function i(){++o===u&&t&&t(s)}e=e||[];var s=[],o=0,u=e.length;if(!u){t&&t(s);return}e.forEach(function(e,t){if(!e||!e.type){i();return}var o=fabric.util.getKlass(e.type,n);o.async?o.fromObject(e,function(n,o){o||(s[t]=n,r&&r(e,s[t])),i()}):(s[t]=o.fromObject(e),r&&r(e,s[t]),i())})},groupSVGElements:function(e,t,n){var r;return r=new fabric.PathGroup(e,t),typeof n!="undefined"&&r.setSourcePath(n),r},populateWithProperties:function(e,t,n){if(n&&Object.prototype.toString.call(n)==="[object Array]")for(var r=0,i=n.length;r<i;r++)n[r]in e&&(t[n[r]]=e[n[r]])},drawDashedLine:function(e,r,i,s,o,u){var a=s-r,f=o-i,l=t(a*a+f*f),c=n(f,a),h=u.length,p=0,d=!0;e.save(),e.translate(r,i),e.moveTo(0,0),e.rotate(c),r=0;while(l>r)r+=u[p++%h],r>l&&(r=l),e[d?"lineTo":"moveTo"](r,0),d=!d;e.restore()},createCanvasElement:function(e){return e||(e=fabric.document.createElement("canvas")),!e.getContext&&typeof G_vmlCanvasManager!="undefined"&&G_vmlCanvasManager.initElement(e),e},createImage:function(){return fabric.isLikelyNode?new(require("canvas").Image):fabric.document.createElement("img")},createAccessors:function(e){var t=e.prototype;for(var n=t.stateProperties.length;n--;){var r=t.stateProperties[n],i=r.charAt(0).toUpperCase()+r.slice(1),s="set"+i,o="get"+i;t[o]||(t[o]=function(e){return new Function('return this.get("'+e+'")')}(r)),t[s]||(t[s]=function(e){return new Function("value",'return this.set("'+e+'", value)')}(r))}},clipContext:function(e,t){t.save(),t.beginPath(),e.clipTo(t),t.clip()},multiplyTransformMatrices:function(e,t){var n=[[e[0],e[2],e[4]],[e[1],e[3],e[5]],[0,0,1]],r=[[t[0],t[2],t[4]],[t[1],t[3],t[5]],[0,0,1]],i=[];for(var s=0;s<3;s++){i[s]=[];for(var o=0;o<3;o++){var u=0;for(var a=0;a<3;a++)u+=n[s][a]*r[a][o];i[s][o]=u}}return[i[0][0],i[1][0],i[0][1],i[1][1],i[0][2],i[1][2]]},getFunctionBody:function(e){return(String(e).match(/function[^{]*\{([\s\S]*)\}/)||{})[1]},normalizePoints:function(e,t){var n=fabric.util.array.min(e,"x"),r=fabric.util.array.min(e,"y");n=n<0?n:0,r=n<0?r:0;for(var i=0,s=e.length;i<s;i++)e[i].x-=t.width/2+n||0,e[i].y-=t.height/2+r||0},isTransparent:function(e,t,n,r){r>0&&(t>r?t-=r:t=0,n>r?n-=r:n=0);var i=!0,s=e.getImageData(t,n,r*2||1,r*2||1);for(var o=3,u=s.data.length;o<u;o+=4){var a=s.data[o];i=a<=0;if(i===!1)break}return s=null,i}}}(typeof exports!="undefined"?exports:this),function(){function i(t,i,o,u,a,f,l,c,h){r=n.call(arguments);if(e[r])return e[r];var p=s(l,o,u,c,h,t,i),d=(p.x1-p.x0)*(p.x1-p.x0)+(p.y1-p.y0)*(p.y1-p.y0),v=1/d-.25;v<0&&(v=0);var m=Math.sqrt(v);f===a&&(m=-m);var g=.5*(p.x0+p.x1)-m*(p.y1-p.y0),y=.5*(p.y0+p.y1)+m*(p.x1-p.x0),b=Math.atan2(p.y0-y,p.x0-g),w=Math.atan2(p.y1-y,p.x1-g),E=w-b;E<0&&f===1?E+=2*Math.PI:E>0&&f===0&&(E-=2*Math.PI);var S=Math.ceil(Math.abs(E/(Math.PI*.5+.001))),x=[];for(var T=0;T<S;T++){var N=b+T*E/S,C=b+(T+1)*E/S;x[T]=[g,y,N,C,o,u,p.sinTh,p.cosTh]}return e[r]=x,x}function s(e,t,n,r,i,s,o){var u=e*(Math.PI/180),a=Math.sin(u),f=Math.cos(u);t=Math.abs(t),n=Math.abs(n);var l=f*(r-s)+a*(i-o),c=f*(i-o)-a*(r-s),h=l*l/(t*t)+c*c/(n*n);h*=.25,h>1&&(h=Math.sqrt(h),t*=h,n*=h);var p=f/t,d=a/t,v=-a/n,m=f/n;return{x0:p*r+d*i,y0:v*r+m*i,x1:p*s+d*o,y1:v*s+m*o,sinTh:a,cosTh:f}}function o(e,i,s,o,u,a,f,l){r=n.call(arguments);if(t[r])return t[r];var c=Math.sin(s),h=Math.cos(s),p=Math.sin(o),d=Math.cos(o),v=l*u,m=-f*a,g=f*u,y=l*a,b=.25*(o-s),w=8/3*Math.sin(b)*Math.sin(b)/Math.sin(b*2),E=e+h-w*c,S=i+c+w*h,x=e+d,T=i+p,N=x+w*p,C=T-w*d;return t[r]=[v*E+m*S,g*E+y*S,v*N+m*C,g*N+y*C,v*x+m*T,g*x+y*T],t[r]}var e={},t={},n=Array.prototype.join,r;fabric.util.drawArc=function(e,t,n,r){var s=r[0],u=r[1],a=r[2],f=r[3],l=r[4],c=r[5],h=r[6],p=i(c,h,s,u,f,l,a,t,n);for(var d=0;d<p.length;d++){var v=o.apply(this,p[d]);e.bezierCurveTo.apply(e,v)}}}(),function(){function t(t,n){var r=e.call(arguments,2),i=[];for(var s=0,o=t.length;s<o;s++)i[s]=r.length?t[s][n].apply(t[s],r):t[s][n].call(t[s]);return i}function n(e,t){return i(e,t,function(e,t){return e>=t})}function r(e,t){return i(e,t,function(e,t){return e<t})}function i(e,t,n){if(!e||e.length===0)return;var r=e.length-1,i=t?e[r][t]:e[r];if(t)while(r--)n(e[r][t],i)&&(i=e[r][t]);else while(r--)n(e[r],i)&&(i=e[r]);return i}var e=Array.prototype.slice;Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(this===void 0||this===null)throw new TypeError;var t=Object(this),n=t.length>>>0;if(n===0)return-1;var r=0;arguments.length>0&&(r=Number(arguments[1]),r!==r?r=0:r!==0&&r!==Number.POSITIVE_INFINITY&&r!==Number.NEGATIVE_INFINITY&&(r=(r>0||-1)*Math.floor(Math.abs(r))));if(r>=n)return-1;var i=r>=0?r:Math.max(n-Math.abs(r),0);for(;i<n;i++)if(i in t&&t[i]===e)return i;return-1}),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)n in this&&e.call(t,this[n],n,this)}),Array.prototype.map||(Array.prototype.map=function(e,t){var n=[];for(var r=0,i=this.length>>>0;r<i;r++)r in this&&(n[r]=e.call(t,this[r],r,this));return n}),Array.prototype.every||(Array.prototype.every=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)if(n in this&&!e.call(t,this[n],n,this))return!1;return!0}),Array.prototype.some||(Array.prototype.some=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)if(n in this&&e.call(t,this[n],n,this))return!0;return!1}),Array.prototype.filter||(Array.prototype.filter=function(e,t){var n=[],r;for(var i=0,s=this.length>>>0;i<s;i++)i in this&&(r=this[i],e.call(t,r,i,this)&&n.push(r));return n}),Array.prototype.reduce||(Array.prototype.reduce=function(e){var t=this.length>>>0,n=0,r;if(arguments.length>1)r=arguments[1];else do{if(n in this){r=this[n++];break}if(++n>=t)throw new TypeError}while(!0);for(;n<t;n++)n in this&&(r=e.call(null,r,this[n],n,this));return r}),fabric.util.array={invoke:t,min:r,max:n}}(),function(){function e(e,t){for(var n in t)e[n]=t[n];return e}function t(t){return e({},t)}fabric.util.object={extend:e,clone:t}}(),function(){function e(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})}function t(e,t){return e.charAt(0).toUpperCase()+(t?e.slice(1):e.slice(1).toLowerCase())}function n(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\xA0]+/,"").replace(/[\s\xA0]+$/,"")}),fabric.util.string={camelize:e,capitalize:t,escapeXml:n}}(),function(){var e=Array.prototype.slice,t=Function.prototype.apply,n=function(){};Function.prototype.bind||(Function.prototype.bind=function(r){var i=this,s=e.call(arguments,1),o;return s.length?o=function(){return t.call(i,this instanceof n?this:r,s.concat(e.call(arguments)))}:o=function(){return t.call(i,this instanceof n?this:r,arguments)},n.prototype=this.prototype,o.prototype=new n,o})}(),function(){function i(){}function s(t){var n=this.constructor.superclass.prototype[t];return arguments.length>1?n.apply(this,e.call(arguments,1)):n.call(this)}function o(){function u(){this.initialize.apply(this,arguments)}var n=null,o=e.call(arguments,0);typeof o[0]=="function"&&(n=o.shift()),u.superclass=n,u.subclasses=[],n&&(i.prototype=n.prototype,u.prototype=new i,n.subclasses.push(u));for(var a=0,f=o.length;a<f;a++)r(u,o[a],n);return u.prototype.initialize||(u.prototype.initialize=t),u.prototype.constructor=u,u.prototype.callSuper=s,u}var e=Array.prototype.slice,t=function(){},n=function(){for(var e in{toString:1})if(e==="toString")return!1;return!0}(),r=function(e,t,r){for(var i in t)i in e.prototype&&typeof e.prototype[i]=="function"&&(t[i]+"").indexOf("callSuper")>-1?e.prototype[i]=function(e){return function(){var n=this.constructor.superclass;this.constructor.superclass=r;var i=t[e].apply(this,arguments);this.constructor.superclass=n;if(e!=="initialize")return i}}(i):e.prototype[i]=t[i],n&&(t.toString!==Object.prototype.toString&&(e.prototype.toString=t.toString),t.valueOf!==Object.prototype.valueOf&&(e.prototype.valueOf=t.valueOf))};fabric.util.createClass=o}(),function(){function t(e){var t=Array.prototype.slice.call(arguments,1),n,r,i=t.length;for(r=0;r<i;r++){n=typeof e[t[r]];if(!/^(?:function|object|unknown)$/.test(n))return!1}return!0}function s(e,t){return{handler:t,wrappedHandler:o(e,t)}}function o(e,t){return function(r){t.call(n(e),r||fabric.window.event)}}function u(e,t){return function(n){if(c[e]&&c[e][t]){var r=c[e][t];for(var i=0,s=r.length;i<s;i++)r[i].call(this,n||fabric.window.event)}}}function d(t,n){t||(t=fabric.window.event);var r=t.target||(typeof t.srcElement!==e?t.srcElement:null),i=fabric.util.getScrollLeftTop(r,n);return{x:v(t)+i.left,y:m(t)+i.top}}function g(e,t,n){var r=e.type==="touchend"?"changedTouches":"touches";return e[r]&&e[r][0]?e[r][0][t]-(e[r][0][t]-e[r][0][n])||e[n]:e[n]}var e="unknown",n,r,i=function(){var e=0;return function(t){return t.__uniqueID||(t.__uniqueID="uniqueID__"+e++)}}();(function(){var e={};n=function(t){return e[t]},r=function(t,n){e[t]=n}})();var a=t(fabric.document.documentElement,"addEventListener","removeEventListener")&&t(fabric.window,"addEventListener","removeEventListener"),f=t(fabric.document.documentElement,"attachEvent","detachEvent")&&t(fabric.window,"attachEvent","detachEvent"),l={},c={},h,p;a?(h=function(e,t,n){e.addEventListener(t,n,!1)},p=function(e,t,n){e.removeEventListener(t,n,!1)}):f?(h=function(e,t,n){var o=i(e);r(o,e),l[o]||(l[o]={}),l[o][t]||(l[o][t]=[]);var u=s(o,n);l[o][t].push(u),e.attachEvent("on"+t,u.wrappedHandler)},p=function(e,t,n){var r=i(e),s;if(l[r]&&l[r][t])for(var o=0,u=l[r][t].length;o<u;o++)s=l[r][t][o],s&&s.handler===n&&(e.detachEvent("on"+t,s.wrappedHandler),l[r][t][o]=null)}):(h=function(e,t,n){var r=i(e);c[r]||(c[r]={});if(!c[r][t]){c[r][t]=[];var s=e["on"+t];s&&c[r][t].push(s),e["on"+t]=u(r,t)}c[r][t].push(n)},p=function(e,t,n){var r=i(e);if(c[r]&&c[r][t]){var s=c[r][t];for(var o=0,u=s.length;o<u;o++)s[o]===n&&s.splice(o,1)}}),fabric.util.addListener=h,fabric.util.removeListener=p;var v=function(t){return typeof t.clientX!==e?t.clientX:0},m=function(t){return typeof t.clientY!==e?t.clientY:0};fabric.isTouchSupported&&(v=function(e){return g(e,"pageX","clientX")},m=function(e){return g(e,"pageY","clientY")}),fabric.util.getPointer=d,fabric.util.object.extend(fabric.util,fabric.Observable)}(),function(){function e(e,t){var n=e.style;if(!n)return e;if(typeof t=="string")return e.style.cssText+=";"+t,t.indexOf("opacity")>-1?s(e,t.match(/opacity:\s*(\d?\.?\d*)/)[1]):e;for(var r in t)if(r==="opacity")s(e,t[r]);else{var i=r==="float"||r==="cssFloat"?typeof n.styleFloat=="undefined"?"cssFloat":"styleFloat":r;n[i]=t[r]}return e}var t=fabric.document.createElement("div"),n=typeof t.style.opacity=="string",r=typeof t.style.filter=="string",i=/alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,s=function(e){return e};n?s=function(e,t){return e.style.opacity=t,e}:r&&(s=function(e,t){var n=e.style;return e.currentStyle&&!e.currentStyle.hasLayout&&(n.zoom=1),i.test(n.filter)?(t=t>=.9999?"":"alpha(opacity="+t*100+")",n.filter=n.filter.replace(i,t)):n.filter+=" alpha(opacity="+t*100+")",e}),fabric.util.setStyle=e}(),function(){function t(e){return typeof e=="string"?fabric.document.getElementById(e):e}function s(e,t){var n=fabric.document.createElement(e);for(var r in t)r==="class"?n.className=t[r]:r==="for"?n.htmlFor=t[r]:n.setAttribute(r,t[r]);return n}function o(e,t){e&&(" "+e.className+" ").indexOf(" "+t+" ")===-1&&(e.className+=(e.className?" ":"")+t)}function u(e,t,n){return typeof t=="string"&&(t=s(t,n)),e.parentNode&&e.parentNode.replaceChild(t,e),t.appendChild(e),t}function a(e,t){var n,r,i=0,s=0,o=fabric.document.documentElement,u=fabric.document.body||{scrollLeft:0,scrollTop:0};r=e;while(e&&e.parentNode&&!n)e=e.parentNode,e!==fabric.document&&fabric.util.getElementStyle(e,"position")==="fixed"&&(n=e),e!==fabric.document&&r!==t&&fabric.util.getElementStyle(e,"position")==="absolute"?(i=0,s=0):e===fabric.document?(i=u.scrollLeft||o.scrollLeft||0,s=u.scrollTop||o.scrollTop||0):(i+=e.scrollLeft||0,s+=e.scrollTop||0);return{left:i,top:s}}function f(e){var t,n=e&&e.ownerDocument,r={left:0,top:0},i={left:0,top:0},s,o={borderLeftWidth:"left",borderTopWidth:"top",paddingLeft:"left",paddingTop:"top"};if(!n)return{left:0,top:0};for(var u in o)i[o[u]]+=parseInt(l(e,u),10)||0;return t=n.documentElement,typeof e.getBoundingClientRect!="undefined"&&(r=e.getBoundingClientRect()),s=fabric.util.getScrollLeftTop(e,null),{left:r.left+s.left-(t.clientLeft||0)+i.left,top:r.top+s.top-(t.clientTop||0)+i.top}}var e=Array.prototype.slice,n,r=function(t){return e.call(t,0)};try{n=r(fabric.document.childNodes)instanceof Array}catch(i){}n||(r=function(e){var t=new Array(e.length),n=e.length;while(n--)t[n]=e[n];return t});var l;fabric.document.defaultView&&fabric.document.defaultView.getComputedStyle?l=function(e,t){return fabric.document.defaultView.getComputedStyle(e,null)[t]}:l=function(e,t){var n=e.style[t];return!n&&e.currentStyle&&(n=e.currentStyle[t]),n},function(){function n(e){return typeof e.onselectstart!="undefined"&&(e.onselectstart=fabric.util.falseFunction),t?e.style[t]="none":typeof e.unselectable=="string"&&(e.unselectable="on"),e}function r(e){return typeof e.onselectstart!="undefined"&&(e.onselectstart=null),t?e.style[t]="":typeof e.unselectable=="string"&&(e.unselectable=""),e}var e=fabric.document.documentElement.style,t="userSelect"in e?"userSelect":"MozUserSelect"in e?"MozUserSelect":"WebkitUserSelect"in e?"WebkitUserSelect":"KhtmlUserSelect"in e?"KhtmlUserSelect":"";fabric.util.makeElementUnselectable=n,fabric.util.makeElementSelectable=r}(),function(){function e(e,t){var n=fabric.document.getElementsByTagName("head")[0],r=fabric.document.createElement("script"),i=!0;r.onload=r.onreadystatechange=function(e){if(i){if(typeof this.readyState=="string"&&this.readyState!=="loaded"&&this.readyState!=="complete")return;i=!1,t(e||fabric.window.event),r=r.onload=r.onreadystatechange=null}},r.src=e,n.appendChild(r)}fabric.util.getScript=e}(),fabric.util.getById=t,fabric.util.toArray=r,fabric.util.makeElement=s,fabric.util.addClass=o,fabric.util.wrapElement=u,fabric.util.getScrollLeftTop=a,fabric.util.getElementOffset=f,fabric.util.getElementStyle=l}(),function(){function e(e,t){return e+(/\?/.test(e)?"&":"?")+t}function n(){}function r(r,i){i||(i={});var s=i.method?i.method.toUpperCase():"GET",o=i.onComplete||function(){},u=t(),a;return u.onreadystatechange=function(){u.readyState===4&&(o(u),u.onreadystatechange=n)},s==="GET"&&(a=null,typeof i.parameters=="string"&&(r=e(r,i.parameters))),u.open(s,r,!0),(s==="POST"||s==="PUT")&&u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.send(a),u}var t=function(){var e=[function(){return new ActiveXObject("Microsoft.XMLHTTP")},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml2.XMLHTTP.3.0")},function(){return new XMLHttpRequest}];for(var t=e.length;t--;)try{var n=e[t]();if(n)return e[t]}catch(r){}}();fabric.util.request=r}(),fabric.log=function(){},fabric.warn=function(){},typeof console!="undefined"&&["log","warn"].forEach(function(e){typeof console[e]!="undefined"&&console[e].apply&&(fabric[e]=function(){return console[e].apply(console,arguments)})}),function(){function e(e){n(function(t){e||(e={});var r=t||+(new Date),i=e.duration||500,s=r+i,o,u=e.onChange||function(){},a=e.abort||function(){return!1},f=e.easing||function(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t},l="startValue"in e?e.startValue:0,c="endValue"in e?e.endValue:100,h=e.byValue||c-l;e.onStart&&e.onStart(),function p(t){o=t||+(new Date);var c=o>s?i:o-r;if(a()){e.onComplete&&e.onComplete();return}u(f(c,l,h,i));if(o>s){e.onComplete&&e.onComplete();return}n(p)}(r)})}function n(){return t.apply(fabric.window,arguments)}var t=fabric.window.requestAnimationFrame||fabric.window.webkitRequestAnimationFrame||fabric.window.mozRequestAnimationFrame||fabric.window.oRequestAnimationFrame||fabric.window.msRequestAnimationFrame||function(e){fabric.window.setTimeout(e,1e3/60)};fabric.util.animate=e,fabric.util.requestAnimFrame=n}(),function(){function e(e,t,n,r){return e<Math.abs(t)?(e=t,r=n/4):r=n/(2*Math.PI)*Math.asin(t/e),{a:e,c:t,p:n,s:r}}function t(e,t,n){return e.a*Math.pow(2,10*(t-=1))*Math.sin((t*n-e.s)*2*Math.PI/e.p)}function n(e,t,n,r){return n*((e=e/r-1)*e*e+1)+t}function r(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e+t:n/2*((e-=2)*e*e+2)+t}function i(e,t,n,r){return n*(e/=r)*e*e*e+t}function s(e,t,n,r){return-n*((e=e/r-1)*e*e*e-1)+t}function o(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e*e+t:-n/2*((e-=2)*e*e*e-2)+t}function u(e,t,n,r){return n*(e/=r)*e*e*e*e+t}function a(e,t,n,r){return n*((e=e/r-1)*e*e*e*e+1)+t}function f(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e*e*e+t:n/2*((e-=2)*e*e*e*e+2)+t}function l(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t}function c(e,t,n,r){return n*Math.sin(e/r*(Math.PI/2))+t}function h(e,t,n,r){return-n/2*(Math.cos(Math.PI*e/r)-1)+t}function p(e,t,n,r){return e===0?t:n*Math.pow(2,10*(e/r-1))+t}function d(e,t,n,r){return e===r?t+n:n*(-Math.pow(2,-10*e/r)+1)+t}function v(e,t,n,r){return e===0?t:e===r?t+n:(e/=r/2,e<1?n/2*Math.pow(2,10*(e-1))+t:n/2*(-Math.pow(2,-10*--e)+2)+t)}function m(e,t,n,r){return-n*(Math.sqrt(1-(e/=r)*e)-1)+t}function g(e,t,n,r){return n*Math.sqrt(1-(e=e/r-1)*e)+t}function y(e,t,n,r){return e/=r/2,e<1?-n/2*(Math.sqrt(1-e*e)-1)+t:n/2*(Math.sqrt(1-(e-=2)*e)+1)+t}function b(n,r,i,s){var o=1.70158,u=0,a=i;if(n===0)return r;n/=s;if(n===1)return r+i;u||(u=s*.3);var f=e(a,i,u,o);return-t(f,n,s)+r}function w(t,n,r,i){var s=1.70158,o=0,u=r;if(t===0)return n;t/=i;if(t===1)return n+r;o||(o=i*.3);var a=e(u,r,o,s);return a.a*Math.pow(2,-10*t)*Math.sin((t*i-a.s)*2*Math.PI/a.p)+a.c+n}function E(n,r,i,s){var o=1.70158,u=0,a=i;if(n===0)return r;n/=s/2;if(n===2)return r+i;u||(u=s*.3*1.5);var f=e(a,i,u,o);return n<1?-0.5*t(f,n,s)+r:f.a*Math.pow(2,-10*(n-=1))*Math.sin((n*s-f.s)*2*Math.PI/f.p)*.5+f.c+r}function S(e,t,n,r,i){return i===undefined&&(i=1.70158),n*(e/=r)*e*((i+1)*e-i)+t}function x(e,t,n,r,i){return i===undefined&&(i=1.70158),n*((e=e/r-1)*e*((i+1)*e+i)+1)+t}function T(e,t,n,r,i){return i===undefined&&(i=1.70158),e/=r/2,e<1?n/2*e*e*(((i*=1.525)+1)*e-i)+t:n/2*((e-=2)*e*(((i*=1.525)+1)*e+i)+2)+t}function N(e,t,n,r){return n-C(r-e,0,n,r)+t}function C(e,t,n,r){return(e/=r)<1/2.75?n*7.5625*e*e+t:e<2/2.75?n*(7.5625*(e-=1.5/2.75)*e+.75)+t:e<2.5/2.75?n*(7.5625*(e-=2.25/2.75)*e+.9375)+t:n*(7.5625*(e-=2.625/2.75)*e+.984375)+t}function k(e,t,n,r){return e<r/2?N(e*2,0,n,r)*.5+t:C(e*2-r,0,n,r)*.5+n*.5+t}fabric.util.ease={easeInQuad:function(e,t,n,r){return n*(e/=r)*e+t},easeOutQuad:function(e,t,n,r){return-n*(e/=r)*(e-2)+t},easeInOutQuad:function(e,t,n,r){return e/=r/2,e<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t},easeInCubic:function(e,t,n,r){return n*(e/=r)*e*e+t},easeOutCubic:n,easeInOutCubic:r,easeInQuart:i,easeOutQuart:s,easeInOutQuart:o,easeInQuint:u,easeOutQuint:a,easeInOutQuint:f,easeInSine:l,easeOutSine:c,easeInOutSine:h,easeInExpo:p,easeOutExpo:d,easeInOutExpo:v,easeInCirc:m,easeOutCirc:g,easeInOutCirc:y,easeInElastic:b,easeOutElastic:w,easeInOutElastic:E,easeInBack:S,easeOutBack:x,easeInOutBack:T,easeInBounce:N,easeOutBounce:C,easeInOutBounce:k}}(),function(e){"use strict";function l(e){return e in a?a[e]:e}function c(e,n,r){var i=Object.prototype.toString.call(n)==="[object Array]",s;return e!=="fill"&&e!=="stroke"||n!=="none"?e==="fillRule"?n=n==="evenodd"?"destination-over":n:e==="strokeDashArray"?n=n.replace(/,/g," ").split(/\s+/).map(function(e){return parseInt(e)}):e==="transformMatrix"?r&&r.transformMatrix?n=u(r.transformMatrix,t.parseTransformAttribute(n)):n=t.parseTransformAttribute(n):e==="visible"?(n=n==="none"||n==="hidden"?!1:!0,r&&r.visible===!1&&(n=!1)):e==="originX"?n=n==="start"?"left":n==="end"?"right":"center":s=i?n.map(o):o(n):n="",!i&&isNaN(s)?n:s}function h(e){for(var n in f){if(!e[n]||typeof e[f[n]]=="undefined")continue;if(e[n].indexOf("url(")===0)continue;var r=new t.Color(e[n]);e[n]=r.setAlpha(s(r.getAlpha()*e[f[n]],2)).toRgba()}return e}function p(e,t){var n=e.match(/(normal|italic)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)px(?:\/(normal|[\d\.]+))?\s+(.*)/);if(!n)return;var r=n[1],i=n[3],s=n[4],o=n[5],u=n[6];r&&(t.fontStyle=r),i&&(t.fontWeight=isNaN(parseFloat(i))?i:parseFloat(i)),s&&(t.fontSize=parseFloat(s)),u&&(t.fontFamily=u),o&&(t.lineHeight=o==="normal"?1:o)}function d(e,t){var n,r;e.replace(/;$/,"").split(";").forEach(function(e){var i=e.split(":");n=l(i[0].trim().toLowerCase()),r=c(n,i[1].trim()),n==="font"?p(r,t):t[n]=r})}function v(e,t){var n,r;for(var i in e){if(typeof e[i]=="undefined")continue;n=l(i.toLowerCase()),r=c(n,e[i]),n==="font"?p(r,t):t[n]=r}}function m(e){var n={};for(var r in t.cssRules)if(g(e,r.split(" ")))for(var i in t.cssRules[r])n[i]=t.cssRules[r][i];return n}function g(e,t){var n,r=!0;return n=b(e,t.pop()),n&&t.length&&(r=y(e,t)),n&&r&&t.length===0}function y(e,t){var n,r=!0;while(e.parentNode&&e.parentNode.nodeType===1&&t.length)r&&(n=t.pop()),e=e.parentNode,r=b(e,n);return t.length===0}function b(e,t){var n=e.nodeName,r=e.getAttribute("class"),i=e.getAttribute("id"),s;s=new RegExp("^"+n,"i"),t=t.replace(s,""),i&&t.length&&(s=new RegExp("#"+i+"(?![a-zA-Z\\-]+)","i"),t=t.replace(s,""));if(r&&t.length){r=r.split(" ");for(var o=r.length;o--;)s=new RegExp("\\."+r[o]+"(?![a-zA-Z\\-]+)","i"),t=t.replace(s,"")}return t.length===0}function w(e){var t=e.getElementsByTagName("use");while(t.length){var n=t[0],r=n.getAttribute("xlink:href").substr(1),i=n.getAttribute("x")||0,s=n.getAttribute("y")||0,o=e.getElementById(r).cloneNode(!0),u=(n.getAttribute("transform")||"")+" translate("+i+", "+s+")",a;for(var f=0,l=n.attributes,c=l.length;f<c;f++){var h=l.item(f);if(h.nodeName==="x"||h.nodeName==="y"||h.nodeName==="xlink:href")continue;h.nodeName==="transform"?u=u+" "+h.nodeValue:o.setAttribute(h.nodeName,h.nodeValue)}o.setAttribute("transform",u),o.removeAttribute("id"),a=n.parentNode,a.replaceChild(o,n)}}function E(e,t){t[3]=t[0]=t[0]>t[3]?t[3]:t[0];if(t[0]===1&&t[3]===1&&t[4]===0&&t[5]===0)return;var n=e.ownerDocument.createElement("g");while(e.firstChild!=null)n.appendChild(e.firstChild);n.setAttribute("transform","matrix("+t[0]+" "+t[1]+" "+t[2]+" "+t[3]+" "+t[4]+" "+t[5]+")"),e.appendChild(n)}function x(e){var n=e.objects,i=e.options;return n=n.map(function(e){return t[r(e.type)].fromObject(e)}),{objects:n,options:i}}function T(e,t,n){t[n]&&t[n].toSVG&&e.push('<pattern x="0" y="0" id="',n,'Pattern" ','width="',t[n].source.width,'" height="',t[n].source.height,'" patternUnits="userSpaceOnUse">','<image x="0" y="0" ','width="',t[n].source.width,'" height="',t[n].source.height,'" xlink:href="',t[n].source.src,'"></image></pattern>')}var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.string.capitalize,i=t.util.object.clone,s=t.util.toFixed,o=t.util.parseUnit,u=t.util.multiplyTransformMatrices,a={cx:"left",x:"left",r:"radius",cy:"top",y:"top",display:"visible",visibility:"visible",transform:"transformMatrix","fill-opacity":"fillOpacity","fill-rule":"fillRule","font-family":"fontFamily","font-size":"fontSize","font-style":"fontStyle","font-weight":"fontWeight","stroke-dasharray":"strokeDashArray","stroke-linecap":"strokeLineCap","stroke-linejoin":"strokeLineJoin","stroke-miterlimit":"strokeMiterLimit","stroke-opacity":"strokeOpacity","stroke-width":"strokeWidth","text-decoration":"textDecoration","text-anchor":"originX"},f={stroke:"strokeOpacity",fill:"fillOpacity"};t.parseTransformAttribute=function(){function e(e,t){var n=t[0];e[0]=Math.cos(n),e[1]=Math.sin(n),e[2]=-Math.sin(n),e[3]=Math.cos(n)}function n(e,t){var n=t[0],r=t.length===2?t[1]:t[0];e[0]=n,e[3]=r}function r(e,t){e[2]=t[0]}function i(e,t){e[1]=t[0]}function s(e,t){e[4]=t[0],t.length===2&&(e[5]=t[1])}var o=[1,0,0,1,0,0],u="(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)",a="(?:\\s+,?\\s*|,\\s*)",f="(?:(skewX)\\s*\\(\\s*("+u+")\\s*\\))",l="(?:(skewY)\\s*\\(\\s*("+u+")\\s*\\))",c="(?:(rotate)\\s*\\(\\s*("+u+")(?:"+a+"("+u+")"+a+"("+u+"))?\\s*\\))",h="(?:(scale)\\s*\\(\\s*("+u+")(?:"+a+"("+u+"))?\\s*\\))",p="(?:(translate)\\s*\\(\\s*("+u+")(?:"+a+"("+u+"))?\\s*\\))",d="(?:(matrix)\\s*\\(\\s*("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+"\\s*\\))",v="(?:"+d+"|"+p+"|"+h+"|"+c+"|"+f+"|"+l+")",m="(?:"+v+"(?:"+a+v+")*"+")",g="^\\s*(?:"+m+"?)\\s*$",y=new RegExp(g),b=new RegExp(v,"g");return function(u){var a=o.concat(),f=[];if(!u||u&&!y.test(u))return a;u.replace(b,function(u){var l=(new RegExp(v)).exec(u).filter(function(e){return e!==""&&e!=null}),c=l[1],h=l.slice(2).map(parseFloat);switch(c){case"translate":s(a,h);break;case"rotate":h[0]=t.util.degreesToRadians(h[0]),e(a,h);break;case"scale":n(a,h);break;case"skewX":r(a,h);break;case"skewY":i(a,h);break;case"matrix":a=h}f.push(a.concat()),a=o.concat()});var l=f[0];while(f.length>1)f.shift(),l=t.util.multiplyTransformMatrices(l,f[0]);return l}}(),t.parseSVGDocument=function(){function s(e,t){while(e&&(e=e.parentNode))if(t.test(e.nodeName))return!0;return!1}var e=/^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/,n="(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)",r=new RegExp("^\\s*("+n+"+)\\s*,?"+"\\s*("+n+"+)\\s*,?"+"\\s*("+n+"+)\\s*,?"+"\\s*("+n+"+)\\s*"+"$");return function(n,o,u){if(!n)return;var a=new Date;w(n);var f=n.getAttribute("viewBox"),l=parseFloat(n.getAttribute("width")),c=parseFloat(n.getAttribute("height")),h,p;if(f&&(f=f.match(r))){var d=parseFloat(f[1]),v=parseFloat(f[2]),m=1,g=1;h=parseFloat(f[3]),p=parseFloat(f[4]),l&&l!==h&&(m=l/h),c&&c!==p&&(g=c/p),E(n,[m,0,0,g,-d,-v])}var y=t.util.toArray(n.getElementsByTagName("*"));if(y.length===0&&t.isLikelyNode){y=n.selectNodes('//*[name(.)!="svg"]');var b=[];for(var S=0,x=y.length;S<x;S++)b[S]=y[S];y=b}var T=y.filter(function(t){return e.test(t.tagName)&&!s(t,/^(?:pattern|defs)$/)});if(!T||T&&!T.length){o&&o([],{});return}var N={width:l?l:h,height:c?c:p,widthAttr:l,heightAttr:c};t.gradientDefs=t.getGradientDefs(n),t.cssRules=t.getCSSRules(n),t.parseElements(T,function(e){t.documentParsingTime=new Date-a,o&&o(e,N)},i(N),u)}}();var S={has:function(e,t){t(!1)},get:function(){},set:function(){}};n(t,{resolveGradients:function(e){for(var n=e.length;n--;){var r=e[n].get("fill");if(!/^url\(/.test(r))continue;var i=r.slice(5,r.length-1);t.gradientDefs[i]&&e[n].set("fill",t.Gradient.fromElement(t.gradientDefs[i],e[n]))}},getGradientDefs:function(e){var t=e.getElementsByTagName("linearGradient"),n=e.getElementsByTagName("radialGradient"),r,i,s={};i=t.length;for(;i--;)r=t[i],s[r.getAttribute("id")]=r;i=n.length;for(;i--;)r=n[i],s[r.getAttribute("id")]=r;return s},parseAttributes:function(e,r){if(!e)return;var i,s={};e.parentNode&&/^[g|a]$/i.test(e.parentNode.nodeName)&&(s=t.parseAttributes(e.parentNode,r));var o=r.reduce(function(t,n){return i=e.getAttribute(n),i&&(n=l(n),i=c(n,i,s),t[n]=i),t},{});return o=n(o,n(m(e),t.parseStyleAttribute(e))),h(n(s,o))},parseElements:function(e,n,r,i){(new t.ElementsParser(e,n,r,i)).parse()},parseStyleAttribute:function(e){var t={},n=e.getAttribute("style");return n?(typeof n=="string"?d(n,t):v(n,t),t):t},parsePointsAttribute:function(e){if(!e)return null;e=e.replace(/,/g," ").trim(),e=e.split(/\s+/);var t=[],n,r;n=0,r=e.length;for(;n<r;n+=2)t.push({x:parseFloat(e[n]),y:parseFloat(e[n+1])});return t},getCSSRules:function(e){var n=e.getElementsByTagName("style"),r={},i;for(var s=0,o=n.length;s<o;s++){var u=n[0].textContent;u=u.replace(/\/\*[\s\S]*?\*\//g,""),i=u.match(/[^{]*\{[\s\S]*?\}/g),i=i.map(function(e){return e.trim()}),i.forEach(function(e){var n=e.match(/([\s\S]*?)\s*\{([^}]*)\}/),i={},s=n[2].trim(),o=s.replace(/;$/,"").split(/\s*;\s*/);for(var u=0,a=o.length;u<a;u++){var f=o[u].split(/\s*:\s*/),h=l(f[0]),p=c(h,f[1],f[0]);i[h]=p}e=n[1],e.split(",").forEach(function(e){r[e.trim()]=t.util.object.clone(i)})})}return r},loadSVGFromURL:function(e,n,r){function i(i){var s=i.responseXML;s&&!s.documentElement&&t.window.ActiveXObject&&i.responseText&&(s=new ActiveXObject("Microsoft.XMLDOM"),s.async="false",s.loadXML(i.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,"")));if(!s||!s.documentElement)return;t.parseSVGDocument(s.documentElement
,function(r,i){S.set(e,{objects:t.util.array.invoke(r,"toObject"),options:i}),n(r,i)},r)}e=e.replace(/^\n\s*/,"").trim(),S.has(e,function(r){r?S.get(e,function(e){var t=x(e);n(t.objects,t.options)}):new t.util.request(e,{method:"get",onComplete:i})})},loadSVGFromString:function(e,n,r){e=e.trim();var i;if(typeof DOMParser!="undefined"){var s=new DOMParser;s&&s.parseFromString&&(i=s.parseFromString(e,"text/xml"))}else t.window.ActiveXObject&&(i=new ActiveXObject("Microsoft.XMLDOM"),i.async="false",i.loadXML(e.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,"")));t.parseSVGDocument(i.documentElement,function(e,t){n(e,t)},r)},createSVGFontFacesMarkup:function(e){var t="";for(var n=0,r=e.length;n<r;n++){if(e[n].type!=="text"||!e[n].path)continue;t+=["@font-face {","font-family: ",e[n].fontFamily,"; ","src: url('",e[n].path,"')","}"].join("")}return t&&(t=['<style type="text/css">',"<![CDATA[",t,"]]>","</style>"].join("")),t},createSVGRefElementsMarkup:function(e){var t=[];return T(t,e,"backgroundColor"),T(t,e,"overlayColor"),t.join("")}})}(typeof exports!="undefined"?exports:this),fabric.ElementsParser=function(e,t,n,r){this.elements=e,this.callback=t,this.options=n,this.reviver=r},fabric.ElementsParser.prototype.parse=function(){this.instances=new Array(this.elements.length),this.numElements=this.elements.length,this.createObjects()},fabric.ElementsParser.prototype.createObjects=function(){for(var e=0,t=this.elements.length;e<t;e++)(function(e,t){setTimeout(function(){e.createObject(e.elements[t],t)},0)})(this,e)},fabric.ElementsParser.prototype.createObject=function(e,t){var n=fabric[fabric.util.string.capitalize(e.tagName)];if(n&&n.fromElement)try{this._createObject(n,e,t)}catch(r){fabric.log(r)}else this.checkIfDone()},fabric.ElementsParser.prototype._createObject=function(e,t,n){if(e.async)e.fromElement(t,this.createCallback(n,t),this.options);else{var r=e.fromElement(t,this.options);this.reviver&&this.reviver(t,r),this.instances[n]=r,this.checkIfDone()}},fabric.ElementsParser.prototype.createCallback=function(e,t){var n=this;return function(r){n.reviver&&n.reviver(t,r),n.instances[e]=r,n.checkIfDone()}},fabric.ElementsParser.prototype.checkIfDone=function(){--this.numElements===0&&(this.instances=this.instances.filter(function(e){return e!=null}),fabric.resolveGradients(this.instances),this.callback(this.instances))},function(e){"use strict";function n(e,t){this.x=e,this.y=t}var t=e.fabric||(e.fabric={});if(t.Point){t.warn("fabric.Point is already defined");return}t.Point=n,n.prototype={constructor:n,add:function(e){return new n(this.x+e.x,this.y+e.y)},addEquals:function(e){return this.x+=e.x,this.y+=e.y,this},scalarAdd:function(e){return new n(this.x+e,this.y+e)},scalarAddEquals:function(e){return this.x+=e,this.y+=e,this},subtract:function(e){return new n(this.x-e.x,this.y-e.y)},subtractEquals:function(e){return this.x-=e.x,this.y-=e.y,this},scalarSubtract:function(e){return new n(this.x-e,this.y-e)},scalarSubtractEquals:function(e){return this.x-=e,this.y-=e,this},multiply:function(e){return new n(this.x*e,this.y*e)},multiplyEquals:function(e){return this.x*=e,this.y*=e,this},divide:function(e){return new n(this.x/e,this.y/e)},divideEquals:function(e){return this.x/=e,this.y/=e,this},eq:function(e){return this.x===e.x&&this.y===e.y},lt:function(e){return this.x<e.x&&this.y<e.y},lte:function(e){return this.x<=e.x&&this.y<=e.y},gt:function(e){return this.x>e.x&&this.y>e.y},gte:function(e){return this.x>=e.x&&this.y>=e.y},lerp:function(e,t){return new n(this.x+(e.x-this.x)*t,this.y+(e.y-this.y)*t)},distanceFrom:function(e){var t=this.x-e.x,n=this.y-e.y;return Math.sqrt(t*t+n*n)},midPointFrom:function(e){return new n(this.x+(e.x-this.x)/2,this.y+(e.y-this.y)/2)},min:function(e){return new n(Math.min(this.x,e.x),Math.min(this.y,e.y))},max:function(e){return new n(Math.max(this.x,e.x),Math.max(this.y,e.y))},toString:function(){return this.x+","+this.y},setXY:function(e,t){this.x=e,this.y=t},setFromPoint:function(e){this.x=e.x,this.y=e.y},swap:function(e){var t=this.x,n=this.y;this.x=e.x,this.y=e.y,e.x=t,e.y=n}}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function n(e){this.status=e,this.points=[]}var t=e.fabric||(e.fabric={});if(t.Intersection){t.warn("fabric.Intersection is already defined");return}t.Intersection=n,t.Intersection.prototype={appendPoint:function(e){this.points.push(e)},appendPoints:function(e){this.points=this.points.concat(e)}},t.Intersection.intersectLineLine=function(e,r,i,s){var o,u=(s.x-i.x)*(e.y-i.y)-(s.y-i.y)*(e.x-i.x),a=(r.x-e.x)*(e.y-i.y)-(r.y-e.y)*(e.x-i.x),f=(s.y-i.y)*(r.x-e.x)-(s.x-i.x)*(r.y-e.y);if(f!==0){var l=u/f,c=a/f;0<=l&&l<=1&&0<=c&&c<=1?(o=new n("Intersection"),o.points.push(new t.Point(e.x+l*(r.x-e.x),e.y+l*(r.y-e.y)))):o=new n}else u===0||a===0?o=new n("Coincident"):o=new n("Parallel");return o},t.Intersection.intersectLinePolygon=function(e,t,r){var i=new n,s=r.length;for(var o=0;o<s;o++){var u=r[o],a=r[(o+1)%s],f=n.intersectLineLine(e,t,u,a);i.appendPoints(f.points)}return i.points.length>0&&(i.status="Intersection"),i},t.Intersection.intersectPolygonPolygon=function(e,t){var r=new n,i=e.length;for(var s=0;s<i;s++){var o=e[s],u=e[(s+1)%i],a=n.intersectLinePolygon(o,u,t);r.appendPoints(a.points)}return r.points.length>0&&(r.status="Intersection"),r},t.Intersection.intersectPolygonRectangle=function(e,r,i){var s=r.min(i),o=r.max(i),u=new t.Point(o.x,s.y),a=new t.Point(s.x,o.y),f=n.intersectLinePolygon(s,u,e),l=n.intersectLinePolygon(u,o,e),c=n.intersectLinePolygon(o,a,e),h=n.intersectLinePolygon(a,s,e),p=new n;return p.appendPoints(f.points),p.appendPoints(l.points),p.appendPoints(c.points),p.appendPoints(h.points),p.points.length>0&&(p.status="Intersection"),p}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function n(e){e?this._tryParsingColor(e):this.setSource([0,0,0,1])}function r(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}var t=e.fabric||(e.fabric={});if(t.Color){t.warn("fabric.Color is already defined.");return}t.Color=n,t.Color.prototype={_tryParsingColor:function(e){var t;e in n.colorNameMap&&(e=n.colorNameMap[e]);if(e==="transparent"){this.setSource([255,255,255,0]);return}t=n.sourceFromHex(e),t||(t=n.sourceFromRgb(e)),t||(t=n.sourceFromHsl(e)),t&&this.setSource(t)},_rgbToHsl:function(e,n,r){e/=255,n/=255,r/=255;var i,s,o,u=t.util.array.max([e,n,r]),a=t.util.array.min([e,n,r]);o=(u+a)/2;if(u===a)i=s=0;else{var f=u-a;s=o>.5?f/(2-u-a):f/(u+a);switch(u){case e:i=(n-r)/f+(n<r?6:0);break;case n:i=(r-e)/f+2;break;case r:i=(e-n)/f+4}i/=6}return[Math.round(i*360),Math.round(s*100),Math.round(o*100)]},getSource:function(){return this._source},setSource:function(e){this._source=e},toRgb:function(){var e=this.getSource();return"rgb("+e[0]+","+e[1]+","+e[2]+")"},toRgba:function(){var e=this.getSource();return"rgba("+e[0]+","+e[1]+","+e[2]+","+e[3]+")"},toHsl:function(){var e=this.getSource(),t=this._rgbToHsl(e[0],e[1],e[2]);return"hsl("+t[0]+","+t[1]+"%,"+t[2]+"%)"},toHsla:function(){var e=this.getSource(),t=this._rgbToHsl(e[0],e[1],e[2]);return"hsla("+t[0]+","+t[1]+"%,"+t[2]+"%,"+e[3]+")"},toHex:function(){var e=this.getSource(),t,n,r;return t=e[0].toString(16),t=t.length===1?"0"+t:t,n=e[1].toString(16),n=n.length===1?"0"+n:n,r=e[2].toString(16),r=r.length===1?"0"+r:r,t.toUpperCase()+n.toUpperCase()+r.toUpperCase()},getAlpha:function(){return this.getSource()[3]},setAlpha:function(e){var t=this.getSource();return t[3]=e,this.setSource(t),this},toGrayscale:function(){var e=this.getSource(),t=parseInt((e[0]*.3+e[1]*.59+e[2]*.11).toFixed(0),10),n=e[3];return this.setSource([t,t,t,n]),this},toBlackWhite:function(e){var t=this.getSource(),n=(t[0]*.3+t[1]*.59+t[2]*.11).toFixed(0),r=t[3];return e=e||127,n=Number(n)<Number(e)?0:255,this.setSource([n,n,n,r]),this},overlayWith:function(e){e instanceof n||(e=new n(e));var t=[],r=this.getAlpha(),i=.5,s=this.getSource(),o=e.getSource();for(var u=0;u<3;u++)t.push(Math.round(s[u]*(1-i)+o[u]*i));return t[3]=r,this.setSource(t),this}},t.Color.reRGBa=/^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/,t.Color.reHSLa=/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/,t.Color.reHex=/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i,t.Color.colorNameMap={aqua:"#00FFFF",black:"#000000",blue:"#0000FF",fuchsia:"#FF00FF",gray:"#808080",green:"#008000",lime:"#00FF00",maroon:"#800000",navy:"#000080",olive:"#808000",orange:"#FFA500",purple:"#800080",red:"#FF0000",silver:"#C0C0C0",teal:"#008080",white:"#FFFFFF",yellow:"#FFFF00"},t.Color.fromRgb=function(e){return n.fromSource(n.sourceFromRgb(e))},t.Color.sourceFromRgb=function(e){var t=e.match(n.reRGBa);if(t){var r=parseInt(t[1],10)/(/%$/.test(t[1])?100:1)*(/%$/.test(t[1])?255:1),i=parseInt(t[2],10)/(/%$/.test(t[2])?100:1)*(/%$/.test(t[2])?255:1),s=parseInt(t[3],10)/(/%$/.test(t[3])?100:1)*(/%$/.test(t[3])?255:1);return[parseInt(r,10),parseInt(i,10),parseInt(s,10),t[4]?parseFloat(t[4]):1]}},t.Color.fromRgba=n.fromRgb,t.Color.fromHsl=function(e){return n.fromSource(n.sourceFromHsl(e))},t.Color.sourceFromHsl=function(e){var t=e.match(n.reHSLa);if(!t)return;var i=(parseFloat(t[1])%360+360)%360/360,s=parseFloat(t[2])/(/%$/.test(t[2])?100:1),o=parseFloat(t[3])/(/%$/.test(t[3])?100:1),u,a,f;if(s===0)u=a=f=o;else{var l=o<=.5?o*(s+1):o+s-o*s,c=o*2-l;u=r(c,l,i+1/3),a=r(c,l,i),f=r(c,l,i-1/3)}return[Math.round(u*255),Math.round(a*255),Math.round(f*255),t[4]?parseFloat(t[4]):1]},t.Color.fromHsla=n.fromHsl,t.Color.fromHex=function(e){return n.fromSource(n.sourceFromHex(e))},t.Color.sourceFromHex=function(e){if(e.match(n.reHex)){var t=e.slice(e.indexOf("#")+1),r=t.length===3,i=r?t.charAt(0)+t.charAt(0):t.substring(0,2),s=r?t.charAt(1)+t.charAt(1):t.substring(2,4),o=r?t.charAt(2)+t.charAt(2):t.substring(4,6);return[parseInt(i,16),parseInt(s,16),parseInt(o,16),1]}},t.Color.fromSource=function(e){var t=new n;return t.setSource(e),t}}(typeof exports!="undefined"?exports:this),function(){function e(e){var t=e.getAttribute("style"),n=e.getAttribute("offset"),r,i;n=parseFloat(n)/(/%$/.test(n)?100:1);if(t){var s=t.split(/\s*;\s*/);s[s.length-1]===""&&s.pop();for(var o=s.length;o--;){var u=s[o].split(/\s*:\s*/),a=u[0].trim(),f=u[1].trim();a==="stop-color"?r=f:a==="stop-opacity"&&(i=f)}}return r||(r=e.getAttribute("stop-color")||"rgb(0,0,0)"),i||(i=e.getAttribute("stop-opacity")),r=(new fabric.Color(r)).toRgb(),{offset:n,color:r,opacity:isNaN(parseFloat(i))?1:parseFloat(i)}}function t(e){return{x1:e.getAttribute("x1")||0,y1:e.getAttribute("y1")||0,x2:e.getAttribute("x2")||"100%",y2:e.getAttribute("y2")||0}}function n(e){return{x1:e.getAttribute("fx")||e.getAttribute("cx")||"50%",y1:e.getAttribute("fy")||e.getAttribute("cy")||"50%",r1:0,x2:e.getAttribute("cx")||"50%",y2:e.getAttribute("cy")||"50%",r2:e.getAttribute("r")||"50%"}}function r(e,t){for(var n in t){if(typeof t[n]=="string"&&/^\d+%$/.test(t[n])){var r=parseFloat(t[n],10);if(n==="x1"||n==="x2"||n==="r2")t[n]=fabric.util.toFixed(e.width*r/100,2);else if(n==="y1"||n==="y2")t[n]=fabric.util.toFixed(e.height*r/100,2)}i(t,n,e)}}function i(e,t,n){if(t==="x1"||t==="x2")e[t]-=fabric.util.toFixed(n.width/2,2);else if(t==="y1"||t==="y2")e[t]-=fabric.util.toFixed(n.height/2,2)}function s(e,t){for(var n in t){i(t,n,e);if(n==="x1"||n==="x2"||n==="r2")t[n]=fabric.util.toFixed(t[n]/e.width*100,2)+"%";else if(n==="y1"||n==="y2")t[n]=fabric.util.toFixed(t[n]/e.height*100,2)+"%"}}fabric.Gradient=fabric.util.createClass({initialize:function(e){e||(e={});var t={};this.id=fabric.Object.__uid++,this.type=e.type||"linear",t={x1:e.coords.x1||0,y1:e.coords.y1||0,x2:e.coords.x2||0,y2:e.coords.y2||0},this.type==="radial"&&(t.r1=e.coords.r1||0,t.r2=e.coords.r2||0),this.coords=t,this.gradientUnits=e.gradientUnits||"objectBoundingBox",this.colorStops=e.colorStops.slice()},addColorStop:function(e){for(var t in e){var n=new fabric.Color(e[t]);this.colorStops.push({offset:t,color:n.toRgb(),opacity:n.getAlpha()})}return this},toObject:function(){return{type:this.type,coords:this.coords,gradientUnits:this.gradientUnits,colorStops:this.colorStops}},toSVG:function(e,t){var n=fabric.util.object.clone(this.coords),r;this.colorStops.sort(function(e,t){return e.offset-t.offset}),t&&this.gradientUnits==="userSpaceOnUse"?(n.x1+=e.width/2,n.y1+=e.height/2,n.x2+=e.width/2,n.y2+=e.height/2):this.gradientUnits==="objectBoundingBox"&&s(e,n),this.type==="linear"?r=["<linearGradient ",'id="SVGID_',this.id,'" gradientUnits="',this.gradientUnits,'" x1="',n.x1,'" y1="',n.y1,'" x2="',n.x2,'" y2="',n.y2,'">']:this.type==="radial"&&(r=["<radialGradient ",'id="SVGID_',this.id,'" gradientUnits="',this.gradientUnits,'" cx="',n.x2,'" cy="',n.y2,'" r="',n.r2,'" fx="',n.x1,'" fy="',n.y1,'">']);for(var i=0;i<this.colorStops.length;i++)r.push("<stop ",'offset="',this.colorStops[i].offset*100+"%",'" style="stop-color:',this.colorStops[i].color,this.colorStops[i].opacity?";stop-opacity: "+this.colorStops[i].opacity:";",'"/>');return r.push(this.type==="linear"?"</linearGradient>":"</radialGradient>"),r.join("")},toLive:function(e){var t;if(!this.type)return;this.type==="linear"?t=e.createLinearGradient(this.coords.x1,this.coords.y1,this.coords.x2,this.coords.y2):this.type==="radial"&&(t=e.createRadialGradient(this.coords.x1,this.coords.y1,this.coords.r1,this.coords.x2,this.coords.y2,this.coords.r2));for(var n=0,r=this.colorStops.length;n<r;n++){var i=this.colorStops[n].color,s=this.colorStops[n].opacity,o=this.colorStops[n].offset;typeof s!="undefined"&&(i=(new fabric.Color(i)).setAlpha(s).toRgba()),t.addColorStop(parseFloat(o),i)}return t}}),fabric.util.object.extend(fabric.Gradient,{fromElement:function(i,s){var o=i.getElementsByTagName("stop"),u=i.nodeName==="linearGradient"?"linear":"radial",a=i.getAttribute("gradientUnits")||"objectBoundingBox",f=[],l={};u==="linear"?l=t(i):u==="radial"&&(l=n(i));for(var c=o.length;c--;)f.push(e(o[c]));return r(s,l),new fabric.Gradient({type:u,coords:l,gradientUnits:a,colorStops:f})},forObject:function(e,t){return t||(t={}),r(e,t),new fabric.Gradient(t)}})}(),fabric.Pattern=fabric.util.createClass({repeat:"repeat",offsetX:0,offsetY:0,initialize:function(e){e||(e={}),this.id=fabric.Object.__uid++;if(e.source)if(typeof e.source=="string")if(typeof fabric.util.getFunctionBody(e.source)!="undefined")this.source=new Function(fabric.util.getFunctionBody(e.source));else{var t=this;this.source=fabric.util.createImage(),fabric.util.loadImage(e.source,function(e){t.source=e})}else this.source=e.source;e.repeat&&(this.repeat=e.repeat),e.offsetX&&(this.offsetX=e.offsetX),e.offsetY&&(this.offsetY=e.offsetY)},toObject:function(){var e;return typeof this.source=="function"?e=String(this.source):typeof this.source.src=="string"&&(e=this.source.src),{source:e,repeat:this.repeat,offsetX:this.offsetX,offsetY:this.offsetY}},toSVG:function(e){var t=typeof this.source=="function"?this.source():this.source,n=t.width/e.getWidth(),r=t.height/e.getHeight(),i="";return t.src?i=t.src:t.toDataURL&&(i=t.toDataURL()),'<pattern id="SVGID_'+this.id+'" x="'+this.offsetX+'" y="'+this.offsetY+'" width="'+n+'" height="'+r+'">'+'<image x="0" y="0"'+' width="'+t.width+'" height="'+t.height+'" xlink:href="'+i+'"></image>'+"</pattern>"},toLive:function(e){var t=typeof this.source=="function"?this.source():this.source;if(!t)return"";if(typeof t.src!="undefined"){if(!t.complete)return"";if(t.naturalWidth===0||t.naturalHeight===0)return""}return e.createPattern(t,this.repeat)}}),function(e){"use strict";var t=e.fabric||(e.fabric={});if(t.Shadow){t.warn("fabric.Shadow is already defined.");return}t.Shadow=t.util.createClass({color:"rgb(0,0,0)",blur:0,offsetX:0,offsetY:0,affectStroke:!1,includeDefaultValues:!0,initialize:function(e){typeof e=="string"&&(e=this._parseShadow(e));for(var n in e)this[n]=e[n];this.id=t.Object.__uid++},_parseShadow:function(e){var n=e.trim(),r=t.Shadow.reOffsetsAndBlur.exec(n)||[],i=n.replace(t.Shadow.reOffsetsAndBlur,"")||"rgb(0,0,0)";return{color:i.trim(),offsetX:parseInt(r[1],10)||0,offsetY:parseInt(r[2],10)||0,blur:parseInt(r[3],10)||0}},toString:function(){return[this.offsetX,this.offsetY,this.blur,this.color].join("px ")},toSVG:function(e){var t="SourceAlpha";return e&&(e.fill===this.color||e.stroke===this.color)&&(t="SourceGraphic"),'<filter id="SVGID_'+this.id+'" y="-40%" height="180%">'+'<feGaussianBlur in="'+t+'" stdDeviation="'+(this.blur?this.blur/3:0)+'"></feGaussianBlur>'+'<feOffset dx="'+this.offsetX+'" dy="'+this.offsetY+'"></feOffset>'+"<feMerge>"+"<feMergeNode></feMergeNode>"+'<feMergeNode in="SourceGraphic"></feMergeNode>'+"</feMerge>"+"</filter>"},toObject:function(){if(this.includeDefaultValues)return{color:this.color,blur:this.blur,offsetX:this.offsetX,offsetY:this.offsetY};var e={},n=t.Shadow.prototype;return this.color!==n.color&&(e.color=this.color),this.blur!==n.blur&&(e.blur=this.blur),this.offsetX!==n.offsetX&&(e.offsetX=this.offsetX),this.offsetY!==n.offsetY&&(e.offsetY=this.offsetY),e}}),t.Shadow.reOffsetsAndBlur=/(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/}(typeof exports!="undefined"?exports:this),function(){"use strict";if(fabric.StaticCanvas){fabric.warn("fabric.StaticCanvas is already defined.");return}var e=fabric.util.object.extend,t=fabric.util.getElementOffset,n=fabric.util.removeFromArray,r=new Error("Could not initialize `canvas` element");fabric.StaticCanvas=fabric.util.createClass({initialize:function(e,t){t||(t={}),this._initStatic(e,t),fabric.StaticCanvas.activeInstance=this},backgroundColor:"",backgroundImage:null,overlayColor:"",overlayImage:null,includeDefaultValues:!0,stateful:!0,renderOnAddRemove:!0,clipTo:null,controlsAboveOverlay:!1,allowTouchScrolling:!1,imageSmoothingEnabled:!0,viewportTransform:[1,0,0,1,0,0],onBeforeScaleRotate:function(){},_initStatic:function(e,t){this._objects=[],this._createLowerCanvas(e),this._initOptions(t),this._setImageSmoothing(),t.overlayImage&&this.setOverlayImage(t.overlayImage,this.renderAll.bind(this)),t.backgroundImage&&this.setBackgroundImage(t.backgroundImage,this.renderAll.bind(this)),t.backgroundColor&&this.setBackgroundColor(t.backgroundColor,this.renderAll.bind(this)),t.overlayColor&&this.setOverlayColor(t.overlayColor,this.renderAll.bind(this)),this.calcOffset()},calcOffset:function(){return this._offset=t(this.lowerCanvasEl),this},setOverlayImage:function(e,t,n){return this.__setBgOverlayImage("overlayImage",e,t,n)},setBackgroundImage:function(e,t,n){return this.__setBgOverlayImage("backgroundImage",e,t,n)},setOverlayColor:function(e,t){return this.__setBgOverlayColor("overlayColor",e,t)},setBackgroundColor:function(e,t){return this.__setBgOverlayColor("backgroundColor",e,t)},_setImageSmoothing:function(){var e=this.getContext();e.imageSmoothingEnabled=this.imageSmoothingEnabled,e.webkitImageSmoothingEnabled=this.imageSmoothingEnabled,e.mozImageSmoothingEnabled=this.imageSmoothingEnabled,e.msImageSmoothingEnabled=this.imageSmoothingEnabled,e.oImageSmoothingEnabled=this.imageSmoothingEnabled},__setBgOverlayImage:function(e,t,n,r){return typeof t=="string"?fabric.util.loadImage(t,function(t){this[e]=new fabric.Image(t,r),n&&n()},this):(this[e]=t,n&&n()),this},__setBgOverlayColor:function(e,t,n){if(t&&t.source){var r=this;fabric.util.loadImage(t.source,function(i){r[e]=new fabric.Pattern({source:i,repeat:t.repeat,offsetX:t.offsetX,offsetY:t.offsetY}),n&&n()})}else this[e]=t,n&&n();return this},_createCanvasElement:function(){var e=fabric.document.createElement("canvas");e.style||(e.style={});if(!e)throw r;return this._initCanvasElement(e),e},_initCanvasElement:function(e){fabric.util.createCanvasElement(e);if(typeof e.getContext=="undefined")throw r},_initOptions:function(e){for(var t in e)this[t]=e[t];this.width=this.width||parseInt(this.lowerCanvasEl.width,10)||0,this.height=this.height||parseInt(this.lowerCanvasEl.height,10)||0;if(!this.lowerCanvasEl.style)return;this.lowerCanvasEl.width=this.width,this.lowerCanvasEl.height=this.height,this.lowerCanvasEl.style.width=this.width+"px",this.lowerCanvasEl.style.height=this.height+"px",this.viewportTransform=this.viewportTransform.slice()},_createLowerCanvas:function(e){this.lowerCanvasEl=fabric.util.getById(e)||this._createCanvasElement(),this._initCanvasElement(this.lowerCanvasEl),fabric.util.addClass(this.lowerCanvasEl,"lower-canvas"),this.interactive&&this._applyCanvasStyle(this.lowerCanvasEl),this.contextContainer=this.lowerCanvasEl.getContext("2d")},getWidth:function(){return this.width},getHeight:function(){return this.height},setWidth:function(e,t){return this.setDimensions({width:e},t)},setHeight:function(e,t){return this.setDimensions({height:e},t)},setDimensions:function(e,t){var n;t=t||{};for(var r in e)n=e[r],t.cssOnly||(this._setBackstoreDimension(r,e[r]),n+="px"),t.backstoreOnly||this._setCssDimension(r,n);return t.cssOnly||this.renderAll(),this.calcOffset(),this},_setBackstoreDimension:function(e,t){return this.lowerCanvasEl[e]=t,this.upperCanvasEl&&(this.upperCanvasEl[e]=t),this.cacheCanvasEl&&(this.cacheCanvasEl[e]=t),this[e]=t,this},_setCssDimension:function(e,t){return this.lowerCanvasEl.style[e]=t,this.upperCanvasEl&&(this.upperCanvasEl.style[e]=t),this.wrapperEl&&(this.wrapperEl.style[e]=t),this},getZoom:function(){return Math.sqrt(this.viewportTransform[0]*this.viewportTransform[3])},setViewportTransform:function(e){this.viewportTransform=e,this.renderAll();for(var t=0,n=this._objects.length;t<n;t++)this._objects[t].setCoords();return this},zoomToPoint:function(e,t){var n=e;e=fabric.util.transformPoint(e,fabric.util.invertTransform(this.viewportTransform)),this.viewportTransform[0]=t,this.viewportTransform[3]=t;var r=fabric.util.transformPoint(e,this.viewportTransform);this.viewportTransform[4]+=n.x-r.x,this.viewportTransform[5]+=n.y-r.y,this.renderAll();for(var i=0,s=this._objects.length;i<s;i++)this._objects[i].setCoords();return this},setZoom:function(e){return this.zoomToPoint(new fabric.Point(0,0),e),this},absolutePan:function(e){this.viewportTransform[4]=-e.x,this.viewportTransform[5]=-e.y,this.renderAll();for(var t=0,n=this._objects.length;t<n;t++)this._objects[t].setCoords();return this},relativePan:function(e){return this.absolutePan(new fabric.Point(-e.x-this.viewportTransform[4],-e.y-this.viewportTransform[5]))},getElement:function(){return this.lowerCanvasEl},getActiveObject:function(){return null},getActiveGroup:function(){return null},_draw:function(e,t){if(!t)return;e.save();var n=this.viewportTransform;e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),t.render(e),e.restore(),this.controlsAboveOverlay||t._renderControls(e)},_onObjectAdded:function(e){this.stateful&&e.setupState(),e.canvas=this,e.setCoords(),this.fire("object:added",{target:e}),e.fire("added")},_onObjectRemoved:function(e){this.getActiveObject()===e&&(this.fire("before:selection:cleared",{target:e}),this._discardActiveObject(),this.fire("selection:cleared")),this.fire("object:removed",{target:e}),e.fire("removed")},clearContext:function(e){return e.clearRect(0,0,this.width,this.height),this},getContext:function(){return this.contextContainer},clear:function(){return this._objects.length=0,this.discardActiveGroup&&this.discardActiveGroup(),this.discardActiveObject&&this.discardActiveObject(),this.clearContext(this.contextContainer),this.contextTop&&this.clearContext(this.contextTop),this.fire("canvas:cleared"),this.renderAll(),this},renderAll:function(e){var t=this[e===!0&&this.interactive?"contextTop":"contextContainer"],n=this.getActiveGroup();return this.contextTop&&this.selection&&!this._groupSelector&&this.clearContext(this.contextTop),e||this.clearContext(t),this.fire("before:render"),this.clipTo&&fabric.util.clipContext(this,t),this._renderBackground(t),this._renderObjects(t,n),this._renderActiveGroup(t,n),this.clipTo&&t.restore(),this._renderOverlay(t),this.controlsAboveOverlay&&this.interactive&&this.drawControls(t),this.fire("after:render"),this},_renderObjects:function(e,t){var n,r;if(!t)for(n=0,r=this._objects.length;n<r;++n)this._draw(e,this._objects[n]);else for(n=0,r=this._objects.length;n<r;++n)this._objects[n]&&!t.contains(this._objects[n])&&this._draw(e,this._objects[n])},_renderActiveGroup:function(e,t){if(t){var n=[];this.forEachObject(function(e){t.contains(e)&&n.push(e)}),t._set("objects",n),this._draw(e,t)}},_renderBackground:function(e){this.backgroundColor&&(e.fillStyle=this.backgroundColor.toLive?this.backgroundColor.toLive(e):this.backgroundColor,e.fillRect(this.backgroundColor.offsetX||0,this.backgroundColor.offsetY||0,this.width,this.height)),this.backgroundImage&&this._draw(e,this.backgroundImage)},_renderOverlay:function(e){this.overlayColor&&(e.fillStyle=this.overlayColor.toLive?this.overlayColor.toLive(e):this.overlayColor,e.fillRect(this.overlayColor.offsetX||0,this.overlayColor.offsetY||0,this.width,this.height)),this.overlayImage&&this._draw(e,this.overlayImage)},renderTop:function(){var e=this.contextTop||this.contextContainer;this.clearContext(e),this.selection&&this._groupSelector&&this._drawSelection();var t=this.getActiveGroup();return t&&t.render(e),this._renderOverlay(e),this.fire("after:render"),this},getCenter:function(){return{top:this.getHeight()/2,left:this.getWidth()/2}},centerObjectH:function(e){return this._centerObject(e,new fabric.Point(this.getCenter().left,e.getCenterPoint().y)),this.renderAll(),this},centerObjectV:function(e){return this._centerObject(e,new fabric.Point(e.getCenterPoint().x,this.getCenter().top)),this.renderAll(),this},centerObject:function(e){var t=this.getCenter();return this._centerObject(e,new fabric.Point(t.left,t.top)),this.renderAll(),this},_centerObject:function(e,t){return e.setPositionByOrigin(t,"center","center"),this},toDatalessJSON:function(e){return this.toDatalessObject(e)},toObject:function(e){return this._toObjectMethod("toObject",e)},toDatalessObject:function(e){return this._toObjectMethod("toDatalessObject",e)},_toObjectMethod:function(t,n){var r=this.getActiveGroup();r&&this.discardActiveGroup();var i={objects:this._toObjects(t,n)};return e(i,this.__serializeBgOverlay()),fabric.util.populateWithProperties(this,i,n),r&&(this.setActiveGroup(new fabric.Group(r.getObjects(),{originX:"center",originY:"center"})),r.forEachObject(function(e){e.set("active",!0)}),this._currentTransform&&(this._currentTransform.target=this.getActiveGroup())),i},_toObjects:function(e,t){return this.getObjects().map(function(n){return this._toObject(n,e,t)},this)},_toObject:function(e,t,n){var r;this.includeDefaultValues||(r=e.includeDefaultValues,e.includeDefaultValues=!1);var i=e[t](n);return this.includeDefaultValues||(e.includeDefaultValues=r),i},__serializeBgOverlay:function(){var e={background:this.backgroundColor&&this.backgroundColor.toObject?this.backgroundColor.toObject():this.backgroundColor};return this.overlayColor&&(e.overlay=this.overlayColor.toObject?this.overlayColor.toObject():this.overlayColor),this.backgroundImage&&(e.backgroundImage=this.backgroundImage.toObject()),this.overlayImage&&(e.overlayImage=this.overlayImage.toObject()),e},toSVG:function(e,t){e||(e={});var n=[];return this._setSVGPreamble(n,e),this._setSVGHeader(n,e),this._setSVGBgOverlayColor(n,"backgroundColor"),this._setSVGBgOverlayImage(n,"backgroundImage"),this._setSVGObjects(n,t),this._setSVGBgOverlayColor(n,"overlayColor"),this._setSVGBgOverlayImage(n,"overlayImage"),n.push("</svg>"),n.join("")},_setSVGPreamble:function(e,t){t.suppressPreamble||e.push('<?xml version="1.0" encoding="',t.encoding||"UTF-8",'" standalone="no" ?>','<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ','"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')},_setSVGHeader:function(e,t){e.push("<svg ",'xmlns="http://www.w3.org/2000/svg" ','xmlns:xlink="http://www.w3.org/1999/xlink" ','version="1.1" ','width="',t.viewBox?t.viewBox.width:this.width,'" ','height="',t.viewBox?t.viewBox.height:this.height,'" ',this.backgroundColor&&!this.backgroundColor.toLive?'style="background-color: '+this.backgroundColor+'" ':null,t.viewBox?'viewBox="'+t.viewBox.x+" "+t.viewBox.y+" "+t.viewBox.width+" "+t.viewBox.height+'" ':null,'xml:space="preserve">',"<desc>Created with Fabric.js ",fabric.version,"</desc>","<defs>",fabric.createSVGFontFacesMarkup(this.getObjects()),fabric.createSVGRefElementsMarkup(this),"</defs>")},_setSVGObjects:function(e,t){var n=this.getActiveGroup();n&&this.discardActiveGroup();for(var r=0,i=this.getObjects(),s=i.length;r<s;r++)e.push(i[r].toSVG(t));n&&(this.setActiveGroup(new fabric.Group(n.getObjects())),n.forEachObject(function(e){e.set("active",!0)}))},_setSVGBgOverlayImage:function(e,t){this[t]&&this[t].toSVG&&e.push(this[t].toSVG())},_setSVGBgOverlayColor:function(e,t){this[t]&&this[t].source?e.push('<rect x="',this[t].offsetX,'" y="',this[t].offsetY,'" ','width="',this[t].repeat==="repeat-y"||this[t].repeat==="no-repeat"?this[t].source.width:this.width,'" height="',this[t].repeat==="repeat-x"||this[t].repeat==="no-repeat"?this[t].source.height:this.height,'" fill="url(#'+t+'Pattern)"',"></rect>"):this[t]&&t==="overlayColor"&&e.push('<rect x="0" y="0" ','width="',this.width,'" height="',this.height,'" fill="',this[t],'"',"></rect>")},sendToBack:function(e){return n(this._objects,e),this._objects.unshift(e),this.renderAll&&this.renderAll()},bringToFront:function(e){return n(this._objects,e),this._objects.push(e),this.renderAll&&this.renderAll()},sendBackwards:function(e,t){var r=this._objects.indexOf(e);if(r!==0){var i=this._findNewLowerIndex(e,r,t);n(this._objects,e),this._objects.splice(i,0,e),this.renderAll&&this.renderAll()}return this},_findNewLowerIndex:function(e,t,n){var r;if(n){r=t;for(var i=t-1;i>=0;--i){var s=e.intersectsWithObject(this._objects[i])||e.isContainedWithinObject(this._objects[i])||this._objects[i].isContainedWithinObject(e);if(s){r=i;break}}}else r=t-1;return r},bringForward:function(e,t){var r=this._objects.indexOf(e);if(r!==this._objects.length-1){var i=this._findNewUpperIndex(e,r,t);n(this._objects,e),this._objects.splice(i,0,e),this.renderAll&&this.renderAll()}return this},_findNewUpperIndex:function(e,t,n){var r;if(n){r=t;for(var i=t+1;i<this._objects.length;++i){var s=e.intersectsWithObject(this._objects[i])||e.isContainedWithinObject(this._objects[i])||this._objects[i].isContainedWithinObject(e);if(s){r=i;break}}}else r=t+1;return r},moveTo:function(e,t){return n(this._objects,e),this._objects.splice(t,0,e),this.renderAll&&this.renderAll()},dispose:function(){return this.clear(),this.interactive&&this.removeListeners(),this},toString:function(){return"#<fabric.Canvas ("+this.complexity()+"): "+"{ objects: "+this.getObjects().length+" }>"}}),e(fabric.StaticCanvas.prototype,fabric.Observable),e(fabric.StaticCanvas.prototype,fabric.Collection),e(fabric.StaticCanvas.prototype,fabric.DataURLExporter),e(fabric.StaticCanvas,{EMPTY_JSON:'{"objects": [], "background": "white"}',supports:function(e){var t=fabric.util.createCanvasElement();if(!t||!t.getContext)return null;var n=t.getContext("2d");if(!n)return null;switch(e){case"getImageData":return typeof n.getImageData!="undefined";case"setLineDash":return typeof n.setLineDash!="undefined";case"toDataURL":return typeof t.toDataURL!="undefined";case"toDataURLWithQuality":try{return t.toDataURL("image/jpeg",0),!0}catch(r){}return!1;default:return null}}}),fabric.StaticCanvas.prototype.toJSON=fabric.StaticCanvas.prototype.toObject}(),fabric.BaseBrush=fabric.util.createClass({color:"rgb(0, 0, 0)",width:1,shadow:null,strokeLineCap:"round",strokeLineJoin:"round",setShadow:function(e){return this.shadow=new fabric.Shadow(e),this},_setBrushStyles:function(){var e=this.canvas.contextTop;e.strokeStyle=this.color,e.lineWidth=this.width,e.lineCap=this.strokeLineCap,e.lineJoin=this.strokeLineJoin},_setShadow:function(){if(!this.shadow)return;var e=this.canvas.contextTop;e.shadowColor=this.shadow.color,e.shadowBlur=this.shadow.blur,e.shadowOffsetX=this.shadow.offsetX,e.shadowOffsetY=this.shadow.offsetY},_resetShadow:function(){var e=this.canvas.contextTop;e.shadowColor="",e.shadowBlur=e.shadowOffsetX=e.shadowOffsetY=0}}),function(){var e=fabric.util.array.min,t=fabric.util.array.max;fabric.PencilBrush=fabric.util.createClass(fabric.BaseBrush,{initialize:function(e){this.canvas=e,this._points=[]},onMouseDown:function(e){this._prepareForDrawing(e),this._captureDrawingPath(e),this._render()},onMouseMove:function(e){this._captureDrawingPath(e),this.canvas.clearContext(this.canvas.contextTop),this._render()},onMouseUp:function(){this._finalizeAndAddPath()},_prepareForDrawing:function(e){var t=new fabric.Point(e.x,e.y);this._reset(),this._addPoint(t),this.canvas.contextTop.moveTo(t.x,t.y)},_addPoint:function(e){this._points.push(e)},_reset:function(){this._points.length=0,this._setBrushStyles
(),this._setShadow()},_captureDrawingPath:function(e){var t=new fabric.Point(e.x,e.y);this._addPoint(t)},_render:function(){var e=this.canvas.contextTop,t=this.canvas.viewportTransform,n=this._points[0],r=this._points[1];e.save(),e.transform(t[0],t[1],t[2],t[3],t[4],t[5]),e.beginPath(),this._points.length===2&&n.x===r.x&&n.y===r.y&&(n.x-=.5,r.x+=.5),e.moveTo(n.x,n.y);for(var i=1,s=this._points.length;i<s;i++){var o=n.midPointFrom(r);e.quadraticCurveTo(n.x,n.y,o.x,o.y),n=this._points[i],r=this._points[i+1]}e.lineTo(n.x,n.y),e.stroke(),e.restore()},_getSVGPathData:function(){return this.box=this.getPathBoundingBox(this._points),this.convertPointsToSVGPath(this._points,this.box.minX,this.box.minY)},getPathBoundingBox:function(n){var r=[],i=[],s=n[0],o=n[1],u=s;for(var a=1,f=n.length;a<f;a++){var l=s.midPointFrom(o);r.push(u.x),r.push(l.x),i.push(u.y),i.push(l.y),s=n[a],o=n[a+1],u=l}return r.push(s.x),i.push(s.y),{minX:e(r),minY:e(i),maxX:t(r),maxY:t(i)}},convertPointsToSVGPath:function(e,t,n){var r=[],i=new fabric.Point(e[0].x-t,e[0].y-n),s=new fabric.Point(e[1].x-t,e[1].y-n);r.push("M ",e[0].x-t," ",e[0].y-n," ");for(var o=1,u=e.length;o<u;o++){var a=i.midPointFrom(s);r.push("Q ",i.x," ",i.y," ",a.x," ",a.y," "),i=new fabric.Point(e[o].x-t,e[o].y-n),o+1<e.length&&(s=new fabric.Point(e[o+1].x-t,e[o+1].y-n))}return r.push("L ",i.x," ",i.y," "),r},createPath:function(e){var t=new fabric.Path(e);return t.fill=null,t.stroke=this.color,t.strokeWidth=this.width,t.strokeLineCap=this.strokeLineCap,t.strokeLineJoin=this.strokeLineJoin,this.shadow&&(this.shadow.affectStroke=!0,t.setShadow(this.shadow)),t},_finalizeAndAddPath:function(){var e=this.canvas.contextTop;e.closePath();var t=this._getSVGPathData().join("");if(t==="M 0 0 Q 0 0 0 0 L 0 0"){this.canvas.renderAll();return}var n=this.box.minX+(this.box.maxX-this.box.minX)/2,r=this.box.minY+(this.box.maxY-this.box.minY)/2;this.canvas.contextTop.arc(n,r,3,0,Math.PI*2,!1);var i=this.createPath(t);i.set({left:n,top:r,originX:"center",originY:"center"}),this.canvas.add(i),i.setCoords(),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderAll(),this.canvas.fire("path:created",{path:i})}})}(),fabric.CircleBrush=fabric.util.createClass(fabric.BaseBrush,{width:10,initialize:function(e){this.canvas=e,this.points=[]},drawDot:function(e){var t=this.addPoint(e),n=this.canvas.contextTop,r=this.canvas.viewportTransform;n.save(),n.transform(r[0],r[1],r[2],r[3],r[4],r[5]),n.fillStyle=t.fill,n.beginPath(),n.arc(t.x,t.y,t.radius,0,Math.PI*2,!1),n.closePath(),n.fill(),n.restore()},onMouseDown:function(e){this.points.length=0,this.canvas.clearContext(this.canvas.contextTop),this._setShadow(),this.drawDot(e)},onMouseMove:function(e){this.drawDot(e)},onMouseUp:function(){var e=this.canvas.renderOnAddRemove;this.canvas.renderOnAddRemove=!1;var t=[];for(var n=0,r=this.points.length;n<r;n++){var i=this.points[n],s=new fabric.Circle({radius:i.radius,left:i.x,top:i.y,originX:"center",originY:"center",fill:i.fill});this.shadow&&s.setShadow(this.shadow),t.push(s)}var o=new fabric.Group(t,{originX:"center",originY:"center"});o.canvas=this.canvas,this.canvas.add(o),this.canvas.fire("path:created",{path:o}),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderOnAddRemove=e,this.canvas.renderAll()},addPoint:function(e){var t=new fabric.Point(e.x,e.y),n=fabric.util.getRandomInt(Math.max(0,this.width-20),this.width+20)/2,r=(new fabric.Color(this.color)).setAlpha(fabric.util.getRandomInt(0,100)/100).toRgba();return t.radius=n,t.fill=r,this.points.push(t),t}}),fabric.SprayBrush=fabric.util.createClass(fabric.BaseBrush,{width:10,density:20,dotWidth:1,dotWidthVariance:1,randomOpacity:!1,optimizeOverlapping:!0,initialize:function(e){this.canvas=e,this.sprayChunks=[]},onMouseDown:function(e){this.sprayChunks.length=0,this.canvas.clearContext(this.canvas.contextTop),this._setShadow(),this.addSprayChunk(e),this.render()},onMouseMove:function(e){this.addSprayChunk(e),this.render()},onMouseUp:function(){var e=this.canvas.renderOnAddRemove;this.canvas.renderOnAddRemove=!1;var t=[];for(var n=0,r=this.sprayChunks.length;n<r;n++){var i=this.sprayChunks[n];for(var s=0,o=i.length;s<o;s++){var u=new fabric.Rect({width:i[s].width,height:i[s].width,left:i[s].x+1,top:i[s].y+1,originX:"center",originY:"center",fill:this.color});this.shadow&&u.setShadow(this.shadow),t.push(u)}}this.optimizeOverlapping&&(t=this._getOptimizedRects(t));var a=new fabric.Group(t,{originX:"center",originY:"center"});a.canvas=this.canvas,this.canvas.add(a),this.canvas.fire("path:created",{path:a}),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderOnAddRemove=e,this.canvas.renderAll()},_getOptimizedRects:function(e){var t={},n;for(var r=0,i=e.length;r<i;r++)n=e[r].left+""+e[r].top,t[n]||(t[n]=e[r]);var s=[];for(n in t)s.push(t[n]);return s},render:function(){var e=this.canvas.contextTop;e.fillStyle=this.color;var t=this.canvas.viewportTransform;e.save(),e.transform(t[0],t[1],t[2],t[3],t[4],t[5]);for(var n=0,r=this.sprayChunkPoints.length;n<r;n++){var i=this.sprayChunkPoints[n];typeof i.opacity!="undefined"&&(e.globalAlpha=i.opacity),e.fillRect(i.x,i.y,i.width,i.width)}e.restore()},addSprayChunk:function(e){this.sprayChunkPoints=[];var t,n,r,i=this.width/2;for(var s=0;s<this.density;s++){t=fabric.util.getRandomInt(e.x-i,e.x+i),n=fabric.util.getRandomInt(e.y-i,e.y+i),this.dotWidthVariance?r=fabric.util.getRandomInt(Math.max(1,this.dotWidth-this.dotWidthVariance),this.dotWidth+this.dotWidthVariance):r=this.dotWidth;var o=new fabric.Point(t,n);o.width=r,this.randomOpacity&&(o.opacity=fabric.util.getRandomInt(0,100)/100),this.sprayChunkPoints.push(o)}this.sprayChunks.push(this.sprayChunkPoints)}}),fabric.PatternBrush=fabric.util.createClass(fabric.PencilBrush,{getPatternSrc:function(){var e=20,t=5,n=fabric.document.createElement("canvas"),r=n.getContext("2d");return n.width=n.height=e+t,r.fillStyle=this.color,r.beginPath(),r.arc(e/2,e/2,e/2,0,Math.PI*2,!1),r.closePath(),r.fill(),n},getPatternSrcFunction:function(){return String(this.getPatternSrc).replace("this.color",'"'+this.color+'"')},getPattern:function(){return this.canvas.contextTop.createPattern(this.source||this.getPatternSrc(),"repeat")},_setBrushStyles:function(){this.callSuper("_setBrushStyles"),this.canvas.contextTop.strokeStyle=this.getPattern()},createPath:function(e){var t=this.callSuper("createPath",e);return t.stroke=new fabric.Pattern({source:this.source||this.getPatternSrcFunction()}),t}}),function(){var e=fabric.util.getPointer,t=fabric.util.degreesToRadians,n=fabric.util.radiansToDegrees,r=Math.atan2,i=Math.abs,s=.5;fabric.Canvas=fabric.util.createClass(fabric.StaticCanvas,{initialize:function(e,t){t||(t={}),this._initStatic(e,t),this._initInteractive(),this._createCacheCanvas(),fabric.Canvas.activeInstance=this},uniScaleTransform:!1,centeredScaling:!1,centeredRotation:!1,interactive:!0,selection:!0,selectionColor:"rgba(100, 100, 255, 0.3)",selectionDashArray:[],selectionBorderColor:"rgba(255, 255, 255, 0.3)",selectionLineWidth:1,hoverCursor:"move",moveCursor:"move",defaultCursor:"default",freeDrawingCursor:"crosshair",rotationCursor:"crosshair",containerClass:"canvas-container",perPixelTargetFind:!1,targetFindTolerance:0,skipTargetFind:!1,_initInteractive:function(){this._currentTransform=null,this._groupSelector=null,this._initWrapperElement(),this._createUpperCanvas(),this._initEventListeners(),this.freeDrawingBrush=fabric.PencilBrush&&new fabric.PencilBrush(this),this.calcOffset()},_resetCurrentTransform:function(e){var t=this._currentTransform;t.target.set({scaleX:t.original.scaleX,scaleY:t.original.scaleY,left:t.original.left,top:t.original.top}),this._shouldCenterTransform(e,t.target)?t.action==="rotate"?this._setOriginToCenter(t.target):(t.originX!=="center"&&(t.originX==="right"?t.mouseXSign=-1:t.mouseXSign=1),t.originY!=="center"&&(t.originY==="bottom"?t.mouseYSign=-1:t.mouseYSign=1),t.originX="center",t.originY="center"):(t.originX=t.original.originX,t.originY=t.original.originY)},containsPoint:function(e,t){var n=this.getPointer(e,!0),r=this._normalizePointer(t,n);return t.containsPoint(r)||t._findTargetCorner(n)},_normalizePointer:function(e,t){var n=this.getActiveGroup(),r=t.x,i=t.y,s=n&&e.type!=="group"&&n.contains(e),o;return s&&(o=new fabric.Point(n.left,n.top),o=fabric.util.transformPoint(o,this.viewportTransform,!0),r-=o.x,i-=o.y),{x:r,y:i}},isTargetTransparent:function(e,t,n){var r=e.hasBorders,i=e.transparentCorners;e.hasBorders=e.transparentCorners=!1,this._draw(this.contextCache,e),e.hasBorders=r,e.transparentCorners=i;var s=fabric.util.isTransparent(this.contextCache,t,n,this.targetFindTolerance);return this.clearContext(this.contextCache),s},_shouldClearSelection:function(e,t){var n=this.getActiveGroup(),r=this.getActiveObject();return!t||t&&n&&!n.contains(t)&&n!==t&&!e.shiftKey||t&&!t.evented||t&&!t.selectable&&r&&r!==t},_shouldCenterTransform:function(e,t){if(!t)return;var n=this._currentTransform,r;return n.action==="scale"||n.action==="scaleX"||n.action==="scaleY"?r=this.centeredScaling||t.centeredScaling:n.action==="rotate"&&(r=this.centeredRotation||t.centeredRotation),r?!e.altKey:e.altKey},_getOriginFromCorner:function(e,t){var n={x:e.originX,y:e.originY};if(t==="ml"||t==="tl"||t==="bl")n.x="right";else if(t==="mr"||t==="tr"||t==="br")n.x="left";if(t==="tl"||t==="mt"||t==="tr")n.y="bottom";else if(t==="bl"||t==="mb"||t==="br")n.y="top";return n},_getActionFromCorner:function(e,t){var n="drag";return t&&(n=t==="ml"||t==="mr"?"scaleX":t==="mt"||t==="mb"?"scaleY":t==="mtr"?"rotate":"scale"),n},_setupCurrentTransform:function(e,n){if(!n)return;var r=this.getPointer(e),i=n._findTargetCorner(this.getPointer(e,!0)),s=this._getActionFromCorner(n,i),o=this._getOriginFromCorner(n,i);this._currentTransform={target:n,action:s,scaleX:n.scaleX,scaleY:n.scaleY,offsetX:r.x-n.left,offsetY:r.y-n.top,originX:o.x,originY:o.y,ex:r.x,ey:r.y,left:n.left,top:n.top,theta:t(n.angle),width:n.width*n.scaleX,mouseXSign:1,mouseYSign:1},this._currentTransform.original={left:n.left,top:n.top,scaleX:n.scaleX,scaleY:n.scaleY,originX:o.x,originY:o.y},this._resetCurrentTransform(e)},_translateObject:function(e,t){var n=this._currentTransform.target;n.get("lockMovementX")||n.set("left",e-this._currentTransform.offsetX),n.get("lockMovementY")||n.set("top",t-this._currentTransform.offsetY)},_scaleObject:function(e,t,n){var r=this._currentTransform,i=r.target,s=i.get("lockScalingX"),o=i.get("lockScalingY");if(s&&o)return;var u=i.translateToOriginPoint(i.getCenterPoint(),r.originX,r.originY),a=i.toLocalPoint(new fabric.Point(e,t),r.originX,r.originY);this._setLocalMouse(a,r),this._setObjectScale(a,r,s,o,n),i.setPositionByOrigin(u,r.originX,r.originY)},_setObjectScale:function(e,t,n,r,i){var s=t.target;t.newScaleX=s.scaleX,t.newScaleY=s.scaleY,i==="equally"&&!n&&!r?this._scaleObjectEqually(e,s,t):i?i==="x"&&!s.get("lockUniScaling")?(t.newScaleX=e.x/(s.width+s.strokeWidth),n||s.set("scaleX",t.newScaleX)):i==="y"&&!s.get("lockUniScaling")&&(t.newScaleY=e.y/(s.height+s.strokeWidth),r||s.set("scaleY",t.newScaleY)):(t.newScaleX=e.x/(s.width+s.strokeWidth),t.newScaleY=e.y/(s.height+s.strokeWidth),n||s.set("scaleX",t.newScaleX),r||s.set("scaleY",t.newScaleY)),this._flipObject(t)},_scaleObjectEqually:function(e,t,n){var r=e.y+e.x,i=(t.height+t.strokeWidth)*n.original.scaleY+(t.width+t.strokeWidth)*n.original.scaleX;n.newScaleX=n.original.scaleX*r/i,n.newScaleY=n.original.scaleY*r/i,t.set("scaleX",n.newScaleX),t.set("scaleY",n.newScaleY)},_flipObject:function(e){e.newScaleX<0&&(e.originX==="left"?e.originX="right":e.originX==="right"&&(e.originX="left")),e.newScaleY<0&&(e.originY==="top"?e.originY="bottom":e.originY==="bottom"&&(e.originY="top"))},_setLocalMouse:function(e,t){var n=t.target;t.originX==="right"?e.x*=-1:t.originX==="center"&&(e.x*=t.mouseXSign*2,e.x<0&&(t.mouseXSign=-t.mouseXSign)),t.originY==="bottom"?e.y*=-1:t.originY==="center"&&(e.y*=t.mouseYSign*2,e.y<0&&(t.mouseYSign=-t.mouseYSign)),i(e.x)>n.padding?e.x<0?e.x+=n.padding:e.x-=n.padding:e.x=0,i(e.y)>n.padding?e.y<0?e.y+=n.padding:e.y-=n.padding:e.y=0},_rotateObject:function(e,t){var i=this._currentTransform;if(i.target.get("lockRotation"))return;var s=r(i.ey-i.top,i.ex-i.left),o=r(t-i.top,e-i.left),u=n(o-s+i.theta);u<0&&(u=360+u),i.target.angle=u},setCursor:function(e){this.upperCanvasEl.style.cursor=e},_resetObjectTransform:function(e){e.scaleX=1,e.scaleY=1,e.setAngle(0)},_drawSelection:function(){var e=this.contextTop,t=this._groupSelector,n=t.left,r=t.top,o=i(n),u=i(r);e.fillStyle=this.selectionColor,e.fillRect(t.ex-(n>0?0:-n),t.ey-(r>0?0:-r),o,u),e.lineWidth=this.selectionLineWidth,e.strokeStyle=this.selectionBorderColor;if(this.selectionDashArray.length>1){var a=t.ex+s-(n>0?0:o),f=t.ey+s-(r>0?0:u);e.beginPath(),fabric.util.drawDashedLine(e,a,f,a+o,f,this.selectionDashArray),fabric.util.drawDashedLine(e,a,f+u-1,a+o,f+u-1,this.selectionDashArray),fabric.util.drawDashedLine(e,a,f,a,f+u,this.selectionDashArray),fabric.util.drawDashedLine(e,a+o-1,f,a+o-1,f+u,this.selectionDashArray),e.closePath(),e.stroke()}else e.strokeRect(t.ex+s-(n>0?0:o),t.ey+s-(r>0?0:u),o,u)},_isLastRenderedObject:function(e){return this.controlsAboveOverlay&&this.lastRenderedObjectWithControlsAboveOverlay&&this.lastRenderedObjectWithControlsAboveOverlay.visible&&this.containsPoint(e,this.lastRenderedObjectWithControlsAboveOverlay)&&this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(e,!0))},findTarget:function(e,t){if(this.skipTargetFind)return;if(this._isLastRenderedObject(e))return this.lastRenderedObjectWithControlsAboveOverlay;var n=this.getActiveGroup();if(n&&!t&&this.containsPoint(e,n))return n;var r=this._searchPossibleTargets(e);return this._fireOverOutEvents(r),r},_fireOverOutEvents:function(e){e?this._hoveredTarget!==e&&(this.fire("mouse:over",{target:e}),e.fire("mouseover"),this._hoveredTarget&&(this.fire("mouse:out",{target:this._hoveredTarget}),this._hoveredTarget.fire("mouseout")),this._hoveredTarget=e):this._hoveredTarget&&(this.fire("mouse:out",{target:this._hoveredTarget}),this._hoveredTarget.fire("mouseout"),this._hoveredTarget=null)},_checkTarget:function(e,t,n){if(t&&t.visible&&t.evented&&this.containsPoint(e,t)){if(!this.perPixelTargetFind&&!t.perPixelTargetFind||!!t.isEditing)return!0;var r=this.isTargetTransparent(t,n.x,n.y);if(!r)return!0}},_searchPossibleTargets:function(e){var t,n=this.getPointer(e,!0),r=this._objects.length;while(r--)if(this._checkTarget(e,this._objects[r],n)){this.relatedTarget=this._objects[r],t=this._objects[r];break}return t},getPointer:function(t,n,r){r||(r=this.upperCanvasEl);var i=e(t,r),s=r.getBoundingClientRect(),o;return this.calcOffset(),i.x=i.x-this._offset.left,i.y=i.y-this._offset.top,n||(i=fabric.util.transformPoint(i,fabric.util.invertTransform(this.viewportTransform))),s.width===0||s.height===0?o={width:1,height:1}:o={width:r.width/s.width,height:r.height/s.height},{x:i.x*o.width,y:i.y*o.height}},_createUpperCanvas:function(){var e=this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/,"");this.upperCanvasEl=this._createCanvasElement(),fabric.util.addClass(this.upperCanvasEl,"upper-canvas "+e),this.wrapperEl.appendChild(this.upperCanvasEl),this._copyCanvasStyle(this.lowerCanvasEl,this.upperCanvasEl),this._applyCanvasStyle(this.upperCanvasEl),this.contextTop=this.upperCanvasEl.getContext("2d")},_createCacheCanvas:function(){this.cacheCanvasEl=this._createCanvasElement(),this.cacheCanvasEl.setAttribute("width",this.width),this.cacheCanvasEl.setAttribute("height",this.height),this.contextCache=this.cacheCanvasEl.getContext("2d")},_initWrapperElement:function(){this.wrapperEl=fabric.util.wrapElement(this.lowerCanvasEl,"div",{"class":this.containerClass}),fabric.util.setStyle(this.wrapperEl,{width:this.getWidth()+"px",height:this.getHeight()+"px",position:"relative"}),fabric.util.makeElementUnselectable(this.wrapperEl)},_applyCanvasStyle:function(e){var t=this.getWidth()||e.width,n=this.getHeight()||e.height;fabric.util.setStyle(e,{position:"absolute",width:t+"px",height:n+"px",left:0,top:0}),e.width=t,e.height=n,fabric.util.makeElementUnselectable(e)},_copyCanvasStyle:function(e,t){t.style.cssText=e.style.cssText},getSelectionContext:function(){return this.contextTop},getSelectionElement:function(){return this.upperCanvasEl},_setActiveObject:function(e){this._activeObject&&this._activeObject.set("active",!1),this._activeObject=e,e.set("active",!0)},setActiveObject:function(e,t){return this._setActiveObject(e),this.renderAll(),this.fire("object:selected",{target:e,e:t}),e.fire("selected",{e:t}),this},getActiveObject:function(){return this._activeObject},_discardActiveObject:function(){this._activeObject&&this._activeObject.set("active",!1),this._activeObject=null},discardActiveObject:function(e){return this._discardActiveObject(),this.renderAll(),this.fire("selection:cleared",{e:e}),this},_setActiveGroup:function(e){this._activeGroup=e,e&&e.set("active",!0)},setActiveGroup:function(e,t){return this._setActiveGroup(e),e&&(this.fire("object:selected",{target:e,e:t}),e.fire("selected",{e:t})),this},getActiveGroup:function(){return this._activeGroup},_discardActiveGroup:function(){var e=this.getActiveGroup();e&&e.destroy(),this.setActiveGroup(null)},discardActiveGroup:function(e){return this._discardActiveGroup(),this.fire("selection:cleared",{e:e}),this},deactivateAll:function(){var e=this.getObjects(),t=0,n=e.length;for(;t<n;t++)e[t].set("active",!1);return this._discardActiveGroup(),this._discardActiveObject(),this},deactivateAllWithDispatch:function(e){var t=this.getActiveGroup()||this.getActiveObject();return t&&this.fire("before:selection:cleared",{target:t,e:e}),this.deactivateAll(),t&&this.fire("selection:cleared",{e:e}),this},drawControls:function(e){var t=this.getActiveGroup();t?this._drawGroupControls(e,t):this._drawObjectsControls(e)},_drawGroupControls:function(e,t){t._renderControls(e)},_drawObjectsControls:function(e){for(var t=0,n=this._objects.length;t<n;++t){if(!this._objects[t]||!this._objects[t].active)continue;this._objects[t]._renderControls(e),this.lastRenderedObjectWithControlsAboveOverlay=this._objects[t]}}});for(var o in fabric.StaticCanvas)o!=="prototype"&&(fabric.Canvas[o]=fabric.StaticCanvas[o]);fabric.isTouchSupported&&(fabric.Canvas.prototype._setCursorFromEvent=function(){}),fabric.Element=fabric.Canvas}(),function(){var e={mt:0,tr:1,mr:2,br:3,mb:4,bl:5,ml:6,tl:7},t=fabric.util.addListener,n=fabric.util.removeListener;fabric.util.object.extend(fabric.Canvas.prototype,{cursorMap:["n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize","nw-resize"],_initEventListeners:function(){this._bindEvents(),t(fabric.window,"resize",this._onResize),t(this.upperCanvasEl,"mousedown",this._onMouseDown),t(this.upperCanvasEl,"mousemove",this._onMouseMove),t(this.upperCanvasEl,"mousewheel",this._onMouseWheel),t(this.upperCanvasEl,"touchstart",this._onMouseDown),t(this.upperCanvasEl,"touchmove",this._onMouseMove),typeof Event!="undefined"&&"add"in Event&&(Event.add(this.upperCanvasEl,"gesture",this._onGesture),Event.add(this.upperCanvasEl,"drag",this._onDrag),Event.add(this.upperCanvasEl,"orientation",this._onOrientationChange),Event.add(this.upperCanvasEl,"shake",this._onShake))},_bindEvents:function(){this._onMouseDown=this._onMouseDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),this._onMouseUp=this._onMouseUp.bind(this),this._onResize=this._onResize.bind(this),this._onGesture=this._onGesture.bind(this),this._onDrag=this._onDrag.bind(this),this._onShake=this._onShake.bind(this),this._onOrientationChange=this._onOrientationChange.bind(this),this._onMouseWheel=this._onMouseWheel.bind(this)},removeListeners:function(){n(fabric.window,"resize",this._onResize),n(this.upperCanvasEl,"mousedown",this._onMouseDown),n(this.upperCanvasEl,"mousemove",this._onMouseMove),n(this.upperCanvasEl,"mousewheel",this._onMouseWheel),n(this.upperCanvasEl,"touchstart",this._onMouseDown),n(this.upperCanvasEl,"touchmove",this._onMouseMove),typeof Event!="undefined"&&"remove"in Event&&(Event.remove(this.upperCanvasEl,"gesture",this._onGesture),Event.remove(this.upperCanvasEl,"drag",this._onDrag),Event.remove(this.upperCanvasEl,"orientation",this._onOrientationChange),Event.remove(this.upperCanvasEl,"shake",this._onShake))},_onGesture:function(e,t){this.__onTransformGesture&&this.__onTransformGesture(e,t)},_onDrag:function(e,t){this.__onDrag&&this.__onDrag(e,t)},_onMouseWheel:function(e,t){this.__onMouseWheel&&this.__onMouseWheel(e,t)},_onOrientationChange:function(e,t){this.__onOrientationChange&&this.__onOrientationChange(e,t)},_onShake:function(e,t){this.__onShake&&this.__onShake(e,t)},_onMouseDown:function(e){this.__onMouseDown(e),t(fabric.document,"touchend",this._onMouseUp),t(fabric.document,"touchmove",this._onMouseMove),n(this.upperCanvasEl,"mousemove",this._onMouseMove),n(this.upperCanvasEl,"touchmove",this._onMouseMove),e.type==="touchstart"?n(this.upperCanvasEl,"mousedown",this._onMouseDown):(t(fabric.document,"mouseup",this._onMouseUp),t(fabric.document,"mousemove",this._onMouseMove))},_onMouseUp:function(e){this.__onMouseUp(e),n(fabric.document,"mouseup",this._onMouseUp),n(fabric.document,"touchend",this._onMouseUp),n(fabric.document,"mousemove",this._onMouseMove),n(fabric.document,"touchmove",this._onMouseMove),t(this.upperCanvasEl,"mousemove",this._onMouseMove),t(this.upperCanvasEl,"touchmove",this._onMouseMove);if(e.type==="touchend"){var r=this;setTimeout(function(){t(r.upperCanvasEl,"mousedown",r._onMouseDown)},400)}},_onMouseMove:function(e){!this.allowTouchScrolling&&e.preventDefault&&e.preventDefault(),this.__onMouseMove(e)},_onResize:function(){this.calcOffset()},_shouldRender:function(e,t){var n=this.getActiveGroup()||this.getActiveObject();return!!(e&&(e.isMoving||e!==n)||!e&&!!n||!e&&!n&&!this._groupSelector||t&&this._previousPointer&&this.selection&&(t.x!==this._previousPointer.x||t.y!==this._previousPointer.y))},__onMouseUp:function(e){var t;if(this.isDrawingMode&&this._isCurrentlyDrawing){this._onMouseUpInDrawingMode(e);return}this._currentTransform?(this._finalizeCurrentTransform(),t=this._currentTransform.target):t=this.findTarget(e,!0);var n=this._shouldRender(t,this.getPointer(e));this._maybeGroupObjects(e),t&&(t.isMoving=!1),n&&this.renderAll(),this._handleCursorAndEvent(e,t)},_handleCursorAndEvent:function(e,t){this._setCursorFromEvent(e,t);var n=this;setTimeout(function(){n._setCursorFromEvent(e,t)},50),this.fire("mouse:up",{target:t,e:e}),t&&t.fire("mouseup",{e:e})},_finalizeCurrentTransform:function(){var e=this._currentTransform,t=e.target;t._scaling&&(t._scaling=!1),t.setCoords(),this.stateful&&t.hasStateChanged()&&(this.fire("object:modified",{target:t}),t.fire("modified")),this._restoreOriginXY(t)},_restoreOriginXY:function(e){if(this._previousOriginX&&this._previousOriginY){var t=e.translateToOriginPoint(e.getCenterPoint(),this._previousOriginX,this._previousOriginY);e.originX=this._previousOriginX,e.originY=this._previousOriginY,e.left=t.x,e.top=t.y,this._previousOriginX=null,this._previousOriginY=null}},_onMouseDownInDrawingMode:function(e){this._isCurrentlyDrawing=!0,this.discardActiveObject(e).renderAll(),this.clipTo&&fabric.util.clipContext(this,this.contextTop);var t=fabric.util.invertTransform(this.viewportTransform),n=fabric.util.transformPoint(this.getPointer(e,!0),t);this.freeDrawingBrush.onMouseDown(n),this.fire("mouse:down",{e:e})},_onMouseMoveInDrawingMode:function(e){if(this._isCurrentlyDrawing){var t=fabric.util.invertTransform(this.viewportTransform),n=fabric.util.transformPoint(this.getPointer(e,!0),t);this.freeDrawingBrush.onMouseMove(n)}this.setCursor(this.freeDrawingCursor),this.fire("mouse:move",{e:e})},_onMouseUpInDrawingMode:function(e){this._isCurrentlyDrawing=!1,this.clipTo&&this.contextTop.restore(),this.freeDrawingBrush.onMouseUp(),this.fire("mouse:up",{e:e})},__onMouseDown:function(e){var t="which"in e?e.which===1:e.button===1;if(!t&&!fabric.isTouchSupported)return;if(this.isDrawingMode){this._onMouseDownInDrawingMode(e);return}if(this._currentTransform)return;var n=this.findTarget(e),r=this.getPointer(e,!0);this._previousPointer=r;var i=this._shouldRender(n,r),s=this._shouldGroup(e,n);this._shouldClearSelection(e,n)?this._clearSelection(e,n,r):s&&(this._handleGrouping(e,n),n=this.getActiveGroup()),n&&n.selectable&&!s&&(this._beforeTransform(e,n),this._setupCurrentTransform(e,n)),i&&this.renderAll(),this.fire("mouse:down",{target:n,e:e}),n&&n.fire("mousedown",{e:e})},_beforeTransform:function(e,t){var n;this.stateful&&t.saveState(),(n=t._findTargetCorner(this.getPointer(e)))&&this.onBeforeScaleRotate(t),t!==this.getActiveGroup()&&t!==this.getActiveObject()&&(this.deactivateAll(),this.setActiveObject(t,e))},_clearSelection:function(e,t,n){this.deactivateAllWithDispatch(e),t&&t.selectable?this.setActiveObject(t,e):this.selection&&(this._groupSelector={ex:n.x,ey:n.y,top:0,left:0})},_setOriginToCenter:function(e){this._previousOriginX=this._currentTransform.target.originX,this._previousOriginY=this._currentTransform.target.originY;var t=e.getCenterPoint();e.originX="center",e.originY="center",e.left=t.x,e.top=t.y,this._currentTransform.left=e.left,this._currentTransform.top=e.top},_setCenterToOrigin:function(e){var t=e.translateToOriginPoint(e.getCenterPoint(),this._previousOriginX,this._previousOriginY);e.originX=this._previousOriginX,e.originY=this._previousOriginY,e.left=t.x,e.top=t.y,this._previousOriginX=null,this._previousOriginY=null},__onMouseMove:function(e){var t,n;if(this.isDrawingMode){this._onMouseMoveInDrawingMode(e);return}var r=this._groupSelector;r?(n=this.getPointer(e,!0),r.left=n.x-r.ex,r.top=n.y-r.ey,this.renderTop()):this._currentTransform?this._transformObject(e):(t=this.findTarget(e),!t||t&&!t.selectable?this.setCursor(this.defaultCursor):this._setCursorFromEvent(e,t)),this.fire("mouse:move",{target:t,e:e}),t&&t.fire("mousemove",{e:e})},_transformObject:function(e){var t=this.getPointer(e),n=this._currentTransform;n.reset=!1,n.target.isMoving=!0,this._beforeScaleTransform(e,n),this._performTransformAction(e,n,t),this.renderAll()},_performTransformAction:function(e,t,n){var r=n.x,i=n.y,s=t.target,o=t.action;o==="rotate"?(this._rotateObject(r,i),this._fire("rotating",s,e)):o==="scale"?(this._onScale(e,t,r,i),this._fire("scaling",s,e)):o==="scaleX"?(this._scaleObject(r,i,"x"),this._fire("scaling",s,e)):o==="scaleY"?(this._scaleObject(r,i,"y"),this._fire("scaling",s,e)):(this._translateObject(r,i),this._fire("moving",s,e),this.setCursor(this.moveCursor))},_fire:function(e,t,n){this.fire("object:"+e,{target:t,e:n}),t.fire(e,{e:n})},_beforeScaleTransform:function(e,t){if(t.action==="scale"||t.action==="scaleX"||t.action==="scaleY"){var n=this._shouldCenterTransform(e,t.target);if(n&&(t.originX!=="center"||t.originY!=="center")||!n&&t.originX==="center"&&t.originY==="center")this._resetCurrentTransform(e),t.reset=!0}},_onScale:function(e,t,n,r){(e.shiftKey||this.uniScaleTransform)&&!t.target.get("lockUniScaling")?(t.currentAction="scale",this._scaleObject(n,r)):(!t.reset&&t.currentAction==="scale"&&this._resetCurrentTransform(e,t.target),t.currentAction="scaleEqually",this._scaleObject(n,r,"equally"))},_setCursorFromEvent:function(e,t){if(!t||!t.selectable)return this.setCursor(this.defaultCursor),!1;var n=this.getActiveGroup(),r=t._findTargetCorner&&(!n||!n.contains(t))&&t._findTargetCorner(this.getPointer(e,!0));return r?this._setCornerCursor(r,t):this.setCursor(t.hoverCursor||this.hoverCursor),!0},_setCornerCursor:function(t,n){if(t in e)this.setCursor(this._getRotatedCornerCursor(t,n));else{if(t!=="mtr"||!n.hasRotatingPoint)return this.setCursor(this.defaultCursor),!1;this.setCursor(this.rotationCursor)}},_getRotatedCornerCursor:function(t,n){var r=Math.round(n.getAngle()%360/45);return r<0&&(r+=8),r+=e[t],r%=8,this.cursorMap[r]}})}(),function(){var e=Math.min,t=Math.max;fabric.util.object.extend(fabric.Canvas.prototype,{_shouldGroup:function(e,t){var n=this.getActiveObject();return e.shiftKey&&(this.getActiveGroup()||n&&n!==t)&&this.selection},_handleGrouping:function(e,t){if(t===this.getActiveGroup()){t=this.findTarget(e,!0);if(!t||t.isType("group"))return}this.getActiveGroup()?this._updateActiveGroup(t,e):this._createActiveGroup(t,e),this._activeGroup&&this._activeGroup.saveCoords()},_updateActiveGroup:function(e,t){var n=this.getActiveGroup();if(n.contains(e)){n.removeWithUpdate(e),this._resetObjectTransform(n),e.set("active",!1);if(n.size()===1){this.discardActiveGroup(t),this.setActiveObject(n.item(0));return}}else n.addWithUpdate(e),this._resetObjectTransform(n);this.fire("selection:created",{target:n,e:t}),n.set("active",!0)},_createActiveGroup:function(e,t){if(this._activeObject&&e!==this._activeObject){var n=this._createGroup(e);n.addWithUpdate(),this.setActiveGroup(n),this._activeObject=null,this.fire("selection:created",{target:n,e:t})}e.set("active",!0)},_createGroup:function(e){var t=this.getObjects(),n=t.indexOf(this._activeObject)<t.indexOf(e),r=n?[this._activeObject,e]:[e,this._activeObject];return new fabric.Group(r,{originX:"center",originY:"center",canvas:this})},_groupSelectedObjects:function(e){var t=this._collectObjects();t.length===1?this.setActiveObject(t[0],e):t.length>1&&(t=new fabric.Group(t.reverse(),{originX:"center",originY:"center",canvas:this}),t.addWithUpdate(),this.setActiveGroup(t,e),t.saveCoords(),this.fire("selection:created",{target:t}),this.renderAll())},_collectObjects:function(){var n=[],r,i=this._groupSelector.ex,s=this._groupSelector.ey,o=i+this._groupSelector.left,u=s+this._groupSelector.top,a=new fabric.Point(e(i,o),e(s,u)),f=new fabric.Point(t(i,o),t(s,u)),l=i===o&&s===u;for(var c=this._objects.length;c--;){r=this._objects[c];if(!r||!r.selectable||!r.visible)continue;if(r.intersectsWithRect(a,f)||r.isContainedWithinRect(a,f)||r.containsPoint(a)||r.containsPoint(f)){r.set("active",!0),n.push(r);if(l)break}}return n},_maybeGroupObjects:function(e){this.selection&&this._groupSelector&&this._groupSelectedObjects(e);var t=this.getActiveGroup();t&&(t.setObjectsCoords().setCoords(),t.isMoving=!1,this.setCursor(this.defaultCursor)),this._groupSelector=null,this._currentTransform=null}})}(),fabric.util.object.extend(fabric.StaticCanvas.prototype,{toDataURL:function(e){e||(e={});var t=e.format||"png",n=e.quality||1,r=e.multiplier||1,i={left:e.left,top:e.top,width:e.width,height:e.height};return r!==1?this.__toDataURLWithMultiplier(t,n,i,r):this.__toDataURL(t,n,i)},__toDataURL:function(e,t,n){this.renderAll(!0);var r=this.upperCanvasEl||this.lowerCanvasEl,i=this.__getCroppedCanvas(r,n);e==="jpg"&&(e="jpeg");var s=fabric.StaticCanvas.supports("toDataURLWithQuality")?(i||r).toDataURL("image/"+e,t):(i||r).toDataURL("image/"+e);return this.contextTop&&this.clearContext(this.contextTop),this.renderAll(),i&&(i=null),s},__getCroppedCanvas:function(e,t){var n,r,i="left"in t||"top"in t||"width"in t||"height"in t;return i&&(n=fabric.util.createCanvasElement(),r=n.getContext("2d"),n.width=t.width||this.width,n.height=t.height||this.height,r.drawImage(e,-t.left||0,-t.top||0)),n},__toDataURLWithMultiplier:function(e,t,n,r){var i=this.getWidth(),s=this.getHeight(),o=i*r,u=s*r,a=this.getActiveObject(),f=this.getActiveGroup(),l=this.contextTop||this.contextContainer;r>1&&this.setWidth(o).setHeight(u),l.scale(r,r),n.left&&(n.left*=r),n.top&&(n.top*=r),n.width?n.width*=r:r<1&&(n.width=o),n.height?n.height*=r:r<1&&(n.height=u),f?this._tempRemoveBordersControlsFromGroup(f):a&&this.deactivateAll&&this.deactivateAll(),this.renderAll(!0);var c=this.__toDataURL(e,t,n);return this.width=i,this.height=s,l.scale(1/r,1/r),this.setWidth(i).setHeight(s),f?this._restoreBordersControlsOnGroup(f):a&&this.setActiveObject&&this.setActiveObject(a),this.contextTop&&this.clearContext(this.contextTop),this.renderAll(),c},toDataURLWithMultiplier:function(e,t,n){return this.toDataURL({format:e,multiplier:t,quality:n})},_tempRemoveBordersControlsFromGroup:function(e){e.origHasControls=e.hasControls,e.origBorderColor=e.borderColor,e.hasControls=!0,e.borderColor="rgba(0,0,0,0)",e.forEachObject(function(e){e.origBorderColor=e.borderColor,e.borderColor="rgba(0,0,0,0)"})},_restoreBordersControlsOnGroup:function(e){e.hideControls=e.origHideControls,e.borderColor=e.origBorderColor,e.forEachObject(function(e){e.borderColor=e.origBorderColor,delete e.origBorderColor})}}),fabric.util.object.extend(fabric.StaticCanvas.prototype,{loadFromDatalessJSON:function(e,t,n){return this.loadFromJSON(e,t,n)},loadFromJSON:function(e,t,n){if(!e)return;var r=typeof e=="string"?JSON.parse(e):e;this.clear();var i=this;return this._enlivenObjects(r.objects,function(){i._setBgOverlay(r,t)},n),this},_setBgOverlay:function(e
,t){var n=this,r={backgroundColor:!1,overlayColor:!1,backgroundImage:!1,overlayImage:!1};if(!e.backgroundImage&&!e.overlayImage&&!e.background&&!e.overlay){t&&t();return}var i=function(){r.backgroundImage&&r.overlayImage&&r.backgroundColor&&r.overlayColor&&(n.renderAll(),t&&t())};this.__setBgOverlay("backgroundImage",e.backgroundImage,r,i),this.__setBgOverlay("overlayImage",e.overlayImage,r,i),this.__setBgOverlay("backgroundColor",e.background,r,i),this.__setBgOverlay("overlayColor",e.overlay,r,i),i()},__setBgOverlay:function(e,t,n,r){var i=this;if(!t){n[e]=!0;return}e==="backgroundImage"||e==="overlayImage"?fabric.Image.fromObject(t,function(t){i[e]=t,n[e]=!0,r&&r()}):this["set"+fabric.util.string.capitalize(e,!0)](t,function(){n[e]=!0,r&&r()})},_enlivenObjects:function(e,t,n){var r=this;if(!e||e.length===0){t&&t();return}var i=this.renderOnAddRemove;this.renderOnAddRemove=!1,fabric.util.enlivenObjects(e,function(e){e.forEach(function(e,t){r.insertAt(e,t,!0)}),r.renderOnAddRemove=i,t&&t()},null,n)},_toDataURL:function(e,t){this.clone(function(n){t(n.toDataURL(e))})},_toDataURLWithMultiplier:function(e,t,n){this.clone(function(r){n(r.toDataURLWithMultiplier(e,t))})},clone:function(e,t){var n=JSON.stringify(this.toJSON(t));this.cloneWithoutData(function(t){t.loadFromJSON(n,function(){e&&e(t)})})},cloneWithoutData:function(e){var t=fabric.document.createElement("canvas");t.width=this.getWidth(),t.height=this.getHeight();var n=new fabric.Canvas(t);n.clipTo=this.clipTo,this.backgroundImage?(n.setBackgroundImage(this.backgroundImage.src,function(){n.renderAll(),e&&e(n)}),n.backgroundImageOpacity=this.backgroundImageOpacity,n.backgroundImageStretch=this.backgroundImageStretch):e&&e(n)}}),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.toFixed,i=t.util.string.capitalize,s=t.util.degreesToRadians,o=t.StaticCanvas.supports("setLineDash");if(t.Object)return;t.Object=t.util.createClass({type:"object",originX:"left",originY:"top",top:0,left:0,width:0,height:0,scaleX:1,scaleY:1,flipX:!1,flipY:!1,opacity:1,angle:0,cornerSize:12,transparentCorners:!0,hoverCursor:null,padding:0,borderColor:"rgba(102,153,255,0.75)",cornerColor:"rgba(102,153,255,0.5)",centeredScaling:!1,centeredRotation:!0,fill:"rgb(0,0,0)",fillRule:"source-over",backgroundColor:"",stroke:null,strokeWidth:1,strokeDashArray:null,strokeLineCap:"butt",strokeLineJoin:"miter",strokeMiterLimit:10,shadow:null,borderOpacityWhenMoving:.4,borderScaleFactor:1,transformMatrix:null,minScaleLimit:.01,selectable:!0,evented:!0,visible:!0,hasControls:!0,hasBorders:!0,hasRotatingPoint:!0,rotatingPointOffset:40,perPixelTargetFind:!1,includeDefaultValues:!0,clipTo:null,lockMovementX:!1,lockMovementY:!1,lockRotation:!1,lockScalingX:!1,lockScalingY:!1,lockUniScaling:!1,stateProperties:"top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule shadow clipTo visible backgroundColor".split(" "),initialize:function(e){e&&this.setOptions(e)},_initGradient:function(e){e.fill&&e.fill.colorStops&&!(e.fill instanceof t.Gradient)&&this.set("fill",new t.Gradient(e.fill))},_initPattern:function(e){e.fill&&e.fill.source&&!(e.fill instanceof t.Pattern)&&this.set("fill",new t.Pattern(e.fill)),e.stroke&&e.stroke.source&&!(e.stroke instanceof t.Pattern)&&this.set("stroke",new t.Pattern(e.stroke))},_initClipping:function(e){if(!e.clipTo||typeof e.clipTo!="string")return;var n=t.util.getFunctionBody(e.clipTo);typeof n!="undefined"&&(this.clipTo=new Function("ctx",n))},setOptions:function(e){for(var t in e)this.set(t,e[t]);this._initGradient(e),this._initPattern(e),this._initClipping(e)},transform:function(e,t){this.group&&this.group.transform(e,t),e.globalAlpha=this.opacity;var n=t?this._getLeftTopCoords():this.getCenterPoint();e.translate(n.x,n.y),e.rotate(s(this.angle)),e.scale(this.scaleX*(this.flipX?-1:1),this.scaleY*(this.flipY?-1:1))},toObject:function(e){var n=t.Object.NUM_FRACTION_DIGITS,i={type:this.type,originX:this.originX,originY:this.originY,left:r(this.left,n),top:r(this.top,n),width:r(this.width,n),height:r(this.height,n),fill:this.fill&&this.fill.toObject?this.fill.toObject():this.fill,stroke:this.stroke&&this.stroke.toObject?this.stroke.toObject():this.stroke,strokeWidth:r(this.strokeWidth,n),strokeDashArray:this.strokeDashArray,strokeLineCap:this.strokeLineCap,strokeLineJoin:this.strokeLineJoin,strokeMiterLimit:r(this.strokeMiterLimit,n),scaleX:r(this.scaleX,n),scaleY:r(this.scaleY,n),angle:r(this.getAngle(),n),flipX:this.flipX,flipY:this.flipY,opacity:r(this.opacity,n),shadow:this.shadow&&this.shadow.toObject?this.shadow.toObject():this.shadow,visible:this.visible,clipTo:this.clipTo&&String(this.clipTo),backgroundColor:this.backgroundColor};return this.includeDefaultValues||(i=this._removeDefaultValues(i)),t.util.populateWithProperties(this,i,e),i},toDatalessObject:function(e){return this.toObject(e)},_removeDefaultValues:function(e){var n=t.util.getKlass(e.type).prototype,r=n.stateProperties;return r.forEach(function(t){e[t]===n[t]&&delete e[t]}),e},toString:function(){return"#<fabric."+i(this.type)+">"},get:function(e){return this[e]},_setObject:function(e){for(var t in e)this._set(t,e[t])},set:function(e,t){return typeof e=="object"?this._setObject(e):typeof t=="function"&&e!=="clipTo"?this._set(e,t(this.get(e))):this._set(e,t),this},_set:function(e,n){var i=e==="scaleX"||e==="scaleY";return i&&(n=this._constrainScale(n)),e==="scaleX"&&n<0?(this.flipX=!this.flipX,n*=-1):e==="scaleY"&&n<0?(this.flipY=!this.flipY,n*=-1):e==="width"||e==="height"?this.minScaleLimit=r(Math.min(.1,1/Math.max(this.width,this.height)),2):e==="shadow"&&n&&!(n instanceof t.Shadow)&&(n=new t.Shadow(n)),this[e]=n,this},toggle:function(e){var t=this.get(e);return typeof t=="boolean"&&this.set(e,!t),this},setSourcePath:function(e){return this.sourcePath=e,this},getViewportTransform:function(){return this.canvas&&this.canvas.viewportTransform?this.canvas.viewportTransform:[1,0,0,1,0,0]},render:function(e,n){if(this.width===0||this.height===0||!this.visible)return;e.save(),this._setupFillRule(e),this._transform(e,n),this._setStrokeStyles(e),this._setFillStyles(e);var r=this.transformMatrix;r&&this.group&&(e.translate(-this.group.width/2,-this.group.height/2),e.transform(r[0],r[1],r[2],r[3],r[4],r[5])),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e),this._render(e,n),this.clipTo&&e.restore(),this._removeShadow(e),this._restoreFillRule(e),e.restore()},_transform:function(e,t){var n=this.transformMatrix;n&&!this.group&&e.setTransform(n[0],n[1],n[2],n[3],n[4],n[5]),t||this.transform(e)},_setStrokeStyles:function(e){this.stroke&&(e.lineWidth=this.strokeWidth,e.lineCap=this.strokeLineCap,e.lineJoin=this.strokeLineJoin,e.miterLimit=this.strokeMiterLimit,e.strokeStyle=this.stroke.toLive?this.stroke.toLive(e):this.stroke)},_setFillStyles:function(e){this.fill&&(e.fillStyle=this.fill.toLive?this.fill.toLive(e):this.fill)},_renderControls:function(e,n){var r=this.getViewportTransform();e.save();if(this.active&&!n){var i;this.group&&(i=t.util.transformPoint(this.group.getCenterPoint(),r),e.translate(i.x,i.y),e.rotate(s(this.group.angle))),i=t.util.transformPoint(this.getCenterPoint(),r,null!=this.group),this.group&&(i.x*=this.group.scaleX,i.y*=this.group.scaleY),e.translate(i.x,i.y),e.rotate(s(this.angle)),this.drawBorders(e),this.drawControls(e)}e.restore()},_setShadow:function(e){if(!this.shadow)return;e.shadowColor=this.shadow.color,e.shadowBlur=this.shadow.blur,e.shadowOffsetX=this.shadow.offsetX,e.shadowOffsetY=this.shadow.offsetY},_removeShadow:function(e){if(!this.shadow)return;e.shadowColor="",e.shadowBlur=e.shadowOffsetX=e.shadowOffsetY=0},_renderFill:function(e){if(!this.fill)return;this.fill.toLive&&(e.save(),e.translate(-this.width/2+this.fill.offsetX||0,-this.height/2+this.fill.offsetY||0)),this.fillRule==="destination-over"?e.fill("evenodd"):e.fill(),this.fill.toLive&&e.restore(),this.shadow&&!this.shadow.affectStroke&&this._removeShadow(e)},_renderStroke:function(e){if(!this.stroke||this.strokeWidth===0)return;e.save(),this.strokeDashArray?(1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),o?(e.setLineDash(this.strokeDashArray),this._stroke&&this._stroke(e)):this._renderDashedStroke&&this._renderDashedStroke(e),e.stroke()):this._stroke?this._stroke(e):e.stroke(),this._removeShadow(e),e.restore()},clone:function(e,n){return this.constructor.fromObject?this.constructor.fromObject(this.toObject(n),e):new t.Object(this.toObject(n))},cloneAsImage:function(e){var n=this.toDataURL();return t.util.loadImage(n,function(n){e&&e(new t.Image(n))}),this},toDataURL:function(e){e||(e={});var n=t.util.createCanvasElement(),r=this.getBoundingRect();n.width=r.width,n.height=r.height,t.util.wrapElement(n,"div");var i=new t.Canvas(n);e.format==="jpg"&&(e.format="jpeg"),e.format==="jpeg"&&(i.backgroundColor="#fff");var s={active:this.get("active"),left:this.getLeft(),top:this.getTop()};this.set("active",!1),this.setPositionByOrigin(new t.Point(n.width/2,n.height/2),"center","center");var o=this.canvas;i.add(this);var u=i.toDataURL(e);return this.set(s).setCoords(),this.canvas=o,i.dispose(),i=null,u},isType:function(e){return this.type===e},complexity:function(){return 0},toJSON:function(e){return this.toObject(e)},setGradient:function(e,n){n||(n={});var r={colorStops:[]};r.type=n.type||(n.r1||n.r2?"radial":"linear"),r.coords={x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2};if(n.r1||n.r2)r.coords.r1=n.r1,r.coords.r2=n.r2;for(var i in n.colorStops){var s=new t.Color(n.colorStops[i]);r.colorStops.push({offset:i,color:s.toRgb(),opacity:s.getAlpha()})}return this.set(e,t.Gradient.forObject(this,r))},setPatternFill:function(e){return this.set("fill",new t.Pattern(e))},setShadow:function(e){return this.set("shadow",e?new t.Shadow(e):null)},setColor:function(e){return this.set("fill",e),this},setAngle:function(e){var t=(this.originX!=="center"||this.originY!=="center")&&this.centeredRotation;return t&&this._setOriginToCenter(),this.set("angle",e),t&&this._resetOrigin(),this},centerH:function(){return this.canvas.centerObjectH(this),this},centerV:function(){return this.canvas.centerObjectV(this),this},center:function(){return this.canvas.centerObject(this),this},remove:function(){return this.canvas.remove(this),this},getLocalPointer:function(e,t){t=t||this.canvas.getPointer(e);var n=this.translateToOriginPoint(this.getCenterPoint(),"left","top");return{x:t.x-n.x,y:t.y-n.y}},_setupFillRule:function(e){this.fillRule&&(this._prevFillRule=e.globalCompositeOperation,e.globalCompositeOperation=this.fillRule)},_restoreFillRule:function(e){this.fillRule&&this._prevFillRule&&(e.globalCompositeOperation=this._prevFillRule)}}),t.util.createAccessors(t.Object),t.Object.prototype.rotate=t.Object.prototype.setAngle,n(t.Object.prototype,t.Observable),t.Object.NUM_FRACTION_DIGITS=2,t.Object.__uid=0}(typeof exports!="undefined"?exports:this),function(){var e=fabric.util.degreesToRadians;fabric.util.object.extend(fabric.Object.prototype,{translateToCenterPoint:function(t,n,r){var i=t.x,s=t.y,o=this.stroke?this.strokeWidth:0;return n==="left"?i=t.x+(this.getWidth()+o*this.scaleX)/2:n==="right"&&(i=t.x-(this.getWidth()+o*this.scaleX)/2),r==="top"?s=t.y+(this.getHeight()+o*this.scaleY)/2:r==="bottom"&&(s=t.y-(this.getHeight()+o*this.scaleY)/2),fabric.util.rotatePoint(new fabric.Point(i,s),t,e(this.angle))},translateToOriginPoint:function(t,n,r){var i=t.x,s=t.y,o=this.stroke?this.strokeWidth:0;return n==="left"?i=t.x-(this.getWidth()+o*this.scaleX)/2:n==="right"&&(i=t.x+(this.getWidth()+o*this.scaleX)/2),r==="top"?s=t.y-(this.getHeight()+o*this.scaleY)/2:r==="bottom"&&(s=t.y+(this.getHeight()+o*this.scaleY)/2),fabric.util.rotatePoint(new fabric.Point(i,s),t,e(this.angle))},getCenterPoint:function(){var e=new fabric.Point(this.left,this.top);return this.translateToCenterPoint(e,this.originX,this.originY)},getPointByOrigin:function(e,t){var n=this.getCenterPoint();return this.translateToOriginPoint(n,e,t)},toLocalPoint:function(t,n,r){var i=this.getCenterPoint(),s=this.stroke?this.strokeWidth:0,o,u;return n&&r?(n==="left"?o=i.x-(this.getWidth()+s*this.scaleX)/2:n==="right"?o=i.x+(this.getWidth()+s*this.scaleX)/2:o=i.x,r==="top"?u=i.y-(this.getHeight()+s*this.scaleY)/2:r==="bottom"?u=i.y+(this.getHeight()+s*this.scaleY)/2:u=i.y):(o=this.left,u=this.top),fabric.util.rotatePoint(new fabric.Point(t.x,t.y),i,-e(this.angle)).subtractEquals(new fabric.Point(o,u))},setPositionByOrigin:function(e,t,n){var r=this.translateToCenterPoint(e,t,n),i=this.translateToOriginPoint(r,this.originX,this.originY);this.set("left",i.x),this.set("top",i.y)},adjustPosition:function(t){var n=e(this.angle),r=this.getWidth()/2,i=Math.cos(n)*r,s=Math.sin(n)*r,o=this.getWidth(),u=Math.cos(n)*o,a=Math.sin(n)*o;this.originX==="center"&&t==="left"||this.originX==="right"&&t==="center"?(this.left-=i,this.top-=s):this.originX==="left"&&t==="center"||this.originX==="center"&&t==="right"?(this.left+=i,this.top+=s):this.originX==="left"&&t==="right"?(this.left+=u,this.top+=a):this.originX==="right"&&t==="left"&&(this.left-=u,this.top-=a),this.setCoords(),this.originX=t},_setOriginToCenter:function(){this._originalOriginX=this.originX,this._originalOriginY=this.originY;var e=this.getCenterPoint();this.originX="center",this.originY="center",this.left=e.x,this.top=e.y},_resetOrigin:function(){var e=this.translateToOriginPoint(this.getCenterPoint(),this._originalOriginX,this._originalOriginY);this.originX=this._originalOriginX,this.originY=this._originalOriginY,this.left=e.x,this.top=e.y,this._originalOriginX=null,this._originalOriginY=null},_getLeftTopCoords:function(){return this.translateToOriginPoint(this.getCenterPoint(),"left","center")}})}(),function(){var e=fabric.util.degreesToRadians;fabric.util.object.extend(fabric.Object.prototype,{oCoords:null,intersectsWithRect:function(e,t){var n=this.oCoords,r=new fabric.Point(n.tl.x,n.tl.y),i=new fabric.Point(n.tr.x,n.tr.y),s=new fabric.Point(n.bl.x,n.bl.y),o=new fabric.Point(n.br.x,n.br.y),u=fabric.Intersection.intersectPolygonRectangle([r,i,o,s],e,t);return u.status==="Intersection"},intersectsWithObject:function(e){function t(e){return{tl:new fabric.Point(e.tl.x,e.tl.y),tr:new fabric.Point(e.tr.x,e.tr.y),bl:new fabric.Point(e.bl.x,e.bl.y),br:new fabric.Point(e.br.x,e.br.y)}}var n=t(this.oCoords),r=t(e.oCoords),i=fabric.Intersection.intersectPolygonPolygon([n.tl,n.tr,n.br,n.bl],[r.tl,r.tr,r.br,r.bl]);return i.status==="Intersection"},isContainedWithinObject:function(e){var t=e.getBoundingRect(),n=new fabric.Point(t.left,t.top),r=new fabric.Point(t.left+t.width,t.top+t.height);return this.isContainedWithinRect(n,r)},isContainedWithinRect:function(e,t){var n=this.getBoundingRect();return n.left>=e.x&&n.left+n.width<=t.x&&n.top>=e.y&&n.top+n.height<=t.y},containsPoint:function(e){var t=this._getImageLines(this.oCoords),n=this._findCrossPoints(e,t);return n!==0&&n%2===1},_getImageLines:function(e){return{topline:{o:e.tl,d:e.tr},rightline:{o:e.tr,d:e.br},bottomline:{o:e.br,d:e.bl},leftline:{o:e.bl,d:e.tl}}},_findCrossPoints:function(e,t){var n,r,i,s,o,u,a=0,f;for(var l in t){f=t[l];if(f.o.y<e.y&&f.d.y<e.y)continue;if(f.o.y>=e.y&&f.d.y>=e.y)continue;f.o.x===f.d.x&&f.o.x>=e.x?(o=f.o.x,u=e.y):(n=0,r=(f.d.y-f.o.y)/(f.d.x-f.o.x),i=e.y-n*e.x,s=f.o.y-r*f.o.x,o=-(i-s)/(n-r),u=i+n*o),o>=e.x&&(a+=1);if(a===2)break}return a},getBoundingRectWidth:function(){return this.getBoundingRect().width},getBoundingRectHeight:function(){return this.getBoundingRect().height},getBoundingRect:function(){this.oCoords||this.setCoords();var e=[this.oCoords.tl.x,this.oCoords.tr.x,this.oCoords.br.x,this.oCoords.bl.x],t=fabric.util.array.min(e),n=fabric.util.array.max(e),r=Math.abs(t-n),i=[this.oCoords.tl.y,this.oCoords.tr.y,this.oCoords.br.y,this.oCoords.bl.y],s=fabric.util.array.min(i),o=fabric.util.array.max(i),u=Math.abs(s-o);return{left:t,top:s,width:r,height:u}},getWidth:function(){return this.width*this.scaleX},getHeight:function(){return this.height*this.scaleY},_constrainScale:function(e){return Math.abs(e)<this.minScaleLimit?e<0?-this.minScaleLimit:this.minScaleLimit:e},scale:function(e){return e=this._constrainScale(e),e<0&&(this.flipX=!this.flipX,this.flipY=!this.flipY,e*=-1),this.scaleX=e,this.scaleY=e,this.setCoords(),this},scaleToWidth:function(e){var t=this.getBoundingRectWidth()/this.getWidth();return this.scale(e/this.width/t)},scaleToHeight:function(e){var t=this.getBoundingRectHeight()/this.getHeight();return this.scale(e/this.height/t)},setCoords:function(){var t=this.strokeWidth>1?this.strokeWidth:0,n=e(this.angle),r=this.getViewportTransform(),i=function(e){return fabric.util.transformPoint(e,r)},s=this.width,o=this.height,u=this.strokeLineCap==="round"||this.strokeLineCap==="square",a=this.type==="line"&&this.width===1,f=this.type==="line"&&this.height===1,l=u&&f||this.type!=="line",c=u&&a||this.type!=="line";a?s=t:f&&(o=t),l&&(s+=t),c&&(o+=t),this.currentWidth=s*this.scaleX,this.currentHeight=o*this.scaleY,this.currentWidth<0&&(this.currentWidth=Math.abs(this.currentWidth));var h=Math.sqrt(Math.pow(this.currentWidth/2,2)+Math.pow(this.currentHeight/2,2)),p=Math.atan(isFinite(this.currentHeight/this.currentWidth)?this.currentHeight/this.currentWidth:0),d=Math.cos(p+n)*h,v=Math.sin(p+n)*h,m=Math.sin(n),g=Math.cos(n),y=this.getCenterPoint(),b=new fabric.Point(this.currentWidth,this.currentHeight),w=new fabric.Point(y.x-d,y.y-v),E=new fabric.Point(w.x+b.x*g,w.y+b.x*m),S=new fabric.Point(w.x-b.y*m,w.y+b.y*g),x=new fabric.Point(w.x+b.x/2*g,w.y+b.x/2*m),T=i(w),N=i(E),C=i(new fabric.Point(E.x-b.y*m,E.y+b.y*g)),k=i(S),L=i(new fabric.Point(w.x-b.y/2*m,w.y+b.y/2*g)),A=i(x),O=i(new fabric.Point(E.x-b.y/2*m,E.y+b.y/2*g)),M=i(new fabric.Point(S.x+b.x/2*g,S.y+b.x/2*m)),_=i(new fabric.Point(x.x,x.y)),D=Math.cos(p+n)*this.padding*Math.sqrt(2),P=Math.sin(p+n)*this.padding*Math.sqrt(2);return T=T.add(new fabric.Point(-D,-P)),N=N.add(new fabric.Point(P,-D)),C=C.add(new fabric.Point(D,P)),k=k.add(new fabric.Point(-P,D)),L=L.add(new fabric.Point((-D-P)/2,(-P+D)/2)),A=A.add(new fabric.Point((P-D)/2,-(P+D)/2)),O=O.add(new fabric.Point((P+D)/2,(P-D)/2)),M=M.add(new fabric.Point((D-P)/2,(D+P)/2)),_=_.add(new fabric.Point((P-D)/2,-(P+D)/2)),this.oCoords={tl:T,tr:N,br:C,bl:k,ml:L,mt:A,mr:O,mb:M,mtr:_},this._setCornerCoords&&this._setCornerCoords(),this}})}(),fabric.util.object.extend(fabric.Object.prototype,{sendToBack:function(){return this.group?fabric.StaticCanvas.prototype.sendToBack.call(this.group,this):this.canvas.sendToBack(this),this},bringToFront:function(){return this.group?fabric.StaticCanvas.prototype.bringToFront.call(this.group,this):this.canvas.bringToFront(this),this},sendBackwards:function(e){return this.group?fabric.StaticCanvas.prototype.sendBackwards.call(this.group,this,e):this.canvas.sendBackwards(this,e),this},bringForward:function(e){return this.group?fabric.StaticCanvas.prototype.bringForward.call(this.group,this,e):this.canvas.bringForward(this,e),this},moveTo:function(e){return this.group?fabric.StaticCanvas.prototype.moveTo.call(this.group,this,e):this.canvas.moveTo(this,e),this}}),fabric.util.object.extend(fabric.Object.prototype,{getSvgStyles:function(){var e=this.fill?this.fill.toLive?"url(#SVGID_"+this.fill.id+")":this.fill:"none",t=this.stroke?this.stroke.toLive?"url(#SVGID_"+this.stroke.id+")":this.stroke:"none",n=this.strokeWidth?this.strokeWidth:"0",r=this.strokeDashArray?this.strokeDashArray.join(" "):"",i=this.strokeLineCap?this.strokeLineCap:"butt",s=this.strokeLineJoin?this.strokeLineJoin:"miter",o=this.strokeMiterLimit?this.strokeMiterLimit:"4",u=typeof this.opacity!="undefined"?this.opacity:"1",a=this.visible?"":" visibility: hidden;",f=this.shadow&&this.type!=="text"?"filter: url(#SVGID_"+this.shadow.id+");":"";return["stroke: ",t,"; ","stroke-width: ",n,"; ","stroke-dasharray: ",r,"; ","stroke-linecap: ",i,"; ","stroke-linejoin: ",s,"; ","stroke-miterlimit: ",o,"; ","fill: ",e,"; ","opacity: ",u,";",f,a].join("")},getSvgTransform:function(){var e=fabric.util.toFixed,t=this.getAngle(),n=this.getViewportTransform(),r=fabric.util.transformPoint(this.getCenterPoint(),n),i=fabric.Object.NUM_FRACTION_DIGITS,s="translate("+e(r.x,i)+" "+e(r.y,i)+")",o=t!==0?" rotate("+e(t,i)+")":"",u=this.scaleX===1&&this.scaleY===1&&n[0]===1&&n[3]===1?"":" scale("+e(this.scaleX*n[0],i)+" "+e(this.scaleY*n[3],i)+")",a=this.flipX?"matrix(-1 0 0 1 0 0) ":"",f=this.flipY?"matrix(1 0 0 -1 0 0)":"";return[s,o,u,a,f].join("")},_createBaseSVGMarkup:function(){var e=[];return this.fill&&this.fill.toLive&&e.push(this.fill.toSVG(this,!1)),this.stroke&&this.stroke.toLive&&e.push(this.stroke.toSVG(this,!1)),this.shadow&&e.push(this.shadow.toSVG(this)),e}}),fabric.util.object.extend(fabric.Object.prototype,{hasStateChanged:function(){return this.stateProperties.some(function(e){return this.get(e)!==this.originalState[e]},this)},saveState:function(e){return this.stateProperties.forEach(function(e){this.originalState[e]=this.get(e)},this),e&&e.stateProperties&&e.stateProperties.forEach(function(e){this.originalState[e]=this.get(e)},this),this},setupState:function(){return this.originalState={},this.saveState(),this}}),function(){var e=fabric.util.degreesToRadians,t=function(){return typeof G_vmlCanvasManager!="undefined"};fabric.util.object.extend(fabric.Object.prototype,{_controlsVisibility:null,_findTargetCorner:function(e){if(!this.hasControls||!this.active)return!1;var t=e.x,n=e.y,r,i;for(var s in this.oCoords){if(!this.isControlVisible(s))continue;if(s==="mtr"&&!this.hasRotatingPoint)continue;if(!(!this.get("lockUniScaling")||s!=="mt"&&s!=="mr"&&s!=="mb"&&s!=="ml"))continue;i=this._getImageLines(this.oCoords[s].corner),r=this._findCrossPoints({x:t,y:n},i);if(r!==0&&r%2===1)return this.__corner=s,s}return!1},_setCornerCoords:function(){var t=this.oCoords,n=e(this.angle),r=e(45-this.angle),i=Math.sqrt(2*Math.pow(this.cornerSize,2))/2,s=i*Math.cos(r),o=i*Math.sin(r),u=Math.sin(n),a=Math.cos(n);t.tl.corner={tl:{x:t.tl.x-o,y:t.tl.y-s},tr:{x:t.tl.x+s,y:t.tl.y-o},bl:{x:t.tl.x-s,y:t.tl.y+o},br:{x:t.tl.x+o,y:t.tl.y+s}},t.tr.corner={tl:{x:t.tr.x-o,y:t.tr.y-s},tr:{x:t.tr.x+s,y:t.tr.y-o},br:{x:t.tr.x+o,y:t.tr.y+s},bl:{x:t.tr.x-s,y:t.tr.y+o}},t.bl.corner={tl:{x:t.bl.x-o,y:t.bl.y-s},bl:{x:t.bl.x-s,y:t.bl.y+o},br:{x:t.bl.x+o,y:t.bl.y+s},tr:{x:t.bl.x+s,y:t.bl.y-o}},t.br.corner={tr:{x:t.br.x+s,y:t.br.y-o},bl:{x:t.br.x-s,y:t.br.y+o},br:{x:t.br.x+o,y:t.br.y+s},tl:{x:t.br.x-o,y:t.br.y-s}},t.ml.corner={tl:{x:t.ml.x-o,y:t.ml.y-s},tr:{x:t.ml.x+s,y:t.ml.y-o},bl:{x:t.ml.x-s,y:t.ml.y+o},br:{x:t.ml.x+o,y:t.ml.y+s}},t.mt.corner={tl:{x:t.mt.x-o,y:t.mt.y-s},tr:{x:t.mt.x+s,y:t.mt.y-o},bl:{x:t.mt.x-s,y:t.mt.y+o},br:{x:t.mt.x+o,y:t.mt.y+s}},t.mr.corner={tl:{x:t.mr.x-o,y:t.mr.y-s},tr:{x:t.mr.x+s,y:t.mr.y-o},bl:{x:t.mr.x-s,y:t.mr.y+o},br:{x:t.mr.x+o,y:t.mr.y+s}},t.mb.corner={tl:{x:t.mb.x-o,y:t.mb.y-s},tr:{x:t.mb.x+s,y:t.mb.y-o},bl:{x:t.mb.x-s,y:t.mb.y+o},br:{x:t.mb.x+o,y:t.mb.y+s}},t.mtr.corner={tl:{x:t.mtr.x-o+u*this.rotatingPointOffset,y:t.mtr.y-s-a*this.rotatingPointOffset},tr:{x:t.mtr.x+s+u*this.rotatingPointOffset,y:t.mtr.y-o-a*this.rotatingPointOffset},bl:{x:t.mtr.x-s+u*this.rotatingPointOffset,y:t.mtr.y+o-a*this.rotatingPointOffset},br:{x:t.mtr.x+o+u*this.rotatingPointOffset,y:t.mtr.y+s-a*this.rotatingPointOffset}}},drawBorders:function(e){if(!this.hasBorders)return this;var t=this.padding,n=t*2,r=this.getViewportTransform();e.save(),e.globalAlpha=this.isMoving?this.borderOpacityWhenMoving:1,e.strokeStyle=this.borderColor;var i=1/this._constrainScale(this.scaleX),s=1/this._constrainScale(this.scaleY);e.lineWidth=1/this.borderScaleFactor;var o=this.getWidth(),u=this.getHeight(),a=this.strokeWidth>1?this.strokeWidth:0,f=this.strokeLineCap==="round"||this.strokeLineCap==="square",l=this.type==="line"&&this.width===1,c=this.type==="line"&&this.height===1,h=f&&c||this.type!=="line",p=f&&l||this.type!=="line";l?o=a/i:c&&(u=a/s),h&&(o+=a/i),p&&(u+=a/s);var d=fabric.util.transformPoint(new fabric.Point(o,u),r,!0),v=d.x,m=d.y;this.group&&(v*=this.group.scaleX,m*=this.group.scaleY),e.strokeRect(~~(-(v/2)-t)-.5,~~(-(m/2)-t)-.5,~~(v+n)+1,~~(m+n)+1);if(this.hasRotatingPoint&&this.isControlVisible("mtr")&&!this.get("lockRotation")&&this.hasControls){var g=(-m-t*2)/2;e.beginPath(),e.moveTo(0,g),e.lineTo(0,g-this.rotatingPointOffset),e.closePath(),e.stroke()}return e.restore(),this},drawControls:function(e){if(!this.hasControls)return this;var t=this.cornerSize,n=t/2,r=this.getViewportTransform(),i=this.strokeWidth>1?this.strokeWidth:0,s=this.width,o=this.height,u=this.strokeLineCap==="round"||this.strokeLineCap==="square",a=this.type==="line"&&this.width===1,f=this.type==="line"&&this.height===1,l=u&&f||this.type!=="line",c=u&&a||this.type!=="line";a?s=i:f&&(o=i),l&&(s+=i),c&&(o+=i),s*=this.scaleX,o*=this.scaleY;var h=fabric.util.transformPoint(new fabric.Point(s,o),r,!0),p=h.x,d=h.y,v=-(p/2),m=-(d/2),g=this.padding,y=n,b=n-t,w=this.transparentCorners?"strokeRect":"fillRect";return e.save(),e.lineWidth=1,e.globalAlpha=this.isMoving?this.borderOpacityWhenMoving:1,e.strokeStyle=e.fillStyle=this.cornerColor,this._drawControl("tl",e,w,v-y-g,m-y-g),this._drawControl("tr",e,w,v+p-y+g,m-y-g),this._drawControl("bl",e,w,v-y-g,m+d+b+g),this._drawControl("br",e,w,v+p+b+g,m+d+b+g),this.get("lockUniScaling")||(this._drawControl("mt",e,w,v+p/2-y,m-y-g),this._drawControl("mb",e,w,v+p/2-y,m+d+b+g),this._drawControl("mr",e,w,v+p+b+g,m+d/2-y),this._drawControl("ml",e,w,v-y-g,m+d/2-y)),this.hasRotatingPoint&&this._drawControl("mtr",e,w,v+p/2-y,m-this.rotatingPointOffset-this.cornerSize/2-g),e.restore(),this},_drawControl:function(e,n,r,i,s){var o=this.cornerSize;this.isControlVisible(e)&&(t()||this.transparentCorners||n.clearRect(i,s,o,o),n[r](i,s,o,o))},isControlVisible:function(e){return this._getControlsVisibility()[e]},setControlVisible:function(e,t){return this._getControlsVisibility()[e]=t,this},setControlsVisibility:function(e){e||(e={});for(var t in e)this.setControlVisible(t,e[t]);return this},_getControlsVisibility:function(){return this._controlsVisibility||(this._controlsVisibility={tl:!0,tr:!0,br:!0,bl:!0,ml:!0,mt:!0,mr:!0,mb:!0,mtr:!0}),this._controlsVisibility}})}(),fabric.util.object.extend(fabric.StaticCanvas.prototype,{FX_DURATION:500,fxCenterObjectH:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("left"),endValue:this.getCenter().left,duration:this.FX_DURATION,onChange:function(t){e.set("left",t),s.renderAll(),i()},onComplete:function(){e.setCoords(),r()}}),this},fxCenterObjectV:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("top"),endValue:this.getCenter().top,duration:this.FX_DURATION,onChange:function(t){e.set("top",t),s.renderAll(),i()},onComplete:function(){e.setCoords(),r()}}),this},fxRemove:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("opacity"),endValue:0,duration:this.FX_DURATION,onStart:function(){e.set("active",!1)},onChange:function(t){e.set("opacity",t),s.renderAll(),i()},onComplete:function(){s.remove(e),r()}}),this}}),fabric.util.object.extend(fabric.Object.prototype,{animate:function(){if(arguments[0]&&typeof arguments[0]=="object"){var e=[],t,n;for(t in arguments[0])e.push(t);for(var r=0,i=e.length;r<i;r++)t=e[r],n=r!==i-1,this._animate(t,arguments[0][t],arguments[1],n)}else this._animate.apply(this,arguments);return this},_animate:function(e,t,n,r){var i=this,s;t=t.toString(),n?n=fabric.util.object.clone(n):n={},~e.indexOf(".")&&(s=e.split("."));var o=s?this.get(s[0])[s[1]]:this.get(e);"from"in n||(n.from=o),~t.indexOf("=")?t=o+parseFloat(t.replace("=","")):t=parseFloat(t),fabric.util.animate({startValue:n.from,endValue:t,byValue:n.by,easing:n.easing,duration:n.duration,abort:n.abort&&function(){return n.abort.call(i)},onChange:function(t){s?i[s[0]][s[1]]=t:i.set(e,t);if(r)return;n.onChange&&n.onChange()},onComplete:function(){if(r)return;i.setCoords(),n.onComplete&&n.onComplete()}})}}),function(e){"use strict";function s(e,t){var n=e.origin,r=e.axis1,i=e.axis2,s=e.dimension,o=t.nearest,u=t.center,a=t.farthest;return function(){switch(this.get(n)){case o:return Math.min(this.get(r),this.get(i));case u:return Math.min(this.get(r),this.get(i))+.5*this.get(s);case a:return Math.max(this.get(r),this.get(i))}}}var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r={x1:1,x2:1,y1:1,y2:1},i=t.StaticCanvas.supports("setLineDash");if(t.Line){t.warn("fabric.Line is already defined");return}t.Line=t.util.createClass(t.Object,{type:"line",x1:0,y1:0,x2:0,y2:0,initialize:function(e,t){t=t||{},e||(e=[0,0,0,0]),this.callSuper("initialize",t),this.set("x1",e[0]),this.set("y1",e[1]),this.set("x2",e[2]),this.set("y2",e[3]),this._setWidthHeight(t)},_setWidthHeight:function(e){e||(e={}),this.width=Math.abs(this.x2-this.x1)||1,this.height=Math.abs(this.y2-this.y1)||1,this.left="left"in e?e.left:this._getLeftToOriginX(),this.top="top"in e?e.top:this._getTopToOriginY()},_set:function(e,t){return this[e]=t,typeof r[e]!="undefined"&&this._setWidthHeight(),this},_getLeftToOriginX:s({origin:"originX",axis1:"x1",axis2:"x2",dimension:"width"},{nearest:"left",center:"center",farthest:"right"}),_getTopToOriginY:s({origin:"originY",axis1:"y1",axis2:"y2",dimension:"height"},{nearest:"top",center:"center",farthest:"bottom"}),_render:function(e){e.beginPath();var t=this.group&&this.group.type==="path-group";if(t){var n=this.getCenterPoint();e.translate(n.x,n.y),this.transformMatrix||e.translate(-this.group.width/2,-this.group.height/2)}if(!this.strokeDashArray||this.strokeDashArray&&i){var r=this.x1<=this.x2?-1:1,s=this.y1<=this.y2?-1:1;e.moveTo(this.width===1?0:r*this.width/2,this.height===1?0:s*this.height/2),e.lineTo(this.width===1?0:r*-1*this.width/2,this.height===1?0:s*-1*this.height/2)}e.lineWidth=this.strokeWidth;var o=e.strokeStyle;e.strokeStyle=this.stroke||e.fillStyle,this.stroke&&this._renderStroke(e),e.strokeStyle=o},_renderDashedStroke:function(e){var n=this.x1<=this.x2?-1:1,r=this.y1<=this.y2?-1:1,i=this.width===1?0:n*this.width/2,s=this.height===1?0:r*this.height/2;e.beginPath(),t.util.drawDashedLine(e,i,s,-i,-s,this.strokeDashArray),e.closePath()},toObject:function(e){return n(this.callSuper("toObject",e),{x1:this.get("x1"),y1:this.get("y1"),x2:this.get("x2"),y2:this.get("y2")})},toSVG:function(e){var t=this._createBaseSVGMarkup();return t.push("<line ",'x1="',this.get("x1"),'" y1="',this.get("y1"),'" x2="',this.get("x2"),'" y2="',this.get("y2"),'" style="',this.getSvgStyles(),'"/>'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Line.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")),t.Line.fromElement=function(e,r){var i=t.parseAttributes(e,t.Line.ATTRIBUTE_NAMES),s=[i.x1||0,i.y1||0,i.x2||0,i.y2||0];return new t.Line(s,n(i,r))},t.Line.fromObject=function(e){var n=[e.x1,e.y1,e.x2,e.y2];return new t.Line(n,e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function i(e){return"radius"in e&&e.radius>0}var t=e.fabric||(e.fabric={}),n=Math.PI*2,r=t.util.object.extend;if(t.Circle){t.warn("fabric.Circle is already defined.");return}t.Circle=t.util.createClass(t.Object,{type:"circle",radius:0,initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("radius",e.radius||0)},_set:function(e,t){return this.callSuper("_set",e,t),e==="radius"&&this.setRadius(t),this},toObject:function(e){return r(this.callSuper("toObject",e),{radius:this.get("radius")})},toSVG:function(e){var t=this._createBaseSVGMarkup();return t.push("<circle ",'cx="0" cy="0" ','r="',this.radius,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(t.join("")):t.join("")},_render:function(e,t){e.beginPath(),e.globalAlpha=this.group?e.globalAlpha*this.opacity:this.opacity,e.arc(t?this.left:0,t?this.top:0,this.radius,0,n,!1),this._renderFill(e),this.stroke&&this._renderStroke(e)},getRadiusX:function(){return this.get("radius")*this.get("scaleX")},getRadiusY:function(){return this.get("radius")*this.get("scaleY")},setRadius:function(e){this.radius=e,this.set("width",e*2).set("height",e*2)},complexity:function(){return 1}}),t.Circle.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")),t.Circle.fromElement=function(e,n){n||(n={});var s=t.parseAttributes(e,t.Circle.ATTRIBUTE_NAMES);if(!i(s))throw new Error("value of `r` attribute is required and can not be negative");"left"in s||(s.left=0),"top"in s||(s.top=0),"transformMatrix"in s||(s.left-=n.width?n.width/2:0,s.top-=n.height?n.height/2:0);var o=new t.Circle(r(s,n));return o.cx=parseFloat
(e.getAttribute("cx"))||0,o.cy=parseFloat(e.getAttribute("cy"))||0,o},t.Circle.fromObject=function(e){return new t.Circle(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});if(t.Triangle){t.warn("fabric.Triangle is already defined");return}t.Triangle=t.util.createClass(t.Object,{type:"triangle",initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("width",e.width||100).set("height",e.height||100)},_render:function(e){var t=this.width/2,n=this.height/2;e.beginPath(),e.moveTo(-t,n),e.lineTo(0,-n),e.lineTo(t,n),e.closePath(),this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n=this.width/2,r=this.height/2;e.beginPath(),t.util.drawDashedLine(e,-n,r,0,-r,this.strokeDashArray),t.util.drawDashedLine(e,0,-r,n,r,this.strokeDashArray),t.util.drawDashedLine(e,n,r,-n,r,this.strokeDashArray),e.closePath()},toSVG:function(e){var t=this._createBaseSVGMarkup(),n=this.width/2,r=this.height/2,i=[-n+" "+r,"0 "+ -r,n+" "+r].join(",");return t.push("<polygon ",'points="',i,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Triangle.fromObject=function(e){return new t.Triangle(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=Math.PI*2,r=t.util.object.extend;if(t.Ellipse){t.warn("fabric.Ellipse is already defined.");return}t.Ellipse=t.util.createClass(t.Object,{type:"ellipse",rx:0,ry:0,initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("rx",e.rx||0),this.set("ry",e.ry||0),this.set("width",this.get("rx")*2),this.set("height",this.get("ry")*2)},toObject:function(e){return r(this.callSuper("toObject",e),{rx:this.get("rx"),ry:this.get("ry")})},toSVG:function(e){var t=this._createBaseSVGMarkup();return t.push("<ellipse ",'rx="',this.get("rx"),'" ry="',this.get("ry"),'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(t.join("")):t.join("")},render:function(e,t){if(this.rx===0||this.ry===0)return;return this.callSuper("render",e,t)},_render:function(e,t){e.beginPath(),e.globalAlpha=this.group?e.globalAlpha*this.opacity:this.opacity,e.save(),e.transform(1,0,0,this.ry/this.rx,0,0),e.arc(t?this.left:0,t?this.top*this.rx/this.ry:0,this.rx,0,n,!1),e.restore(),this._renderFill(e),this._renderStroke(e)},complexity:function(){return 1}}),t.Ellipse.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")),t.Ellipse.fromElement=function(e,n){n||(n={});var i=t.parseAttributes(e,t.Ellipse.ATTRIBUTE_NAMES);"left"in i||(i.left=0),"top"in i||(i.top=0),"transformMatrix"in i||(i.left-=n.width?n.width/2:0,i.top-=n.height?n.height/2:0);var s=new t.Ellipse(r(i,n));return s.cx=parseFloat(e.getAttribute("cx"))||0,s.cy=parseFloat(e.getAttribute("cy"))||0,s},t.Ellipse.fromObject=function(e){return new t.Ellipse(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function i(e){return e.left=e.left||0,e.top=e.top||0,e}var t=e.fabric||(e.fabric={}),n=t.util.object.extend;if(t.Rect){console.warn("fabric.Rect is already defined");return}var r=t.Object.prototype.stateProperties.concat();r.push("rx","ry","x","y"),t.Rect=t.util.createClass(t.Object,{stateProperties:r,type:"rect",rx:0,ry:0,x:0,y:0,strokeDashArray:null,initialize:function(e){e=e||{},this.callSuper("initialize",e),this._initRxRy(),this.x=e.x||0,this.y=e.y||0},_initRxRy:function(){this.rx&&!this.ry?this.ry=this.rx:this.ry&&!this.rx&&(this.rx=this.ry)},_render:function(e){if(this.width===1&&this.height===1){e.fillRect(0,0,1,1);return}var t=this.rx?Math.min(this.rx,this.width/2):0,n=this.ry?Math.min(this.ry,this.height/2):0,r=this.width,i=this.height,s=-r/2,o=-i/2,u=this.group&&this.group.type==="path-group",a=t!==0||n!==0,f=.4477152502;e.beginPath(),e.globalAlpha=u?e.globalAlpha*this.opacity:this.opacity,this.transformMatrix&&u&&e.translate(this.width/2+this.x,this.height/2+this.y),!this.transformMatrix&&u&&e.translate(-this.group.width/2+this.width/2+this.x,-this.group.height/2+this.height/2+this.y),e.moveTo(s+t,o),e.lineTo(s+r-t,o),a&&e.bezierCurveTo(s+r-f*t,o,s+r,o+f*n,s+r,o+n),e.lineTo(s+r,o+i-n),a&&e.bezierCurveTo(s+r,o+i-f*n,s+r-f*t,o+i,s+r-t,o+i),e.lineTo(s+t,o+i),a&&e.bezierCurveTo(s+f*t,o+i,s,o+i-f*n,s,o+i-n),e.lineTo(s,o+n),a&&e.bezierCurveTo(s,o+f*n,s+f*t,o,s+t,o),e.closePath(),this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n=-this.width/2,r=-this.height/2,i=this.width,s=this.height;e.beginPath(),t.util.drawDashedLine(e,n,r,n+i,r,this.strokeDashArray),t.util.drawDashedLine(e,n+i,r,n+i,r+s,this.strokeDashArray),t.util.drawDashedLine(e,n+i,r+s,n,r+s,this.strokeDashArray),t.util.drawDashedLine(e,n,r+s,n,r,this.strokeDashArray),e.closePath()},_normalizeLeftTopProperties:function(e){return"left"in e&&this.set("left",e.left+this.getWidth()/2),this.set("x",e.left||0),"top"in e&&this.set("top",e.top+this.getHeight()/2),this.set("y",e.top||0),this},toObject:function(e){var t=n(this.callSuper("toObject",e),{rx:this.get("rx")||0,ry:this.get("ry")||0,x:this.get("x"),y:this.get("y")});return this.includeDefaultValues||this._removeDefaultValues(t),t},toSVG:function(e){var t=this._createBaseSVGMarkup();return t.push("<rect ",'x="',-1*this.width/2,'" y="',-1*this.height/2,'" rx="',this.get("rx"),'" ry="',this.get("ry"),'" width="',this.width,'" height="',this.height,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Rect.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")),t.Rect.fromElement=function(e,r){if(!e)return null;var s=t.parseAttributes(e,t.Rect.ATTRIBUTE_NAMES);s=i(s);var o=new t.Rect(n(r?t.util.object.clone(r):{},s));return o._normalizeLeftTopProperties(s),o},t.Rect.fromObject=function(e){return new t.Rect(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.toFixed;if(t.Polyline){t.warn("fabric.Polyline is already defined");return}t.Polyline=t.util.createClass(t.Object,{type:"polyline",points:null,initialize:function(e,t,n){t=t||{},this.set("points",e),this.callSuper("initialize",t),this._calcDimensions(n)},_calcDimensions:function(e){return t.Polygon.prototype._calcDimensions.call(this,e)},toObject:function(e){return t.Polygon.prototype.toObject.call(this,e)},toSVG:function(e){var t=[],r=this._createBaseSVGMarkup();for(var i=0,s=this.points.length;i<s;i++)t.push(n(this.points[i].x,2),",",n(this.points[i].y,2)," ");return r.push("<polyline ",'points="',t.join(""),'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(r.join("")):r.join("")},_render:function(e){var t;e.beginPath(),e.moveTo(this.points[0].x,this.points[0].y);for(var n=0,r=this.points.length;n<r;n++)t=this.points[n],e.lineTo(t.x,t.y);this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n,r;e.beginPath();for(var i=0,s=this.points.length;i<s;i++)n=this.points[i],r=this.points[i+1]||n,t.util.drawDashedLine(e,n.x,n.y,r.x,r.y,this.strokeDashArray)},complexity:function(){return this.get("points").length}}),t.Polyline.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(),t.Polyline.fromElement=function(e,n){if(!e)return null;n||(n={});var r=t.parsePointsAttribute(e.getAttribute("points")),i=t.parseAttributes(e,t.Polyline.ATTRIBUTE_NAMES);return"transformMatrix"in i||t.util.normalizePoints(r,n),new t.Polyline(r,t.util.object.extend(i,n),!0)},t.Polyline.fromObject=function(e){var n=e.points;return new t.Polyline(n,e,!0)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.min,i=t.util.array.max,s=t.util.toFixed;if(t.Polygon){t.warn("fabric.Polygon is already defined");return}t.Polygon=t.util.createClass(t.Object,{type:"polygon",points:null,initialize:function(e,t,n){t=t||{},this.points=e,this.callSuper("initialize",t),this._calcDimensions(n)},_calcDimensions:function(e){var t=this.points,n=r(t,"x"),s=r(t,"y"),o=i(t,"x"),u=i(t,"y");this.width=o-n||1,this.height=u-s||1,this.minX=n,this.minY=s;if(e)return;var a=this.width/2+this.minX,f=this.height/2+this.minY;this.points.forEach(function(e){e.x-=a,e.y-=f},this)},toObject:function(e){return n(this.callSuper("toObject",e),{points:this.points.concat()})},toSVG:function(e){var t=[],n=this._createBaseSVGMarkup();for(var r=0,i=this.points.length;r<i;r++)t.push(s(this.points[r].x,2),",",s(this.points[r].y,2)," ");return n.push("<polygon ",'points="',t.join(""),'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(n.join("")):n.join("")},_render:function(e){var t;e.beginPath(),e.globalAlpha=this.group?e.globalAlpha*this.opacity:this.opacity,e.moveTo(this.points[0].x,this.points[0].y);for(var n=0,r=this.points.length;n<r;n++)t=this.points[n],e.lineTo(t.x,t.y);this._renderFill(e);if(this.stroke||this.strokeDashArray)e.closePath(),this._renderStroke(e)},_renderDashedStroke:function(e){var n,r;e.beginPath();for(var i=0,s=this.points.length;i<s;i++)n=this.points[i],r=this.points[i+1]||this.points[0],t.util.drawDashedLine(e,n.x,n.y,r.x,r.y,this.strokeDashArray);e.closePath()},complexity:function(){return this.points.length}}),t.Polygon.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(),t.Polygon.fromElement=function(e,r){if(!e)return null;r||(r={});var i=t.parsePointsAttribute(e.getAttribute("points")),s=t.parseAttributes(e,t.Polygon.ATTRIBUTE_NAMES);return"transformMatrix"in s||t.util.normalizePoints(i,r),new t.Polygon(i,n(s,r),!0)},t.Polygon.fromObject=function(e){return new t.Polygon(e.points,e,!0)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function f(e){return e[0]==="H"?e[1]:e[e.length-2]}function l(e){return e[0]==="V"?e[1]:e[e.length-1]}var t=e.fabric||(e.fabric={}),n=t.util.array.min,r=t.util.array.max,i=t.util.object.extend,s=Object.prototype.toString,o=t.util.drawArc,u={m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7},a={m:"l",M:"L"};if(t.Path){t.warn("fabric.Path is already defined");return}t.Path=t.util.createClass(t.Object,{type:"path",path:null,initialize:function(e,t){t=t||{},this.setOptions(t);if(!e)throw new Error("`path` argument is required");var n=s.call(e)==="[object Array]";this.path=n?e:e.match&&e.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);if(!this.path)return;n||(this.path=this._parsePath()),this._initializePath(t),t.sourcePath&&this.setSourcePath(t.sourcePath)},_initializePath:function(e){var t="width"in e&&e.width!=null,n="height"in e&&e.width!=null,r="left"in e,s="top"in e,o=r?this.left:0,u=s?this.top:0;!t||!n?(i(this,this._parseDimensions()),t&&(this.width=e.width),n&&(this.height=e.height)):(s||(this.top=this.height/2),r||(this.left=this.width/2)),this.pathOffset=this.pathOffset||this._calculatePathOffset(o,u)},_calculatePathOffset:function(e,t){return{x:this.left-e-this.width/2,y:this.top-t-this.height/2}},_render:function(e,t){var n,r=null,i=0,s=0,u=0,a=0,f=0,l=0,c,h,p,d,v=-(this.width/2+this.pathOffset.x),m=-(this.height/2+this.pathOffset.y);t&&(v+=this.width/2,m+=this.height/2);for(var g=0,y=this.path.length;g<y;++g){n=this.path[g];switch(n[0]){case"l":u+=n[1],a+=n[2],e.lineTo(u+v,a+m);break;case"L":u=n[1],a=n[2],e.lineTo(u+v,a+m);break;case"h":u+=n[1],e.lineTo(u+v,a+m);break;case"H":u=n[1],e.lineTo(u+v,a+m);break;case"v":a+=n[1],e.lineTo(u+v,a+m);break;case"V":a=n[1],e.lineTo(u+v,a+m);break;case"m":u+=n[1],a+=n[2],i=u,s=a,e.moveTo(u+v,a+m);break;case"M":u=n[1],a=n[2],i=u,s=a,e.moveTo(u+v,a+m);break;case"c":c=u+n[5],h=a+n[6],f=u+n[3],l=a+n[4],e.bezierCurveTo(u+n[1]+v,a+n[2]+m,f+v,l+m,c+v,h+m),u=c,a=h;break;case"C":u=n[5],a=n[6],f=n[3],l=n[4],e.bezierCurveTo(n[1]+v,n[2]+m,f+v,l+m,u+v,a+m);break;case"s":c=u+n[3],h=a+n[4],f=f?2*u-f:u,l=l?2*a-l:a,e.bezierCurveTo(f+v,l+m,u+n[1]+v,a+n[2]+m,c+v,h+m),f=u+n[1],l=a+n[2],u=c,a=h;break;case"S":c=n[3],h=n[4],f=2*u-f,l=2*a-l,e.bezierCurveTo(f+v,l+m,n[1]+v,n[2]+m,c+v,h+m),u=c,a=h,f=n[1],l=n[2];break;case"q":c=u+n[3],h=a+n[4],f=u+n[1],l=a+n[2],e.quadraticCurveTo(f+v,l+m,c+v,h+m),u=c,a=h;break;case"Q":c=n[3],h=n[4],e.quadraticCurveTo(n[1]+v,n[2]+m,c+v,h+m),u=c,a=h,f=n[1],l=n[2];break;case"t":c=u+n[1],h=a+n[2],r[0].match(/[QqTt]/)===null?(f=u,l=a):r[0]==="t"?(f=2*u-p,l=2*a-d):r[0]==="q"&&(f=2*u-f,l=2*a-l),p=f,d=l,e.quadraticCurveTo(f+v,l+m,c+v,h+m),u=c,a=h,f=u+n[1],l=a+n[2];break;case"T":c=n[1],h=n[2],f=2*u-f,l=2*a-l,e.quadraticCurveTo(f+v,l+m,c+v,h+m),u=c,a=h;break;case"a":o(e,u+v,a+m,[n[1],n[2],n[3],n[4],n[5],n[6]+u+v,n[7]+a+m]),u+=n[6],a+=n[7];break;case"A":o(e,u+v,a+m,[n[1],n[2],n[3],n[4],n[5],n[6]+v,n[7]+m]),u=n[6],a=n[7];break;case"z":case"Z":u=i,a=s,e.closePath()}r=n}},render:function(e,n){if(!this.visible)return;e.save(),n&&e.translate(-this.width/2,-this.height/2);var r=this.transformMatrix;r&&e.transform(r[0],r[1],r[2],r[3],r[4],r[5]),n||this.transform(e),this._setStrokeStyles(e),this._setFillStyles(e),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e),e.beginPath(),e.globalAlpha=this.group?e.globalAlpha*this.opacity:this.opacity,this._render(e,n),this._renderFill(e),this._renderStroke(e),this.clipTo&&e.restore(),this._removeShadow(e),e.restore()},toString:function(){return"#<fabric.Path ("+this.complexity()+'): { "top": '+this.top+', "left": '+this.left+" }>"},toObject:function(e){var t=i(this.callSuper("toObject",e),{path:this.path.map(function(e){return e.slice()}),pathOffset:this.pathOffset});return this.sourcePath&&(t.sourcePath=this.sourcePath),this.transformMatrix&&(t.transformMatrix=this.transformMatrix),t},toDatalessObject:function(e){var t=this.toObject(e);return this.sourcePath&&(t.path=this.sourcePath),delete t.sourcePath,t},toSVG:function(e){var t=[],n=this._createBaseSVGMarkup();for(var r=0,i=this.path.length;r<i;r++)t.push(this.path[r].join(" "));var s=t.join(" ");return n.push('<g transform="',this.group?"":this.getSvgTransform(),'">',"<path ",'d="',s,'" style="',this.getSvgStyles(),'" transform="translate(',-this.width/2," ",-this.height/2,")",'" stroke-linecap="round" ',"/>","</g>"),e?e(n.join("")):n.join("")},complexity:function(){return this.path.length},_parsePath:function(){var e=[],t=[],n,r,i=/([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,s,o;for(var f=0,l,c=this.path.length;f<c;f++){n=this.path[f],o=n.slice(1).trim(),t.length=0;while(s=i.exec(o))t.push(s[0]);l=[n.charAt(0)];for(var h=0,p=t.length;h<p;h++)r=parseFloat(t[h]),isNaN(r)||l.push(r);var d=l[0],v=u[d.toLowerCase()],m=a[d]||d;if(l.length-1>v)for(var g=1,y=l.length;g<y;g+=v)e.push([d].concat(l.slice(g,g+v))),d=m;else e.push(l)}return e},_parseDimensions:function(){var e=[],t=[],i={};this.path.forEach(function(n,r){this._getCoordsFromCommand(n,r,e,t,i)},this);var s=n(e),o=n(t),u=r(e),a=r(t),f=u-s,l=a-o,c={left:this.left+(s+f/2),top:this.top+(o+l/2),width:f,height:l};return c},_getCoordsFromCommand:function(e,t,n,r,i){var s=!1;e[0]!=="H"&&(i.x=t===0?f(e):f(this.path[t-1])),e[0]!=="V"&&(i.y=t===0?l(e):l(this.path[t-1])),e[0]===e[0].toLowerCase()&&(s=!0);var o=this._getXY(e,s,i),u;u=parseInt(o.x,10),isNaN(u)||n.push(u),u=parseInt(o.y,10),isNaN(u)||r.push(u)},_getXY:function(e,t,n){var r=t?n.x+f(e):e[0]==="V"?n.x:f(e),i=t?n.y+l(e):e[0]==="H"?n.y:l(e);return{x:r,y:i}}}),t.Path.fromObject=function(e,n){typeof e.path=="string"?t.loadSVGFromURL(e.path,function(r){var i=r[0],s=e.path;delete e.path,t.util.object.extend(i,e),i.setSourcePath(s),n(i)}):n(new t.Path(e.path,e))},t.Path.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(["d"]),t.Path.fromElement=function(e,n,r){var s=t.parseAttributes(e,t.Path.ATTRIBUTE_NAMES);n&&n(new t.Path(s.d,i(s,r)))},t.Path.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.invoke,i=t.Object.prototype.toObject;if(t.PathGroup){t.warn("fabric.PathGroup is already defined");return}t.PathGroup=t.util.createClass(t.Path,{type:"path-group",fill:"",initialize:function(e,t){t=t||{},this.paths=e||[];for(var n=this.paths.length;n--;)this.paths[n].group=this;this.setOptions(t),t.widthAttr&&(this.scaleX=t.widthAttr/t.width),t.heightAttr&&(this.scaleY=t.heightAttr/t.height),this.setCoords(),t.sourcePath&&this.setSourcePath(t.sourcePath)},render:function(e){if(!this.visible)return;e.save();var n=this.transformMatrix;n&&e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),this.transform(e),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e);for(var r=0,i=this.paths.length;r<i;++r)this.paths[r].render(e,!0);this.clipTo&&e.restore(),this._removeShadow(e),e.restore()},_set:function(e,t){if(e==="fill"&&t&&this.isSameColor()){var n=this.paths.length;while(n--)this.paths[n]._set(e,t)}return this.callSuper("_set",e,t)},toObject:function(e){var t=n(i.call(this,e),{paths:r(this.getObjects(),"toObject",e)});return this.sourcePath&&(t.sourcePath=this.sourcePath),t},toDatalessObject:function(e){var t=this.toObject(e);return this.sourcePath&&(t.paths=this.sourcePath),t},toSVG:function(e){var t=this.getObjects(),n=["<g ",'style="',this.getSvgStyles(),'" ','transform="',this.getSvgTransform(),'" ',">"];for(var r=0,i=t.length;r<i;r++)n.push(t[r].toSVG(e));return n.push("</g>"),e?e(n.join("")):n.join("")},toString:function(){return"#<fabric.PathGroup ("+this.complexity()+"): { top: "+this.top+", left: "+this.left+" }>"},isSameColor:function(){var e=(this.getObjects()[0].get("fill")||"").toLowerCase();return this.getObjects().every(function(t){return(t.get("fill")||"").toLowerCase()===e})},complexity:function(){return this.paths.reduce(function(e,t){return e+(t&&t.complexity?t.complexity():0)},0)},getObjects:function(){return this.paths}}),t.PathGroup.fromObject=function(e,n){typeof e.paths=="string"?t.loadSVGFromURL(e.paths,function(r){var i=e.paths;delete e.paths;var s=t.util.groupSVGElements(r,e,i);n(s)}):t.util.enlivenObjects(e.paths,function(r){delete e.paths,n(new t.PathGroup(r,e))})},t.PathGroup.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.min,i=t.util.array.max,s=t.util.array.invoke;if(t.Group)return;var o={lockMovementX:!0,lockMovementY:!0,lockRotation:!0,lockScalingX:!0,lockScalingY:!0,lockUniScaling:!0};t.Group=t.util.createClass(t.Object,t.Collection,{type:"group",initialize:function(e,t){t=t||{},this._objects=e||[];for(var r=this._objects.length;r--;)this._objects[r].group=this;this.originalState={},this.callSuper("initialize"),this._calcBounds(),this._updateObjectsCoords(),t&&n(this,t),this._setOpacityIfSame(),this.setCoords(),this.saveCoords()},_updateObjectsCoords:function(){this.forEachObject(this._updateObjectCoords,this)},_updateObjectCoords:function(e){var t=e.getLeft(),n=e.getTop();e.set({originalLeft:t,originalTop:n,left:t-this.left,top:n-this.top}),e.setCoords(),e.__origHasControls=e.hasControls,e.hasControls=!1},toString:function(){return"#<fabric.Group: ("+this.complexity()+")>"},addWithUpdate:function(e){return this._restoreObjectsState(),e&&(this._objects.push(e),e.group=this),this.forEachObject(this._setObjectActive,this),this._calcBounds(),this._updateObjectsCoords(),this},_setObjectActive:function(e){e.set("active",!0),e.group=this},removeWithUpdate:function(e){return this._moveFlippedObject(e),this._restoreObjectsState(),this.forEachObject(this._setObjectActive,this),this.remove(e),this._calcBounds(),this._updateObjectsCoords(),this},_onObjectAdded:function(e){e.group=this},_onObjectRemoved:function(e){delete e.group,e.set("active",!1)},delegatedProperties:{fill:!0,opacity:!0,fontFamily:!0,fontWeight:!0,fontSize:!0,fontStyle:!0,lineHeight:!0,textDecoration:!0,textAlign:!0,backgroundColor:!0},_set:function(e,t){if(e in this.delegatedProperties){var n=this._objects.length;this[e]=t;while(n--)this._objects[n].set(e,t)}else this[e]=t},toObject:function(e){return n(this.callSuper("toObject",e),{objects:s(this._objects,"toObject",e)})},render:function(e){if(!this.visible)return;e.save(),this.clipTo&&t.util.clipContext(this,e);for(var n=0,r=this._objects.length;n<r;n++)this._renderObject(this._objects[n],e);this.clipTo&&e.restore(),e.restore()},_renderControls:function(e,t){this.callSuper("_renderControls",e,t);for(var n=0,r=this._objects.length;n<r;n++)this._objects[n]._renderControls(e)},_renderObject:function(e,t){var n=e.hasRotatingPoint;if(!e.visible)return;e.hasRotatingPoint=!1,e.render(t),e.hasRotatingPoint=n},_restoreObjectsState:function(){return this._objects.forEach(this._restoreObjectState,this),this},_moveFlippedObject:function(e){var t=e.get("originX"),n=e.get("originY"),r=e.getCenterPoint();e.set({originX:"center",originY:"center",left:r.x,top:r.y}),this._toggleFlipping(e);var i=e.getPointByOrigin(t,n);return e.set({originX:t,originY:n,left:i.x,top:i.y}),this},_toggleFlipping:function(e){this.flipX&&(e.toggle("flipX"),e.set("left",-e.get("left")),e.setAngle(-e.getAngle())),this.flipY&&(e.toggle("flipY"),e.set("top",-e.get("top")),e.setAngle(-e.getAngle()))},_restoreObjectState:function(e){return this._setObjectPosition(e),e.setCoords(),e.hasControls=e.__origHasControls,delete e.__origHasControls,e.set("active",!1),e.setCoords(),delete e.group,this},_setObjectPosition:function(e){var t=this.getLeft(),n=this.getTop(),r=this._getRotatedLeftTop(e);e.set({angle:e.getAngle()+this.getAngle(),left:t+r.left,top:n+r.top,scaleX:e.get("scaleX")*this.get("scaleX"),scaleY:e.get("scaleY")*this.get("scaleY")})},_getRotatedLeftTop:function(e){var t=this.getAngle()*(Math.PI/180);return{left:-Math.sin(t)*e.getTop()*this.get("scaleY")+Math.cos(t)*e.getLeft()*this.get("scaleX"),top:Math.cos(t)*e.getTop()*this.get("scaleY")+Math.sin(t)*e.getLeft()*this.get("scaleX")}},destroy:function(){return this._objects.forEach(this._moveFlippedObject,this),this._restoreObjectsState()},saveCoords:function(){return this._originalLeft=this.get("left"),this._originalTop=this.get("top"),this},hasMoved:function(){return this._originalLeft!==this.get("left")||this._originalTop!==this.get("top")},setObjectsCoords:function(){return this.forEachObject(function(e){e.setCoords()}),this},_setOpacityIfSame:function(){var e=this.getObjects(),t=e[0]?e[0].get("opacity"):1,n=e.every(function(e){return e.get("opacity")===t});n&&(this.opacity=t)},_calcBounds:function(e){var t=[],n=[],r;for(var i=0,s=this._objects.length;i<s;++i){r=this._objects[i],r.setCoords();for(var o in r.oCoords)t.push(r.oCoords[o].x),n.push(r.oCoords[o].y)}this.set(this._getBounds(t,n,e))},_getBounds:function(e,n,s){var o=t.util.invertTransform(this.getViewportTransform()),u=t.util.transformPoint(new t.Point(r(e),r(n)),o),a=t.util.transformPoint(new t.Point(i(e),i(n)),o),f={width:a.x-u.x||0,height:a.y-u.y||0};return s||(f.left=(u.x+a.x)/2||0,f.top=(u.y+a.y)/2||0),f},toSVG:function(e){var t=["<g ",'transform="',this.getSvgTransform(),'">'];for(var n=0,r=this._objects.length;n<r;n++)t.push(this._objects[n].toSVG(e));return t.push("</g>"),e?e(t.join("")):t.join("")},get:function(e){if(e in o){if(this[e])return this[e];for(var t=0,n=this._objects.length;t<n;t++)if(this._objects[t][e])return!0;return!1}return e in this.delegatedProperties?this._objects[0]&&this._objects[0].get(e):this[e]}}),t.Group.fromObject=function(e,n){t.util.enlivenObjects(e.objects,function(r){delete e.objects,n&&n(new t.Group(r,e))})},t.Group.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=fabric.util.object.extend;e.fabric||(e.fabric={});if(e.fabric.Image){fabric.warn("fabric.Image is already defined.");return}fabric.Image=fabric.util.createClass(fabric.Object,{type:"image",crossOrigin:"",initialize:function(e,t){t||(t={}),this.filters=[],this.callSuper("initialize",t),this._initElement(e,t),this._initConfig(t),t.filters&&(this.filters=t.filters,this.applyFilters())},getElement:function(){return this._element},setElement:function(e,t){return this._element=e,this._originalElement=e,this._initConfig(),this.filters.length!==0&&this.applyFilters(t),this},setCrossOrigin:function(e){return this.crossOrigin=e,this._element.crossOrigin=e,this},getOriginalSize:function(){var e=this.getElement();return{width:e.width,height:e.height}},render:function(e,t){if(!this.visible)return;e.save();var n=this.transformMatrix,r=this.group&&this.group.type==="path-group";r&&e.translate(-this.group.width/2,-this.group.height/2),n&&e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),t||this.transform(e),r&&e.translate(this.width/2,this.height/2),this._setShadow(e),this.clipTo&&fabric.util.clipContext(this,e),this._render(e),this.shadow&&!this.shadow.affectStroke&&this._removeShadow(e),this._renderStroke(e),this.clipTo&&e.restore(),e.restore()},_stroke:function(e){e.save(),this._setStrokeStyles(e),e.beginPath(),e.strokeRect(-this.width/2,-this.height/2,this.width,this.height),e.closePath(),e.restore()},_renderDashedStroke:function(e){var t=-this.width/2,n=-this.height/2,r=this.width,i=this.height;e.save(),this._setStrokeStyles(e),e.beginPath(),fabric.util.drawDashedLine(e,t,n,t+r,n,this.strokeDashArray),fabric.util.drawDashedLine(e,t+r,n,t+r,n+i,this.strokeDashArray),fabric.util.drawDashedLine(e,t+r,n+i,t,n+i,this.strokeDashArray),fabric.util.drawDashedLine(e,t,n+i,t,n,this.strokeDashArray),e.closePath(),e.restore()},toObject:function(e){return t(this.callSuper("toObject",e),{src:this._originalElement.src||this._originalElement._src,filters:this.filters.map(function(e){return e&&e.toObject()}),crossOrigin:this.crossOrigin})},toSVG:function(e){var t=[];t.push('<g transform="',this.getSvgTransform(),'">','<image xlink:href="',this.getSvgSrc(),'" style="',this.getSvgStyles(),'" transform="translate('+ -this.width/2+" "+ -this.height/2+")",'" width="',this.width,'" height="',this.height,'" preserveAspectRatio="none"',"></image>");if(this.stroke||this.strokeDashArray){var n=this.fill;this.fill=null,t.push("<rect ",'x="',-1*this.width/2,'" y="',-1*this.height/2,'" width="',this.width,'" height="',this.height,'" style="',this.getSvgStyles(),'"/>'),this.fill=n}return t.push("</g>"),e?e(t.join("")):t.join("")},getSrc:function(){if(this.getElement())return this.getElement().src||this.getElement()._src},toString:function(){return'#<fabric.Image: { src: "'+this.getSrc()+'" }>'},clone:function(e,t){this.constructor.fromObject(this.toObject(t),e)},applyFilters:function(e){if(!this._originalElement)return;if(this.filters.length===0){this._element=this._originalElement,e&&e();return}var t=this._originalElement,n=fabric.util.createCanvasElement(),r=fabric.util.createImage(),i=this;return n.width=t.width,n.height=t.height,n.getContext("2d").drawImage(t,0,0,t.width,t.height),this.filters.forEach(function(e){e&&e.applyTo(n)}),r.width=t.width,r.height=t.height,fabric.isLikelyNode?(r.src=n.toBuffer(undefined,fabric.Image.pngCompression),i._element=r,e&&e()):(r.onload=function(){i._element=r,e&&e(),r.onload=n=t=null},r.src=n.toDataURL("image/png")),this},_render:function(e){this._element&&e.drawImage(this._element,-this.width/2,-this.height/2,this.width,this.height)},_resetWidthHeight:function(){var e=this.getElement();this.set("width",e.width),this.set("height",e.height)},_initElement:function(e){this.setElement(fabric.util.getById(e)),fabric.util.addClass(this.getElement(),fabric.Image.CSS_CANVAS)},_initConfig:function(e){e||(e={}),this.setOptions(e),this._setWidthHeight(e),this._element&&this.crossOrigin&&(this._element.crossOrigin=this.crossOrigin)},_initFilters:function(e,t){e.filters&&e.filters.length?fabric.util.enlivenObjects(e.filters,function(e){t&&t(e)},"fabric.Image.filters"):t&&t()},_setWidthHeight:function(e){this.width="width"in e?e.width:this.getElement()?this.getElement().width||0:0,this.height="height"in e?e.height:this.getElement()?this.getElement().height||0:0},complexity:function(){return 1}}),fabric.Image.CSS_CANVAS="canvas-img",fabric.Image.prototype.getSvgSrc=fabric.Image.prototype.getSrc,fabric.Image.fromObject=function(e,t){fabric.util.loadImage(e.src,function(n){fabric.Image.prototype._initFilters.call(e,e,function(r){e.filters=r||[];var i=new fabric.Image(n,e);t&&t(i)})},null,e.crossOrigin)},fabric.Image.fromURL=function(e,t,n){fabric.util.loadImage(e,function(e){t(new fabric.Image(e,n))},null,n&&n.crossOrigin)},fabric.Image.ATTRIBUTE_NAMES=fabric.SHARED_ATTRIBUTES.concat("x y width height xlink:href".split(" ")),fabric.Image.fromElement=function(e,n,r){var i=fabric.parseAttributes(e,fabric.Image.ATTRIBUTE_NAMES);fabric.Image.fromURL(i["xlink:href"],n,t(r?fabric.util.object.clone(r):{},i))},fabric.Image.async=!0,fabric.Image.pngCompression=1}(typeof exports!="undefined"?exports:this),fabric.util.object.extend(fabric.Object.prototype,{_getAngleValueForStraighten:function(){var e=this.getAngle()%360;return e>0?Math.round((e-1)/90)*90:Math.round(e/90)*90},straighten:function(){return this.setAngle(this._getAngleValueForStraighten()),this},fxStraighten:function(e){e=e||{};var t=function(){},n=e.onComplete||t,r=e.onChange||t,i=this;return fabric.util.animate({startValue:this.get("angle"),endValue:this._getAngleValueForStraighten(),duration:this.FX_DURATION,onChange:function(e){i.setAngle(e),r()},onComplete:function(){i.setCoords(),n()},onStart:function(){i.set("active",!1)}}),this}}),fabric.util.object.extend(fabric.StaticCanvas.prototype,{straightenObject:function(e){return e.straighten(),this.renderAll(),this},fxStraightenObject:function(e){return e.fxStraighten({onChange:this.renderAll.bind(this)}),this}}),fabric.Image.filters=fabric.Image.filters||{},fabric.Image.filters.BaseFilter=fabric.util.createClass({type:"BaseFilter",toObject:function(){return{type:this.type}},toJSON:function(){return this.toObject()}}),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Brightness=t.util.createClass(t.Image.filters.BaseFilter,{type:"Brightness",initialize:function(e){e=e||{},this.brightness=e.brightness||0},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.brightness;for(var s=0,o=r.length;s<o;s+=4)r[s]+=i,r[s+1]+=i,r[s+2]+=i;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{brightness:this.brightness})}}),t.Image.filters.Brightness.fromObject=function(e){return new t.Image.filters.Brightness(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Convolute=t.util.createClass(t.Image.filters.BaseFilter,{type:"Convolute",initialize:function(e){e=e||{},this.opaque=e.opaque,this.matrix=e.matrix||[0,0,0,0,1,0,0,0,0];var n=t.util.createCanvasElement();this.tmpCtx=n.getContext("2d")},_createImageData:function(e,t){return this.tmpCtx.createImageData(e,t)},applyTo:function(e){var t=this.matrix,n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=Math.round(Math.sqrt(t.length)),s=Math.floor(i/2),o=r.data,u=r.width,a=r.height,f=u,l=a,c=this._createImageData(f,l),h=c.data,p=this.opaque?1:0;for(var d=0;d<l;d++)for(var v=0;v<f;v++){var m=d,g=v,y=(d*f+v)*4,b=0,w=0,E=0,S=0;for(var x=0;x<i;x++)for(var T=0;T<i;T++){var N=m+x-s,C=g+T-s;if(N<0||N>a||C<0||C>u)continue;var k=(N*u+C)*4,L=t[x*i+T];b+=o[k]*L,w+=o[k+1]*L,E+=o[k+2]*L,S+=o[k+3]*L}h[y]=b,h[y+1]=w,h[y+2]=E,h[y+3]=S+p*(255-S)}n.putImageData(c,0,0)},toObject:function(){return n(this.callSuper("toObject"),{opaque:this.opaque,matrix:this.matrix})}}),t.Image.filters.Convolute.fromObject=function(e){return new t.Image.filters.Convolute(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.GradientTransparency=t.util.createClass(t.Image.filters.BaseFilter,{type:"GradientTransparency",initialize:function(e){e=e||{},this.threshold=e.threshold||100},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.threshold,s=r.length;for(var o=0,u=r.length;o<u;o+=4)r[o+3]=i+255*(s-o)/s;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{threshold:this.threshold})}}),t.Image.filters.GradientTransparency.fromObject=function(e){return new t.Image.filters.GradientTransparency(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Grayscale=t.util.createClass(t.Image.filters.BaseFilter,{type:"Grayscale",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=n.width*n.height*4,s=0,o;while(s<i)o=(r[s]+r[s+1]+r[s+2])/3,r[s]=o,r[s+1]=o,r[s+2]=o,s+=4;t.putImageData(n,0,0)}}),t.Image.filters.Grayscale.fromObject=function(){return new t.Image.filters.Grayscale}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Invert=t.util.createClass(t.Image.filters.BaseFilter,{type:"Invert",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height
),r=n.data,i=r.length,s;for(s=0;s<i;s+=4)r[s]=255-r[s],r[s+1]=255-r[s+1],r[s+2]=255-r[s+2];t.putImageData(n,0,0)}}),t.Image.filters.Invert.fromObject=function(){return new t.Image.filters.Invert}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Mask=t.util.createClass(t.Image.filters.BaseFilter,{type:"Mask",initialize:function(e){e=e||{},this.mask=e.mask,this.channel=[0,1,2,3].indexOf(e.channel)>-1?e.channel:0},applyTo:function(e){if(!this.mask)return;var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=this.mask.getElement(),o=t.util.createCanvasElement(),u=this.channel,a,f=r.width*r.height*4;o.width=s.width,o.height=s.height,o.getContext("2d").drawImage(s,0,0,s.width,s.height);var l=o.getContext("2d").getImageData(0,0,s.width,s.height),c=l.data;for(a=0;a<f;a+=4)i[a+3]=c[a+u];n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{mask:this.mask.toObject(),channel:this.channel})}}),t.Image.filters.Mask.fromObject=function(e,n){t.util.loadImage(e.mask.src,function(r){e.mask=new t.Image(r,e.mask),n&&n(new t.Image.filters.Mask(e))})},t.Image.filters.Mask.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Noise=t.util.createClass(t.Image.filters.BaseFilter,{type:"Noise",initialize:function(e){e=e||{},this.noise=e.noise||0},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.noise,s;for(var o=0,u=r.length;o<u;o+=4)s=(.5-Math.random())*i,r[o]+=s,r[o+1]+=s,r[o+2]+=s;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{noise:this.noise})}}),t.Image.filters.Noise.fromObject=function(e){return new t.Image.filters.Noise(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Pixelate=t.util.createClass(t.Image.filters.BaseFilter,{type:"Pixelate",initialize:function(e){e=e||{},this.blocksize=e.blocksize||4},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=n.height,s=n.width,o,u,a,f,l,c,h;for(u=0;u<i;u+=this.blocksize)for(a=0;a<s;a+=this.blocksize){o=u*4*s+a*4,f=r[o],l=r[o+1],c=r[o+2],h=r[o+3];for(var p=u,d=u+this.blocksize;p<d;p++)for(var v=a,m=a+this.blocksize;v<m;v++)o=p*4*s+v*4,r[o]=f,r[o+1]=l,r[o+2]=c,r[o+3]=h}t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{blocksize:this.blocksize})}}),t.Image.filters.Pixelate.fromObject=function(e){return new t.Image.filters.Pixelate(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.RemoveWhite=t.util.createClass(t.Image.filters.BaseFilter,{type:"RemoveWhite",initialize:function(e){e=e||{},this.threshold=e.threshold||30,this.distance=e.distance||20},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.threshold,s=this.distance,o=255-i,u=Math.abs,a,f,l;for(var c=0,h=r.length;c<h;c+=4)a=r[c],f=r[c+1],l=r[c+2],a>o&&f>o&&l>o&&u(a-f)<s&&u(a-l)<s&&u(f-l)<s&&(r[c+3]=1);t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{threshold:this.threshold,distance:this.distance})}}),t.Image.filters.RemoveWhite.fromObject=function(e){return new t.Image.filters.RemoveWhite(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Sepia=t.util.createClass(t.Image.filters.BaseFilter,{type:"Sepia",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=r.length,s,o;for(s=0;s<i;s+=4)o=.3*r[s]+.59*r[s+1]+.11*r[s+2],r[s]=o+100,r[s+1]=o+50,r[s+2]=o+255;t.putImageData(n,0,0)}}),t.Image.filters.Sepia.fromObject=function(){return new t.Image.filters.Sepia}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Sepia2=t.util.createClass(t.Image.filters.BaseFilter,{type:"Sepia2",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=r.length,s,o,u,a;for(s=0;s<i;s+=4)o=r[s],u=r[s+1],a=r[s+2],r[s]=(o*.393+u*.769+a*.189)/1.351,r[s+1]=(o*.349+u*.686+a*.168)/1.203,r[s+2]=(o*.272+u*.534+a*.131)/2.14;t.putImageData(n,0,0)}}),t.Image.filters.Sepia2.fromObject=function(){return new t.Image.filters.Sepia2}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Tint=t.util.createClass(t.Image.filters.BaseFilter,{type:"Tint",initialize:function(e){e=e||{},this.color=e.color||"#000000",this.opacity=typeof e.opacity!="undefined"?e.opacity:(new t.Color(this.color)).getAlpha()},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=i.length,o,u,a,f,l,c,h,p,d;d=(new t.Color(this.color)).getSource(),u=d[0]*this.opacity,a=d[1]*this.opacity,f=d[2]*this.opacity,p=1-this.opacity;for(o=0;o<s;o+=4)l=i[o],c=i[o+1],h=i[o+2],i[o]=u+l*p,i[o+1]=a+c*p,i[o+2]=f+h*p;n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{color:this.color,opacity:this.opacity})}}),t.Image.filters.Tint.fromObject=function(e){return new t.Image.filters.Tint(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Multiply=t.util.createClass(t.Image.filters.BaseFilter,{type:"Multiply",initialize:function(e){e=e||{},this.color=e.color||"#000000"},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=i.length,o,u;u=(new t.Color(this.color)).getSource();for(o=0;o<s;o+=4)i[o]*=u[0]/255,i[o+1]*=u[1]/255,i[o+2]*=u[2]/255;n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{color:this.color})}}),t.Image.filters.Multiply.fromObject=function(e){return new t.Image.filters.Multiply(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric;t.Image.filters.Blend=t.util.createClass({type:"Blend",initialize:function(e){e=e||{},this.color=e.color||"#000",this.image=e.image||!1,this.mode=e.mode||"multiply",this.alpha=e.alpha||1},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s,o,u,a,f,l,c,h=!1;if(this.image){h=!0;var p=t.util.createCanvasElement();p.width=this.image.width,p.height=this.image.height;var d=new t.StaticCanvas(p);d.add(this.image);var v=d.getContext("2d");c=v.getImageData(0,0,d.width,d.height).data}else c=(new t.Color(this.color)).getSource(),s=c[0]*this.alpha,o=c[1]*this.alpha,u=c[2]*this.alpha;for(var m=0,g=i.length;m<g;m+=4){a=i[m],f=i[m+1],l=i[m+2],h&&(s=c[m]*this.alpha,o=c[m+1]*this.alpha,u=c[m+2]*this.alpha);switch(this.mode){case"multiply":i[m]=a*s/255,i[m+1]=f*o/255,i[m+2]=l*u/255;break;case"screen":i[m]=1-(1-a)*(1-s),i[m+1]=1-(1-f)*(1-o),i[m+2]=1-(1-l)*(1-u);break;case"add":i[m]=Math.min(255,a+s),i[m+1]=Math.min(255,f+o),i[m+2]=Math.min(255,l+u);break;case"diff":i[m]=Math.abs(a-s),i[m+1]=Math.abs(f-o),i[m+2]=Math.abs(l-u)}}n.putImageData(r,0,0)}}),t.Image.filters.Blend.fromObject=function(e){return new t.Image.filters.Blend(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.object.clone,i=t.util.toFixed,s=t.StaticCanvas.supports("setLineDash");if(t.Text){t.warn("fabric.Text is already defined");return}var o=t.Object.prototype.stateProperties.concat();o.push("fontFamily","fontWeight","fontSize","text","textDecoration","textAlign","fontStyle","lineHeight","textBackgroundColor","useNative","path"),t.Text=t.util.createClass(t.Object,{_dimensionAffectingProps:{fontSize:!0,fontWeight:!0,fontFamily:!0,textDecoration:!0,fontStyle:!0,lineHeight:!0,stroke:!0,strokeWidth:!0,text:!0},_reNewline:/\r?\n/,type:"text",fontSize:40,fontWeight:"normal",fontFamily:"Times New Roman",textDecoration:"",textAlign:"left",fontStyle:"",lineHeight:1.3,textBackgroundColor:"",path:null,useNative:!0,stateProperties:o,stroke:null,shadow:null,initialize:function(e,t){t=t||{},this.text=e,this.__skipDimension=!0,this.setOptions(t),this.__skipDimension=!1,this._initDimensions()},_initDimensions:function(){if(this.__skipDimension)return;var e=t.util.createCanvasElement();this._render(e.getContext("2d"))},toString:function(){return"#<fabric.Text ("+this.complexity()+'): { "text": "'+this.text+'", "fontFamily": "'+this.fontFamily+'" }>'},_render:function(e){typeof Cufon=="undefined"||this.useNative===!0?this._renderViaNative(e):this._renderViaCufon(e)},_renderViaNative:function(e){var n=this.text.split(this._reNewline);this._setTextStyles(e),this.width=this._getTextWidth(e,n),this.height=this._getTextHeight(e,n),this.clipTo&&t.util.clipContext(this,e),this._renderTextBackground(e,n),this._translateForTextAlign(e),this._renderText(e,n),this.textAlign!=="left"&&this.textAlign!=="justify"&&e.restore(),this._renderTextDecoration(e,n),this.clipTo&&e.restore(),this._setBoundaries(e,n),this._totalLineHeight=0},_renderText:function(e,t){e.save(),this._setShadow(e),this._setupFillRule(e),this._renderTextFill(e,t),this._renderTextStroke(e,t),this._restoreFillRule(e),this._removeShadow(e),e.restore()},_translateForTextAlign:function(e){this.textAlign!=="left"&&this.textAlign!=="justify"&&(e.save(),e.translate(this.textAlign==="center"?this.width/2:this.width,0))},_setBoundaries:function(e,t){this._boundaries=[];for(var n=0,r=t.length;n<r;n++){var i=this._getLineWidth(e,t[n]),s=this._getLineLeftOffset(i);this._boundaries.push({height:this.fontSize*this.lineHeight,width:i,left:s})}},_setTextStyles:function(e){this._setFillStyles(e),this._setStrokeStyles(e),e.textBaseline="alphabetic",this.skipTextAlign||(e.textAlign=this.textAlign),e.font=this._getFontDeclaration()},_getTextHeight:function(e,t){return this.fontSize*t.length*this.lineHeight},_getTextWidth:function(e,t){var n=e.measureText(t[0]||"|").width;for(var r=1,i=t.length;r<i;r++){var s=e.measureText(t[r]).width;s>n&&(n=s)}return n},_renderChars:function(e,t,n,r,i){t[e](n,r,i)},_renderTextLine:function(e,t,n,r,i,s){i-=this.fontSize/4;if(this.textAlign!=="justify"){this._renderChars(e,t,n,r,i,s);return}var o=t.measureText(n).width,u=this.width;if(u>o){var a=n.split(/\s+/),f=t.measureText(n.replace(/\s+/g,"")).width,l=u-f,c=a.length-1,h=l/c,p=0;for(var d=0,v=a.length;d<v;d++)this._renderChars(e,t,a[d],r+p,i,s),p+=t.measureText(a[d]).width+h}else this._renderChars(e,t,n,r,i,s)},_getLeftOffset:function(){return t.isLikelyNode?0:-this.width/2},_getTopOffset:function(){return-this.height/2},_renderTextFill:function(e,t){if(!this.fill&&!this._skipFillStrokeCheck)return;this._boundaries=[];var n=0;for(var r=0,i=t.length;r<i;r++){var s=this._getHeightOfLine(e,r,t);n+=s,this._renderTextLine("fillText",e,t[r],this._getLeftOffset(),this._getTopOffset()+n,r)}},_renderTextStroke:function(e,t){if((!this.stroke||this.strokeWidth===0)&&!this._skipFillStrokeCheck)return;var n=0;e.save(),this.strokeDashArray&&(1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),s&&e.setLineDash(this.strokeDashArray)),e.beginPath();for(var r=0,i=t.length;r<i;r++){var o=this._getHeightOfLine(e,r,t);n+=o,this._renderTextLine("strokeText",e,t[r],this._getLeftOffset(),this._getTopOffset()+n,r)}e.closePath(),e.restore()},_getHeightOfLine:function(){return this.fontSize*this.lineHeight},_renderTextBackground:function(e,t){this._renderTextBoxBackground(e),this._renderTextLinesBackground(e,t)},_renderTextBoxBackground:function(e){if(!this.backgroundColor)return;e.save(),e.fillStyle=this.backgroundColor,e.fillRect(this._getLeftOffset(),this._getTopOffset(),this.width,this.height),e.restore()},_renderTextLinesBackground:function(e,t){if(!this.textBackgroundColor)return;e.save(),e.fillStyle=this.textBackgroundColor;for(var n=0,r=t.length;n<r;n++)if(t[n]!==""){var i=this._getLineWidth(e,t[n]),s=this._getLineLeftOffset(i);e.fillRect(this._getLeftOffset()+s,this._getTopOffset()+n*this.fontSize*this.lineHeight,i,this.fontSize*this.lineHeight)}e.restore()},_getLineLeftOffset:function(e){return this.textAlign==="center"?(this.width-e)/2:this.textAlign==="right"?this.width-e:0},_getLineWidth:function(e,t){return this.textAlign==="justify"?this.width:e.measureText(t).width},_renderTextDecoration:function(e,t){function i(i){for(var s=0,o=t.length;s<o;s++){var u=r._getLineWidth(e,t[s]),a=r._getLineLeftOffset(u);e.fillRect(r._getLeftOffset()+a,~~(i+s*r._getHeightOfLine(e,s,t)-n),u,1)}}if(!this.textDecoration)return;var n=this._getTextHeight(e,t)/2,r=this;this.textDecoration.indexOf("underline")>-1&&i(this.fontSize*this.lineHeight),this.textDecoration.indexOf("line-through")>-1&&i(this.fontSize*this.lineHeight-this.fontSize/2),this.textDecoration.indexOf("overline")>-1&&i(this.fontSize*this.lineHeight-this.fontSize)},_getFontDeclaration:function(){return[t.isLikelyNode?this.fontWeight:this.fontStyle,t.isLikelyNode?this.fontStyle:this.fontWeight,this.fontSize+"px",t.isLikelyNode?'"'+this.fontFamily+'"':this.fontFamily].join(" ")},render:function(e,t){if(!this.visible)return;e.save(),this._transform(e,t);var n=this.transformMatrix,r=this.group&&this.group.type==="path-group";r&&e.translate(-this.group.width/2,-this.group.height/2),n&&e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),r&&e.translate(this.left,this.top),this._render(e),e.restore()},toObject:function(e){var t=n(this.callSuper("toObject",e),{text:this.text,fontSize:this.fontSize,fontWeight:this.fontWeight,fontFamily:this.fontFamily,fontStyle:this.fontStyle,lineHeight:this.lineHeight,textDecoration:this.textDecoration,textAlign:this.textAlign,path:this.path,textBackgroundColor:this.textBackgroundColor,useNative:this.useNative});return this.includeDefaultValues||this._removeDefaultValues(t),t},toSVG:function(e){var t=[],n=this.text.split(this._reNewline),r=this._getSVGLeftTopOffsets(n),i=this._getSVGTextAndBg(r.lineTop,r.textLeft,n),s=this._getSVGShadows(r.lineTop,n);return r.textTop+=this._fontAscent?this._fontAscent/5*this.lineHeight:0,this._wrapSVGTextAndBg(t,i,s,r),e?e(t.join("")):t.join("")},_getSVGLeftTopOffsets:function(e){var t=this.useNative?this.fontSize*this.lineHeight:-this._fontAscent-this._fontAscent/5*this.lineHeight,n=-(this.width/2),r=this.useNative?this.fontSize-1:this.height/2-e.length*this.fontSize-this._totalLineHeight;return{textLeft:n,textTop:r,lineTop:t}},_wrapSVGTextAndBg:function(e,t,n,r){e.push('<g transform="',this.getSvgTransform(),'">',t.textBgRects.join(""),"<text ",this.fontFamily?'font-family="'+this.fontFamily.replace(/"/g,"'")+'" ':"",this.fontSize?'font-size="'+this.fontSize+'" ':"",this.fontStyle?'font-style="'+this.fontStyle+'" ':"",this.fontWeight?'font-weight="'+this.fontWeight+'" ':"",this.textDecoration?'text-decoration="'+this.textDecoration+'" ':"",'style="',this.getSvgStyles(),'" ','transform="translate(',i(r.textLeft,2)," ",i(r.textTop,2),')">',n.join(""),t.textSpans.join(""),"</text>","</g>")},_getSVGShadows:function(e,n){var r=[],s,o,u=1;if(!this.shadow||!this._boundaries)return r;for(s=0,o=n.length;s<o;s++)if(n[s]!==""){var a=this._boundaries&&this._boundaries[s]?this._boundaries[s].left:0;r.push('<tspan x="',i(a+u+this.shadow.offsetX,2),s===0||this.useNative?'" y':'" dy','="',i(this.useNative?e*s-this.height/2+this.shadow.offsetY:e+(s===0?this.shadow.offsetY:0),2),'" ',this._getFillAttributes(this.shadow.color),">",t.util.string.escapeXml(n[s]),"</tspan>"),u=1}else u++;return r},_getSVGTextAndBg:function(e,t,n){var r=[],i=[],s=1;this._setSVGBg(i);for(var o=0,u=n.length;o<u;o++){n[o]!==""?(this._setSVGTextLineText(n[o],o,r,e,s,i),s=1):s++;if(!this.textBackgroundColor||!this._boundaries)continue;this._setSVGTextLineBg(i,o,t,e)}return{textSpans:r,textBgRects:i}},_setSVGTextLineText:function(e,n,r,s,o){var u=this._boundaries&&this._boundaries[n]?i(this._boundaries[n].left,2):0;r.push('<tspan x="',u,'" ',n===0||this.useNative?"y":"dy",'="',i(this.useNative?s*n-this.height/2:s*o,2),'" ',this._getFillAttributes(this.fill),">",t.util.string.escapeXml(e),"</tspan>")},_setSVGTextLineBg:function(e,t,n,r){e.push("<rect ",this._getFillAttributes(this.textBackgroundColor),' x="',i(n+this._boundaries[t].left,2),'" y="',i(r*t-this.height/2,2),'" width="',i(this._boundaries[t].width,2),'" height="',i(this._boundaries[t].height,2),'"></rect>')},_setSVGBg:function(e){this.backgroundColor&&this._boundaries&&e.push("<rect ",this._getFillAttributes(this.backgroundColor),' x="',i(-this.width/2,2),'" y="',i(-this.height/2,2),'" width="',i(this.width,2),'" height="',i(this.height,2),'"></rect>')},_getFillAttributes:function(e){var n=e&&typeof e=="string"?new t.Color(e):"";return!n||!n.getSource()||n.getAlpha()===1?'fill="'+e+'"':'opacity="'+n.getAlpha()+'" fill="'+n.setAlpha(1).toRgb()+'"'},_set:function(e,t){e==="fontFamily"&&this.path&&(this.path=this.path.replace(/(.*?)([^\/]*)(\.font\.js)/,"$1"+t+"$3")),this.callSuper("_set",e,t),e in this._dimensionAffectingProps&&(this._initDimensions(),this.setCoords())},complexity:function(){return 1}}),t.Text.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")),t.Text.DEFAULT_SVG_FONT_SIZE=16,t.Text.fromElement=function(e,n){if(!e)return null;var r=t.parseAttributes(e,t.Text.ATTRIBUTE_NAMES);n=t.util.object.extend(n?t.util.object.clone(n):{},r),"dx"in r&&(n.left+=r.dx),"dy"in r&&(n.top+=r.dy),"fontSize"in n||(n.fontSize=t.Text.DEFAULT_SVG_FONT_SIZE),n.originX||(n.originX="left");var i=new t.Text(e.textContent,n),s=0;return i.originX==="left"&&(s=i.getWidth()/2),i.originX==="right"&&(s=-i.getWidth()/2),i.set({left:i.getLeft()+s,top:i.getTop()-i.getHeight()/2}),i},t.Text.fromObject=function(e){return new t.Text(e.text,r(e))},t.util.createAccessors(t.Text)}(typeof exports!="undefined"?exports:this),function(){var e=fabric.util.object.clone;fabric.IText=fabric.util.createClass(fabric.Text,fabric.Observable,{type:"i-text",selectionStart:0,selectionEnd:0,selectionColor:"rgba(17,119,255,0.3)",isEditing:!1,editable:!0,editingBorderColor:"rgba(102,153,255,0.25)",cursorWidth:2,cursorColor:"#333",cursorDelay:1e3,cursorDuration:600,styles:null,caching:!0,_skipFillStrokeCheck:!0,_reSpace:/\s|\n/,_fontSizeFraction:4,_currentCursorOpacity:0,_selectionDirection:null,_abortCursorAnimation:!1,_charWidthsCache:{},initialize:function(e,t){this.styles=t?t.styles||{}:{},this.callSuper("initialize",e,t),this.initBehavior(),fabric.IText.instances.push(this),this.__lineWidths={},this.__lineHeights={},this.__lineOffsets={}},isEmptyStyles:function(){if(!this.styles)return!0;var e=this.styles;for(var t in e)for(var n in e[t])for(var r in e[t][n])return!1;return!0},setSelectionStart:function(e){this.selectionStart!==e&&(this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})),this.selectionStart=e,this.hiddenTextarea&&(this.hiddenTextarea.selectionStart=e)},setSelectionEnd:function(e){this.selectionEnd!==e&&(this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})),this.selectionEnd=e,this.hiddenTextarea&&(this.hiddenTextarea.selectionEnd=e)},getSelectionStyles:function(e,t){if(arguments.length===2){var n=[];for(var r=e;r<t;r++)n.push(this.getSelectionStyles(r));return n}var i=this.get2DCursorLocation(e);return this.styles[i.lineIndex]?this.styles[i.lineIndex][i.charIndex]||{}:{}},setSelectionStyles:function(e){if(this.selectionStart===this.selectionEnd)this._extendStyles(this.selectionStart,e);else for(var t=this.selectionStart;t<this.selectionEnd;t++)this._extendStyles(t,e);return this},_extendStyles:function(e,t){var n=this.get2DCursorLocation(e);this.styles[n.lineIndex]||(this.styles[n.lineIndex]={}),this.styles[n.lineIndex][n.charIndex]||(this.styles[n.lineIndex][n.charIndex]={}),fabric.util.object.extend(this.styles[n.lineIndex][n.charIndex],t)},_render:function(e){this.callSuper("_render",e),this.ctx=e,this.isEditing&&this.renderCursorOrSelection()},renderCursorOrSelection:function(){if(!this.active)return;var e=this.text.split(""),t;this.selectionStart===this.selectionEnd?(t=this._getCursorBoundaries(e,"cursor"),this.renderCursor(t)):(t=this._getCursorBoundaries(e,"selection"),this.renderSelection(e,t))},get2DCursorLocation:function(e){typeof e=="undefined"&&(e=this.selectionStart);var t=this.text.slice(0,e),n=t.split(this._reNewline);return{lineIndex:n.length-1,charIndex:n[n.length-1].length}},getCurrentCharStyle:function(e,t){var n=this.styles[e]&&this.styles[e][t===0?0:t-1];return{fontSize:n&&n.fontSize||this.fontSize,fill:n&&n.fill||this.fill,textBackgroundColor:n&&n.textBackgroundColor||this.textBackgroundColor,textDecoration:n&&n.textDecoration||this.textDecoration,fontFamily:n&&n.fontFamily||this.fontFamily,fontWeight:n&&n.fontWeight||this.fontWeight,fontStyle:n&&n.fontStyle||this.fontStyle,stroke:n&&n.stroke||this.stroke,strokeWidth:n&&n.strokeWidth||this.strokeWidth}},getCurrentCharFontSize:function(e,t){return this.styles[e]&&this.styles[e][t===0?0:t-1]&&this.styles[e][t===0?0:t-1].fontSize||this.fontSize},getCurrentCharColor:function(e,t){return this.styles[e]&&this.styles[e][t===0?0:t-1]&&this.styles[e][t===0?0:t-1].fill||this.cursorColor},_getCursorBoundaries:function(e,t){var n=this.get2DCursorLocation(),r=this.text.split(this._reNewline),i=Math.round(this._getLeftOffset()),s=-this.height/2,o=this._getCursorBoundariesOffsets(e,t,n,r);return{left:i,top:s,leftOffset:o.left+o.lineLeft,topOffset:o.top}},_getCursorBoundariesOffsets:function(e,t,n,r){var i=0,s=0,o=0,u=0,a=t==="cursor"?this._getHeightOfLine(this.ctx,0)-this.getCurrentCharFontSize(n.lineIndex,n.charIndex):0;for(var f=0;f<this.selectionStart;f++){if(e[f]==="\n"){u=0;var l=s+(t==="cursor"?1:0);a+=this._getCachedLineHeight(l),s++,o=0}else u+=this._getWidthOfChar(this.ctx,e[f],s,o),o++;i=this._getCachedLineOffset(s,r)}return this._clearCache(),{top:a,left:u,lineLeft:i}},_clearCache:function(){this.__lineWidths={},this.__lineHeights={},this.__lineOffsets={}},_getCachedLineHeight:function(e){return this.__lineHeights[e]||(this.__lineHeights[e]=this._getHeightOfLine(this.ctx,e))},_getCachedLineWidth:function(e,t){return this.__lineWidths[e]||(this.__lineWidths[e]=this._getWidthOfLine(this.ctx,e,t))},_getCachedLineOffset:function(e,t){var n=this._getCachedLineWidth(e,t);return this.__lineOffsets[e]||(this.__lineOffsets[e]=this._getLineLeftOffset(n))},renderCursor:function(e){var t=this.ctx;t.save();var n=this.get2DCursorLocation(),r=n.lineIndex,i=n.charIndex,s=this.getCurrentCharFontSize(r,i),o=r===0&&i===0?this._getCachedLineOffset(r,this.text.split(this._reNewline)):e.leftOffset;t.fillStyle=this.getCurrentCharColor(r,i),t.globalAlpha=this.__isMousedown?1:this._currentCursorOpacity,t.fillRect(e.left+o,e.top+e.topOffset,this.cursorWidth/this.scaleX,s),t.restore()},renderSelection:function(e,t){var n=this.ctx;n.save(),n.fillStyle=this.selectionColor;var r=this.get2DCursorLocation(this.selectionStart),i=this.get2DCursorLocation(this.selectionEnd),s=r.lineIndex,o=i.lineIndex,u=this.text.split(this._reNewline);for(var a=s;a<=o;a++){var f=this._getCachedLineOffset(a,u)||0,l=this._getCachedLineHeight(a),c=0;if(a===s)for(var h=0,p=u[a].length;h<p;h++)h>=r.charIndex&&(a!==o||h<i.charIndex)&&(c+=this._getWidthOfChar(n,u[a][h],a,h)),h<r.charIndex&&(f+=this._getWidthOfChar(n,u[a][h],a,h));else if(a>s&&a<o)c+=this._getCachedLineWidth(a,u)||5;else if(a===o)for(var d=0,v=i.charIndex;d<v;d++)c+=this._getWidthOfChar(n,u[a][d],a,d);n.fillRect(t.left+f,t.top+t.topOffset,c,l),t.topOffset+=l}n.restore()},_renderChars:function(e,t,n,r,i,s){if(this.isEmptyStyles())return this._renderCharsFast(e,t,n,r,i);this.skipTextAlign=!0,r-=this.textAlign==="center"?this.width/2:this.textAlign==="right"?this.width:0;var o=this.text.split(this._reNewline),u=this._getWidthOfLine(t,s,o),a=this._getHeightOfLine(t,s,o),f=this._getLineLeftOffset(u),l=n.split(""),c,h="";r+=f||0,t.save();for(var p=0,d=l.length;p<=d;p++){c=c||this.getCurrentCharStyle(s,p);var v=this.getCurrentCharStyle(s,p+1);if(this._hasStyleChanged(c,v)||p===d)this._renderChar(e,t,s,p-1,h,r,i,a),h="",c=v;h+=l[p]}t.restore()},_renderCharsFast:function(e,t,n,r,i){this.skipTextAlign=!1,e==="fillText"&&this.fill&&this.callSuper("_renderChars",e,t,n,r,i),e==="strokeText"&&this.stroke&&this.callSuper("_renderChars",e,t,n,r,i)},_renderChar:function(e,t,n,r,i,s,o,u){var a,f,l;if(this.styles&&this.styles[n]&&(a=this.styles[n][r])){var c=a.stroke||this.stroke,h=a.fill||this.fill;t.save(),f=this._applyCharStylesGetWidth(t,i,n,r,a),l=this._getHeightOfChar(t,i,n,r),h&&t.fillText(i,s,o),c&&t.strokeText(i,s,o),this._renderCharDecoration(t,a,s,o,f,u,l),t.restore(),t.translate(f,0)}else e==="strokeText"&&this.stroke&&t[e](i,s,o),e==="fillText"&&this.fill&&t[e](i,s,o),f=this._applyCharStylesGetWidth(t,i,n,r),this._renderCharDecoration(t,null,s,o,f,u),t.translate(t.measureText(i).width,0)},_hasStyleChanged:function(e,t){return e.fill!==t.fill||e.fontSize!==t.fontSize||e.textBackgroundColor!==t.textBackgroundColor||e.textDecoration!==t.textDecoration||e.fontFamily!==t.fontFamily||e.fontWeight!==t.fontWeight||e.fontStyle!==t.fontStyle||e.stroke!==t.stroke||e.strokeWidth!==t.strokeWidth},_renderCharDecoration:function(e,t,n,r,i,s,o){var u=t?t.textDecoration||this.textDecoration:this.textDecoration,a=(t?t.fontSize:null)||this.fontSize;if(!u)return;u.indexOf("underline")>-1&&this._renderCharDecorationAtOffset(e,n,r+this.fontSize/this._fontSizeFraction,i,0,this.fontSize/20),u.indexOf("line-through")>-1&&this._renderCharDecorationAtOffset(e,n,r+this.fontSize/this._fontSizeFraction,i,o/2,a/20),u.indexOf("overline")>-1&&this._renderCharDecorationAtOffset(e,n,r,i,s-this.fontSize/this._fontSizeFraction,this.fontSize/20)},_renderCharDecorationAtOffset:function(e,t,n,r,i,s){e.fillRect(t,n-i,r,s)},_renderTextLine:function(e,t,n,r,i,s){i+=this.fontSize/4,this.callSuper("_renderTextLine",e,t,n,r,i,s)},_renderTextDecoration:function(e,t){if(this.isEmptyStyles())return this.callSuper("_renderTextDecoration",e,t)},_renderTextLinesBackground:function(e,t){if(!this.textBackgroundColor&&!this.styles)return;e.save(),this.textBackgroundColor&&(e.fillStyle=this.textBackgroundColor);var n=0,r=this.fontSize/this._fontSizeFraction;for(var i=0,s=t.length;i<s;i++){var o=this._getHeightOfLine(e,i,t);if(t[i]===""){n+=o;continue}var u=this._getWidthOfLine(e,i,t),a=this._getLineLeftOffset(u);this.textBackgroundColor&&(e.fillStyle=this.textBackgroundColor,e.fillRect(this._getLeftOffset()+a,this._getTopOffset()+n+r,u,o));if(this.styles[i])for(var f=0,l=t[i].length;f<l;f++)if(this.styles[i]&&this.styles[i][f]&&this.styles[i][f].textBackgroundColor){var c=t[i][f];e.fillStyle=this.styles[i][f].textBackgroundColor,e.fillRect(this._getLeftOffset()+a+this._getWidthOfCharsAt(e,i,f,t),this._getTopOffset()+n+r,this._getWidthOfChar(e,c,i,f,t)+1,o)}n+=o}e.restore()},_getCacheProp:function(e,t){return e+t.fontFamily+t.fontSize+t.fontWeight+t.fontStyle+t.shadow},_applyCharStylesGetWidth:function(t,n,r,i,s){var o=s||this.styles[r]&&this.styles[r][i];o?o=e(o):o={},this._applyFontStyles(o);var u=this._getCacheProp(n,o);if(this.isEmptyStyles()&&this._charWidthsCache[u]&&this.caching)return this._charWidthsCache[u];typeof o.shadow=="string"&&(o.shadow=new fabric.Shadow(o.shadow));var a=o.fill||this.fill;return t.fillStyle=a.toLive?a.toLive(t):a,o.stroke&&(t.strokeStyle=o.stroke&&o.stroke.toLive?o.stroke.toLive(t):o.stroke),t.lineWidth=o.strokeWidth||this.strokeWidth,t.font=this._getFontDeclaration.call(o),this._setShadow.call(o,t),this.caching?(this._charWidthsCache[u]||(this._charWidthsCache[u]=t.measureText(n).width),this._charWidthsCache[u]):t.measureText(n).width},_applyFontStyles:function(e){e.fontFamily||(e.fontFamily=this.fontFamily),e.fontSize||(e.fontSize=this.fontSize),e.fontWeight||(e.fontWeight=this.fontWeight),e.fontStyle||(e.fontStyle=this.fontStyle)},_getStyleDeclaration:function(t,n){return this.styles[t]&&this.styles[t][n]?e(this.styles[t][n]):{}},_getWidthOfChar:function(e,t,n,r){var i=this._getStyleDeclaration(n,r);this._applyFontStyles(i);var s=this._getCacheProp(t,i);if(this._charWidthsCache[s]&&this.caching)return this._charWidthsCache[s];if(e){e.save();var o=this._applyCharStylesGetWidth(e,t,n,r);return e.restore(),o}},_getHeightOfChar:function(e,t,n,r){return this.styles[n]&&this.styles[n][r]?this.styles[n][r].fontSize||this.fontSize:this.fontSize},_getWidthOfCharAt:function(e,t,n,r){r=r||this.text.split(this._reNewline);var i=r[t].split("")[n];return this._getWidthOfChar(e,i,t,n)},_getHeightOfCharAt:function(e,t,n,r){r=r||this.text.split(this._reNewline);var i=r[t].split("")[n];return this._getHeightOfChar(e,i,t,n)},_getWidthOfCharsAt:function(e,t,n,r){var i=0;for(var s=0;s<n;s++)i+=this._getWidthOfCharAt(e,t,s,r);return i},_getWidthOfLine:function(e,t,n){return this._getWidthOfCharsAt(e,t,n[t].length,n)},_getTextWidth:function(e,t){if(this.isEmptyStyles())return this.callSuper("_getTextWidth",e,t);var n=this._getWidthOfLine(e,0,t);for(var r=1,i=t.length;r<i;r++){var s=this._getWidthOfLine(e,r,t);s>n&&(n=s)}return n},_getHeightOfLine:function(e,t,n){n=n||this.text.split(this._reNewline);var r=this._getHeightOfChar(e,n[t][0],t,0),i=n[t],s=i.split("");for(var o=1,u=s.length;o<u;o++){var a=this._getHeightOfChar(e,s[o],t,o);a>r&&(r=a)}return r*this.lineHeight},_getTextHeight:function(e,t){var n=0;for(var r=0,i=t.length;r<i;r++)n+=this._getHeightOfLine(e,r,t);return n},_getTopOffset:function(){var e=fabric.Text.prototype._getTopOffset.call(this);return e-this.fontSize/this._fontSizeFraction},_renderTextBoxBackground:function(e){if(!this.backgroundColor)return;e.save(),e.fillStyle=this.backgroundColor,e.fillRect(this._getLeftOffset(),this._getTopOffset()+this.fontSize/this._fontSizeFraction,this.width,this.height),e.restore()},toObject:function(t){return fabric.util.object.extend(this.callSuper("toObject",t),{styles:e(this.styles)})}}),fabric.IText.fromObject=function(t){return new fabric.IText(t.text,e(t))},fabric.IText.instances=[]}(),function(){var e=fabric.util.object.clone;fabric.util.object.extend(fabric.IText.prototype,{initBehavior:function(){this.initAddedHandler(),this.initCursorSelectionHandlers(),this.initDoubleClickSimulation()},initSelectedHandler:function(){this.on("selected",function(){var e=this;setTimeout(function(){e.selected=!0},100)})},initAddedHandler:function(){this.on("added",function(){this.canvas&&!this.canvas._hasITextHandlers&&(this.canvas._hasITextHandlers=!0,this._initCanvasHandlers())})},_initCanvasHandlers:function(){this.canvas.on("selection:cleared",function(){fabric.IText.prototype.exitEditingOnOthers.call()}),this.canvas.on("mouse:up",function(){fabric.IText.instances.forEach(function(e){e.__isMousedown=!1})}),this.canvas.on("object:selected",function(e){fabric.IText.prototype.exitEditingOnOthers.call(e.target)})},_tick:function(){var e=this;if(this._abortCursorAnimation)return;this.animate("_currentCursorOpacity",1,{duration:this.cursorDuration,onComplete:function(){e._onTickComplete()},onChange:function(){e.canvas&&e.canvas.renderAll()},abort:function(){return e._abortCursorAnimation}})},_onTickComplete:function(){if(this._abortCursorAnimation)return;var e=this;this._cursorTimeout1&&clearTimeout(this._cursorTimeout1),this._cursorTimeout1=setTimeout(function(){e.animate("_currentCursorOpacity",0,{duration:this.cursorDuration/2,onComplete:function(){e._tick()},onChange:function(){e.canvas&&e.canvas.renderAll()},abort:function(){return e._abortCursorAnimation}})},100)},initDelayedCursor:function(e){var t=this,n=e?0:this.cursorDelay;e&&(this._abortCursorAnimation=!0,clearTimeout(this._cursorTimeout1),this._currentCursorOpacity=1,this.canvas&&this.canvas.renderAll()),this._cursorTimeout2&&clearTimeout(this._cursorTimeout2),this._cursorTimeout2=setTimeout(function(){t._abortCursorAnimation=!1,t._tick()},n)},abortCursorAnimation:function(){this._abortCursorAnimation=!0,clearTimeout(this._cursorTimeout1),clearTimeout(this._cursorTimeout2),this._currentCursorOpacity=0,this.canvas&&this.canvas.renderAll();var e=this;setTimeout(function(){e._abortCursorAnimation=!1},10)},selectAll:function(){this.selectionStart=0,this.selectionEnd=this.text.length,this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},getSelectedText:function(){return this.text.slice(this.selectionStart,this.selectionEnd)},findWordBoundaryLeft:function(e){var t=0,n=e-1;if(this._reSpace.test(this.text.charAt(n)))while(this._reSpace.test(this.text.charAt(n)))t++,n--;while(/\S/.test(this.text.charAt(n))&&n>-1)t++,n--;return e-t},findWordBoundaryRight:function(e){var t=0,n=e;if(this
._reSpace.test(this.text.charAt(n)))while(this._reSpace.test(this.text.charAt(n)))t++,n++;while(/\S/.test(this.text.charAt(n))&&n<this.text.length)t++,n++;return e+t},findLineBoundaryLeft:function(e){var t=0,n=e-1;while(!/\n/.test(this.text.charAt(n))&&n>-1)t++,n--;return e-t},findLineBoundaryRight:function(e){var t=0,n=e;while(!/\n/.test(this.text.charAt(n))&&n<this.text.length)t++,n++;return e+t},getNumNewLinesInSelectedText:function(){var e=this.getSelectedText(),t=0;for(var n=0,r=e.split(""),i=r.length;n<i;n++)r[n]==="\n"&&t++;return t},searchWordBoundary:function(e,t){var n=this._reSpace.test(this.text.charAt(e))?e-1:e,r=this.text.charAt(n),i=/[ \n\.,;!\?\-]/;while(!i.test(r)&&n>0&&n<this.text.length)n+=t,r=this.text.charAt(n);return i.test(r)&&r!=="\n"&&(n+=t===1?0:1),n},selectWord:function(e){var t=this.searchWordBoundary(e,-1),n=this.searchWordBoundary(e,1);this.setSelectionStart(t),this.setSelectionEnd(n),this.initDelayedCursor(!0)},selectLine:function(e){var t=this.findLineBoundaryLeft(e),n=this.findLineBoundaryRight(e);this.setSelectionStart(t),this.setSelectionEnd(n),this.initDelayedCursor(!0)},enterEditing:function(){if(this.isEditing||!this.editable)return;return this.exitEditingOnOthers(),this.isEditing=!0,this.initHiddenTextarea(),this._updateTextarea(),this._saveEditingProps(),this._setEditingProps(),this._tick(),this.canvas&&this.canvas.renderAll(),this.fire("editing:entered"),this.canvas&&this.canvas.fire("text:editing:entered",{target:this}),this},exitEditingOnOthers:function(){fabric.IText.instances.forEach(function(e){e.selected=!1,e.isEditing&&e.exitEditing()},this)},_setEditingProps:function(){this.hoverCursor="text",this.canvas&&(this.canvas.defaultCursor=this.canvas.moveCursor="text"),this.borderColor=this.editingBorderColor,this.hasControls=this.selectable=!1,this.lockMovementX=this.lockMovementY=!0},_updateTextarea:function(){if(!this.hiddenTextarea)return;this.hiddenTextarea.value=this.text,this.hiddenTextarea.selectionStart=this.selectionStart},_saveEditingProps:function(){this._savedProps={hasControls:this.hasControls,borderColor:this.borderColor,lockMovementX:this.lockMovementX,lockMovementY:this.lockMovementY,hoverCursor:this.hoverCursor,defaultCursor:this.canvas&&this.canvas.defaultCursor,moveCursor:this.canvas&&this.canvas.moveCursor}},_restoreEditingProps:function(){if(!this._savedProps)return;this.hoverCursor=this._savedProps.overCursor,this.hasControls=this._savedProps.hasControls,this.borderColor=this._savedProps.borderColor,this.lockMovementX=this._savedProps.lockMovementX,this.lockMovementY=this._savedProps.lockMovementY,this.canvas&&(this.canvas.defaultCursor=this._savedProps.defaultCursor,this.canvas.moveCursor=this._savedProps.moveCursor)},exitEditing:function(){return this.selected=!1,this.isEditing=!1,this.selectable=!0,this.selectionEnd=this.selectionStart,this.hiddenTextarea&&this.canvas&&this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea),this.hiddenTextarea=null,this.abortCursorAnimation(),this._restoreEditingProps(),this._currentCursorOpacity=0,this.fire("editing:exited"),this.canvas&&this.canvas.fire("text:editing:exited",{target:this}),this},_removeExtraneousStyles:function(){var e=this.text.split(this._reNewline);for(var t in this.styles)e[t]||delete this.styles[t]},_removeCharsFromTo:function(e,t){var n=t;while(n!==e){var r=this.get2DCursorLocation(n).charIndex;n--;var i=this.get2DCursorLocation(n).charIndex,s=i>r;s?this.removeStyleObject(s,n+1):this.removeStyleObject(this.get2DCursorLocation(n).charIndex===0,n)}this.text=this.text.slice(0,e)+this.text.slice(t)},insertChars:function(e){var t=this.text.slice(this.selectionStart,this.selectionStart+1)==="\n";this.text=this.text.slice(0,this.selectionStart)+e+this.text.slice(this.selectionEnd),this.selectionStart===this.selectionEnd&&this.insertStyleObjects(e,t,this.copiedStyles),this.selectionStart+=e.length,this.selectionEnd=this.selectionStart,this.canvas&&this.canvas.renderAll().renderAll(),this.setCoords(),this.fire("changed"),this.canvas&&this.canvas.fire("text:changed",{target:this})},insertNewlineStyleObject:function(t,n,r){this.shiftLineStyles(t,1),this.styles[t+1]||(this.styles[t+1]={});var i=this.styles[t][n-1],s={};if(r)s[0]=e(i),this.styles[t+1]=s;else{for(var o in this.styles[t])parseInt(o,10)>=n&&(s[parseInt(o,10)-n]=this.styles[t][o],delete this.styles[t][o]);this.styles[t+1]=s}},insertCharStyleObject:function(t,n,r){var i=this.styles[t],s=e(i);n===0&&!r&&(n=1);for(var o in s){var u=parseInt(o,10);u>=n&&(i[u+1]=s[u])}this.styles[t][n]=r||e(i[n-1])},insertStyleObjects:function(e,t,n){if(this.isEmptyStyles())return;var r=this.get2DCursorLocation(),i=r.lineIndex,s=r.charIndex;this.styles[i]||(this.styles[i]={}),e==="\n"?this.insertNewlineStyleObject(i,s,t):n?this._insertStyles(n):this.insertCharStyleObject(i,s)},_insertStyles:function(e){for(var t=0,n=e.length;t<n;t++){var r=this.get2DCursorLocation(this.selectionStart+t),i=r.lineIndex,s=r.charIndex;this.insertCharStyleObject(i,s,e[t])}},shiftLineStyles:function(t,n){var r=e(this.styles);for(var i in this.styles){var s=parseInt(i,10);s>t&&(this.styles[s+n]=r[s])}},removeStyleObject:function(t,n){var r=this.get2DCursorLocation(n),i=r.lineIndex,s=r.charIndex;if(t){var o=this.text.split(this._reNewline),u=o[i-1],a=u?u.length:0;this.styles[i-1]||(this.styles[i-1]={});for(s in this.styles[i])this.styles[i-1][parseInt(s,10)+a]=this.styles[i][s];this.shiftLineStyles(i,-1)}else{var f=this.styles[i];if(f){var l=this.selectionStart===this.selectionEnd?-1:0;delete f[s+l]}var c=e(f);for(var h in c){var p=parseInt(h,10);p>=s&&p!==0&&(f[p-1]=c[p],delete f[p])}}},insertNewline:function(){this.insertChars("\n")}})}(),fabric.util.object.extend(fabric.IText.prototype,{initDoubleClickSimulation:function(){this.__lastClickTime=+(new Date),this.__lastLastClickTime=+(new Date),this.__lastPointer={},this.on("mousedown",this.onMouseDown.bind(this))},onMouseDown:function(e){this.__newClickTime=+(new Date);var t=this.canvas.getPointer(e.e);this.isTripleClick(t)?(this.fire("tripleclick",e),this._stopEvent(e.e)):this.isDoubleClick(t)&&(this.fire("dblclick",e),this._stopEvent(e.e)),this.__lastLastClickTime=this.__lastClickTime,this.__lastClickTime=this.__newClickTime,this.__lastPointer=t,this.__lastIsEditing=this.isEditing,this.__lastSelected=this.selected},isDoubleClick:function(e){return this.__newClickTime-this.__lastClickTime<500&&this.__lastPointer.x===e.x&&this.__lastPointer.y===e.y&&this.__lastIsEditing},isTripleClick:function(e){return this.__newClickTime-this.__lastClickTime<500&&this.__lastClickTime-this.__lastLastClickTime<500&&this.__lastPointer.x===e.x&&this.__lastPointer.y===e.y},_stopEvent:function(e){e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation()},initCursorSelectionHandlers:function(){this.initSelectedHandler(),this.initMousedownHandler(),this.initMousemoveHandler(),this.initMouseupHandler(),this.initClicks()},initClicks:function(){this.on("dblclick",function(e){this.selectWord(this.getSelectionStartFromPointer(e.e))}),this.on("tripleclick",function(e){this.selectLine(this.getSelectionStartFromPointer(e.e))})},initMousedownHandler:function(){this.on("mousedown",function(e){var t=this.canvas.getPointer(e.e);this.__mousedownX=t.x,this.__mousedownY=t.y,this.__isMousedown=!0,this.hiddenTextarea&&this.canvas&&this.canvas.wrapperEl.appendChild(this.hiddenTextarea),this.selected&&this.setCursorByClick(e.e),this.isEditing&&(this.__selectionStartOnMouseDown=this.selectionStart,this.initDelayedCursor(!0))})},initMousemoveHandler:function(){this.on("mousemove",function(e){if(!this.__isMousedown||!this.isEditing)return;var t=this.getSelectionStartFromPointer(e.e);t>=this.__selectionStartOnMouseDown?(this.setSelectionStart(this.__selectionStartOnMouseDown),this.setSelectionEnd(t)):(this.setSelectionStart(t),this.setSelectionEnd(this.__selectionStartOnMouseDown))})},_isObjectMoved:function(e){var t=this.canvas.getPointer(e);return this.__mousedownX!==t.x||this.__mousedownY!==t.y},initMouseupHandler:function(){this.on("mouseup",function(e){this.__isMousedown=!1;if(this._isObjectMoved(e.e))return;this.__lastSelected&&(this.enterEditing(),this.initDelayedCursor(!0)),this.selected=!0})},setCursorByClick:function(e){var t=this.getSelectionStartFromPointer(e);e.shiftKey?t<this.selectionStart?(this.setSelectionEnd(this.selectionStart),this.setSelectionStart(t)):this.setSelectionEnd(t):(this.setSelectionStart(t),this.setSelectionEnd(t))},_getLocalRotatedPointer:function(e){var t=this.canvas.getPointer(e),n=new fabric.Point(t.x,t.y),r=new fabric.Point(this.left,this.top),i=fabric.util.rotatePoint(n,r,fabric.util.degreesToRadians(-this.angle));return this.getLocalPointer(e,i)},getSelectionStartFromPointer:function(e){var t=this._getLocalRotatedPointer(e),n=this.text.split(this._reNewline),r=0,i=0,s=0,o=0,u;for(var a=0,f=n.length;a<f;a++){s+=this._getHeightOfLine(this.ctx,a)*this.scaleY;var l=this._getWidthOfLine(this.ctx,a,n),c=this._getLineLeftOffset(l);i=c*this.scaleX,this.flipX&&(n[a]=n[a].split("").reverse().join(""));for(var h=0,p=n[a].length;h<p;h++){var d=n[a][h];r=i,i+=this._getWidthOfChar(this.ctx,d,a,this.flipX?p-h:h)*this.scaleX;if(s<=t.y||i<=t.x){o++;continue}return this._getNewSelectionStartFromOffset(t,r,i,o+a,p)}if(t.y<s)return this._getNewSelectionStartFromOffset(t,r,i,o+a,p)}if(typeof u=="undefined")return this.text.length},_getNewSelectionStartFromOffset:function(e,t,n,r,i){var s=e.x-t,o=n-e.x,u=o>s?0:1,a=r+u;return this.flipX&&(a=i-a),a>this.text.length&&(a=this.text.length),a}}),fabric.util.object.extend(fabric.IText.prototype,{initHiddenTextarea:function(){this.hiddenTextarea=fabric.document.createElement("textarea"),this.hiddenTextarea.setAttribute("autocapitalize","off"),this.hiddenTextarea.style.cssText="position: absolute; top: 0; left: -9999px",fabric.document.body.appendChild(this.hiddenTextarea),fabric.util.addListener(this.hiddenTextarea,"keydown",this.onKeyDown.bind(this)),fabric.util.addListener(this.hiddenTextarea,"keypress",this.onKeyPress.bind(this)),fabric.util.addListener(this.hiddenTextarea,"copy",this.copy.bind(this)),fabric.util.addListener(this.hiddenTextarea,"paste",this.paste.bind(this)),!this._clickHandlerInitialized&&this.canvas&&(fabric.util.addListener(this.canvas.upperCanvasEl,"click",this.onClick.bind(this)),this._clickHandlerInitialized=!0)},_keysMap:{8:"removeChars",13:"insertNewline",37:"moveCursorLeft",38:"moveCursorUp",39:"moveCursorRight",40:"moveCursorDown",46:"forwardDelete"},_ctrlKeysMap:{65:"selectAll",88:"cut"},onClick:function(){this.hiddenTextarea&&this.hiddenTextarea.focus()},onKeyDown:function(e){if(!this.isEditing)return;if(e.keyCode in this._keysMap)this[this._keysMap[e.keyCode]](e);else{if(!(e.keyCode in this._ctrlKeysMap&&(e.ctrlKey||e.metaKey)))return;this[this._ctrlKeysMap[e.keyCode]](e)}e.stopPropagation(),this.canvas&&this.canvas.renderAll()},forwardDelete:function(e){this.selectionStart===this.selectionEnd&&this.moveCursorRight(e),this.removeChars(e)},copy:function(e){var t=this.getSelectedText(),n=this._getClipboardData(e);n&&n.setData("text",t),this.copiedText=t,this.copiedStyles=this.getSelectionStyles(this.selectionStart,this.selectionEnd)},paste:function(e){var t=null,n=this._getClipboardData(e);n?t=n.getData("text"):t=this.copiedText,t&&this.insertChars(t)},cut:function(e){if(this.selectionStart===this.selectionEnd)return;this.copy(),this.removeChars(e)},_getClipboardData:function(e){return e&&(e.clipboardData||fabric.window.clipboardData)},onKeyPress:function(e){if(!this.isEditing||e.metaKey||e.ctrlKey||e.keyCode in this._keysMap)return;this.insertChars(String.fromCharCode(e.which)),e.stopPropagation()},getDownCursorOffset:function(e,t){var n=t?this.selectionEnd:this.selectionStart,r=this.text.split(this._reNewline),i,s,o=this.text.slice(0,n),u=this.text.slice(n),a=o.slice(o.lastIndexOf("\n")+1),f=u.match(/(.*)\n?/)[1],l=(u.match(/.*\n(.*)\n?/)||{})[1]||"",c=this.get2DCursorLocation(n);if(c.lineIndex===r.length-1||e.metaKey)return this.text.length-n;var h=this._getWidthOfLine(this.ctx,c.lineIndex,r);s=this._getLineLeftOffset(h);var p=s,d=c.lineIndex;for(var v=0,m=a.length;v<m;v++)i=a[v],p+=this._getWidthOfChar(this.ctx,i,d,v);var g=this._getIndexOnNextLine(c,l,p,r);return f.length+1+g},_getIndexOnNextLine:function(e,t,n,r){var i=e.lineIndex+1,s=this._getWidthOfLine(this.ctx,i,r),o=this._getLineLeftOffset(s),u=o,a=0,f;for(var l=0,c=t.length;l<c;l++){var h=t[l],p=this._getWidthOfChar(this.ctx,h,i,l);u+=p;if(u>n){f=!0;var d=u-p,v=u,m=Math.abs(d-n),g=Math.abs(v-n);a=g<m?l+1:l;break}}return f||(a=t.length),a},moveCursorDown:function(e){this.abortCursorAnimation(),this._currentCursorOpacity=1;var t=this.getDownCursorOffset(e,this._selectionDirection==="right");e.shiftKey?this.moveCursorDownWithShift(t):this.moveCursorDownWithoutShift(t),this.initDelayedCursor()},moveCursorDownWithoutShift:function(e){this._selectionDirection="right",this.selectionStart+=e,this.selectionStart>this.text.length&&(this.selectionStart=this.text.length),this.selectionEnd=this.selectionStart},moveCursorDownWithShift:function(e){if(this._selectionDirection==="left"&&this.selectionStart!==this.selectionEnd){this.selectionStart+=e,this._selectionDirection="left";return}this._selectionDirection="right",this.selectionEnd+=e,this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length)},getUpCursorOffset:function(e,t){var n=t?this.selectionEnd:this.selectionStart,r=this.get2DCursorLocation(n);if(r.lineIndex===0||e.metaKey)return n;var i=this.text.slice(0,n),s=i.slice(i.lastIndexOf("\n")+1),o=(i.match(/\n?(.*)\n.*$/)||{})[1]||"",u=this.text.split(this._reNewline),a,f=this._getWidthOfLine(this.ctx,r.lineIndex,u),l=this._getLineLeftOffset(f),c=l,h=r.lineIndex;for(var p=0,d=s.length;p<d;p++)a=s[p],c+=this._getWidthOfChar(this.ctx,a,h,p);var v=this._getIndexOnPrevLine(r,o,c,u);return o.length-v+s.length},_getIndexOnPrevLine:function(e,t,n,r){var i=e.lineIndex-1,s=this._getWidthOfLine(this.ctx,i,r),o=this._getLineLeftOffset(s),u=o,a=0,f;for(var l=0,c=t.length;l<c;l++){var h=t[l],p=this._getWidthOfChar(this.ctx,h,i,l);u+=p;if(u>n){f=!0;var d=u-p,v=u,m=Math.abs(d-n),g=Math.abs(v-n);a=g<m?l:l-1;break}}return f||(a=t.length-1),a},moveCursorUp:function(e){this.abortCursorAnimation(),this._currentCursorOpacity=1;var t=this.getUpCursorOffset(e,this._selectionDirection==="right");e.shiftKey?this.moveCursorUpWithShift(t):this.moveCursorUpWithoutShift(t),this.initDelayedCursor()},moveCursorUpWithShift:function(e){if(this.selectionStart===this.selectionEnd)this.selectionStart-=e;else{if(this._selectionDirection==="right"){this.selectionEnd-=e,this._selectionDirection="right";return}this.selectionStart-=e}this.selectionStart<0&&(this.selectionStart=0),this._selectionDirection="left"},moveCursorUpWithoutShift:function(e){this.selectionStart===this.selectionEnd&&(this.selectionStart-=e),this.selectionStart<0&&(this.selectionStart=0),this.selectionEnd=this.selectionStart,this._selectionDirection="left"},moveCursorLeft:function(e){if(this.selectionStart===0&&this.selectionEnd===0)return;this.abortCursorAnimation(),this._currentCursorOpacity=1,e.shiftKey?this.moveCursorLeftWithShift(e):this.moveCursorLeftWithoutShift(e),this.initDelayedCursor()},_move:function(e,t,n){e.altKey?this[t]=this["findWordBoundary"+n](this[t]):e.metaKey?this[t]=this["findLineBoundary"+n](this[t]):this[t]+=n==="Left"?-1:1},_moveLeft:function(e,t){this._move(e,t,"Left")},_moveRight:function(e,t){this._move(e,t,"Right")},moveCursorLeftWithoutShift:function(e){this._selectionDirection="left",this.selectionEnd===this.selectionStart&&this._moveLeft(e,"selectionStart"),this.selectionEnd=this.selectionStart},moveCursorLeftWithShift:function(e){this._selectionDirection==="right"&&this.selectionStart!==this.selectionEnd?this._moveLeft(e,"selectionEnd"):(this._selectionDirection="left",this._moveLeft(e,"selectionStart"),this.text.charAt(this.selectionStart)==="\n"&&this.selectionStart--,this.selectionStart<0&&(this.selectionStart=0))},moveCursorRight:function(e){if(this.selectionStart>=this.text.length&&this.selectionEnd>=this.text.length)return;this.abortCursorAnimation(),this._currentCursorOpacity=1,e.shiftKey?this.moveCursorRightWithShift(e):this.moveCursorRightWithoutShift(e),this.initDelayedCursor()},moveCursorRightWithShift:function(e){this._selectionDirection==="left"&&this.selectionStart!==this.selectionEnd?this._moveRight(e,"selectionStart"):(this._selectionDirection="right",this._moveRight(e,"selectionEnd"),this.text.charAt(this.selectionEnd-1)==="\n"&&this.selectionEnd++,this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length))},moveCursorRightWithoutShift:function(e){this._selectionDirection="right",this.selectionStart===this.selectionEnd?(this._moveRight(e,"selectionStart"),this.selectionEnd=this.selectionStart):(this.selectionEnd+=this.getNumNewLinesInSelectedText(),this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length),this.selectionStart=this.selectionEnd)},removeChars:function(e){this.selectionStart===this.selectionEnd?this._removeCharsNearCursor(e):this._removeCharsFromTo(this.selectionStart,this.selectionEnd),this.selectionEnd=this.selectionStart,this._removeExtraneousStyles(),this.canvas&&this.canvas.renderAll().renderAll(),this.setCoords(),this.fire("changed"),this.canvas&&this.canvas.fire("text:changed",{target:this})},_removeCharsNearCursor:function(e){if(this.selectionStart!==0)if(e.metaKey){var t=this.findLineBoundaryLeft(this.selectionStart);this._removeCharsFromTo(t,this.selectionStart),this.selectionStart=t}else if(e.altKey){var n=this.findWordBoundaryLeft(this.selectionStart);this._removeCharsFromTo(n,this.selectionStart),this.selectionStart=n}else{var r=this.text.slice(this.selectionStart-1,this.selectionStart)==="\n";this.removeStyleObject(r),this.selectionStart--,this.text=this.text.slice(0,this.selectionStart)+this.text.slice(this.selectionStart+1)}}}),fabric.util.object.extend(fabric.IText.prototype,{_setSVGTextLineText:function(e,t,n,r,i,s){this.styles[t]?this._setSVGTextLineChars(e,t,n,r,i,s):this.callSuper("_setSVGTextLineText",e,t,n,r,i)},_setSVGTextLineChars:function(e,t,n,r,i,s){var o=t===0||this.useNative?"y":"dy",u=e.split(""),a=0,f=this._getSVGLineLeftOffset(t),l=this._getSVGLineTopOffset(t),c=this._getHeightOfLine(this.ctx,t);for(var h=0,p=u.length;h<p;h++){var d=this.styles[t][h]||{};n.push(this._createTextCharSpan(u[h],d,f,l,o,a));var v=this._getWidthOfChar(this.ctx,u[h],t,h);d.textBackgroundColor&&s.push(this._createTextCharBg(d,f,l,c,v,a)),a+=v}},_getSVGLineLeftOffset:function(e){return this._boundaries&&this._boundaries[e]?fabric.util.toFixed(this._boundaries[e].left,2):0},_getSVGLineTopOffset:function(e){var t=0;for(var n=0;n<=e;n++)t+=this._getHeightOfLine(this.ctx,n);return t-this.height/2},_createTextCharBg:function(e,t,n,r,i,s){return['<rect fill="',e.textBackgroundColor,'" transform="translate(',-this.width/2," ",-this.height+r,")",'" x="',t+s,'" y="',n+r,'" width="',i,'" height="',r,'"></rect>'].join("")},_createTextCharSpan:function(e,t,n,r,i,s){var o=this.getSvgStyles.call(fabric.util.object.extend({visible:!0,fill:this.fill,stroke:this.stroke,type:"text"},t));return['<tspan x="',n+s,'" ',i,'="',r,'" ',t.fontFamily?'font-family="'+t.fontFamily.replace(/"/g,"'")+'" ':"",t.fontSize?'font-size="'+t.fontSize+'" ':"",t.fontStyle?'font-style="'+t.fontStyle+'" ':"",t.fontWeight?'font-weight="'+t.fontWeight+'" ':"",t.textDecoration?'text-decoration="'+t.textDecoration+'" ':"",'style="',o,'">',fabric.util.string.escapeXml(e),"</tspan>"].join("")}}),function(){function request(e,t,n){var r=URL.parse(e);r.port||(r.port=r.protocol.indexOf("https:")===0?443:80);var i=r.port===443?HTTPS:HTTP,s=i.request({hostname:r.hostname,port:r.port,path:r.path,method:"GET"},function(e){var r="";t&&e.setEncoding(t),e.on("end",function(){n(r)}),e.on("data",function(t){e.statusCode===200&&(r+=t)})});s.on("error",function(e){e.errno===process.ECONNREFUSED?fabric.log("ECONNREFUSED: connection refused to "+r.hostname+":"+r.port):fabric.log(e.message)}),s.end()}function requestFs(e,t){var n=require("fs");n.readFile(e,function(e,n){if(e)throw fabric.log(e),e;t(n)})}if(typeof document!="undefined"&&typeof window!="undefined")return;var DOMParser=require("xmldom").DOMParser,URL=require("url"),HTTP=require("http"),HTTPS=require("https"),Canvas=require("canvas"),Image=require("canvas").Image;fabric.util.loadImage=function(e,t,n){function r(r){i.src=new Buffer(r,"binary"),i._src=e,t&&t.call(n,i)}var i=new Image;e&&(e instanceof Buffer||e.indexOf("data")===0)?(i.src=i._src=e,t&&t.call(n,i)):e&&e.indexOf("http")!==0?requestFs(e,r):e?request(e,"binary",r):t&&t.call(n,e)},fabric.loadSVGFromURL=function(e,t,n){e=e.replace(/^\n\s*/,"").replace(/\?.*$/,"").trim(),e.indexOf("http")!==0?requestFs(e,function(e){fabric.loadSVGFromString(e.toString(),t,n)}):request(e,"",function(e){fabric.loadSVGFromString(e,t,n)})},fabric.loadSVGFromString=function(e,t,n){var r=(new DOMParser).parseFromString(e);fabric.parseSVGDocument(r.documentElement,function(e,n){t&&t(e,n)},n)},fabric.util.getScript=function(url,callback){request(url,"",function(body){eval(body),callback&&callback()})},fabric.Image.fromObject=function(e,t){fabric.util.loadImage(e.src,function(n){var r=new fabric.Image(n);r._initConfig(e),r._initFilters(e,function(e){r.filters=e||[],t&&t(r)})})},fabric.createCanvasForNode=function(e,t,n,r){r=r||n;var i=fabric.document.createElement("canvas"),s=new Canvas(e||600,t||600,r);i.style={},i.width=s.width,i.height=s.height;var o=fabric.Canvas||fabric.StaticCanvas,u=new o(i,n);return u.contextContainer=s.getContext("2d"),u.nodeCanvas=s,u.Font=Canvas.Font,u},fabric.StaticCanvas.prototype.createPNGStream=function(){return this.nodeCanvas.createPNGStream()},fabric.StaticCanvas.prototype.createJPEGStream=function(e){return this.nodeCanvas.createJPEGStream(e)};var origSetWidth=fabric.StaticCanvas.prototype.setWidth;fabric.StaticCanvas.prototype.setWidth=function(e,t){return origSetWidth.call(this,e,t),this.nodeCanvas.width=e,this},fabric.Canvas&&(fabric.Canvas.prototype.setWidth=fabric.StaticCanvas.prototype.setWidth);var origSetHeight=fabric.StaticCanvas.prototype.setHeight;fabric.StaticCanvas.prototype.setHeight=function(e,t){return origSetHeight.call(this,e,t),this.nodeCanvas.height=e,this},fabric.Canvas&&(fabric.Canvas.prototype.setHeight=fabric.StaticCanvas.prototype.setHeight)}();
;!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=r&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=r&f+1],c=c*d+h[r&(h[f]=h[g=r&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[r&e]=r&(c^=19*b[r&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),n(c)}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o=c.pow(d,e),p=c.pow(2,f),q=2*p,r=d-1,s=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var r=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=o,c=0;p>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=q;)a/=2,b/=2,c>>>=1;return(a+c)/b},r,"global"in f?f.global:this==c)};l(c[i](),b),g&&g.exports?g.exports=s:h&&h.amd&&h(function(){return s})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");
;(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"]'))
        .filter(function(link){
          return (link != null && link.href != null);
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname;

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();

;/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function() {
// handlebars/safe-string.js
var __module3__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module2__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module3__);

// handlebars/exception.js
var __module4__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module1__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) { 
                data.key = key; 
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module2__, __module4__);

// handlebars/runtime.js
var __module5__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module2__, __module4__, __module1__);

// handlebars.runtime.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module3__, __module4__, __module2__, __module5__);

  return __module0__;
})();

;
//# sourceMappingURL=vendor.js.map