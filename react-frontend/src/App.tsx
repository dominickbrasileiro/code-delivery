import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { Mapping } from "./components/Mapping";
import { theme } from "./theme";

export const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Mapping />
    </MuiThemeProvider>
  );
}

