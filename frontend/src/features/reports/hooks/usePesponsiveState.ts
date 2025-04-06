import { useState, useEffect } from 'react'
import { useWindowWidth } from './useWndowWidth.ts'

export const useResponsiveState = (defaultValue: number, minWidth: number, maxWidth: number, coefficient: number = 1) => {
  const [state, setState] = useState(defaultValue)
  const width = useWindowWidth()

  useEffect(() => {
    const calculateState = () => {
      const newState = Math.min(Math.max(width * coefficient, minWidth), maxWidth)
      setState(newState)
    }
    calculateState()
    window.addEventListener('resize', calculateState)
    return () => {
      window.removeEventListener('resize', calculateState)
    }
  }, [width, minWidth, maxWidth, coefficient])
  return state
}
