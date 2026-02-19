import { Suspense } from 'react';
import { useConfig } from './config/ConfigContext';
import { useToggledImport } from '@entur/react-component-toggle';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

const ThemeLoader = ({ children }: { children: React.ReactNode }) => {
  const { extPath } = useConfig();
  const theme = useToggledImport<Theme>(`${extPath}/CustomTheme`, () =>
    createTheme(),
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export const EnkiThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Suspense>
    <ThemeLoader>{children}</ThemeLoader>
  </Suspense>
);
