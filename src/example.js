import { Atom2 } from "./atom2";

const firstName = new Atom2("f");
const lastName = new Atom2("l");

const fullName = new Atom2("", () => {
  console.log("calc fullName");
  return firstName.get() + " " + lastName.get()
}, false);
console.log(fullName.get());

const label = new Atom2("", () => {
  console.log("calc label");
  return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
}, true);
console.log(label.get());

//check values for false if-branch //fullName.get() 
firstName.set("ff");
console.log(label.get());

//check fullName computation when if-branch was changed //from fullName.get() to firstName.get()
firstName.set("ffffff");
console.log(label.get())