import { createTheme } from '@mui/material/styles';

// Entur brand colors
const enturColors = {
  brandBlue: '#181c56',
  brandLavender: '#aeb7e2',
  brandWhite: '#ffffff',
  brandCoral: '#ff5959',
  brandPeach: '#ffbf9e',

  // Validation / semantic colors
  sky: '#0082b9',
  skyTint: '#e1eff8',
  lava: '#d31b1b',
  lavaTint: '#ffcece',
  mint: '#1a8e60',
  mintTint: '#d0f1e3',
  canary: '#ffca28',
  canaryTint: '#fff4cd',

  // Blues
  blue10: '#292b6a',
  blue20: '#393d79',
  blue30: '#54568c',
  blue50: '#8285a8',
  blue60: '#babbcf',
  blue70: '#d1d4e3',
  blue80: '#ebebf1',
  blue90: '#f5f5f8',

  // Greys
  grey: '#121212',
  grey30: '#4d4d4d',
  grey40: '#646464',
  grey50: '#949494',
  grey60: '#d1d3d3',
  grey70: '#e9e9e9',
  grey80: '#f3f3f3',
  grey90: '#f8f8f8',
};

const theme = createTheme({
  palette: {
    primary: {
      main: enturColors.brandBlue,
      light: enturColors.blue50,
      dark: enturColors.blue10,
      contrastText: enturColors.brandWhite,
    },
    secondary: {
      main: enturColors.brandLavender,
      light: enturColors.blue70,
      dark: enturColors.blue30,
      contrastText: enturColors.brandBlue,
    },
    error: {
      main: enturColors.lava,
      light: enturColors.lavaTint,
      dark: '#b71515',
      contrastText: enturColors.brandWhite,
    },
    warning: {
      main: enturColors.canary,
      light: enturColors.canaryTint,
      dark: '#c9a020',
      contrastText: enturColors.grey,
    },
    success: {
      main: enturColors.mint,
      light: enturColors.mintTint,
      dark: '#14714d',
      contrastText: enturColors.brandWhite,
    },
    info: {
      main: enturColors.sky,
      light: enturColors.skyTint,
      dark: '#006690',
      contrastText: enturColors.brandWhite,
    },
    background: {
      default: enturColors.brandWhite,
      paper: enturColors.brandWhite,
    },
    text: {
      primary: enturColors.grey,
      secondary: enturColors.grey40,
      disabled: enturColors.grey50,
    },
    divider: enturColors.grey60,
  },
  typography: {
    fontFamily:
      '"Nationale", Arial, "Gotham Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '34px',
      fontWeight: 600,
      lineHeight: '42px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: '36px',
    },
    h3: {
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: '30px',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
    },
    h5: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '22px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '22px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '22px',
    },
    subtitle1: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '22px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '18px',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: enturColors.brandBlue,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: enturColors.grey90,
            cursor: 'pointer',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;
