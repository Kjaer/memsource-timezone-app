import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/App";

const app = document.getElementById("app");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  app
);
