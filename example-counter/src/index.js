import * as React from "react";
import * as ReactDOM from "react-dom";
import { Atom } from "../../src/atom";
import { connect } from "./connect";

const AppState = {
  count: new Atom(0)
}

class App extends React.Component {
  componentDidMount() {
    AppState.count.subscribe(this.rerender)
  }
  componentWillUnmount() {
    AppState.count.unsubscribe(this.rerender)
  }
  rerender = () => {
    this.forceUpdate();
  }
  onClick = () => {
    AppState.count.set(AppState.count.get() + 1);
  }
  render() {
    return (
      <div onClick={this.onClick}>
        {AppState.count.get()}
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById("root"));

