import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import Home from "./UI/pages/Home";
import { StylesContextProvider } from "./UI/context/styles.context";

const UI: React.FC = () => {


  return (
    <StylesContextProvider>
      <Home />
    </StylesContextProvider>
  )
};

const root = ReactDOM.createRoot(document.getElementById("react-page"));

root.render(<UI />);
