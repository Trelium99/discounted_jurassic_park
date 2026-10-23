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
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  function refreshActivity(fromClick = false) {
    getActivity().then((data) => {
      setActivity(data);
      if (fromClick) {
        setToast({ id: Date.now(), text: "Feed refreshed" });
      }
    }).catch(() => {
      if (fromClick) {
        setToast({ id: Date.now(), text: "Could not refresh the feed" });
      }
    });
  }

  useEffect(() => {
    refreshActivity();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  console.log(activity);
  const feedRefreshed = toast?.text === "Feed refreshed"
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
            <Box
              as="button"
              onClick={() => refreshActivity(true)}
              px="1rem"
              py="0.4rem"
              border="1px solid"
              borderColor="#7ecbff"
              borderRadius="md"
              color="#7ecbff"
              bg="#0a122e"
              cursor="pointer"
              fontFamily="Share Tech Mono, ui-monospace, Consolas, monospace"
              boxShadow="0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
            >
              Refresh feed
            </Box>
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
              unapplied={activity?.unappliedMaintenance ?? []}
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
        {toast && (
          <Box
            key={toast.id}
            position="fixed"
            top="1.25rem"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
            display="flex"
            alignItems="center"
            gap="0.45rem"
            bg="#0a122e"
            border="1px solid"
            borderColor={feedRefreshed ? "#39ff14" : "#7ecbff"}
            borderRadius="md"
            px="1rem"
            py="0.55rem"
            color={feedRefreshed ? "#39ff14" : "#7ecbff"}
            fontFamily="Share Tech Mono, ui-monospace, Consolas, monospace"
            boxShadow={feedRefreshed
              ? "0 0 6px #39ff14, 0 0 18px rgba(57, 255, 20, 0.75)"
              : "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"}
          >
            {feedRefreshed && (
              <Box as="span" display="inline-flex" w="1rem" h="1rem">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M13.2 8A5.2 5.2 0 0 1 4.4 11.6" />
                  <path d="M2.8 8A5.2 5.2 0 0 1 11.6 4.4" />
                  <path d="M11.2 2.6v2.6h2.6" />
                  <path d="M4.8 13.4V10.8H2.2" />
                </svg>
              </Box>
            )}
            {toast.text}
          </Box>
        )}
      </Box>
    </>
  );
}

export default App;
