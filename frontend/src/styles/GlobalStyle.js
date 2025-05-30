import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fontFamily};
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  * {
    box-sizing: border-box;
  }
  h1, h2, h3 {
    font-family: 'Poppins', 'Nunito', sans-serif;
    margin-top: 0;
  }
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;