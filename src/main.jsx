import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./theme.css";
import { GuitarProvider } from "./context/GuitarContext";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = (e) => {
  document.documentElement.classList.toggle("dark", e.matches);
};

applyTheme(mediaQuery);
mediaQuery.addEventListener("change", applyTheme);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GuitarProvider>
      <App />
    </GuitarProvider>
  </BrowserRouter>
);