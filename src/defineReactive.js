import observe from "./observe.js";
import Dep from "./Dep.js";

export default function defineReactive(obj, key, val) {
  // console.log(key, "====key===");
  var dep = new Dep();
  if (arguments.length === 2) {
    val = obj[key];
  }
  // 递归的流程 index入口调用observe -> new Observer -> defineReactive -> observe
  let childOb = observe(val);

  Object.defineProperty(obj, key, {
    get() {
      console.log("获取：", key, val);
      if (Dep.target) {
        dep.depend();
        if(childOb) {
          childOb.dep.depend();
        }
      }
      return val;
    },
    set(newval) {
      console.log("设置:", key, newval);
      val = newval;
      childOb = observe(newval);
      dep.notify();
    },
  });
}
