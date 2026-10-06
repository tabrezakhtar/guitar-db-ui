import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./theme.css";
import { GuitarProvider } from "./context/GuitarContext";

const rootElement = document.getElementById("root");
const app = (
  <BrowserRouter>
    <GuitarProvider>
      <App />
    </GuitarProvider>
  </BrowserRouter>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}