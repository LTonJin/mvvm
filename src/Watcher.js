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
    // new Watcher的时候会在全局Dep添加new Watcher出来的实例
    Dep.target = this;

    // 这里获取监听对象的值的时候会触发监听对象的get方法，在get方法中收集依赖
    var value = this.getter(this.target);

    // 收集完成之后置空
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