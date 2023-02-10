import { createMuiTheme, createTheme } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const palette : PaletteOptions = {
  type: "light",
  primary: {
    main: "#212121"
  },
  background: {
    default: "#eee"
  },
}

export const theme = createTheme({ palette })

