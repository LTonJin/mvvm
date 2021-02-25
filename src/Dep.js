export default class Dep{
  constructor(){
    // console.log('Dep');
    this.subs = []; // Watcher实例
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  depend() {
    if(Dep.target) {
      this.addSub(Dep.target);
    }
  }

  notify() {
    console.log('notify');
    for (let i = 0, l= this.subs.length; i < l; i++) {
      this.subs[i].update();
      
    }
  }
}