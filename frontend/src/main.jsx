import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./localisation.js";
import { AlertProvider } from "./modules/AuthContext.jsx";
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById("root")).render(
  <AlertProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </AlertProvider>
);
