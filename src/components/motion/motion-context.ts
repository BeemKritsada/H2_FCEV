import { createContext, useContext } from 'react'

export const MotionContext = createContext({
  paused: false,
  reducedMotion: false,
  playing: true,
  togglePaused: () => {},
})

export const useMotion = () => useContext(MotionContext)
