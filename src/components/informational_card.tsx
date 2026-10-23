import { Box, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"
import type { activeDinoProfile } from "../types/event_types"

const BLUE = "#7ecbff"
const RED = "#ff3b3b"
const NEON_GREEN = "#39ff14"
const GLOW = "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
const GREEN_GLOW = "0 0 6px #39ff14, 0 0 18px rgba(57, 255, 20, 0.75)"
const FONT = "Share Tech Mono, ui-monospace, Consolas, monospace"

type InformationalCardProps = {
    dino: activeDinoProfile
}

function Icon({ children, color = BLUE }: { children: ReactNode; color?: string }) {
    return (
        <Box as="span" display="inline-flex" w="1rem" h="1rem" mr="0.45rem" color={color} flexShrink={0}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
                {children}
            </svg>
        </Box>
    )
}

function Row({ icon, label, value, alert = false, accent }: { icon: ReactNode; label: string; value: string; alert?: boolean; accent?: string }) {
    const valueColor = alert ? RED : accent ?? "white"
    const valueGlow = alert ? "0 0 6px #ff2a2a" : accent ? GREEN_GLOW : undefined
    return (
        <Text display="flex" alignItems="center" fontFamily={FONT} fontSize="0.95rem" mt="0.35rem">
            <Icon color={accent}>{icon}</Icon>
            <Box as="span" color={BLUE} textShadow={GLOW}>{label}</Box>
            <Box as="span" ml="0.4rem" color={valueColor} textShadow={valueGlow}>
                {value}
            </Box>
        </Text>
    )
}

function nextFeed(hours: number) {
    if (hours <= 0) {
        return { text: "Hungry", alert: true }
    }
    const rounded = Math.round(hours)
    return { text: `${rounded <= 0 ? "<1" : rounded}h`, alert: false }
}

export default function InformationalCard({ dino }: InformationalCardProps) {
    const feed = nextFeed(dino.time_til_next_feeding)

    return (
        <Box
            w="100%"
            border="1px solid"
            borderColor={dino.herbivore ? NEON_GREEN : BLUE}
            borderRadius="md"
            p="1rem"
            mt="1rem"
            boxShadow={dino.herbivore ? GREEN_GLOW : GLOW}
        >
            <Text fontFamily={FONT} fontSize="1.35rem" fontWeight="bold" color={BLUE} textShadow={GLOW} display="flex" alignItems="center">
                <Icon>
                    <path d="M3 11c0-3 2-6 5-6 2 0 3 1 4 1 1.5 0 2-1 2-1" />
                    <path d="M2 12h12" />
                    <circle cx="6" cy="8" r="0.6" fill="currentColor" stroke="none" />
                </Icon>
                {dino.dinosaur_name}
            </Text>
            <Row
                icon={<path d="M8 2.5c2.5 2 3.5 4 3.5 6.2A3.5 3.5 0 1 1 4.5 8.7C4.5 6.5 5.5 4.5 8 2.5z" />}
                label="Species"
                value={dino.dinosaur_species}
            />
            <Row
                icon={<path d="M8 3.2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.5 13c.6-2.2 2.3-3.3 4.5-3.3S12 10.8 12.5 13" />}
                label="Gender"
                value={dino.dinosaur_gender}
            />
            <Row
                icon={<><path d="M8 1.8c2.2 2.4 3.2 4.2 3.2 6.1a3.2 3.2 0 1 1-6.4 0C4.8 6 5.8 4.2 8 1.8z" /><circle cx="8" cy="8" r="1" /></>}
                label="Location"
                value={dino.last_known_location || "Unknown"}
            />
            <Row
                icon={dino.herbivore
                    ? <path d="M8 13V3M8 4C5 4 3.5 6 3.5 8.2 5 7 6.5 7.2 8 8.2 9.5 7.2 11 7 12.5 8.2 12.5 6 11 4 8 4z" />
                    : <path d="M3 12.5 6.2 4.2 8 8.2 9.8 4.2 13 12.5" />}
                label="Diet"
                value={dino.herbivore ? "Herbivore" : "Carnivore"}
                accent={dino.herbivore ? NEON_GREEN : undefined}
            />
            <Row
                icon={<><circle cx="8" cy="8" r="5" /><path d="M8 5.2V8l2 1.4" /></>}
                label="Digestion"
                value={`${dino.digestion_period}h`}
            />
            <Row
                icon={<path d="M8 2.2 9.2 6H13l-3 2.2 1.1 3.6L8 9.8 4.9 11.8 6 8.2 3 6h3.8z" />}
                label="Next feed"
                value={feed.text}
                alert={feed.alert}
            />
        </Box>
    )
}
