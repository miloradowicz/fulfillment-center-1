import { PropsWithChildren } from 'react'
import AppToolbar from '../components/UI/AppToolbar/AppToolbar.tsx'
import { Container, CssBaseline } from '@mui/material'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="xl">
          {children}
        </Container>
      </main>
    </>
  )
}

export default Layout
