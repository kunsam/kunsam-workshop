import * as React from "react";
import * as ReactDom from "react-dom";
import "./index.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

ReactDom.render(<App />, document.getElementById("app"));
