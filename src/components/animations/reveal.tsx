import { motion, useInView } from "framer-motion"
import { ReactNode, useRef } from "react"

import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right"

type RevealProps = {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: Direction
}

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
}

function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { amount: 0.2, once: true })

  const { x, y } = directionOffsets[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x, y }
      }
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
