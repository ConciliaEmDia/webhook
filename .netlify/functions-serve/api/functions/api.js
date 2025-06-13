var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports2, module2) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/vary/index.js
var require_vary = __commonJS({
  "node_modules/vary/index.js"(exports2, module2) {
    "use strict";
    module2.exports = vary;
    module2.exports.append = append;
    var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    function append(header, field) {
      if (typeof header !== "string") {
        throw new TypeError("header argument is required");
      }
      if (!field) {
        throw new TypeError("field argument is required");
      }
      var fields = !Array.isArray(field) ? parse(String(field)) : field;
      for (var j = 0; j < fields.length; j++) {
        if (!FIELD_NAME_REGEXP.test(fields[j])) {
          throw new TypeError("field argument contains an invalid header name");
        }
      }
      if (header === "*") {
        return header;
      }
      var val = header;
      var vals = parse(header.toLowerCase());
      if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
        return "*";
      }
      for (var i = 0; i < fields.length; i++) {
        var fld = fields[i].toLowerCase();
        if (vals.indexOf(fld) === -1) {
          vals.push(fld);
          val = val ? val + ", " + fields[i] : fields[i];
        }
      }
      return val;
    }
    function parse(header) {
      var end = 0;
      var list = [];
      var start = 0;
      for (var i = 0, len = header.length; i < len; i++) {
        switch (header.charCodeAt(i)) {
          case 32:
            if (start === end) {
              start = end = i + 1;
            }
            break;
          case 44:
            list.push(header.substring(start, end));
            start = end = i + 1;
            break;
          default:
            end = i + 1;
            break;
        }
      }
      list.push(header.substring(start, end));
      return list;
    }
    function vary(res, field) {
      if (!res || !res.getHeader || !res.setHeader) {
        throw new TypeError("res argument is required");
      }
      var val = res.getHeader("Vary") || "";
      var header = Array.isArray(val) ? val.join(", ") : String(val);
      if (val = append(header, field)) {
        res.setHeader("Vary", val);
      }
    }
  }
});

// node_modules/cors/lib/index.js
var require_lib = __commonJS({
  "node_modules/cors/lib/index.js"(exports2, module2) {
    (function() {
      "use strict";
      var assign = require_object_assign();
      var vary = require_vary();
      var defaults = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
      };
      function isString(s) {
        return typeof s === "string" || s instanceof String;
      }
      function isOriginAllowed(origin, allowedOrigin) {
        if (Array.isArray(allowedOrigin)) {
          for (var i = 0; i < allowedOrigin.length; ++i) {
            if (isOriginAllowed(origin, allowedOrigin[i])) {
              return true;
            }
          }
          return false;
        } else if (isString(allowedOrigin)) {
          return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        } else {
          return !!allowedOrigin;
        }
      }
      function configureOrigin(options, req) {
        var requestOrigin = req.headers.origin, headers = [], isAllowed;
        if (!options.origin || options.origin === "*") {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: "*"
          }]);
        } else if (isString(options.origin)) {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: options.origin
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        } else {
          isAllowed = isOriginAllowed(requestOrigin, options.origin);
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: isAllowed ? requestOrigin : false
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        }
        return headers;
      }
      function configureMethods(options) {
        var methods = options.methods;
        if (methods.join) {
          methods = options.methods.join(",");
        }
        return {
          key: "Access-Control-Allow-Methods",
          value: methods
        };
      }
      function configureCredentials(options) {
        if (options.credentials === true) {
          return {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          };
        }
        return null;
      }
      function configureAllowedHeaders(options, req) {
        var allowedHeaders = options.allowedHeaders || options.headers;
        var headers = [];
        if (!allowedHeaders) {
          allowedHeaders = req.headers["access-control-request-headers"];
          headers.push([{
            key: "Vary",
            value: "Access-Control-Request-Headers"
          }]);
        } else if (allowedHeaders.join) {
          allowedHeaders = allowedHeaders.join(",");
        }
        if (allowedHeaders && allowedHeaders.length) {
          headers.push([{
            key: "Access-Control-Allow-Headers",
            value: allowedHeaders
          }]);
        }
        return headers;
      }
      function configureExposedHeaders(options) {
        var headers = options.exposedHeaders;
        if (!headers) {
          return null;
        } else if (headers.join) {
          headers = headers.join(",");
        }
        if (headers && headers.length) {
          return {
            key: "Access-Control-Expose-Headers",
            value: headers
          };
        }
        return null;
      }
      function configureMaxAge(options) {
        var maxAge = (typeof options.maxAge === "number" || options.maxAge) && options.maxAge.toString();
        if (maxAge && maxAge.length) {
          return {
            key: "Access-Control-Max-Age",
            value: maxAge
          };
        }
        return null;
      }
      function applyHeaders(headers, res) {
        for (var i = 0, n = headers.length; i < n; i++) {
          var header = headers[i];
          if (header) {
            if (Array.isArray(header)) {
              applyHeaders(header, res);
            } else if (header.key === "Vary" && header.value) {
              vary(res, header.value);
            } else if (header.value) {
              res.setHeader(header.key, header.value);
            }
          }
        }
      }
      function cors2(options, req, res, next) {
        var headers = [], method = req.method && req.method.toUpperCase && req.method.toUpperCase();
        if (method === "OPTIONS") {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options, req));
          headers.push(configureMethods(options, req));
          headers.push(configureAllowedHeaders(options, req));
          headers.push(configureMaxAge(options, req));
          headers.push(configureExposedHeaders(options, req));
          applyHeaders(headers, res);
          if (options.preflightContinue) {
            next();
          } else {
            res.statusCode = options.optionsSuccessStatus;
            res.setHeader("Content-Length", "0");
            res.end();
          }
        } else {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options, req));
          headers.push(configureExposedHeaders(options, req));
          applyHeaders(headers, res);
          next();
        }
      }
      function middlewareWrapper(o) {
        var optionsCallback = null;
        if (typeof o === "function") {
          optionsCallback = o;
        } else {
          optionsCallback = function(req, cb) {
            cb(null, o);
          };
        }
        return function corsMiddleware(req, res, next) {
          optionsCallback(req, function(err, options) {
            if (err) {
              next(err);
            } else {
              var corsOptions = assign({}, defaults, options);
              var originCallback = null;
              if (corsOptions.origin && typeof corsOptions.origin === "function") {
                originCallback = corsOptions.origin;
              } else if (corsOptions.origin) {
                originCallback = function(origin, cb) {
                  cb(null, corsOptions.origin);
                };
              }
              if (originCallback) {
                originCallback(req.headers.origin, function(err2, origin) {
                  if (err2 || !origin) {
                    next(err2);
                  } else {
                    corsOptions.origin = origin;
                    cors2(corsOptions, req, res, next);
                  }
                });
              } else {
                next();
              }
            }
          });
        };
      }
      module2.exports = middlewareWrapper;
    })();
  }
});

// node_modules/basic-auth/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/basic-auth/node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/basic-auth/index.js
var require_basic_auth = __commonJS({
  "node_modules/basic-auth/index.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    module2.exports = auth;
    module2.exports.parse = parse;
    var CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
    var USER_PASS_REGEXP = /^([^:]*):(.*)$/;
    function auth(req) {
      if (!req) {
        throw new TypeError("argument req is required");
      }
      if (typeof req !== "object") {
        throw new TypeError("argument req is required to be an object");
      }
      var header = getAuthorization(req);
      return parse(header);
    }
    function decodeBase64(str) {
      return Buffer2.from(str, "base64").toString();
    }
    function getAuthorization(req) {
      if (!req.headers || typeof req.headers !== "object") {
        throw new TypeError("argument req is required to have headers property");
      }
      return req.headers.authorization;
    }
    function parse(string) {
      if (typeof string !== "string") {
        return void 0;
      }
      var match = CREDENTIALS_REGEXP.exec(string);
      if (!match) {
        return void 0;
      }
      var userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]));
      if (!userPass) {
        return void 0;
      }
      return new Credentials(userPass[1], userPass[2]);
    }
    function Credentials(name, pass) {
      this.name = name;
      this.pass = pass;
    }
  }
});

// node_modules/morgan/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/morgan/node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
  }
});

