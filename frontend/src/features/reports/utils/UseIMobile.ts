import { useEffect, useState } from 'react'

const breakpoints: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

function useIsMobile(breakpoint: keyof typeof breakpoints = 'sm') {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const px = breakpoints[breakpoint]
    const mediaQuery = window.matchMedia(`(max-width: ${ px }px)`)

    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    updateMatch(mediaQuery)
    mediaQuery.addEventListener('change', updateMatch)

    return () => {
      mediaQuery.removeEventListener('change', updateMatch)
    }
  }, [breakpoint])

  return isMobile
}

export default useIsMobile
