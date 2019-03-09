import { Atom } from "./atom";
import { Atom as Atom2 } from "./atom2";
import { Atom as Atom3 } from "./atom3";
import { Atom as Atom4 } from "./atom4";
import { Atom as Atom5 } from "./atom5";

test("atom constructor and get", () => {
  const atom = new Atom("x");
  expect(atom.get()).toBe("x");
});

test("atom set", () => {
  const atom = new Atom("x");
  expect(atom.get()).toBe("x");
  atom.set("xx");
  expect(atom.get()).toBe("xx");
});

test("atom subscribe, unsubscribe", () => {
  const atom = new Atom("x");
  const sub = jest.fn();
  atom.subscribe(sub);
  atom.set("x");
  expect(sub.mock.calls.length).toBe(0);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
  atom.unsubscribe(sub);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
});






test("atom2 constructor and get", () => {
  const atom = new Atom2("x");
  expect(atom.get()).toBe("x");
});

test("atom2 set", () => {
  const atom = new Atom2("x");
  expect(atom.get()).toBe("x");
  atom.set("xx");
  expect(atom.get()).toBe("xx");
});

test("atom2 subscribe, unsubscribe", () => {
  const atom = new Atom2("x");
  const sub = jest.fn();
  atom.subscribe(sub);
  atom.set("x");
  expect(sub.mock.calls.length).toBe(0);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
  atom.unsubscribe(sub);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
});


test("atom2 computed", () => {
  const firstName = new Atom2("f");
  const lastName = new Atom2("l");
  const fullName = new Atom2("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
});


test("atom2 chain", () => {
  const firstName = new Atom2("f");
  const lastName = new Atom2("l");
  const fullName = new Atom2("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  const label = new Atom2("", () => {
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
  expect(label.get()).toBe("hello ff l");
})







test("atom3 constructor and get", () => {
  const atom = new Atom3("x");
  expect(atom.get()).toBe("x");
});

test("atom3 set", () => {
  const atom = new Atom3("x");
  expect(atom.get()).toBe("x");
  atom.set("xx");
  expect(atom.get()).toBe("xx");
});

test("atom3 subscribe, unsubscribe", () => {
  const atom = new Atom3("x");
  const sub = jest.fn();
  atom.subscribe(sub);
  atom.set("x");
  expect(sub.mock.calls.length).toBe(0);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
  atom.unsubscribe(sub);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
});


test("atom3 computed", () => {
  const firstName = new Atom3("f");
  const lastName = new Atom3("l");
  const fullName = new Atom3("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
});


test("atom3 chain", () => {
  const firstName = new Atom3("f");
  const lastName = new Atom3("l");
  const fullName = new Atom3("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  const label = new Atom3("", () => {
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
  expect(label.get()).toBe("hello ff l");
})


test("atom3 romb glitch", () => {
  const firstName = new Atom3("f");
  const lastName = new Atom3("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom3("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom3("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);
});

test("atom3 deep romb glitch", () => {
  const firstName = new Atom3("f");
  const lastName = new Atom3("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom3("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labeledFullNameJestFn = jest.fn();
  const labeledFullName = new Atom3("", ()=>{
    labeledFullNameJestFn();
    return "new " + fullName.get();
  });
  expect(labeledFullName.get()).toBe("new f l");

  const labelJestFn = jest.fn();
  const label = new Atom3("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : labeledFullName.get())
  });
  expect(label.get()).toBe("hello new f l");

  fullNameJestFn.mockClear();
  labeledFullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello new ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labeledFullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);
});



test("atom4 condition glitch  - fullName doesn't recompute if not needed", () => {
  const firstName = new Atom4("f");
  const lastName = new Atom4("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom4("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom4("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);


  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("fffffff");
  expect(label.get()).toBe("hello fffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});

test("atom4 deep condition glitch  - fullName doesn't recompute if not needed", () => {
  const firstName = new Atom4("f");
  const lastName = new Atom4("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom4("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labeledFullNameJestFn = jest.fn();
  const labeledFullName = new Atom4("", ()=>{
    labeledFullNameJestFn();
    return "new " + fullName.get();
  });
  expect(labeledFullName.get()).toBe("new f l");

  const labelJestFn = jest.fn();
  const label = new Atom4("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : labeledFullName.get())
  });
  expect(label.get()).toBe("hello new f l");

  fullNameJestFn.mockClear();
  labeledFullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello new ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labeledFullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);


  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");

  fullNameJestFn.mockClear();
  labeledFullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("fffffff");
  expect(label.get()).toBe("hello fffffff");
  expect(labeledFullNameJestFn.mock.calls.length).toBe(0);
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});






test("atom5 constructor and get", () => {
  const atom = new Atom5("x");
  expect(atom.get()).toBe("x");
});

test("atom5 set", () => {
  const atom = new Atom5("x");
  expect(atom.get()).toBe("x");
  atom.set("xx");
  expect(atom.get()).toBe("xx");
});

test("atom5 subscribe, unsubscribe", () => {
  const atom = new Atom3("x");
  const sub = jest.fn();
  atom.subscribe(sub);
  atom.set("x");
  expect(sub.mock.calls.length).toBe(0);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
  atom.unsubscribe(sub);
  atom.set("xx");
  expect(sub.mock.calls.length).toBe(1);
});


test("atom5 computed", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  const fullName = new Atom5("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
});


test("atom5 chain", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  const fullName = new Atom5("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  const label = new Atom5("", () => {
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
  expect(label.get()).toBe("hello ff l");
})


test("atom5 romb glitch", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom5("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom5("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);
});



test("atom5 condition glitch  - fullName doesn't recompute if not needed", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom5("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom5("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);


  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");


  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("fffffff");
  expect(label.get()).toBe("hello fffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});


test("atom5 complex condition glitch  - fullName doesn't recompute after deps change", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom5("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom5("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");

  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);


  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});


test("atom5 deep complex condition glitch  - fullName doesn't recompute after deps change", () => {
  const firstName = new Atom5("f");
  const lastName = new Atom5("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom5("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labeledFullNameJestFn = jest.fn();
  const labeledFullName = new Atom5("", ()=>{
    labeledFullNameJestFn();
    return "new " + fullName.get();
  });
  expect(labeledFullName.get()).toBe("new f l");

  const labelJestFn = jest.fn();
  const label = new Atom5("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : labeledFullName.get())
  });
  expect(label.get()).toBe("hello new f l");

  fullNameJestFn.mockClear();
  labeledFullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello new ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labeledFullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);

  fullNameJestFn.mockClear();
  labeledFullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");
  expect(labeledFullNameJestFn.mock.calls.length).toBe(0);
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});