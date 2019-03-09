const Stack = [];
const NeedRecompute = [];

export class Atom {
  constructor(val, fn) {
    this.value = val;
    this.subs = new Set();

    this.fn = fn;
    this.deps = new Set();
    this.oldDeps = null;
    this.recompute.deep = 0;
    if (this.fn) this.recompute();
  }
  get() {
    if (Stack.length > 0) {
      Stack[Stack.length - 1].addDep(this);
    }
    return this.value;
  }
  set(val) {
    if (this.value !== val) {
      this.value = val;
      this.subs.forEach(atom => NeedRecompute.indexOf(atom) === -1 && NeedRecompute.push(atom));
      NeedRecompute.sort((left, right) => right.deep - left.deep);
      if (NeedRecompute.length === this.subs.size) runComputation();
    }
  }
  subscribe(fn) {
    this.subs.add(fn);
  }
  unsubscribe(fn) {
    this.subs.delete(fn);
  }


  addDep(atom) {
    this.deps.add(atom);
  }
  recompute = () => {
    this.oldDeps = this.deps;
    this.deps = new Set();
    Stack.push(this);
    const newVal = this.fn();
    Stack.pop();
    for (const atom of this.oldDeps) {
      if (!this.deps.has(atom)) {
        atom.unsubscribe(this.recompute);
      }
    }
    for (const atom of this.deps) {
      if (!this.oldDeps.has(atom)) {
        atom.subscribe(this.recompute);
      }
    }

    let depsMaxDeep = 0;
    this.deps.forEach(atom => depsMaxDeep = Math.max(atom.recompute.deep, depsMaxDeep));
    this.recompute.deep = depsMaxDeep + 1;
    this.set(newVal);
  }
  unsubscribeFromDeps() {
    this.deps.forEach(dep => dep.unsubscribe(this.recompute));
  }
}

function runComputation() {
  while (NeedRecompute.length) {
    NeedRecompute.pop()();
  }
}