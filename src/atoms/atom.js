export class Atom {
  constructor(val) {
    this.value = val;
    this.subs = new Set();
  }
  get() {
    return this.value;
  }
  set(val) {
    if (this.value !== val) {
      this.value = val;
      this.subs.forEach(fn => fn());
    }
  }
  subscribe(fn) {
    this.subs.add(fn);
  }
  unsubscribe(fn) {
    this.subs.delete(fn);
  }
}