import { Box, Text, Grid, GridItem } from "@chakra-ui/react"
import WallClock from "./components/wall_clock";
import AccidentCounter from "./components/accident_counter";
import { useEffect, useState } from "react";
import { getActivity } from "./api/activity_api";
import MapGrid, { type MapCell } from "./components/map_grid";
import DinoList from "./components/dino_list";
import CellInfo from "./components/cell_info";
import type { activeDinoProfile, maintenanceZone } from "./types/event_types";
import raptor from "./images/Jurassic-Park-Dinosaur-PNG-Free-Image.png";

function buildMapCells(schedule: maintenanceZone[] = [], dinos: activeDinoProfile[] = []): Record<string, MapCell> {
  const cells: Record<string, MapCell> = {}
  for (const zone of schedule) {
    const here = dinos.filter((dino) => dino.last_known_location === zone.location)
    const hungryCarnivore = here.some((dino) => !dino.herbivore && dino.time_til_next_feeding <= 0)
    const digestingCarnivore = here.some((dino) => !dino.herbivore && dino.time_til_next_feeding > 0)
    const dangerous = !zone.is_safe || Boolean(zone.danger_reason) || hungryCarnivore
    const hasWrench = Boolean(zone.needs_maintenance && zone.timestamp)

    if (dangerous) {
      cells[zone.location] = {
        color: "rgba(255, 30, 30, 0.85)",
        icon: hasWrench ? "wrench" : "skull",
      }
      continue
    }
    if (hasWrench) {
      cells[zone.location] = { color: "rgba(57, 255, 20, 0.4)", icon: "wrench" }
      continue
    }
    if (digestingCarnivore) {
      cells[zone.location] = { color: "rgba(255, 140, 0, 0.55)", icon: "warning" }
    }
  }

  for (const dino of dinos) {
    if (!dino.herbivore && dino.time_til_next_feeding <= 0 && dino.last_known_location && !cells[dino.last_known_location]) {
      cells[dino.last_known_location] = { color: "rgba(255, 30, 30, 0.85)", icon: "skull" }
    }
  }
  return cells
}

function App() {
  const [activity, setActivity] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  useEffect(() => {
    getActivity().then((data) => {
      setActivity(data);
    });
  }, []);

  console.log(activity);
  return (
    <>
      <Box position="relative" minH="100vh" w="100vw" bg="#0a122e" display={"flex"} flexDirection="column" alignItems="center" justifyContent="top">
        <Text
          mt={5} 
          fontSize="3rem" 
          fontWeight="bold" 
          style={{ color: "#7ecbff", textShadow: "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)" }}
          fontFamily="Share Tech Mono, ui-monospace, Consolas, monospace">
            Dino Park Maintenance Center
        </Text>

        <Grid 
          templateColumns="repeat(3, 1fr)" 
          gap={4}
          templateRows="repeat(2, 1fr, 2fr)"
          templateAreas={`"header header header"
                          "sidebar main sidebar2"`}
        >
          <GridItem 
            area="header" 
            display={"flex"} 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="top"
            gap={4}
          >
            <WallClock />
            <AccidentCounter />
          </GridItem>
          <GridItem area="sidebar"><DinoList dinos={activity?.dinoProfiles || []} /></GridItem>
          <GridItem area="sidebar2" position="relative" zIndex="1">
            <CellInfo
              location={selectedLocation}
              zone={activity?.maintenanceSchedule?.find((zone: { location: string }) => zone.location === selectedLocation)}
              dinos={(activity?.dinoProfiles || []).filter((dino: { last_known_location: string }) => dino.last_known_location === selectedLocation)}
            />
          </GridItem>
          <GridItem area="main">
            <MapGrid
              selected={selectedLocation}
              onSelect={setSelectedLocation}
              cells={buildMapCells(activity?.maintenanceSchedule, activity?.dinoProfiles)}
            />
          </GridItem>
        </Grid>
        <img
          src={raptor}
          alt=""
          style={{
            position: "absolute",
            right: 0,
            top: "100vh",
            transform: "translateY(-100%)",
            width: "340px",
            height: "auto",
            pointerEvents: "none",
            zIndex: 0,
            marginTop: "10rem",
          }}
        />
      </Box>
    </>
  );
}

export default App;
