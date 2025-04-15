import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GuitarProvider } from "./context/GuitarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GuitarProvider>
      <App />
    </GuitarProvider>
  </React.StrictMode>
);