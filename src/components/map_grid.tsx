import { Box } from "@chakra-ui/react"
import island from "../images/madeira_island-20000-sdb-5fc827-preview.png"
import FeedAlert from "./feed_alert"
import type { unappliedMaintenanceEvent } from "../types/event_types"

const COLUMNS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const GLOW = "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
const AXIS_FONT = "Share Tech Mono, ui-monospace, Consolas, monospace"

export type MapCell = {
    color?: string
    icon?: string
}

function CellIcon({ icon }: { icon?: string }) {
    if (icon === "skull") {
        return (
            <svg viewBox="0 0 16 16" width="78%" height="78%" fill="none" stroke="#ffe4e4" strokeWidth="1.3">
                <path d="M8 1.6a3.5 3.5 0 0 0-2.5 6v1.2h5V7.6A3.5 3.5 0 0 0 8 1.6z" />
                <path d="M6.3 5.4h.01M9.7 5.4h.01M6.5 7.2h3" />
                <path d="M3 12.4 13 14.2M3 14.2 13 12.4" />
            </svg>
        )
    }
    if (icon === "wrench") {
        return (
            <svg viewBox="0 0 16 16" width="70%" height="70%" fill="none" stroke="#7ecbff" strokeWidth="1.4">
                <path d="M9.2 2.4a2.2 2.2 0 0 0-1.6 3.4L3.2 10.2 5 12l4.4-4.4a2.2 2.2 0 0 0 3.2-2.6L10.8 6.6 9.4 5.2z" />
            </svg>
        )
    }
    if (icon === "warning") {
        return (
            <svg viewBox="0 0 16 16" width="70%" height="70%" fill="none" stroke="#fff4d6" strokeWidth="1.4">
                <path d="M8 2.2 13.4 13H2.6z" />
                <path d="M8 6.2v3.2M8 11.3h.01" />
            </svg>
        )
    }
    return icon ? <>{icon}</> : null
}

const KEY = [
    { color: "rgba(255, 30, 30, 0.85)", icon: "skull", label: "Dangerous" },
    { color: "rgba(255, 30, 30, 0.85)", icon: "wrench", label: "Dangerous, needs maintenance" },
    { color: "rgba(57, 255, 20, 0.4)", icon: "wrench", label: "Safe, needs maintenance" },
    { color: "rgba(255, 140, 0, 0.55)", icon: "warning", label: "Carnivore digesting" },
]

type MapGridProps = {
    cells?: Record<string, MapCell>
    selected?: string | null
    onSelect?: (location: string) => void
    unapplied?: unappliedMaintenanceEvent[]
}

export default function MapGrid({ cells = {}, selected = null, onSelect, unapplied = [] }: MapGridProps) {
    const squares = []
    for (let row = 0; row <= 16; row++) {
        for (const column of COLUMNS) {
            const location = `${column}${row}`
            const cell = cells[location]
            squares.push(
                <Box
                    key={location}
                    as="button"
                    title={location}
                    aria-label={location}
                    onClick={() => onSelect?.(location)}
                    cursor="pointer"
                    w="100%"
                    h="100%"
                    p="0"
                    bg={cell?.color ?? (selected === location ? "rgba(126, 203, 255, 0.35)" : "transparent")}
                    border={cell?.icon === "skull" ? "1px solid #ff3b3b" : "1px solid #7ecbff"}
                    boxShadow={
                        selected === location
                            ? GLOW
                            : cell?.icon === "skull"
                                ? "inset 0 0 8px rgba(255, 40, 40, 0.95)"
                                : "inset 0 0 6px rgba(94, 182, 255, 0.85)"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="0.65rem"
                    lineHeight="1"
                >
                    <CellIcon icon={cell?.icon} />
                </Box>
            )
        }
    }

    return (
        <Box w="min(960px, 92vw)" mb="2rem" mt="2rem">
        <Box
            display="grid"
            gridTemplateColumns="1.75rem minmax(0, 1fr)"
            gridTemplateRows="1.4rem auto"
        >
            <Box />
            <Box display="grid" gridTemplateColumns="repeat(26, 1fr)">
                {[...COLUMNS].map((column) => (
                    <Box
                        key={column}
                        textAlign="center"
                        color="#7ecbff"
                        textShadow={GLOW}
                        fontFamily={AXIS_FONT}
                        fontSize="0.7rem"
                        lineHeight="1.4rem"
                    >
                        {column}
                    </Box>
                ))}
            </Box>
            <Box display="grid" gridTemplateRows="repeat(17, 1fr)" h="100%">
                {Array.from({ length: 17 }, (_, row) => (
                    <Box
                        key={row}
                        color="#7ecbff"
                        textShadow={GLOW}
                        fontFamily={AXIS_FONT}
                        fontSize="0.65rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {row}
                    </Box>
                ))}
            </Box>
            <Box position="relative" aspectRatio="26 / 17" w="100%" overflow="hidden">
                <img
                    src={island}
                    alt="Madeira island park map"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.45)",
                    }}
                />
                <Box
                    position="absolute"
                    inset="0"
                    display="grid"
                    gridTemplateColumns="repeat(26, 1fr)"
                    gridTemplateRows="repeat(17, 1fr)"
                >
                    {squares}
                </Box>
            </Box>
        </Box>
        <Box display="flex" flexWrap="wrap" gap="0.75rem" mt="0.75rem" ml="1.75rem">
            {KEY.map((item) => (
                <Box key={item.label} display="flex" alignItems="center" gap="0.4rem">
                    <Box
                        w="1.35rem"
                        h="1.35rem"
                        bg={item.color}
                        border="1px solid"
                        borderColor={item.icon === "skull" || (item.icon === "wrench" && item.color.includes("255, 30, 30")) ? "#ff3b3b" : "#7ecbff"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CellIcon icon={item.icon} />
                    </Box>
                    <Box
                        as="span"
                        color="#7ecbff"
                        textShadow={GLOW}
                        fontFamily={AXIS_FONT}
                        fontSize="0.8rem"
                    >
                        {item.label}
                    </Box>
                </Box>
            ))}
        </Box>
        <FeedAlert events={unapplied} />
        </Box>
    )
}
