
import { Atom as Atom5 } from "./atom5";

const firstName = new Atom5("f");
const lastName = new Atom5("l");

const fullName = new Atom5("", () => {
  return firstName.get() + " " + lastName.get()
});
fullName.get();

const label = new Atom5("", () => {
  return "hello " + (firstName.get().length > 5 ? firstName.get() : fullName.get())
});
label.get();
firstName.set("ff");
label.get()
firstName.set("ffffff");
label.get()
