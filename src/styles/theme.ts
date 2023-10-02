import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
  }
}

declare module '@mui/material/styles' {
  interface PaletteOptions {
    footer: PaletteOptions['primary'];
    default: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      light: '#90EE90',
      main: '#228B22',
      dark: '#2E8B57',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ddd',
      main: '#333',
      dark: '#000',
      contrastText: '#EDF5E1',
    },
    error: {
      light: red[500],
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    footer: {
      light: '#F2F2F7',
      main: '#F2F2F7',
      dark: '#ccc',
      contrastText: '#000',
    },
    default: {
      light: '#ddd',
      main: '#333',
      dark: '#000',
      contrastText: '#fff',
    },
    success: {
      light: '#3cef84',
      main: '#05f766',
      dark: '#00c34e',
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            textTransform: 'none',
            backgroundColor: 'red',
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
  },
});
