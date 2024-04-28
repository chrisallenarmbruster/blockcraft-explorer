/*
  File: index.jsx
  Description: Starting point for React application (gets injected into index.html). 
  Redux store, client router, component entry point and style imports can be found in this file.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./override.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
