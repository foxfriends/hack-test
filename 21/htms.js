'use strict';
const root = document.querySelectorAll('[is="htms"],htms');
const scope = {};
const outputs = {};

function natural(value) {
  if(value === null) return null;
  let exp = value.valueOf();
  if(typeof exp === 'function') {
    const f = exp;
    exp = arg => {
      if(typeof arg === 'number') arg = new Number(arg);
      if(typeof arg === 'string') arg = new String(arg);
      return natural(f(arg));
    };
  } else if(exp instanceof Array) {
    exp = exp.map(natural);
  } else if(exp instanceof Object) {
    exp = Object.keys(exp).reduce((obj, key) => ({ ...obj, [key]: natural(exp[key]) }), {});
  }
  return exp;
}

function run(block, scope) {
  return Array.prototype.reduce.call(block, ($_, elem) => {
    const v = n => {
      if(n === null) return n;
      if(n instanceof Number) return n;
      if(n instanceof String) return n;
      if(n instanceof Array) return n;
      if(n instanceof Object) return n;
      if(n instanceof Function) return n;
      if(n === 'true') return true;
      if(n === 'false') return false;
      if(n === true || n === false) return n;
      if(n instanceof Boolean) return n.valueOf();
      [, n] = n.match(/^\s*(.*)\s*$/);
      if(n === '$_') return $_;
      if(scope[n] !== undefined) return scope[n];
      throw new ReferenceError(`Variable ${n} not defined`);
    };
    switch(elem.nodeName) {
      case '#text':
        // untyped text
        if(elem.textContent.replace(/\s/g, '').length === 0) return $_;
        return elem.textContent;
      case 'TEMPLATE':
        // functions
        const _scope = { ...scope };
        const f = argument => run(document.importNode(elem.content, true).childNodes, { ..._scope, argument });
        if(elem.getAttribute('id'))
          scope[elem.getAttribute('id')] = _scope[elem.getAttribute('id')] = f;
        return f;
      case 'VAR':
        // variable assignment
        return scope[elem.getAttribute('name')] = v(run(elem.childNodes, { ...scope }));
      case 'OUTPUT':
        // export
        const val = v(run(elem.childNodes, { ...scope }));
        outputs[elem.getAttribute('name')] = natural(val);
        return val;
      case 'Q':
        // string
        return new String(run(elem.childNodes, { ...scope }));
      case 'I':
        // number
        return new Number(run(elem.childNodes, { ...scope }));
      case 'B':
        // boolean
        const bool = run(elem.childNodes, { ...scope });
        if(bool === 'true') return new Boolean(true);
        if(bool === 'false') return new Boolean(false);
        return new Boolean(bool);
      case 'DEL':
        return new Boolean(!v(run(elem.childNodes, { ...scope })));
      case 'A':
        // addition
        let list = run(elem.childNodes, { ...scope });
        if(typeof list[0] === 'number') {
          return new Number(list.reduce((a, b) => a + v(b), 0));
        } else {
          return new String(list.reduce((a, b) => a + v(b), ''));
        }
      case 'S':
        // subtraction
        return new Number(run(elem.children, { ...scope }).reduce((a, b) => a === null ? v(b) : a - v(b), null));
      case 'DIV':
        // division
        return new Number(run(elem.children, { ...scope }).reduce((a, b) => a === null ? v(b) : a / v(b), null));
      case 'EM':
        // multiplication
        return new Number(run(elem.children, { ...scope }).reduce((a, b) => a * v(b), 1));
      case 'OL':
        // array
        return Array.prototype.map.call(elem.children, li => v(run(li.childNodes, { ...scope })));
      case 'DL':
        // objects
        let dt = elem.firstElementChild
        const obj = {};
        while(dt !== null) {
          const dd = dt.nextElementSibling;
          if(dd.nodeName !== 'DD' || dt.nodeName !== 'DT') throw new SyntaxError('Malformed object literal');
          obj[v(run(dt.childNodes, { ...scope }))] = v(run(dd.childNodes, { ...scope }));
          dt = dd.nextElementSibling;
        }
        return obj;
      case 'SUB':
        // object property
        const v$ = v($_);
        const sub = v$[v(run(elem.childNodes, { ...scope }))];
        if(typeof sub === 'function') return sub.bind(v$);
        return sub;
      case 'SUP':
        // exponentiation
        return new Number(Math.pow(natural(v($_)), natural(v(run(elem.childNodes, { ...scope })))));
      case 'SMALL':
        // less than
        return new Boolean(natural(v($_)) < natural(v(run(elem.childNodes, { ...scope }))));
      case 'SAMP':
        // equality
        return new Boolean(natural(v($_)) === natural(v(run(elem.childNodes, { ...scope }))));
      case 'ARTICLE':
        // if else
        const b = run(elem.querySelector('header').childNodes, { ...scope });
        const ct = elem.querySelector('main');
        const cf = elem.querySelector('aside');
        if(b.valueOf()) {
          return ct ? v(run(ct.childNodes, { ...scope })) : $_;
        } else {
          return cf ? v(run(cf.childNodes, { ...scope })) : $_;
        }
      case 'INS':
        // function call
        return v($_).call(null, v(run(elem.childNodes, { ...scope })));
      case 'FIELDSET':
        // function call with apply
        return v($_).apply(null, v(run(elem.childNodes, { ...scope })));
      case 'CODE':
        // get some native code
        return window[natural(v(run(elem.childNodes, { ...scope })))];
      case 'SPAN':
      case 'HTMS':
      default:
        // sequencing
        return v(run(elem.childNodes, { ...scope }));
    }
  }, null);
}
outputs['default'] = natural(run(root, scope));
if(root[0].getAttribute('id')) {
  window[root[0].getAttribute('id')] = outputs;
}
