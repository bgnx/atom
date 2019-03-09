
import { Atom } from "./atom";
import { Atom2 } from "./atom2";

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

test("atom computed", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  const fullName = new Atom("", () => firstName.get() + " " + lastName.get());
  expect(fullName.get()).toBe("f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
});

test("atom chain", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  const fullName = new Atom("", () => firstName.get() + " " + lastName.get());
  const label = new Atom("", () => {
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  });
  expect(label.get()).toBe("hello f l");
  firstName.set("ff");
  expect(fullName.get()).toBe("ff l");
  expect(label.get()).toBe("hello ff l");
})

test("atom romb glitch", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom("", () => {
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

test("atom deep romb glitch", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  });
  expect(fullName.get()).toBe("f l");

  const labeledFullNameJestFn = jest.fn();
  const labeledFullName = new Atom("", ()=>{
    labeledFullNameJestFn();
    return "new " + fullName.get();
  });
  expect(labeledFullName.get()).toBe("new f l");

  const labelJestFn = jest.fn();
  const label = new Atom("", () => {
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


test("atom condition glitch  - fullName doesn't recompute if not needed", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  }, false);
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  }, true);
  expect(label.get()).toBe("hello f l");
  //check values for false if-branch //fullName.get()
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);

  //change to true if-brach //firstName.get()
  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");

  //check fullName computation for true if-branch //firstName.get()
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("fffffff");
  expect(label.get()).toBe("hello fffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});


test("atom complex condition glitch  - fullName doesn't recompute after deps change", () => {
  const firstName = new Atom("f");
  const lastName = new Atom("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  }, false);
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  }, true);
  expect(label.get()).toBe("hello f l");

  //check values for false if-branch //fullName.get() 
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);

  //check fullName computation when if-branch was changed //from fullName.get() to firstName.get()
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});

test("but atom2 solves complex condition glitch when fullName doesn't recompute after deps change", () => {
  const firstName = new Atom2("f");
  const lastName = new Atom2("l");
  
  const fullNameJestFn = jest.fn();
  const fullName = new Atom2("", () => {
    fullNameJestFn();
    return firstName.get() + " " + lastName.get()
  }, false);
  expect(fullName.get()).toBe("f l");

  const labelJestFn = jest.fn();
  const label = new Atom2("", () => {
    labelJestFn();
    return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
  }, true);
  expect(label.get()).toBe("hello f l");

  //check values for false if-branch //fullName.get() 
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ff");
  expect(label.get()).toBe("hello ff l");
  expect(fullNameJestFn.mock.calls.length).toBe(1);
  expect(labelJestFn.mock.calls.length).toBe(1);

  //check fullName computation when if-branch was changed //from fullName.get() to firstName.get()
  fullNameJestFn.mockClear();
  labelJestFn.mockClear();
  firstName.set("ffffff");
  expect(label.get()).toBe("hello ffffff");
  expect(fullNameJestFn.mock.calls.length).toBe(0);
  expect(labelJestFn.mock.calls.length).toBe(1);

});