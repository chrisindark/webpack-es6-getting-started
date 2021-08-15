import React from "react";
import {BrowserRouter as Router} from "react-router-dom";

import ButtonComponent from "../components";

export default function App() {
  return (
    <Router>
      <div className="App">
        App Component loaded
        <ButtonComponent></ButtonComponent>
      </div>
    </Router>
  );
}
