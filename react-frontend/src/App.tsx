import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { FunctionComponent } from "react";
import { Mapping } from "./components/Mapping";
import { theme } from "./theme";

export const App: FunctionComponent = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Mapping />
    </MuiThemeProvider>
  );
}

