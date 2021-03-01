class Mvvm {
  constructor(options) {
    this.$options = options;
    this._data = this.$options.data;
    observe(this._data);

    for (const k in this._data) {
      if (this._data.hasOwnProperty(k)) {
        Object.defineProperty(this, k, {
          enumerable: true,
          configurable: true,
          get() {
            return Reflect.get(this._data, k);
          },
          set(newVal) {
            Reflect.set(this._data, k, newVal);
          },
        });
      }
    }

    new Compiler(options.el, this);
  }
}

class Observer {
  dep = new Dep();
  constructor(data) {
    var _this = this;
    for (const k in data) {
      let val = data[k];
      observe(val);
      if (data.hasOwnProperty(k)) {
        Object.defineProperty(data, k, {
          enumerable: true,
          configurable: true,
          get() {
            Dep.target && _this.dep.addSub(Dep.target);
            return val;
          },
          set(newVal) {
            val = newVal;
            observe(newVal);
            _this.dep.notify();
          },
        });
      }
    }
  }
}

function observe(data) {
  if (typeof data !== "object") return;
  return new Observer(data);
}

class Compiler {
  constructor(el, vm) {
    this.vm = vm;
    vm.$el = document.querySelector(el);
    var fragmentContainer = document.createDocumentFragment();

    var child;
    while ((child = vm.$el.firstChild)) {
      fragmentContainer.appendChild(child);
    }
    this.replace(fragmentContainer);
    vm.$el.appendChild(fragmentContainer);
  }

  replace(node) {
    node.childNodes.forEach((el) => {
      let text = el.textContent;
      let reg = /\{\{(.*)\}\}/;
      if (el.nodeType === 3 && reg.test(text)) {
        var exp = RegExp.$1.trim();
        var val = expParse(exp, this.vm._data);
        el.textContent = text.replace(reg, val);

        new Watcher(this.vm, exp, function (newVal) {
          el.textContent = text.replace(reg, newVal);
        });
      }
      if (el.nodeType === 1) {
        for (const {name, value} of el.attributes) {
          if (name === 'v-model') {
            var val = expParse(value, this.vm._data);
            el.value = val;
            new Watcher(this.vm, value, function (newVal) {
              el.value = newVal;
            });
            el.addEventListener('input', (event) => {
              let val = event.target.value;
              setExp(value, this.vm, val);
            })
          }
        }
      }
      if (el.childNodes) {
        this.replace(el);
      }
    });
  }
}

function expParse(exp, obj) {
  return exp.split(".").reduce((prev, k) => {
    return prev[k];
  }, obj);
}

function setExp(exp, obj, newVal) { //a.b=2 {a:{b:1}} [a ,b]
  var arr = exp.split(".")
  var val = arr.slice(0, -1).reduce((prev, k) => {
    return prev[k];
  },obj);
  console.log(val);
  var key = arr.slice(-1).join("");
  val[key] = newVal;
}

class Watcher {
  constructor(vm, exp, fn) {
    this.vm = vm;
    this.exp = exp;
    this.fn = fn;
    Dep.target = this;
    expParse(this.exp, this.vm); // 触发getter，然后在getter中收集依赖(Dep.target)
    Dep.target = null;
  }

  update() {
    var val = expParse(this.exp, this.vm);
    this.fn(val);
  }
}

class Dep {
  subs = [];

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((w) => {
      w.update();
    });
  }
}

