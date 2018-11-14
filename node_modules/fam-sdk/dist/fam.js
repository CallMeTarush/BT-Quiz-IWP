/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _fam = __webpack_require__(1);

	var _fam2 = _interopRequireDefault(_fam);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.FreeAllMedia = _fam2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var listenForEvents = Symbol();

	var FreeAllMedia = function () {
	  function FreeAllMedia() {
	    _classCallCheck(this, FreeAllMedia);

	    this[listenForEvents]();
	  }

	  _createClass(FreeAllMedia, [{
	    key: "iframe",
	    value: function iframe(domID, campaignURL) {
	      var container = window.document.getElementById(domID);

	      if (container) {
	        var iframeElement = window.document.createElement("iframe");
	        iframeElement.frameBorder = 0;
	        iframeElement.width = "100%";
	        iframeElement.height = "100%";
	        iframeElement.setAttribute("src", campaignURL);
	        container.appendChild(iframeElement);
	        return iframeElement;
	      } else {
	        throw new Error("FAM: \"" + domID + "\" is not a valid DOM element ID.");
	      }
	    }
	  }, {
	    key: "window",
	    value: function (_window) {
	      function window(_x) {
	        return _window.apply(this, arguments);
	      }

	      window.toString = function () {
	        return _window.toString();
	      };

	      return window;
	    }(function (campaignURL) {
	      return window.open(campaignURL);
	    })
	  }, {
	    key: "on",
	    value: function on(eventName, eventHandler) {
	      var handlerWrapper = function handlerWrapper() {
	        eventHandler();
	      };

	      switch (eventName) {
	        case "start":
	        case "end":
	          break;
	        case "close":
	        case "video:play":
	        case "video:pause":
	        case "video:end":
	        case "video:mute":
	        case "video:unmute":
	        case "activity:start":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            eventHandler(activity);
	          };
	          break;
	        case "activity:end":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            var results = event.detail.results;
	            eventHandler(activity, results);
	          };
	          break;
	        case "image:impression":
	        case "image:clickthrough":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            var creative = event.detail.creative;
	            eventHandler(activity, creative);
	          };
	          break;
	        default:
	          throw new Error("FAM: \"" + eventName + "\" is not a valid FAM event name. See README for full list of event names.");
	      }

	      window.document.addEventListener("fam:" + eventName, handlerWrapper);
	    }
	  }, {
	    key: listenForEvents,
	    value: function value() {
	      var eventListenerName = window.addEventListener ? "addEventListener" : "attachEvent";
	      var eventListener = window[eventListenerName];
	      var eventName = eventListenerName === "attachEvent" ? "onmessage" : "message";

	      eventListener(eventName, function (event) {
	        if (event.data.origin && event.data.origin === "FreeAllMedia") {
	          var customEvent = new CustomEvent(event.data.event, { detail: event.data.payload });
	          document.dispatchEvent(customEvent);
	        }
	      }, false);
	    }
	  }]);

	  return FreeAllMedia;
	}();

	exports.default = FreeAllMedia;

/***/ }
/******/ ]);