// node_modules/morgan/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/morgan/node_modules/debug/src/debug.js"(exports2, module2) {
    exports2 = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports2.coerce = coerce;
    exports2.disable = disable;
    exports2.enable = enable;
    exports2.enabled = enabled;
    exports2.humanize = require_ms();
    exports2.names = [];
    exports2.skips = [];
    exports2.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports2.colors[Math.abs(hash) % exports2.colors.length];
    }
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled) return;
        var self = debug;
        var curr = +/* @__PURE__ */ new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports2.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports2.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports2.formatArgs.call(self, args);
        var logFn = debug.log || exports2.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports2.enabled(namespace);
      debug.useColors = exports2.useColors();
      debug.color = selectColor(namespace);
      if ("function" === typeof exports2.init) {
        exports2.init(debug);
      }
      return debug;
    }
    function enable(namespaces) {
      exports2.save(namespaces);
      exports2.names = [];
      exports2.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports2.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports2.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports2.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports2.skips.length; i < len; i++) {
        if (exports2.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports2.names.length; i < len; i++) {
        if (exports2.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  }
});

// node_modules/morgan/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/morgan/node_modules/debug/src/browser.js"(exports2, module2) {
    exports2 = module2.exports = require_debug();
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports2.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports2.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports2.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports2.storage.removeItem("debug");
        } else {
          exports2.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports2.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports2.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  }
});

// node_modules/morgan/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/morgan/node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2 = module2.exports = require_debug();
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.colors = [6, 2, 3, 4, 5, 1];
    exports2.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(fd);
    }
    exports2.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports2.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports2.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs2 = require("fs");
          stream2 = new fs2.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports2.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    exports2.enable(load());
  }
});

// node_modules/morgan/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/morgan/node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/depd/index.js
var require_depd = __commonJS({
  "node_modules/depd/index.js"(exports2, module2) {
    var relative = require("path").relative;
    module2.exports = depd;
    var basePath = process.cwd();
    function containsNamespace(str, namespace) {
      var vals = str.split(/[ ,]+/);
      var ns = String(namespace).toLowerCase();
      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];
        if (val && (val === "*" || val.toLowerCase() === ns)) {
          return true;
        }
      }
      return false;
    }
    function convertDataDescriptorToAccessor(obj, prop, message) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      var value = descriptor.value;
      descriptor.get = function getter() {
        return value;
      };
      if (descriptor.writable) {
        descriptor.set = function setter(val) {
          return value = val;
        };
      }
      delete descriptor.value;
      delete descriptor.writable;
      Object.defineProperty(obj, prop, descriptor);
      return descriptor;
    }
    function createArgumentsString(arity) {
      var str = "";
      for (var i = 0; i < arity; i++) {
        str += ", arg" + i;
      }
      return str.substr(2);
    }
    function createStackString(stack) {
      var str = this.name + ": " + this.namespace;
      if (this.message) {
        str += " deprecated " + this.message;
      }
      for (var i = 0; i < stack.length; i++) {
        str += "\n    at " + stack[i].toString();
      }
      return str;
    }
    function depd(namespace) {
      if (!namespace) {
        throw new TypeError("argument namespace is required");
      }
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      var file = site[0];
      function deprecate(message) {
        log.call(deprecate, message);
      }
      deprecate._file = file;
      deprecate._ignored = isignored(namespace);
      deprecate._namespace = namespace;
      deprecate._traced = istraced(namespace);
      deprecate._warned = /* @__PURE__ */ Object.create(null);
      deprecate.function = wrapfunction;
      deprecate.property = wrapproperty;
      return deprecate;
    }
    function eehaslisteners(emitter, type) {
      var count = typeof emitter.listenerCount !== "function" ? emitter.listeners(type).length : emitter.listenerCount(type);
      return count > 0;
    }
    function isignored(namespace) {
      if (process.noDeprecation) {
        return true;
      }
      var str = process.env.NO_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function istraced(namespace) {
      if (process.traceDeprecation) {
        return true;
      }
      var str = process.env.TRACE_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function log(message, site) {
      var haslisteners = eehaslisteners(process, "deprecation");
      if (!haslisteners && this._ignored) {
        return;
      }
      var caller;
      var callFile;
      var callSite;
      var depSite;
      var i = 0;
      var seen = false;
      var stack = getStack();
      var file = this._file;
      if (site) {
        depSite = site;
        callSite = callSiteLocation(stack[1]);
        callSite.name = depSite.name;
        file = callSite[0];
      } else {
        i = 2;
        depSite = callSiteLocation(stack[i]);
        callSite = depSite;
      }
      for (; i < stack.length; i++) {
        caller = callSiteLocation(stack[i]);
        callFile = caller[0];
        if (callFile === file) {
          seen = true;
        } else if (callFile === this._file) {
          file = this._file;
        } else if (seen) {
          break;
        }
      }
      var key = caller ? depSite.join(":") + "__" + caller.join(":") : void 0;
      if (key !== void 0 && key in this._warned) {
        return;
      }
      this._warned[key] = true;
      var msg = message;
      if (!msg) {
        msg = callSite === depSite || !callSite.name ? defaultMessage(depSite) : defaultMessage(callSite);
      }
      if (haslisteners) {
        var err = DeprecationError(this._namespace, msg, stack.slice(i));
        process.emit("deprecation", err);
        return;
      }
      var format = process.stderr.isTTY ? formatColor : formatPlain;
      var output = format.call(this, msg, caller, stack.slice(i));
      process.stderr.write(output + "\n", "utf8");
    }
    function callSiteLocation(callSite) {
      var file = callSite.getFileName() || "<anonymous>";
      var line = callSite.getLineNumber();
      var colm = callSite.getColumnNumber();
      if (callSite.isEval()) {
        file = callSite.getEvalOrigin() + ", " + file;
      }
      var site = [file, line, colm];
      site.callSite = callSite;
      site.name = callSite.getFunctionName();
      return site;
    }
    function defaultMessage(site) {
      var callSite = site.callSite;
      var funcName = site.name;
      if (!funcName) {
        funcName = "<anonymous@" + formatLocation(site) + ">";
      }
      var context = callSite.getThis();
      var typeName = context && callSite.getTypeName();
      if (typeName === "Object") {
        typeName = void 0;
      }
      if (typeName === "Function") {
        typeName = context.name || typeName;
      }
      return typeName && callSite.getMethodName() ? typeName + "." + funcName : funcName;
    }
    function formatPlain(msg, caller, stack) {
      var timestamp = (/* @__PURE__ */ new Date()).toUTCString();
      var formatted = timestamp + " " + this._namespace + " deprecated " + msg;
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    at " + stack[i].toString();
        }
        return formatted;
      }
      if (caller) {
        formatted += " at " + formatLocation(caller);
      }
      return formatted;
    }
    function formatColor(msg, caller, stack) {
      var formatted = "\x1B[36;1m" + this._namespace + "\x1B[22;39m \x1B[33;1mdeprecated\x1B[22;39m \x1B[0m" + msg + "\x1B[39m";
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    \x1B[36mat " + stack[i].toString() + "\x1B[39m";
        }
        return formatted;
      }
      if (caller) {
        formatted += " \x1B[36m" + formatLocation(caller) + "\x1B[39m";
      }
      return formatted;
    }
    function formatLocation(callSite) {
      return relative(basePath, callSite[0]) + ":" + callSite[1] + ":" + callSite[2];
    }
    function getStack() {
      var limit = Error.stackTraceLimit;
      var obj = {};
      var prep = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareObjectStackTrace;
      Error.stackTraceLimit = Math.max(10, limit);
      Error.captureStackTrace(obj);
      var stack = obj.stack.slice(1);
      Error.prepareStackTrace = prep;
      Error.stackTraceLimit = limit;
      return stack;
    }
    function prepareObjectStackTrace(obj, stack) {
      return stack;
    }
    function wrapfunction(fn, message) {
      if (typeof fn !== "function") {
        throw new TypeError("argument fn must be a function");
      }
      var args = createArgumentsString(fn.length);
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = fn.name;
      var deprecatedfn = new Function(
        "fn",
        "log",
        "deprecate",
        "message",
        "site",
        '"use strict"\nreturn function (' + args + ") {log.call(deprecate, message, site)\nreturn fn.apply(this, arguments)\n}"
      )(fn, log, this, message, site);
      return deprecatedfn;
    }
    function wrapproperty(obj, prop, message) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new TypeError("argument obj must be object");
      }
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (!descriptor) {
        throw new TypeError("must call property on owner object");
      }
      if (!descriptor.configurable) {
        throw new TypeError("property must be configurable");
      }
      var deprecate = this;
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = prop;
      if ("value" in descriptor) {
        descriptor = convertDataDescriptorToAccessor(obj, prop, message);
      }
      var get = descriptor.get;
      var set = descriptor.set;
      if (typeof get === "function") {
        descriptor.get = function getter() {
          log.call(deprecate, message, site);
          return get.apply(this, arguments);
        };
      }
      if (typeof set === "function") {
        descriptor.set = function setter() {
          log.call(deprecate, message, site);
          return set.apply(this, arguments);
        };
      }
      Object.defineProperty(obj, prop, descriptor);
    }
    function DeprecationError(namespace, message, stack) {
      var error = new Error();
      var stackString;
      Object.defineProperty(error, "constructor", {
        value: DeprecationError
      });
      Object.defineProperty(error, "message", {
        configurable: true,
        enumerable: false,
        value: message,
        writable: true
      });
      Object.defineProperty(error, "name", {
        enumerable: false,
        configurable: true,
        value: "DeprecationError",
        writable: true
      });
      Object.defineProperty(error, "namespace", {
        configurable: true,
        enumerable: false,
        value: namespace,
        writable: true
      });
      Object.defineProperty(error, "stack", {
        configurable: true,
        enumerable: false,
        get: function() {
          if (stackString !== void 0) {
            return stackString;
          }
          return stackString = createStackString.call(this, stack);
        },
        set: function setter(val) {
          stackString = val;
        }
      });
      return error;
    }
  }
});

