import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals.js"

const root_id = document.getElementById("root");
const root = ReactDOM.createRoot(root_id);
root.render(<App />);

reportWebVitals();
