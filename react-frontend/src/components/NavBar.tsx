import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { DriveEta } from "@material-ui/icons";
import { FunctionComponent } from "react";

export const NavBar: FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
        >
          <DriveEta />
        </IconButton>
        <Typography variant="h6">Code Delivery</Typography>
      </Toolbar>
    </AppBar>
  )
}
