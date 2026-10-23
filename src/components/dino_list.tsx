import { Box, Text } from "@chakra-ui/react"
import type { activeDinoProfile } from "../types/event_types"
import InformationalCard from "./informational_card"

interface DinoListProps {
    dinos: activeDinoProfile[]
}

export default function DinoList({ dinos }: DinoListProps) {
    return (
        <Box ml="2rem" mb="2rem" display="flex" flexDirection="column">
            <Text
                fontSize="2rem"
                fontWeight="bold"
                color="#7ecbff"
                textShadow="0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
                fontFamily="Share Tech Mono, ui-monospace, Consolas, monospace"
            >
                Active Dinos
            </Text>
            {dinos.map((dino) => (
                <InformationalCard key={dino.id} dino={dino} />
            ))}
        </Box>
    )
}