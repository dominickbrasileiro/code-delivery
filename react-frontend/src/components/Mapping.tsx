import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Loader } from "google-maps";
import { FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { getCurrentPosition } from "../utils/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../utils/map";
import { Route } from "../utils/models";

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

export const Mapping: FunctionComponent = () => {
  const [routes, setRoutes] = useState<Route[]>();
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  const mapRef = useRef<Map>()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/routes`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(json => setRoutes(json))
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ])

      const $map = document.getElementById("map") as HTMLElement

      mapRef.current = new Map($map, {
        zoom: 15,
        center: {
          lat: position.lat,
          lng: position.long,
        },
      })
    })()
  }, [])

  const startRoute = useCallback((e: FormEvent) => {
    e.preventDefault()

    if (!routes) {
      return
    }


    const idx = routes.findIndex((route) => route.id === selectedRouteId)
    const route = routes[idx]
    const randomColor = colors[idx % colors.length]

    mapRef.current?.addRoute(route.id, {
      currentMarkerOptions: {
        icon: makeCarIcon(randomColor),
        position: {
          lat: route.startPosition.lat,
          lng: route.startPosition.long,
        },
      },
      endMarkerOptions: {
        icon: makeMarkerIcon(randomColor),
        position: {
          lat: route.endPosition.lat,
          lng: route.endPosition.long,
        },
      },
    })
  }, [routes, selectedRouteId])

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid item xs={12} sm={3}>
        <form onSubmit={startRoute}>
          <FormControl
            fullWidth
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
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Grid>
    </Grid>
  );
}
