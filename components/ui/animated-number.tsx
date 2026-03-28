"use client"

import { useEffect, useRef } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedNumberProps {
  value: number
  className?: string
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
  const displayValue = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  )
}
