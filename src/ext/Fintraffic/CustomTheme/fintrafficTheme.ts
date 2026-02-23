import '@fintraffic/fds-coreui-css/dist/fonts-public-sans.css';
import { createTheme } from '@mui/material/styles';

// Fintraffic Design System (FDS) color tokens
const fdsColors = {
  brandBlack: '#000000',
  brandWhite: '#ffffff',
  brandTurquoise: '#00FFCD',

  interactive50: '#EFF8FF',
  interactive100: '#90cefe',
  interactive200: '#1777f8',
  interactive300: '#0034ac',
  interactive400: '#001c5b',

  danger50: '#FFF0ED',
  danger100: '#ff9b87',
  danger200: '#e55636',
  danger300: '#b40000',
  danger400: '#720000',

  success50: '#EAFFF8',
  success100: '#82e8c3',
  success200: '#25a794',
  success300: '#005f61',
  success400: '#004042',

  warning50: '#FFFADB',
  warning100: '#ffe37f',
  warning200: '#eec200',
  warning300: '#b47324',
  warning400: '#6c3e05',

  neutral50: '#F6F6F6',
  neutral100: '#cdcdd7',
  neutral200: '#9696aa',
  neutral300: '#505064',
  neutral400: '#2c2c44',

  text1: '#ffffff',
  text300: '#9696aa',
  text600: '#505064',
  text1000: '#000000',
};

export const fintrafficTheme = createTheme({
  palette: {
    primary: {
      main: fdsColors.brandBlack,
      light: fdsColors.neutral200,
      dark: fdsColors.neutral400,
      contrastText: fdsColors.brandWhite,
    },
    secondary: {
      main: fdsColors.interactive200,
      light: fdsColors.interactive100,
      dark: fdsColors.interactive300,
      contrastText: fdsColors.brandWhite,
    },
    error: {
      main: fdsColors.danger300,
      light: fdsColors.danger100,
      dark: fdsColors.danger400,
      contrastText: fdsColors.brandWhite,
    },
    warning: {
      main: fdsColors.warning200,
      light: fdsColors.warning100,
      dark: fdsColors.warning300,
      contrastText: fdsColors.brandBlack,
    },
    success: {
      main: fdsColors.success200,
      light: fdsColors.success100,
      dark: fdsColors.success300,
      contrastText: fdsColors.brandWhite,
    },
    info: {
      main: fdsColors.interactive200,
      light: fdsColors.interactive50,
      dark: fdsColors.interactive300,
      contrastText: fdsColors.brandWhite,
    },
    background: {
      default: fdsColors.brandWhite,
      paper: fdsColors.brandWhite,
    },
    text: {
      primary: fdsColors.text1000,
      secondary: fdsColors.text600,
      disabled: fdsColors.text300,
    },
    divider: fdsColors.neutral200,
  },
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    h1: {
      fontSize: '42px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    h2: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    h3: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    h4: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    h6: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '110%',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '150%',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '150%',
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '22px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '150%',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontFamily: '"Public Sans", "PublicSans-Medium", sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '0px',
          lineHeight: '22px',
          transition: 'all 200ms',
        },
        containedPrimary: {
          backgroundColor: fdsColors.brandBlack,
          color: fdsColors.brandWhite,
          '&:hover': {
            backgroundColor: fdsColors.interactive200,
            color: fdsColors.brandWhite,
          },
        },
        containedSecondary: {
          backgroundColor: fdsColors.interactive200,
          color: fdsColors.brandWhite,
          '&:hover': {
            backgroundColor: fdsColors.interactive300,
          },
        },
        containedError: {
          backgroundColor: fdsColors.danger300,
          color: fdsColors.brandWhite,
          '&:hover': {
            backgroundColor: fdsColors.danger400,
          },
        },
        outlinedPrimary: {
          borderColor: fdsColors.brandBlack,
          borderWidth: 2,
          color: fdsColors.brandBlack,
          '&:hover': {
            backgroundColor: fdsColors.interactive200,
            borderColor: 'transparent',
            color: fdsColors.brandWhite,
          },
        },
        textPrimary: {
          color: fdsColors.brandBlack,
          '&:hover': {
            backgroundColor: fdsColors.interactive200,
            color: fdsColors.brandWhite,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: fdsColors.interactive200,
            color: fdsColors.brandWhite,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: fdsColors.neutral200,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: fdsColors.neutral200,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: fdsColors.interactive200,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: fdsColors.danger300,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: fdsColors.brandBlack,
          '&.Mui-checked': {
            color: fdsColors.interactive200,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: fdsColors.brandBlack,
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#acd7f1',
            color: fdsColors.brandBlack,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e1eff8',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: fdsColors.brandBlack,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: fdsColors.interactive300,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#e1eff8',
          color: fdsColors.brandBlack,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderColor: fdsColors.neutral200,
            '&.Mui-selected': {
              backgroundColor: fdsColors.interactive200,
              borderColor: 'transparent',
              color: fdsColors.brandWhite,
            },
            '&:hover': {
              backgroundColor: fdsColors.interactive200,
              borderColor: 'transparent',
              color: fdsColors.brandWhite,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: fdsColors.brandBlack,
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
          fontFamily: '"Public Sans", sans-serif',
        },
      },
    },
  },
});