// node_modules/ee-first/index.js
var require_ee_first = __commonJS({
  "node_modules/ee-first/index.js"(exports2, module2) {
    "use strict";
    module2.exports = first;
    function first(stuff, done) {
      if (!Array.isArray(stuff))
        throw new TypeError("arg must be an array of [ee, events...] arrays");
      var cleanups = [];
      for (var i = 0; i < stuff.length; i++) {
        var arr = stuff[i];
        if (!Array.isArray(arr) || arr.length < 2)
          throw new TypeError("each array member must be [ee, events...]");
        var ee = arr[0];
        for (var j = 1; j < arr.length; j++) {
          var event = arr[j];
          var fn = listener(event, callback);
          ee.on(event, fn);
          cleanups.push({
            ee,
            event,
            fn
          });
        }
      }
      function callback() {
        cleanup();
        done.apply(null, arguments);
      }
      function cleanup() {
        var x;
        for (var i2 = 0; i2 < cleanups.length; i2++) {
          x = cleanups[i2];
          x.ee.removeListener(x.event, x.fn);
        }
      }
      function thunk(fn2) {
        done = fn2;
      }
      thunk.cancel = cleanup;
      return thunk;
    }
    function listener(event, done) {
      return function onevent(arg1) {
        var args = new Array(arguments.length);
        var ee = this;
        var err = event === "error" ? arg1 : null;
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        done(err, ee, event, args);
      };
    }
  }
});

// node_modules/morgan/node_modules/on-finished/index.js
var require_on_finished = __commonJS({
  "node_modules/morgan/node_modules/on-finished/index.js"(exports2, module2) {
    "use strict";
    module2.exports = onFinished;
    module2.exports.isFinished = isFinished;
    var first = require_ee_first();
    var defer = typeof setImmediate === "function" ? setImmediate : function(fn) {
      process.nextTick(fn.bind.apply(fn, arguments));
    };
    function onFinished(msg, listener) {
      if (isFinished(msg) !== false) {
        defer(listener, null, msg);
        return msg;
      }
      attachListener(msg, listener);
      return msg;
    }
    function isFinished(msg) {
      var socket = msg.socket;
      if (typeof msg.finished === "boolean") {
        return Boolean(msg.finished || socket && !socket.writable);
      }
      if (typeof msg.complete === "boolean") {
        return Boolean(msg.upgrade || !socket || !socket.readable || msg.complete && !msg.readable);
      }
      return void 0;
    }
    function attachFinishedListener(msg, callback) {
      var eeMsg;
      var eeSocket;
      var finished = false;
      function onFinish(error) {
        eeMsg.cancel();
        eeSocket.cancel();
        finished = true;
        callback(error);
      }
      eeMsg = eeSocket = first([[msg, "end", "finish"]], onFinish);
      function onSocket(socket) {
        msg.removeListener("socket", onSocket);
        if (finished) return;
        if (eeMsg !== eeSocket) return;
        eeSocket = first([[socket, "error", "close"]], onFinish);
      }
      if (msg.socket) {
        onSocket(msg.socket);
        return;
      }
      msg.on("socket", onSocket);
      if (msg.socket === void 0) {
        patchAssignSocket(msg, onSocket);
      }
    }
    function attachListener(msg, listener) {
      var attached = msg.__onFinished;
      if (!attached || !attached.queue) {
        attached = msg.__onFinished = createListener(msg);
        attachFinishedListener(msg, attached);
      }
      attached.queue.push(listener);
    }
    function createListener(msg) {
      function listener(err) {
        if (msg.__onFinished === listener) msg.__onFinished = null;
        if (!listener.queue) return;
        var queue = listener.queue;
        listener.queue = null;
        for (var i = 0; i < queue.length; i++) {
          queue[i](err, msg);
        }
      }
      listener.queue = [];
      return listener;
    }
    function patchAssignSocket(res, callback) {
      var assignSocket = res.assignSocket;
      if (typeof assignSocket !== "function") return;
      res.assignSocket = function _assignSocket(socket) {
        assignSocket.call(this, socket);
        callback(socket);
      };
    }
  }
});

// node_modules/on-headers/index.js
var require_on_headers = __commonJS({
  "node_modules/on-headers/index.js"(exports2, module2) {
    "use strict";
    module2.exports = onHeaders;
    function createWriteHead(prevWriteHead, listener) {
      var fired = false;
      return function writeHead(statusCode) {
        var args = setWriteHeadHeaders.apply(this, arguments);
        if (!fired) {
          fired = true;
          listener.call(this);
          if (typeof args[0] === "number" && this.statusCode !== args[0]) {
            args[0] = this.statusCode;
            args.length = 1;
          }
        }
        return prevWriteHead.apply(this, args);
      };
    }
    function onHeaders(res, listener) {
      if (!res) {
        throw new TypeError("argument res is required");
      }
      if (typeof listener !== "function") {
        throw new TypeError("argument listener must be a function");
      }
      res.writeHead = createWriteHead(res.writeHead, listener);
    }
    function setHeadersFromArray(res, headers) {
      for (var i = 0; i < headers.length; i++) {
        res.setHeader(headers[i][0], headers[i][1]);
      }
    }
    function setHeadersFromObject(res, headers) {
      var keys = Object.keys(headers);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k) res.setHeader(k, headers[k]);
      }
    }
    function setWriteHeadHeaders(statusCode) {
      var length = arguments.length;
      var headerIndex = length > 1 && typeof arguments[1] === "string" ? 2 : 1;
      var headers = length >= headerIndex + 1 ? arguments[headerIndex] : void 0;
      this.statusCode = statusCode;
      if (Array.isArray(headers)) {
        setHeadersFromArray(this, headers);
      } else if (headers) {
        setHeadersFromObject(this, headers);
      }
      var args = new Array(Math.min(length, headerIndex));
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return args;
    }
  }
});

