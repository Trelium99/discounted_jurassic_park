import { Box, Text } from "@chakra-ui/react";


export default function AccidentCounter() {
  return (
    <Box>
        <Text fontSize="2xl" fontWeight="normal" fontFamily="Share Tech Mono, ui-monospace, Consolas, monospace">
            <span style={{ color: "#7ecbff", textShadow: "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)" }}>
                Number of accidents:
            </span>{" "}
            <span style={{ color: "#ff3b3b" }}>8</span>
        </Text>
    </Box>
  );
}