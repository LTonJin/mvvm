import { def } from "./utils";
var rewriteArrayMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

var arrayPrototype = Array.prototype;

export var arrayMethods = Object.create(arrayPrototype);

rewriteArrayMethods.forEach(methodName =>{
  var oldMethod = arrayPrototype[methodName];
  def(arrayMethods, methodName, function () {
    console.log(methodName);
    var ob = this.__ob__;
    var inserted = [];
    switch (methodName) {
      case 'push':
      case 'unshift':
        inserted = arguments;
        break;
      case 'splice':
        inserted = [...arguments].slice(2);
        break;
    }
    if(inserted.length) {
      ob.observeArray(inserted);
    }
    ob.dep.notify();

    var res = oldMethod.apply(this, arguments);
    return res;
  }, false);
})
