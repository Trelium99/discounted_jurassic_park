import { Box } from "@chakra-ui/react"
import island from "../images/madeira_island-20000-sdb-5fc827-preview.png"

const COLUMNS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const GLOW = "0 0 6px #5eb6ff, 0 0 18px rgba(94, 182, 255, 0.75)"
const AXIS_FONT = "Share Tech Mono, ui-monospace, Consolas, monospace"

export type MapCell = {
    color?: string
    icon?: string
}

type MapGridProps = {
    cells?: Record<string, MapCell>
}

export default function MapGrid({ cells = {} }: MapGridProps) {
    const squares = []
    for (let row = 0; row <= 15; row++) {
        for (const column of COLUMNS) {
            const location = `${column}${row}`
            const cell = cells[location]
            squares.push(
                <Box
                    key={location}
                    title={location}
                    bg={cell?.color ?? "transparent"}
                    border="1px solid #7ecbff"
                    boxShadow="inset 0 0 6px rgba(94, 182, 255, 0.85)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="0.65rem"
                    lineHeight="1"
                >
                    {cell?.icon}
                </Box>
            )
        }
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns="1.75rem minmax(0, 1fr)"
            gridTemplateRows="1.4rem auto"
            w="min(960px, 92vw)"
            mb="2rem"
            mt="2rem"
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
            <Box display="grid" gridTemplateRows="repeat(16, 1fr)" h="100%">
                {Array.from({ length: 16 }, (_, row) => (
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
            <Box position="relative" aspectRatio="26 / 16" w="100%" overflow="hidden">
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
                    gridTemplateRows="repeat(16, 1fr)"
                >
                    {squares}
                </Box>
            </Box>
        </Box>
    )
}
