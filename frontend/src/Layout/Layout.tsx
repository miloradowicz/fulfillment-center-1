import React, { PropsWithChildren } from 'react'
import AppToolbar from '../components/ui/AppToolbar/AppToolbar.tsx'
import { Container, CssBaseline } from '@mui/material'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="xl" sx={{ pt: 10 }}>
          {children}
        </Container>
      </main>
    </>
  )
}

export default Layout
