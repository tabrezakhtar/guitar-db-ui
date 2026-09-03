import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./theme.css";
import { GuitarProvider } from "./context/GuitarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GuitarProvider>
      <App />
    </GuitarProvider>
  </BrowserRouter>
);