const Stack = [];
const NeedRecompute = [];

export class Atom2 {
  constructor(val, fn, active = false) {
    this.value = val;
    this.subs = new Set();

    this.fn = fn;
    this.deps = new Set();
    this.oldDeps = null;

    this.active = active;
    this.state = this.fn ? "dirty" : "actual";
  }
  get() {
    if (this.state !== "actual") this.actualize();
    if (Stack.length > 0) {
      Stack[Stack.length - 1].addDep(this);
    }
    return this.value;
  }
  set(val) {
    if (this.value !== val) {
      this.value = val;
      this.subs.forEach(atom => {
        atom.mark(true)
      });
      runComputation();
    }
  }
  subscribe(fn) {
    this.subs.add(fn);
  }
  unsubscribe(fn) {
    this.subs.delete(fn);
    if (this.subs.size === 0) this.unsubscribeFromDeps()
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
        atom.unsubscribe(this);
      }
    }
    for (const atom of this.deps) {
      if (!this.oldDeps.has(atom)) {
        atom.subscribe(this);
      }
    }
    this.set(newVal);
  }
  unsubscribeFromDeps() {
    this.deps.forEach(dep => dep.unsubscribe(this.recompute));
  }

  mark(dirty) {
    this.state = dirty ? "dirty" : "check";
    if(this.state === "active"){
      if (this.active) {
        NeedRecompute.push(this);
      } else {
        this.subs.forEach(atom => {
          atom.mark(false)
        });
      }
    }
  }
  actualize() {
    if (this.state === "check") {
      for (const dep of this.deps) {
        dep.actualize();
        if (this.state === "dirty") break;
      }
    }
    if (this.state === "dirty") this.recompute();
    this.state = "actual";
  }
}

function runComputation() {
  while (NeedRecompute.length) {
    const atoms = NeedRecompute.splice(0);
    for (const atom of atoms) {
      if (atom.state !== "actual") {
        atom.actualize();
      }
    }
  }
}