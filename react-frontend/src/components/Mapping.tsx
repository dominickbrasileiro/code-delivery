import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Route } from "../utils/models";

export const Mapping = () => {
  const [routes, setRoutes] = useState<Route[]>();
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/routes`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(json => setRoutes(json))
  }, []);

  const startRoute = useCallback((e: FormEvent) => {
    e.preventDefault()
    console.log(`Starting route ${selectedRouteId}...`)
  }, [selectedRouteId])

  return (
    <Grid container >
      <Grid item xs={12} sm={3}>
        <FormControl
          fullWidth
          onSubmit={startRoute}
        >
          <InputLabel
            id="route-select-label"
          >
            Select a route
          </InputLabel>
          <Select
            fullWidth
            value={selectedRouteId ?? ""}
            onChange={(e) => setSelectedRouteId(e.target.value as string)}
            labelId="route-select-label"
          >
            {routes && routes.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                <em>{r.title}</em>
              </MenuItem>
            ))}
          </Select>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
          >
            Start route
          </Button>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" />
      </Grid>
    </Grid>
  );
}
