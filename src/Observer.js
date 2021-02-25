import defineReactive from "./defineReactive.js";
import { def } from './utils.js';
import { arrayMethods } from "./array.js";
import observe from "./observe.js";
import Dep from './Dep.js';

export default class Observer {
  constructor(value) {
    // console.log('我是Observer构造函数', value);
    // 每一个observe实例上都有一个dep实例
    this.dep = new Dep();
    def(value, "__ob__", this, false);
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(value) {
    for (const k in value) {
      defineReactive(value, k);
    }
  }
  observeArray(arr) {
    for (let i = 0,l = arr.length; i < l; i++) {
      observe(arr[i]);
      
    }
  }
}