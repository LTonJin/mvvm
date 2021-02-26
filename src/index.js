
import observe from "./observe.js";
import Watcher from "./Watcher.js";

var obj = {
  a: {
    b: 1
  },
  c: {
    d: {
      m:1
    }
  },
  g: [1,2,3,4,5]
};

observe(obj);
new Watcher(obj, 'c.d.m', function (val, oldVal) {
  console.log(val, oldVal);
  console.log('==========');
})

obj.c.d.m = {};
console.log(obj);