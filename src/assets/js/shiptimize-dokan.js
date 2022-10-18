/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/shiptimize-for-woocommerce/assets/js";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/shiptimize-dokan.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/shiptimize-dokan.js":
/*!********************************!*\
  !*** ./js/shiptimize-dokan.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/** \n * Add any aditional functionality we need in the vendor dashboard \n */\nvar ShiptimizeDokan = function () {\n  function ShiptimizeDokan() {\n    _classCallCheck(this, ShiptimizeDokan);\n  }\n\n  _createClass(ShiptimizeDokan, [{\n    key: \"export\",\n    value: function _export(data) {\n      jQuery(\"<div class='shiptimize-sending'>\" + shiptimize_label_sending + \"</div>\").insertBefore('.shiptimize-export-btn');\n      jQuery.ajax({\n        url: dokan.ajaxurl,\n        method: 'GET',\n        data: data,\n        success: function success(resp) {\n          jQuery(\".shiptimize-sending\").remove();\n          jQuery(resp).insertAfter('.shiptimize-export-btn');\n        },\n        error: function error(err) {\n          jQuery(\".shiptimize-sending\").remove();\n          jQuery(\"An error has occurred \" + JSON.stringify(err)).insertAfter(\".shiptimize-export-btn\");\n        }\n      });\n    }\n  }, {\n    key: \"exportSelected\",\n    value: function exportSelected() {\n      var selectedIds = [];\n      jQuery(\"input[name='bulk_orders[]']:checked\").each(function (idx, elem) {\n        selectedIds[idx] = jQuery(elem).val();\n      });\n\n      if (selectedIds.length == 0) {\n        alert(\"No orders are selected\");\n        return;\n      }\n      var data = {\n        'action': 'shiptimize_dokan_export_selected',\n        'ids': selectedIds\n      };\n\n      this.export(data);\n    }\n  }, {\n    key: \"exportAll\",\n    value: function exportAll() {\n      var data = {\n        'action': 'shiptimize_dokan_export_all'\n      };\n\n      this.export(data);\n    }\n  }]);\n\n  return ShiptimizeDokan;\n}();\n\njQuery(function () {\n  window.shiptimize_dokan = new ShiptimizeDokan();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zaGlwdGltaXplLWRva2FuLmpzP2FmNDUiXSwibmFtZXMiOlsiU2hpcHRpbWl6ZURva2FuIiwiZGF0YSIsImpRdWVyeSIsInNoaXB0aW1pemVfbGFiZWxfc2VuZGluZyIsImluc2VydEJlZm9yZSIsImFqYXgiLCJ1cmwiLCJkb2thbiIsImFqYXh1cmwiLCJtZXRob2QiLCJzdWNjZXNzIiwicmVzcCIsInJlbW92ZSIsImluc2VydEFmdGVyIiwiZXJyb3IiLCJlcnIiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VsZWN0ZWRJZHMiLCJlYWNoIiwiaWR4IiwiZWxlbSIsInZhbCIsImxlbmd0aCIsImFsZXJ0IiwiZXhwb3J0Iiwid2luZG93Iiwic2hpcHRpbWl6ZV9kb2thbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7OztJQUdNQSxlO0FBRUosNkJBQWM7QUFBQTtBQUFFOzs7OzRCQUVSQyxJLEVBQU07QUFDWkMsYUFBTyxxQ0FBcUNDLHdCQUFyQyxHQUFnRSxRQUF2RSxFQUFpRkMsWUFBakYsQ0FBOEYsd0JBQTlGO0FBQ0FGLGFBQU9HLElBQVAsQ0FBWTtBQUNWQyxhQUFLQyxNQUFNQyxPQUREO0FBRVZDLGdCQUFRLEtBRkU7QUFHVlIsY0FBTUEsSUFISTtBQUlWUyxpQkFBUyxpQkFBVUMsSUFBVixFQUFnQjtBQUN2QlQsaUJBQU8scUJBQVAsRUFBOEJVLE1BQTlCO0FBQ0FWLGlCQUFPUyxJQUFQLEVBQ0dFLFdBREgsQ0FDZSx3QkFEZjtBQUVELFNBUlM7QUFTVkMsZUFBTyxlQUFVQyxHQUFWLEVBQWU7QUFDcEJiLGlCQUFPLHFCQUFQLEVBQThCVSxNQUE5QjtBQUNBVixpQkFBTywyQkFBMkJjLEtBQUtDLFNBQUwsQ0FBZUYsR0FBZixDQUFsQyxFQUNHRixXQURILENBQ2Usd0JBRGY7QUFFRDtBQWJTLE9BQVo7QUFlRDs7O3FDQUVnQjtBQUNmLFVBQUlLLGNBQWMsRUFBbEI7QUFDQWhCLGFBQU8scUNBQVAsRUFDR2lCLElBREgsQ0FDUSxVQUFVQyxHQUFWLEVBQWVDLElBQWYsRUFBcUI7QUFDekJILG9CQUFZRSxHQUFaLElBQW1CbEIsT0FBT21CLElBQVAsRUFDaEJDLEdBRGdCLEVBQW5CO0FBRUQsT0FKSDs7QUFNQSxVQUFJSixZQUFZSyxNQUFaLElBQXNCLENBQTFCLEVBQTZCO0FBQzNCQyxjQUFNLHdCQUFOO0FBQ0E7QUFDRDtBQUNELFVBQUl2QixPQUFPO0FBQ1Qsa0JBQVUsa0NBREQ7QUFFVCxlQUFPaUI7QUFGRSxPQUFYOztBQUtBLFdBQUtPLE1BQUwsQ0FBWXhCLElBQVo7QUFDRDs7O2dDQUVXO0FBQ1YsVUFBSUEsT0FBTztBQUNULGtCQUFVO0FBREQsT0FBWDs7QUFJQSxXQUFLd0IsTUFBTCxDQUFZeEIsSUFBWjtBQUNEOzs7Ozs7QUFJSEMsT0FBTyxZQUFZO0FBQ2pCd0IsU0FBT0MsZ0JBQVAsR0FBMEIsSUFBSTNCLGVBQUosRUFBMUI7QUFDRCxDQUZEIiwiZmlsZSI6Ii4vanMvc2hpcHRpbWl6ZS1kb2thbi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBcbiAqIEFkZCBhbnkgYWRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgd2UgbmVlZCBpbiB0aGUgdmVuZG9yIGRhc2hib2FyZCBcbiAqL1xuY2xhc3MgU2hpcHRpbWl6ZURva2FuIHtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZXhwb3J0IChkYXRhKSB7XG4gICAgalF1ZXJ5KFwiPGRpdiBjbGFzcz0nc2hpcHRpbWl6ZS1zZW5kaW5nJz5cIiArIHNoaXB0aW1pemVfbGFiZWxfc2VuZGluZyArIFwiPC9kaXY+XCIpLmluc2VydEJlZm9yZSgnLnNoaXB0aW1pemUtZXhwb3J0LWJ0bicpO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgIHVybDogZG9rYW4uYWpheHVybCxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgalF1ZXJ5KFwiLnNoaXB0aW1pemUtc2VuZGluZ1wiKS5yZW1vdmUoKTtcbiAgICAgICAgalF1ZXJ5KHJlc3ApXG4gICAgICAgICAgLmluc2VydEFmdGVyKCcuc2hpcHRpbWl6ZS1leHBvcnQtYnRuJyk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgalF1ZXJ5KFwiLnNoaXB0aW1pemUtc2VuZGluZ1wiKS5yZW1vdmUoKTtcbiAgICAgICAgalF1ZXJ5KFwiQW4gZXJyb3IgaGFzIG9jY3VycmVkIFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoXCIuc2hpcHRpbWl6ZS1leHBvcnQtYnRuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0U2VsZWN0ZWQoKSB7XG4gICAgbGV0IHNlbGVjdGVkSWRzID0gW107XG4gICAgalF1ZXJ5KFwiaW5wdXRbbmFtZT0nYnVsa19vcmRlcnNbXSddOmNoZWNrZWRcIilcbiAgICAgIC5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsZW0pIHtcbiAgICAgICAgc2VsZWN0ZWRJZHNbaWR4XSA9IGpRdWVyeShlbGVtKVxuICAgICAgICAgIC52YWwoKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkSWRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBhbGVydChcIk5vIG9yZGVycyBhcmUgc2VsZWN0ZWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBkYXRhID0ge1xuICAgICAgJ2FjdGlvbic6ICdzaGlwdGltaXplX2Rva2FuX2V4cG9ydF9zZWxlY3RlZCcsXG4gICAgICAnaWRzJzogc2VsZWN0ZWRJZHNcbiAgICB9O1xuXG4gICAgdGhpcy5leHBvcnQoZGF0YSk7XG4gIH1cblxuICBleHBvcnRBbGwoKSB7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAnYWN0aW9uJzogJ3NoaXB0aW1pemVfZG9rYW5fZXhwb3J0X2FsbCdcbiAgICB9O1xuXG4gICAgdGhpcy5leHBvcnQoZGF0YSk7XG4gIH1cbn1cblxuXG5qUXVlcnkoZnVuY3Rpb24gKCkge1xuICB3aW5kb3cuc2hpcHRpbWl6ZV9kb2thbiA9IG5ldyBTaGlwdGltaXplRG9rYW4oKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./js/shiptimize-dokan.js\n");

/***/ })

/******/ });