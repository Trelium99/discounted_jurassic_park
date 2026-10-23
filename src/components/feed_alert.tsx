import { Box, Text } from "@chakra-ui/react"
import type { unappliedMaintenanceEvent } from "../types/event_types"

const RED = "#ff3b3b"
const FONT = "Share Tech Mono, ui-monospace, Consolas, monospace"

export default function FeedAlert({ events }: { events: unappliedMaintenanceEvent[] }) {
    if (events.length === 0) {
        return null
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap="0.4rem" mt="0.75rem">
            <Text fontFamily={FONT} color={RED} fontSize="0.85rem" fontWeight="bold">
                Maintenance logs not applied
            </Text>
            {events.map((event, index) => (
                <Box
                    key={`${event.location}-${event.time}-${index}`}
                    border="1px solid"
                    borderColor={RED}
                    borderRadius="md"
                    bg="#0a122e"
                    px="0.75rem"
                    py="0.35rem"
                >
                    <Text fontFamily={FONT} color={RED} fontSize="0.8rem">
                        {event.location || "no location"}{event.time ? ` at ${event.time}` : ""}: {event.reason}
                    </Text>
                </Box>
            ))}
        </Box>
    )
}
