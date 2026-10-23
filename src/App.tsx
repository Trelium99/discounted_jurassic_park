import { Box, Text, Grid, GridItem } from "@chakra-ui/react"
import WallClock from "./components/wall_clock";
import AccidentCounter from "./components/accident_counter";
import { useEffect, useState } from "react";
import { getActivity } from "./api/activity_api";
import MapGrid from "./components/map_grid";
import DinoList from "./components/dino_list";

function App() {
  const [activity, setActivity] = useState<any>(null);
  useEffect(() => {
    getActivity().then((data) => {
      setActivity(data);
    });
  }, []);

  console.log(activity);
  return (
    <>
      <Box minH="100vh" w="100vw" bg="#0a122e" display={"flex"} flexDirection="column" alignItems="center" justifyContent="top">
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
          <GridItem area="sidebar2" />
          <GridItem area="main">
            <MapGrid />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

export default App;
