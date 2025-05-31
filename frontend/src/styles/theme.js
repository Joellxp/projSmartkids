import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6aa839' }, // Verde principal
    secondary: { main: '#f5e9da' }, // Bege claro
    background: { default: '#f8faf5' },
    text: { primary: '#222', secondary: '#555' }
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Nunito', 'Quicksand', 'Poppins', sans-serif"
  }
});

export default theme;