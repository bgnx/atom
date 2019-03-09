import * as React from "react";
import { Atom } from "../../src/atoms/atom5";

export function connect(Component) {
  const isClass = React.Component.isPrototypeOf(Component);
  return class extends (isClass ? Component : React.Component) {
    constructor(props) {
      super(props);
      this.initialized = false;
      this._cell = new Atom(null, () => {
        if (this.initialized) this.forceUpdate();
        this.initialized = true;
        return isClass ? super.render() : Component(this.props);
      }, () => {
      }, true);
    }
    render() {
      return this._cell.get();
    }
    componentWillUnmount() {
      super.componentWillUnmount();
      this._cell.unsubscribeFromDeps();
    }
  }
}