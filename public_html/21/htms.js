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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const root = document.querySelectorAll('[is="htms"],htms');
const scope = {};
const outputs = {};

function natural(value) {
  if (value === null) return null;
  let exp = value.valueOf();
  if (typeof exp === 'function') {
    const f = exp;
    exp = arg => {
      if (typeof arg === 'number') arg = new Number(arg);
      if (typeof arg === 'string') arg = new String(arg);
      return natural(f(arg));
    };
  } else if (exp instanceof Array) {
    exp = exp.map(natural);
  } else if (exp instanceof Object) {
    exp = Object.keys(exp).reduce((obj, key) => _extends({}, obj, { [key]: natural(exp[key]) }), {});
  }
  return exp;
}

function run(block, scope) {
  return Array.prototype.reduce.call(block, ($_, elem) => {
    const v = n => {
      if (n === null) return n;
      if (n instanceof Number) return n;
      if (n instanceof String) return n;
      if (n instanceof Array) return n;
      if (n instanceof Object) return n;
      if (n instanceof Function) return n;
      if (n === 'true') return true;
      if (n === 'false') return false;
      if (n === true || n === false) return n;
      if (n instanceof Boolean) return n.valueOf();
      [, n] = n.match(/^\s*(.*)\s*$/);
      if (n === '$_') return $_;
      if (scope[n] !== undefined) return scope[n];
      throw new ReferenceError(`Variable ${n} not defined`);
    };
    switch (elem.nodeName) {
      case '#text':
        // untyped text
        if (elem.textContent.replace(/\s/g, '').length === 0) return $_;
        return elem.textContent;
      case 'TEMPLATE':
        // functions
        const _scope = _extends({}, scope);
        const f = argument => run(document.importNode(elem.content, true).childNodes, _extends({}, _scope, { argument }));
        if (elem.getAttribute('id')) scope[elem.getAttribute('id')] = _scope[elem.getAttribute('id')] = f;
        return f;
      case 'VAR':
        // variable assignment
        return scope[elem.getAttribute('name')] = v(run(elem.childNodes, _extends({}, scope)));
      case 'OUTPUT':
        // export
        const val = v(run(elem.childNodes, _extends({}, scope)));
        outputs[elem.getAttribute('name')] = natural(val);
        return val;
      case 'Q':
        // string
        return new String(run(elem.childNodes, _extends({}, scope)));
      case 'I':
        // number
        return new Number(run(elem.childNodes, _extends({}, scope)));
      case 'B':
        // boolean
        const bool = run(elem.childNodes, _extends({}, scope));
        if (bool === 'true') return new Boolean(true);
        if (bool === 'false') return new Boolean(false);
        return new Boolean(bool);
      case 'DEL':
        return new Boolean(!v(run(elem.childNodes, _extends({}, scope))));
      case 'A':
        // addition
        let list = run(elem.childNodes, _extends({}, scope));
        if (typeof list[0] === 'number') {
          return new Number(list.reduce((a, b) => a + v(b), 0));
        } else {
          return new String(list.reduce((a, b) => a + v(b), ''));
        }
      case 'S':
        // subtraction
        return new Number(run(elem.children, _extends({}, scope)).reduce((a, b) => a === null ? v(b) : a - v(b), null));
      case 'DIV':
        // division
        return new Number(run(elem.children, _extends({}, scope)).reduce((a, b) => a === null ? v(b) : a / v(b), null));
      case 'EM':
        // multiplication
        return new Number(run(elem.children, _extends({}, scope)).reduce((a, b) => a * v(b), 1));
      case 'OL':
        // array
        return Array.prototype.map.call(elem.children, li => v(run(li.childNodes, _extends({}, scope))));
      case 'DL':
        // objects
        let dt = elem.firstElementChild;
        const obj = {};
        while (dt !== null) {
          const dd = dt.nextElementSibling;
          if (dd.nodeName !== 'DD' || dt.nodeName !== 'DT') throw new SyntaxError('Malformed object literal');
          obj[v(run(dt.childNodes, _extends({}, scope)))] = v(run(dd.childNodes, _extends({}, scope)));
          dt = dd.nextElementSibling;
        }
        return obj;
      case 'SUB':
        // object property
        const v$ = v($_);
        const sub = v$[v(run(elem.childNodes, _extends({}, scope)))];
        if (typeof sub === 'function') return sub.bind(v$);
        return sub;
      case 'SUP':
        // exponentiation
        return new Number(Math.pow(natural(v($_)), natural(v(run(elem.childNodes, _extends({}, scope))))));
      case 'SMALL':
        // less than
        return new Boolean(natural(v($_)) < natural(v(run(elem.childNodes, _extends({}, scope)))));
      case 'SAMP':
        // equality
        return new Boolean(natural(v($_)) === natural(v(run(elem.childNodes, _extends({}, scope)))));
      case 'ARTICLE':
        // if else
        const b = run(elem.querySelector('header').childNodes, _extends({}, scope));
        const ct = elem.querySelector('main');
        const cf = elem.querySelector('aside');
        if (b.valueOf()) {
          return ct ? v(run(ct.childNodes, _extends({}, scope))) : $_;
        } else {
          return cf ? v(run(cf.childNodes, _extends({}, scope))) : $_;
        }
      case 'INS':
        // function call
        return v($_).call(null, v(run(elem.childNodes, _extends({}, scope))));
      case 'FIELDSET':
        // function call with apply
        return v($_).apply(null, v(run(elem.childNodes, _extends({}, scope))));
      case 'CODE':
        // get some native code
        return window[natural(v(run(elem.childNodes, _extends({}, scope))))];
      case 'SPAN':
      case 'HTMS':
      default:
        // sequencing
        return v(run(elem.childNodes, _extends({}, scope)));
    }
  }, null);
}
outputs['default'] = natural(run(root, scope));
if (root[0].getAttribute('id')) {
  window[root[0].getAttribute('id')] = outputs;
}

/***/ })
/******/ ]);
