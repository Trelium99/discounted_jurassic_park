import { Box, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"
import type { activeDinoProfile, maintenanceZone } from "../types/event_types"

const BLUE = "#7ecbff"
const RED = "#ff3b3b"
const NEON_GREEN = "#39ff14"
const GLOW = "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
const FONT = "Share Tech Mono, ui-monospace, Consolas, monospace"

type CellInfoProps = {
    location: string | null
    zone?: maintenanceZone
    dinos: activeDinoProfile[]
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

function Line({ icon, label, value, color = "white" }: { icon: ReactNode; label: string; value: string; color?: string }) {
    return (
        <Text display="flex" alignItems="center" fontFamily={FONT} fontSize="0.95rem" mt="0.45rem">
            <Icon color={color === "white" ? BLUE : color}>{icon}</Icon>
            <Box as="span" color={BLUE} textShadow={GLOW}>{label}</Box>
            <Box as="span" ml="0.4rem" color={color}>{value}</Box>
        </Text>
    )
}

export default function CellInfo({ location, zone, dinos }: CellInfoProps) {
    const days = zone ? Math.round(zone.days_until_next_maintenance) : 0
    const maintenanceDue = !zone?.timestamp || (zone?.needs_maintenance ?? true)
    const hungryCarnivore = dinos.some((dino) => !dino.herbivore && dino.time_til_next_feeding <= 0)
    const safe = zone?.is_safe !== false && !hungryCarnivore
    const dangerReason = hungryCarnivore ? "Hungry Carnivore Present" : (zone?.danger_reason || "None")

    return (
        <Box mr="2rem" display="flex" flexDirection="column" position="relative" zIndex={1} bg="#0a122e">
            <Text
                fontSize="2rem"
                fontWeight="bold"
                color={BLUE}
                textShadow={GLOW}
                fontFamily={FONT}
            >
                Zone Info
            </Text>
            {!location ? (
                <Box border="1px solid" borderColor={BLUE} borderRadius="md" p="1rem" mt="1rem" boxShadow={GLOW} bg="#0a122e">
                    <Text fontFamily={FONT} color={BLUE} textShadow={GLOW}>Select a zone</Text>
                </Box>
            ) : (
                <Box border="1px solid" borderColor={safe ? BLUE : RED} borderRadius="md" p="1rem" mt="1rem" boxShadow={GLOW} bg="#0a122e">
                    <Text fontFamily={FONT} fontSize="1.35rem" fontWeight="bold" color={BLUE} textShadow={GLOW} display="flex" alignItems="center">
                        <Icon>
                            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
                        </Icon>
                        Zone {location}
                    </Text>
                    <Line
                        icon={safe
                            ? <path d="M8 2.2 13 4.2v4.2c0 3.2-2.1 5.2-5 6.4-2.9-1.2-5-3.2-5-6.4V4.2z" />
                            : <path d="M8 2.2 13.2 12.8H2.8zM8 6.2v3.2M8 11.2h.01" />}
                        label="Safety"
                        value={safe ? "Safe" : "Unsafe"}
                        color={safe ? NEON_GREEN : RED}
                    />
                    <Line
                        icon={<path d="M8 1.8 9.3 6H14l-3.6 2.6 1.4 4.2L8 10.2 4.2 12.8 5.6 8.6 2 6h4.7z" />}
                        label="Danger"
                        value={dangerReason}
                        color={dangerReason === "None" ? "white" : RED}
                    />
                    <Line
                        icon={<path d="M3 8.2 6.2 5l2.2 2.2L12.8 3M3 12.5h10" />}
                        label="Maintenance"
                        value={maintenanceDue ? "Due" : `${days}d`}
                        color={maintenanceDue ? RED : "white"}
                    />
                    <Line
                        icon={<><circle cx="8" cy="8" r="5" /><path d="M8 5.2V8l2 1.4" /></>}
                        label="Last log"
                        value={zone?.timestamp ? new Date(zone.timestamp).toLocaleString("en-GB") : "No log"}
                    />
                    <Line
                        icon={<><path d="M3 11c0-3 2-6 5-6 2 0 3 1 4 1 1.5 0 2-1 2-1" /><path d="M2 12h12" /></>}
                        label="Dinosaurs"
                        value={dinos.length > 0 ? dinos.map((dino) => dino.dinosaur_name).join(", ") : "None"}
                    />
                </Box>
            )}
            <Text fontFamily={FONT} fontSize="0.75rem" color={BLUE} mt="0.75rem" lineHeight="1.35">
                Only cells with an API maintenance log are shown with wrenches. The rest of the cells are assumed to need maintenance by default until updated with an API log.
            </Text>
        </Box>
    )
}
