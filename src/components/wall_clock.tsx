import { useEffect, useState } from "react"
import { Box, Text } from "@chakra-ui/react"

export default function WallClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  })

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <Box
      display="inline-block"
      px={6}
      py={3}
    //   bg="black"
      borderRadius="md"
    //   border="1px solid"
    //   borderColor="red.900"
    >
      <Text
        fontFamily='"Share Tech Mono", ui-monospace, Consolas, monospace'
        fontSize="6xl"
        fontWeight="bold"
        color="#ff3b3b"
        letterSpacing="0.12em"
        fontVariantNumeric="tabular-nums"
        lineHeight="1"
        textShadow="0 0 6px #ff2a2a, 0 0 18px rgba(255, 40, 40, 0.75)"
      >
        {date} {time}
      </Text>
    </Box>
  )
}