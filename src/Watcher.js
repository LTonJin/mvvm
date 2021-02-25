import Dep from "./Dep";

export default class Watcher{
  constructor(target, expression, cb) {
    this.target = target;
    this.getter = parsePath(expression);
    this.callback = cb;
    this.value = this.get();
  }

  update() {
    this.run()
  }
  get() {
    Dep.target = this;
    var value = this.getter(this.target);
    Dep.target = null;
    return value;

  }

  run() {
    this.getAndInvoke(this.callback);
  }

  getAndInvoke(cb){
    var value = this.get();
    if(value !== this.value || typeof value === 'object'){
      var oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue);
    }
  }
}

function parsePath(exp) {
  return(obj) => exp.split('.').reduce((prev, item) => prev[item], obj)
}