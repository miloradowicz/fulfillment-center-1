import { useTheme, useMediaQuery } from '@mui/material'

function useIsMobile() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('sm'))
}

export default useIsMobile
