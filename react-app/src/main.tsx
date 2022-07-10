import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ProStakersProvider } from "./contexts/ProStakersContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProStakersProvider>
      <App />
    </ProStakersProvider>
  </React.StrictMode>
);