// node_modules/morgan/index.js
var require_morgan = __commonJS({
  "node_modules/morgan/index.js"(exports2, module2) {
    "use strict";
    module2.exports = morgan2;
    module2.exports.compile = compile;
    module2.exports.format = format;
    module2.exports.token = token;
    var auth = require_basic_auth();
    var debug = require_src()("morgan");
    var deprecate = require_depd()("morgan");
    var onFinished = require_on_finished();
    var onHeaders = require_on_headers();
    var CLF_MONTH = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var DEFAULT_BUFFER_DURATION = 1e3;
    function morgan2(format2, options) {
      var fmt = format2;
      var opts = options || {};
      if (format2 && typeof format2 === "object") {
        opts = format2;
        fmt = opts.format || "default";
        deprecate("morgan(options): use morgan(" + (typeof fmt === "string" ? JSON.stringify(fmt) : "format") + ", options) instead");
      }
      if (fmt === void 0) {
        deprecate("undefined format: specify a format");
      }
      var immediate = opts.immediate;
      var skip = opts.skip || false;
      var formatLine = typeof fmt !== "function" ? getFormatFunction(fmt) : fmt;
      var buffer = opts.buffer;
      var stream = opts.stream || process.stdout;
      if (buffer) {
        deprecate("buffer option");
        var interval = typeof buffer !== "number" ? DEFAULT_BUFFER_DURATION : buffer;
        stream = createBufferStream(stream, interval);
      }
      return function logger(req, res, next) {
        req._startAt = void 0;
        req._startTime = void 0;
        req._remoteAddress = getip(req);
        res._startAt = void 0;
        res._startTime = void 0;
        recordStartTime.call(req);
        function logRequest() {
          if (skip !== false && skip(req, res)) {
            debug("skip request");
            return;
          }
          var line = formatLine(morgan2, req, res);
          if (line == null) {
            debug("skip line");
            return;
          }
          debug("log request");
          stream.write(line + "\n");
        }
        ;
        if (immediate) {
          logRequest();
        } else {
          onHeaders(res, recordStartTime);
          onFinished(res, logRequest);
        }
        next();
      };
    }
    morgan2.format("combined", ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');
    morgan2.format("common", ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]');
    morgan2.format("default", ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');
    deprecate.property(morgan2, "default", "default format: use combined format");
    morgan2.format("short", ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms");
    morgan2.format("tiny", ":method :url :status :res[content-length] - :response-time ms");
    morgan2.format("dev", function developmentFormatLine(tokens, req, res) {
      var status = headersSent(res) ? res.statusCode : void 0;
      var color = status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : status >= 200 ? 32 : 0;
      var fn = developmentFormatLine[color];
      if (!fn) {
        fn = developmentFormatLine[color] = compile("\x1B[0m:method :url \x1B[" + color + "m:status\x1B[0m :response-time ms - :res[content-length]\x1B[0m");
      }
      return fn(tokens, req, res);
    });
    morgan2.token("url", function getUrlToken(req) {
      return req.originalUrl || req.url;
    });
    morgan2.token("method", function getMethodToken(req) {
      return req.method;
    });
    morgan2.token("response-time", function getResponseTimeToken(req, res, digits) {
      if (!req._startAt || !res._startAt) {
        return;
      }
      var ms = (res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6;
      return ms.toFixed(digits === void 0 ? 3 : digits);
    });
    morgan2.token("total-time", function getTotalTimeToken(req, res, digits) {
      if (!req._startAt || !res._startAt) {
        return;
      }
      var elapsed = process.hrtime(req._startAt);
      var ms = elapsed[0] * 1e3 + elapsed[1] * 1e-6;
      return ms.toFixed(digits === void 0 ? 3 : digits);
    });
    morgan2.token("date", function getDateToken(req, res, format2) {
      var date = /* @__PURE__ */ new Date();
      switch (format2 || "web") {
        case "clf":
          return clfdate(date);
        case "iso":
          return date.toISOString();
        case "web":
          return date.toUTCString();
      }
    });
    morgan2.token("status", function getStatusToken(req, res) {
      return headersSent(res) ? String(res.statusCode) : void 0;
    });
    morgan2.token("referrer", function getReferrerToken(req) {
      return req.headers.referer || req.headers.referrer;
    });
    morgan2.token("remote-addr", getip);
    morgan2.token("remote-user", function getRemoteUserToken(req) {
      var credentials = auth(req);
      return credentials ? credentials.name : void 0;
    });
    morgan2.token("http-version", function getHttpVersionToken(req) {
      return req.httpVersionMajor + "." + req.httpVersionMinor;
    });
    morgan2.token("user-agent", function getUserAgentToken(req) {
      return req.headers["user-agent"];
    });
    morgan2.token("req", function getRequestToken(req, res, field) {
      var header = req.headers[field.toLowerCase()];
      return Array.isArray(header) ? header.join(", ") : header;
    });
    morgan2.token("res", function getResponseHeader(req, res, field) {
      if (!headersSent(res)) {
        return void 0;
      }
      var header = res.getHeader(field);
      return Array.isArray(header) ? header.join(", ") : header;
    });
    function clfdate(dateTime) {
      var date = dateTime.getUTCDate();
      var hour = dateTime.getUTCHours();
      var mins = dateTime.getUTCMinutes();
      var secs = dateTime.getUTCSeconds();
      var year = dateTime.getUTCFullYear();
      var month = CLF_MONTH[dateTime.getUTCMonth()];
      return pad2(date) + "/" + month + "/" + year + ":" + pad2(hour) + ":" + pad2(mins) + ":" + pad2(secs) + " +0000";
    }
    function compile(format2) {
      if (typeof format2 !== "string") {
        throw new TypeError("argument format must be a string");
      }
      var fmt = String(JSON.stringify(format2));
      var js = '  "use strict"\n  return ' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg) {
        var tokenArguments = "req, res";
        var tokenFunction = "tokens[" + String(JSON.stringify(name)) + "]";
        if (arg !== void 0) {
          tokenArguments += ", " + String(JSON.stringify(arg));
        }
        return '" +\n    (' + tokenFunction + "(" + tokenArguments + ') || "-") + "';
      });
      return new Function("tokens, req, res", js);
    }
    function createBufferStream(stream, interval) {
      var buf = [];
      var timer = null;
      function flush() {
        timer = null;
        stream.write(buf.join(""));
        buf.length = 0;
      }
      function write(str) {
        if (timer === null) {
          timer = setTimeout(flush, interval);
        }
        buf.push(str);
      }
      return { write };
    }
    function format(name, fmt) {
      morgan2[name] = fmt;
      return this;
    }
    function getFormatFunction(name) {
      var fmt = morgan2[name] || name || morgan2.default;
      return typeof fmt !== "function" ? compile(fmt) : fmt;
    }
    function getip(req) {
      return req.ip || req._remoteAddress || req.connection && req.connection.remoteAddress || void 0;
    }
    function headersSent(res) {
      return typeof res.headersSent !== "boolean" ? Boolean(res._header) : res.headersSent;
    }
    function pad2(num) {
      var str = String(num);
      return (str.length === 1 ? "0" : "") + str;
    }
    function recordStartTime() {
      this._startAt = process.hrtime();
      this._startTime = /* @__PURE__ */ new Date();
    }
    function token(name, fn) {
      morgan2[name] = fn;
      return this;
    }
  }
});

// node_modules/serverless-http/lib/finish.js
var require_finish = __commonJS({
  "node_modules/serverless-http/lib/finish.js"(exports2, module2) {
    "use strict";
    module2.exports = async function finish(item, transform, ...details) {
      await new Promise((resolve, reject) => {
        if (item.finished || item.complete) {
          resolve();
          return;
        }
        let finished = false;
        function done(err) {
          if (finished) {
            return;
          }
          finished = true;
          item.removeListener("error", done);
          item.removeListener("end", done);
          item.removeListener("finish", done);
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
        item.once("error", done);
        item.once("end", done);
        item.once("finish", done);
      });
      if (typeof transform === "function") {
        await transform(item, ...details);
      } else if (typeof transform === "object" && transform !== null) {
        Object.assign(item, transform);
      }
      return item;
    };
  }
});

// node_modules/serverless-http/lib/response.js
var require_response = __commonJS({
  "node_modules/serverless-http/lib/response.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    var headerEnd = "\r\n\r\n";
    var BODY = Symbol();
    var HEADERS = Symbol();
    function getString(data) {
      if (Buffer.isBuffer(data)) {
        return data.toString("utf8");
      } else if (typeof data === "string") {
        return data;
      } else {
        throw new Error(`response.write() of unexpected type: ${typeof data}`);
      }
    }
    function addData(stream, data) {
      if (Buffer.isBuffer(data) || typeof data === "string" || data instanceof Uint8Array) {
        stream[BODY].push(Buffer.from(data));
      } else {
        throw new Error(`response.write() of unexpected type: ${typeof data}`);
      }
    }
    module2.exports = class ServerlessResponse extends http.ServerResponse {
      static from(res) {
        const response = new ServerlessResponse(res);
        response.statusCode = res.statusCode;
        response[HEADERS] = res.headers;
        response[BODY] = [Buffer.from(res.body)];
        response.end();
        return response;
      }
      static body(res) {
        return Buffer.concat(res[BODY]);
      }
      static headers(res) {
        const headers = typeof res.getHeaders === "function" ? res.getHeaders() : res._headers;
        return Object.assign(headers, res[HEADERS]);
      }
      get headers() {
        return this[HEADERS];
      }
      setHeader(key, value) {
        if (this._wroteHeader) {
          this[HEADERS][key] = value;
        } else {
          super.setHeader(key, value);
        }
      }
      writeHead(statusCode, reason, obj) {
        const headers = typeof reason === "string" ? obj : reason;
        for (const name in headers) {
          this.setHeader(name, headers[name]);
          if (!this._wroteHeader) {
            break;
          }
        }
        super.writeHead(statusCode, reason, obj);
      }
      constructor({ method }) {
        super({ method });
        this[BODY] = [];
        this[HEADERS] = {};
        this.useChunkedEncodingByDefault = false;
        this.chunkedEncoding = false;
        this._header = "";
        this.assignSocket({
          _writableState: {},
          writable: true,
          on: Function.prototype,
          removeListener: Function.prototype,
          destroy: Function.prototype,
          cork: Function.prototype,
          uncork: Function.prototype,
          write: (data, encoding, cb) => {
            if (typeof encoding === "function") {
              cb = encoding;
              encoding = null;
            }
            if (this._header === "" || this._wroteHeader) {
              addData(this, data);
            } else {
              const string = getString(data);
              const index = string.indexOf(headerEnd);
              if (index !== -1) {
                const remainder = string.slice(index + headerEnd.length);
                if (remainder) {
                  addData(this, remainder);
                }
                this._wroteHeader = true;
              }
            }
            if (typeof cb === "function") {
              cb();
            }
          }
        });
        this.once("finish", () => {
          this.emit("close");
        });
      }
    };
  }
});

// node_modules/serverless-http/lib/framework/get-framework.js
var require_get_framework = __commonJS({
  "node_modules/serverless-http/lib/framework/get-framework.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    var Response = require_response();
    function common(cb) {
      return (request) => {
        const response = new Response(request);
        cb(request, response);
        return response;
      };
    }
    module2.exports = function getFramework(app2) {
      if (app2 instanceof http.Server) {
        return (request) => {
          const response = new Response(request);
          app2.emit("request", request, response);
          return response;
        };
      }
      if (typeof app2.callback === "function") {
        return common(app2.callback());
      }
      if (typeof app2.handle === "function") {
        return common((request, response) => {
          app2.handle(request, response);
        });
      }
      if (typeof app2.handler === "function") {
        return common((request, response) => {
          app2.handler(request, response);
        });
      }
      if (typeof app2._onRequest === "function") {
        return common((request, response) => {
          app2._onRequest(request, response);
        });
      }
      if (typeof app2 === "function") {
        return common(app2);
      }
      if (app2.router && typeof app2.router.route == "function") {
        return common((req, res) => {
          const { url, method, headers, body } = req;
          app2.router.route({ url, method, headers, body }, res);
        });
      }
      if (app2._core && typeof app2._core._dispatch === "function") {
        return common(app2._core._dispatch({
          app: app2
        }));
      }
      if (typeof app2.inject === "function") {
        return async (request) => {
          const { method, url, headers, body } = request;
          const res = await app2.inject({ method, url, headers, payload: body });
          return Response.from(res);
        };
      }
      if (typeof app2.main === "function") {
        return common(app2.main);
      }
      throw new Error("Unsupported framework");
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/clean-up-event.js
var require_clean_up_event = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/clean-up-event.js"(exports2, module2) {
    "use strict";
    function removeBasePath(path2 = "/", basePath) {
      if (basePath) {
        const basePathIndex = path2.indexOf(basePath);
        if (basePathIndex > -1) {
          return path2.substr(basePathIndex + basePath.length) || "/";
        }
      }
      return path2;
    }
    function isString(value) {
      return typeof value === "string" || value instanceof String;
    }
    function specialDecodeURIComponent(value) {
      if (!isString(value)) {
        return value;
      }
      let decoded;
      try {
        decoded = decodeURIComponent(value.replace(/[+]/g, "%20"));
      } catch (err) {
        decoded = value.replace(/[+]/g, "%20");
      }
      return decoded;
    }
    function recursiveURLDecode(value) {
      if (isString(value)) {
        return specialDecodeURIComponent(value);
      } else if (Array.isArray(value)) {
        const decodedArray = [];
        for (let index in value) {
          decodedArray.push(recursiveURLDecode(value[index]));
        }
        return decodedArray;
      } else if (value instanceof Object) {
        const decodedObject = {};
        for (let key of Object.keys(value)) {
          decodedObject[specialDecodeURIComponent(key)] = recursiveURLDecode(value[key]);
        }
        return decodedObject;
      }
      return value;
    }
    module2.exports = function cleanupEvent(evt, options) {
      const event = evt || {};
      event.requestContext = event.requestContext || {};
      event.body = event.body || "";
      event.headers = event.headers || {};
      if ("elb" in event.requestContext) {
        if (event.multiValueQueryStringParameters) {
          event.multiValueQueryStringParameters = recursiveURLDecode(event.multiValueQueryStringParameters);
        }
        if (event.queryStringParameters) {
          event.queryStringParameters = recursiveURLDecode(event.queryStringParameters);
        }
      }
      if (event.version === "2.0") {
        event.requestContext.authorizer = event.requestContext.authorizer || {};
        event.requestContext.http.method = event.requestContext.http.method || "GET";
        event.rawPath = removeBasePath(event.requestPath || event.rawPath, options.basePath);
      } else {
        event.requestContext.identity = event.requestContext.identity || {};
        event.httpMethod = event.httpMethod || "GET";
        event.path = removeBasePath(event.requestPath || event.path, options.basePath);
      }
      return event;
    };
  }
});

// node_modules/serverless-http/lib/request.js
var require_request = __commonJS({
  "node_modules/serverless-http/lib/request.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    module2.exports = class ServerlessRequest extends http.IncomingMessage {
      constructor({ method, url, headers, body, remoteAddress }) {
        super({
          encrypted: true,
          readable: false,
          remoteAddress,
          address: () => ({ port: 443 }),
          end: Function.prototype,
          destroy: Function.prototype
        });
        if (typeof headers["content-length"] === "undefined") {
          headers["content-length"] = Buffer.byteLength(body);
        }
        Object.assign(this, {
          ip: remoteAddress,
          complete: true,
          httpVersion: "1.1",
          httpVersionMajor: "1",
          httpVersionMinor: "1",
          method,
          headers,
          body,
          url
        });
        this._read = () => {
          this.push(body);
          this.push(null);
        };
      }
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/create-request.js
var require_create_request = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/create-request.js"(exports2, module2) {
    "use strict";
    var URL = require("url");
    var Request = require_request();
    function requestMethod(event) {
      if (event.version === "2.0") {
        return event.requestContext.http.method;
      }
      return event.httpMethod;
    }
    function requestRemoteAddress(event) {
      if (event.version === "2.0") {
        return event.requestContext.http.sourceIp;
      }
      return event.requestContext.identity.sourceIp;
    }
    function requestHeaders(event) {
      const initialHeader = event.version === "2.0" && Array.isArray(event.cookies) ? { cookie: event.cookies.join("; ") } : {};
      if (event.multiValueHeaders) {
        Object.keys(event.multiValueHeaders).reduce((headers, key) => {
          headers[key.toLowerCase()] = event.multiValueHeaders[key].join(", ");
          return headers;
        }, initialHeader);
      }
      return Object.keys(event.headers).reduce((headers, key) => {
        headers[key.toLowerCase()] = event.headers[key];
        return headers;
      }, initialHeader);
    }
    function requestBody(event) {
      const type = typeof event.body;
      if (Buffer.isBuffer(event.body)) {
        return event.body;
      } else if (type === "string") {
        return Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
      } else if (type === "object") {
        return Buffer.from(JSON.stringify(event.body));
      }
      throw new Error(`Unexpected event.body type: ${typeof event.body}`);
    }
    function requestUrl(event) {
      if (event.version === "2.0") {
        return URL.format({
          pathname: event.rawPath,
          search: event.rawQueryString
        });
      }
      const query = event.multiValueQueryStringParameters || {};
      if (event.queryStringParameters) {
        Object.keys(event.queryStringParameters).forEach((key) => {
          if (Array.isArray(query[key])) {
            if (!query[key].includes(event.queryStringParameters[key])) {
              query[key].push(event.queryStringParameters[key]);
            }
          } else {
            query[key] = [event.queryStringParameters[key]];
          }
        });
      }
      return URL.format({
        pathname: event.path,
        query
      });
    }
    module2.exports = (event, context, options) => {
      const method = requestMethod(event);
      const remoteAddress = requestRemoteAddress(event);
      const headers = requestHeaders(event);
      const body = requestBody(event);
      const url = requestUrl(event);
      if (typeof options.requestId === "string" && options.requestId.length > 0) {
        const header = options.requestId.toLowerCase();
        const requestId = headers[header] || event.requestContext.requestId;
        if (requestId) {
          headers[header] = requestId;
        }
      }
      const req = new Request({
        method,
        headers,
        body,
        remoteAddress,
        url
      });
      req.requestContext = event.requestContext;
      req.apiGateway = {
        event,
        context
      };
      return req;
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/is-binary.js
var require_is_binary = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/is-binary.js"(exports2, module2) {
    "use strict";
    var BINARY_ENCODINGS = ["gzip", "deflate", "br"];
    var BINARY_CONTENT_TYPES = (process.env.BINARY_CONTENT_TYPES || "").split(",");
    function isBinaryEncoding(headers) {
      const contentEncoding = headers["content-encoding"];
      if (typeof contentEncoding === "string") {
        return contentEncoding.split(",").some(
          (value) => BINARY_ENCODINGS.some((binaryEncoding) => value.indexOf(binaryEncoding) !== -1)
        );
      }
    }
    function isBinaryContent(headers, options) {
      const contentTypes = [].concat(
        options.binary ? options.binary : BINARY_CONTENT_TYPES
      ).map(
        (candidate) => new RegExp(`^${candidate.replace(/\*/g, ".*")}$`)
      );
      const contentType = (headers["content-type"] || "").split(";")[0];
      return !!contentType && contentTypes.some((candidate) => candidate.test(contentType));
    }
    module2.exports = function isBinary(headers, options) {
      if (options.binary === false) {
        return false;
      }
      if (options.binary === true) {
        return true;
      }
      if (typeof options.binary === "function") {
        return options.binary(headers);
      }
      return isBinaryEncoding(headers) || isBinaryContent(headers, options);
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/sanitize-headers.js
var require_sanitize_headers = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/sanitize-headers.js"(exports2, module2) {
    "use strict";
    module2.exports = function sanitizeHeaders(headers) {
      return Object.keys(headers).reduce((memo, key) => {
        const value = headers[key];
        if (Array.isArray(value)) {
          memo.multiValueHeaders[key] = value;
          if (key.toLowerCase() !== "set-cookie") {
            memo.headers[key] = value.join(", ");
          }
        } else {
          memo.headers[key] = value == null ? "" : value.toString();
        }
        return memo;
      }, {
        headers: {},
        multiValueHeaders: {}
      });
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/format-response.js
var require_format_response = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/format-response.js"(exports2, module2) {
    "use strict";
    var isBinary = require_is_binary();
    var Response = require_response();
    var sanitizeHeaders = require_sanitize_headers();
    module2.exports = (event, response, options) => {
      const { statusCode } = response;
      const { headers, multiValueHeaders } = sanitizeHeaders(Response.headers(response));
      let cookies = [];
      if (multiValueHeaders["set-cookie"]) {
        cookies = multiValueHeaders["set-cookie"];
      }
      const isBase64Encoded = isBinary(headers, options);
      const encoding = isBase64Encoded ? "base64" : "utf8";
      let body = Response.body(response).toString(encoding);
      if (headers["transfer-encoding"] === "chunked" || response.chunkedEncoding) {
        const raw = Response.body(response).toString().split("\r\n");
        const parsed = [];
        for (let i = 0; i < raw.length; i += 2) {
          const size = parseInt(raw[i], 16);
          const value = raw[i + 1];
          if (value) {
            parsed.push(value.substring(0, size));
          }
        }
        body = parsed.join("");
      }
      let formattedResponse = { statusCode, headers, isBase64Encoded, body };
      if (event.version === "2.0" && cookies.length) {
        formattedResponse["cookies"] = cookies;
      }
      if ((!event.version || event.version === "1.0") && Object.keys(multiValueHeaders).length) {
        formattedResponse["multiValueHeaders"] = multiValueHeaders;
      }
      return formattedResponse;
    };
  }
});

// node_modules/serverless-http/lib/provider/aws/index.js
var require_aws = __commonJS({
  "node_modules/serverless-http/lib/provider/aws/index.js"(exports2, module2) {
    var cleanUpEvent = require_clean_up_event();
    var createRequest = require_create_request();
    var formatResponse = require_format_response();
    module2.exports = (options) => {
      return (getResponse) => async (event_, context = {}) => {
        const event = cleanUpEvent(event_, options);
        const request = createRequest(event, context, options);
        const response = await getResponse(request, event, context);
        return formatResponse(event, response, options);
      };
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/clean-up-request.js
var require_clean_up_request = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/clean-up-request.js"(exports2, module2) {
    "use strict";
    function getUrl({ requestPath, url }) {
      if (requestPath) {
        return requestPath;
      }
      return typeof url === "string" ? url : "/";
    }
    function getRequestContext(request) {
      const requestContext = {};
      requestContext.identity = {};
      const forwardedIp = request.headers["x-forwarded-for"];
      const clientIp = request.headers["client-ip"];
      const ip = forwardedIp ? forwardedIp : clientIp ? clientIp : "";
      if (ip) {
        requestContext.identity.sourceIp = ip.split(":")[0];
      }
      return requestContext;
    }
    module2.exports = function cleanupRequest(req, options) {
      const request = req || {};
      request.requestContext = getRequestContext(req);
      request.method = request.method || "GET";
      request.url = getUrl(request);
      request.body = request.body || "";
      request.headers = request.headers || {};
      if (options.basePath) {
        const basePathIndex = request.url.indexOf(options.basePath);
        if (basePathIndex > -1) {
          request.url = request.url.substr(basePathIndex + options.basePath.length);
        }
      }
      return request;
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/create-request.js
var require_create_request2 = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/create-request.js"(exports2, module2) {
    "use strict";
    var url = require("url");
    var Request = require_request();
    function requestHeaders(request) {
      return Object.keys(request.headers).reduce((headers, key) => {
        headers[key.toLowerCase()] = request.headers[key];
        return headers;
      }, {});
    }
    function requestBody(request) {
      const type = typeof request.rawBody;
      if (Buffer.isBuffer(request.rawBody)) {
        return request.rawBody;
      } else if (type === "string") {
        return Buffer.from(request.rawBody, "utf8");
      } else if (type === "object") {
        return Buffer.from(JSON.stringify(request.rawBody));
      }
      throw new Error(`Unexpected request.body type: ${typeof request.rawBody}`);
    }
    module2.exports = (request) => {
      const method = request.method;
      const query = request.query;
      const headers = requestHeaders(request);
      const body = requestBody(request);
      const req = new Request({
        method,
        headers,
        body,
        url: url.format({
          pathname: request.url,
          query
        })
      });
      req.requestContext = request.requestContext;
      return req;
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/is-binary.js
var require_is_binary2 = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/is-binary.js"(exports2, module2) {
    "use strict";
    var BINARY_ENCODINGS = ["gzip", "deflate", "br"];
    var BINARY_CONTENT_TYPES = (process.env.BINARY_CONTENT_TYPES || "").split(",");
    function isBinaryEncoding(headers) {
      const contentEncoding = headers["content-encoding"];
      if (typeof contentEncoding === "string") {
        return contentEncoding.split(",").some(
          (value) => BINARY_ENCODINGS.some((binaryEncoding) => value.indexOf(binaryEncoding) !== -1)
        );
      }
    }
    function isBinaryContent(headers, options) {
      const contentTypes = [].concat(
        options.binary ? options.binary : BINARY_CONTENT_TYPES
      ).map(
        (candidate) => new RegExp(`^${candidate.replace(/\*/g, ".*")}$`)
      );
      const contentType = (headers["content-type"] || "").split(";")[0];
      return !!contentType && contentTypes.some((candidate) => candidate.test(contentType));
    }
    module2.exports = function isBinary(headers, options) {
      if (options.binary === false) {
        return false;
      }
      if (options.binary === true) {
        return true;
      }
      if (typeof options.binary === "function") {
        return options.binary(headers);
      }
      return isBinaryEncoding(headers) || isBinaryContent(headers, options);
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/set-cookie.json
var require_set_cookie = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/set-cookie.json"(exports2, module2) {
    module2.exports = { variations: ["set-cookie", "Set-cookie", "sEt-cookie", "SEt-cookie", "seT-cookie", "SeT-cookie", "sET-cookie", "SET-cookie", "set-Cookie", "Set-Cookie", "sEt-Cookie", "SEt-Cookie", "seT-Cookie", "SeT-Cookie", "sET-Cookie", "SET-Cookie", "set-cOokie", "Set-cOokie", "sEt-cOokie", "SEt-cOokie", "seT-cOokie", "SeT-cOokie", "sET-cOokie", "SET-cOokie", "set-COokie", "Set-COokie", "sEt-COokie", "SEt-COokie", "seT-COokie", "SeT-COokie", "sET-COokie", "SET-COokie", "set-coOkie", "Set-coOkie", "sEt-coOkie", "SEt-coOkie", "seT-coOkie", "SeT-coOkie", "sET-coOkie", "SET-coOkie", "set-CoOkie", "Set-CoOkie", "sEt-CoOkie", "SEt-CoOkie", "seT-CoOkie", "SeT-CoOkie", "sET-CoOkie", "SET-CoOkie", "set-cOOkie", "Set-cOOkie", "sEt-cOOkie", "SEt-cOOkie", "seT-cOOkie", "SeT-cOOkie", "sET-cOOkie", "SET-cOOkie", "set-COOkie", "Set-COOkie", "sEt-COOkie", "SEt-COOkie", "seT-COOkie", "SeT-COOkie", "sET-COOkie", "SET-COOkie", "set-cooKie", "Set-cooKie", "sEt-cooKie", "SEt-cooKie", "seT-cooKie", "SeT-cooKie", "sET-cooKie", "SET-cooKie", "set-CooKie", "Set-CooKie", "sEt-CooKie", "SEt-CooKie", "seT-CooKie", "SeT-CooKie", "sET-CooKie", "SET-CooKie", "set-cOoKie", "Set-cOoKie", "sEt-cOoKie", "SEt-cOoKie", "seT-cOoKie", "SeT-cOoKie", "sET-cOoKie", "SET-cOoKie", "set-COoKie", "Set-COoKie", "sEt-COoKie", "SEt-COoKie", "seT-COoKie", "SeT-COoKie", "sET-COoKie", "SET-COoKie", "set-coOKie", "Set-coOKie", "sEt-coOKie", "SEt-coOKie", "seT-coOKie", "SeT-coOKie", "sET-coOKie", "SET-coOKie", "set-CoOKie", "Set-CoOKie", "sEt-CoOKie", "SEt-CoOKie", "seT-CoOKie", "SeT-CoOKie", "sET-CoOKie", "SET-CoOKie", "set-cOOKie", "Set-cOOKie", "sEt-cOOKie", "SEt-cOOKie", "seT-cOOKie", "SeT-cOOKie", "sET-cOOKie", "SET-cOOKie", "set-COOKie", "Set-COOKie", "sEt-COOKie", "SEt-COOKie", "seT-COOKie", "SeT-COOKie", "sET-COOKie", "SET-COOKie", "set-cookIe", "Set-cookIe", "sEt-cookIe", "SEt-cookIe", "seT-cookIe", "SeT-cookIe", "sET-cookIe", "SET-cookIe", "set-CookIe", "Set-CookIe", "sEt-CookIe", "SEt-CookIe", "seT-CookIe", "SeT-CookIe", "sET-CookIe", "SET-CookIe", "set-cOokIe", "Set-cOokIe", "sEt-cOokIe", "SEt-cOokIe", "seT-cOokIe", "SeT-cOokIe", "sET-cOokIe", "SET-cOokIe", "set-COokIe", "Set-COokIe", "sEt-COokIe", "SEt-COokIe", "seT-COokIe", "SeT-COokIe", "sET-COokIe", "SET-COokIe", "set-coOkIe", "Set-coOkIe", "sEt-coOkIe", "SEt-coOkIe", "seT-coOkIe", "SeT-coOkIe", "sET-coOkIe", "SET-coOkIe", "set-CoOkIe", "Set-CoOkIe", "sEt-CoOkIe", "SEt-CoOkIe", "seT-CoOkIe", "SeT-CoOkIe", "sET-CoOkIe", "SET-CoOkIe", "set-cOOkIe", "Set-cOOkIe", "sEt-cOOkIe", "SEt-cOOkIe", "seT-cOOkIe", "SeT-cOOkIe", "sET-cOOkIe", "SET-cOOkIe", "set-COOkIe", "Set-COOkIe", "sEt-COOkIe", "SEt-COOkIe", "seT-COOkIe", "SeT-COOkIe", "sET-COOkIe", "SET-COOkIe", "set-cooKIe", "Set-cooKIe", "sEt-cooKIe", "SEt-cooKIe", "seT-cooKIe", "SeT-cooKIe", "sET-cooKIe", "SET-cooKIe", "set-CooKIe", "Set-CooKIe", "sEt-CooKIe", "SEt-CooKIe", "seT-CooKIe", "SeT-CooKIe", "sET-CooKIe", "SET-CooKIe", "set-cOoKIe", "Set-cOoKIe", "sEt-cOoKIe", "SEt-cOoKIe", "seT-cOoKIe", "SeT-cOoKIe", "sET-cOoKIe", "SET-cOoKIe", "set-COoKIe", "Set-COoKIe", "sEt-COoKIe", "SEt-COoKIe", "seT-COoKIe", "SeT-COoKIe", "sET-COoKIe", "SET-COoKIe", "set-coOKIe", "Set-coOKIe", "sEt-coOKIe", "SEt-coOKIe", "seT-coOKIe", "SeT-coOKIe", "sET-coOKIe", "SET-coOKIe", "set-CoOKIe", "Set-CoOKIe", "sEt-CoOKIe", "SEt-CoOKIe", "seT-CoOKIe", "SeT-CoOKIe", "sET-CoOKIe", "SET-CoOKIe", "set-cOOKIe", "Set-cOOKIe", "sEt-cOOKIe", "SEt-cOOKIe", "seT-cOOKIe", "SeT-cOOKIe", "sET-cOOKIe", "SET-cOOKIe", "set-COOKIe", "Set-COOKIe", "sEt-COOKIe", "SEt-COOKIe", "seT-COOKIe", "SeT-COOKIe", "sET-COOKIe", "SET-COOKIe", "set-cookiE", "Set-cookiE", "sEt-cookiE", "SEt-cookiE", "seT-cookiE", "SeT-cookiE", "sET-cookiE", "SET-cookiE", "set-CookiE", "Set-CookiE", "sEt-CookiE", "SEt-CookiE", "seT-CookiE", "SeT-CookiE", "sET-CookiE", "SET-CookiE", "set-cOokiE", "Set-cOokiE", "sEt-cOokiE", "SEt-cOokiE", "seT-cOokiE", "SeT-cOokiE", "sET-cOokiE", "SET-cOokiE", "set-COokiE", "Set-COokiE", "sEt-COokiE", "SEt-COokiE", "seT-COokiE", "SeT-COokiE", "sET-COokiE", "SET-COokiE", "set-coOkiE", "Set-coOkiE", "sEt-coOkiE", "SEt-coOkiE", "seT-coOkiE", "SeT-coOkiE", "sET-coOkiE", "SET-coOkiE", "set-CoOkiE", "Set-CoOkiE", "sEt-CoOkiE", "SEt-CoOkiE", "seT-CoOkiE", "SeT-CoOkiE", "sET-CoOkiE", "SET-CoOkiE", "set-cOOkiE", "Set-cOOkiE", "sEt-cOOkiE", "SEt-cOOkiE", "seT-cOOkiE", "SeT-cOOkiE", "sET-cOOkiE", "SET-cOOkiE", "set-COOkiE", "Set-COOkiE", "sEt-COOkiE", "SEt-COOkiE", "seT-COOkiE", "SeT-COOkiE", "sET-COOkiE", "SET-COOkiE", "set-cooKiE", "Set-cooKiE", "sEt-cooKiE", "SEt-cooKiE", "seT-cooKiE", "SeT-cooKiE", "sET-cooKiE", "SET-cooKiE", "set-CooKiE", "Set-CooKiE", "sEt-CooKiE", "SEt-CooKiE", "seT-CooKiE", "SeT-CooKiE", "sET-CooKiE", "SET-CooKiE", "set-cOoKiE", "Set-cOoKiE", "sEt-cOoKiE", "SEt-cOoKiE", "seT-cOoKiE", "SeT-cOoKiE", "sET-cOoKiE", "SET-cOoKiE", "set-COoKiE", "Set-COoKiE", "sEt-COoKiE", "SEt-COoKiE", "seT-COoKiE", "SeT-COoKiE", "sET-COoKiE", "SET-COoKiE", "set-coOKiE", "Set-coOKiE", "sEt-coOKiE", "SEt-coOKiE", "seT-coOKiE", "SeT-coOKiE", "sET-coOKiE", "SET-coOKiE", "set-CoOKiE", "Set-CoOKiE", "sEt-CoOKiE", "SEt-CoOKiE", "seT-CoOKiE", "SeT-CoOKiE", "sET-CoOKiE", "SET-CoOKiE", "set-cOOKiE", "Set-cOOKiE", "sEt-cOOKiE", "SEt-cOOKiE", "seT-cOOKiE", "SeT-cOOKiE", "sET-cOOKiE", "SET-cOOKiE", "set-COOKiE", "Set-COOKiE", "sEt-COOKiE", "SEt-COOKiE", "seT-COOKiE", "SeT-COOKiE", "sET-COOKiE", "SET-COOKiE", "set-cookIE", "Set-cookIE", "sEt-cookIE", "SEt-cookIE", "seT-cookIE", "SeT-cookIE", "sET-cookIE", "SET-cookIE", "set-CookIE", "Set-CookIE", "sEt-CookIE", "SEt-CookIE", "seT-CookIE", "SeT-CookIE", "sET-CookIE", "SET-CookIE", "set-cOokIE", "Set-cOokIE", "sEt-cOokIE", "SEt-cOokIE", "seT-cOokIE", "SeT-cOokIE", "sET-cOokIE", "SET-cOokIE", "set-COokIE", "Set-COokIE", "sEt-COokIE", "SEt-COokIE", "seT-COokIE", "SeT-COokIE", "sET-COokIE", "SET-COokIE", "set-coOkIE", "Set-coOkIE", "sEt-coOkIE", "SEt-coOkIE", "seT-coOkIE", "SeT-coOkIE", "sET-coOkIE", "SET-coOkIE", "set-CoOkIE", "Set-CoOkIE", "sEt-CoOkIE", "SEt-CoOkIE", "seT-CoOkIE", "SeT-CoOkIE", "sET-CoOkIE", "SET-CoOkIE", "set-cOOkIE", "Set-cOOkIE", "sEt-cOOkIE", "SEt-cOOkIE", "seT-cOOkIE", "SeT-cOOkIE", "sET-cOOkIE", "SET-cOOkIE", "set-COOkIE", "Set-COOkIE", "sEt-COOkIE", "SEt-COOkIE", "seT-COOkIE", "SeT-COOkIE", "sET-COOkIE", "SET-COOkIE", "set-cooKIE", "Set-cooKIE", "sEt-cooKIE", "SEt-cooKIE", "seT-cooKIE", "SeT-cooKIE", "sET-cooKIE", "SET-cooKIE", "set-CooKIE", "Set-CooKIE", "sEt-CooKIE", "SEt-CooKIE", "seT-CooKIE", "SeT-CooKIE", "sET-CooKIE", "SET-CooKIE", "set-cOoKIE", "Set-cOoKIE", "sEt-cOoKIE", "SEt-cOoKIE", "seT-cOoKIE", "SeT-cOoKIE", "sET-cOoKIE", "SET-cOoKIE", "set-COoKIE", "Set-COoKIE", "sEt-COoKIE", "SEt-COoKIE", "seT-COoKIE", "SeT-COoKIE", "sET-COoKIE", "SET-COoKIE", "set-coOKIE", "Set-coOKIE", "sEt-coOKIE", "SEt-coOKIE", "seT-coOKIE", "SeT-coOKIE", "sET-coOKIE", "SET-coOKIE", "set-CoOKIE", "Set-CoOKIE", "sEt-CoOKIE", "SEt-CoOKIE", "seT-CoOKIE", "SeT-CoOKIE", "sET-CoOKIE", "SET-CoOKIE", "set-cOOKIE", "Set-cOOKIE", "sEt-cOOKIE", "SEt-cOOKIE", "seT-cOOKIE", "SeT-cOOKIE", "sET-cOOKIE", "SET-cOOKIE", "set-COOKIE", "Set-COOKIE", "sEt-COOKIE", "SEt-COOKIE", "seT-COOKIE", "SeT-COOKIE", "sET-COOKIE", "SET-COOKIE"] };
  }
});

// node_modules/serverless-http/lib/provider/azure/sanitize-headers.js
var require_sanitize_headers2 = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/sanitize-headers.js"(exports2, module2) {
    "use strict";
    var setCookieVariations = require_set_cookie().variations;
    module2.exports = function sanitizeHeaders(headers) {
      return Object.keys(headers).reduce((memo, key) => {
        const value = headers[key];
        if (Array.isArray(value)) {
          if (key.toLowerCase() === "set-cookie") {
            value.forEach((cookie, i) => {
              memo[setCookieVariations[i]] = cookie;
            });
          } else {
            memo[key] = value.join(", ");
          }
        } else {
          memo[key] = value == null ? "" : value.toString();
        }
        return memo;
      }, {});
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/format-response.js
var require_format_response2 = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/format-response.js"(exports2, module2) {
    var isBinary = require_is_binary2();
    var Response = require_response();
    var sanitizeHeaders = require_sanitize_headers2();
    module2.exports = (response, options) => {
      const { statusCode } = response;
      const headers = sanitizeHeaders(Response.headers(response));
      if (headers["transfer-encoding"] === "chunked" || response.chunkedEncoding) {
        throw new Error("chunked encoding not supported");
      }
      const isBase64Encoded = isBinary(headers, options);
      const encoding = isBase64Encoded ? "base64" : "utf8";
      const body = Response.body(response).toString(encoding);
      return { status: statusCode, headers, isBase64Encoded, body };
    };
  }
});

// node_modules/serverless-http/lib/provider/azure/index.js
var require_azure = __commonJS({
  "node_modules/serverless-http/lib/provider/azure/index.js"(exports2, module2) {
    var cleanupRequest = require_clean_up_request();
    var createRequest = require_create_request2();
    var formatResponse = require_format_response2();
    module2.exports = (options) => {
      return (getResponse) => async (context, req) => {
        const event = cleanupRequest(req, options);
        const request = createRequest(event, options);
        const response = await getResponse(request, context, event);
        context.log(response);
        return formatResponse(response, options);
      };
    };
  }
});

// node_modules/serverless-http/lib/provider/get-provider.js
var require_get_provider = __commonJS({
  "node_modules/serverless-http/lib/provider/get-provider.js"(exports2, module2) {
    var aws = require_aws();
    var azure = require_azure();
    var providers = {
      aws,
      azure
    };
    module2.exports = function getProvider(options) {
      const { provider = "aws" } = options;
      if (provider in providers) {
        return providers[provider](options);
      }
      throw new Error(`Unsupported provider ${provider}`);
    };
  }
});

// node_modules/serverless-http/serverless-http.js
var require_serverless_http = __commonJS({
  "node_modules/serverless-http/serverless-http.js"(exports2, module2) {
    "use strict";
    var finish = require_finish();
    var getFramework = require_get_framework();
    var getProvider = require_get_provider();
    var defaultOptions = {
      requestId: "x-request-id"
    };
    module2.exports = function(app2, opts) {
      const options = Object.assign({}, defaultOptions, opts);
      const framework = getFramework(app2);
      const provider = getProvider(options);
      return provider(async (request, ...context) => {
        await finish(request, options.request, ...context);
        const response = await framework(request);
        await finish(response, options.response, ...context);
        return response;
      });
    };
  }
});

// functions/api.js
var express = require("express");
var cors = require_lib();
var morgan = require_morgan();
var fs = require("fs");
var path = require("path");
var serverless = require_serverless_http();
var app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const requestLog = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip
  };
  console.log(JSON.stringify(requestLog, null, 2));
  next();
});
app.post("/", (req, res) => {
  const dataHora = (/* @__PURE__ */ new Date()).toISOString();
  res.json({ dataHora });
});
exports.handler = serverless(app);
/*! Bundled license information:

object-assign/index.js:
  (*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  *)

vary/index.js:
  (*!
   * vary
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

basic-auth/index.js:
  (*!
   * basic-auth
   * Copyright(c) 2013 TJ Holowaychuk
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/index.js:
  (*!
   * depd
   * Copyright(c) 2014-2018 Douglas Christopher Wilson
   * MIT Licensed
   *)

ee-first/index.js:
  (*!
   * ee-first
   * Copyright(c) 2014 Jonathan Ong
   * MIT Licensed
   *)

on-finished/index.js:
  (*!
   * on-finished
   * Copyright(c) 2013 Jonathan Ong
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

on-headers/index.js:
  (*!
   * on-headers
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

morgan/index.js:
  (*!
   * morgan
   * Copyright(c) 2010 Sencha Inc.
   * Copyright(c) 2011 TJ Holowaychuk
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=api.js.map
