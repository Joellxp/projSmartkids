import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App";
import "@fontsource/nunito";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <AppWrapper />
  </ThemeProvider>
);
