import { alpha, Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import { Loader } from "google-maps";
import { useSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { RouteExistsError } from "../errors/route-exists-error";
import { getCurrentPosition } from "../utils/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../utils/map";
import { Route } from "../utils/models";
import { NavBar } from "./NavBar";
import { io, Socket } from 'socket.io-client'

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  sidebar: {
    borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
  },
  form: {
    margin: "16px"
  },
  btnSubmitWrapper: {
    textAlign: "center",
    marginTop: "8px",
  },
}))

export const Mapping: FunctionComponent = () => {
  const [routes, setRoutes] = useState<Route[]>();
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  const mapRef = useRef<Map>()
  const ioRef = useRef<Socket>()

  const { enqueueSnackbar } = useSnackbar()
  const styles = useStyles()

  useEffect(() => {
    ioRef.current = io(process.env.REACT_APP_API_URL as string)
    ioRef.current.on("connect", () => console.log("socket.io connected"))
    ioRef.current.on("new-position", (payload: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      mapRef.current?.moveCurrentMarker(payload.routeId, {
        lat: payload.position[0],
        lng: payload.position[1]
      })
    })
  })

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/routes`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(json => setRoutes(json))
  }, [])

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

    if (!route) {
      return
    }

    const randomColor = colors[idx % colors.length]

    try {
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

      ioRef.current?.emit("new-direction", {
        routeId: selectedRouteId,
      })
    } catch (error) {
      if (error instanceof RouteExistsError) {
        enqueueSnackbar("Route already started.", {
          variant: "error",
        })
        return
      }

      throw error
    }
  }, [routes, selectedRouteId, enqueueSnackbar])

  return (
    <Grid
      container
      className={styles.root}
    >
      <Grid item xs={12} sm={3} className={styles.sidebar}>
        <NavBar></NavBar>
        <form onSubmit={startRoute} className={styles.form}>
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
            <div className={styles.btnSubmitWrapper}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
              >
                Start route
              </Button>
            </div>
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
