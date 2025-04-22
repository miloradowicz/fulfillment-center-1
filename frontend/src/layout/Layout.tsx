import { Outlet, useLocation } from 'react-router-dom'
import AppToolbar from '@/components/AppToolbar/AppToolbar'

const Layout = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {!isLoginPage && (
        <header className="fixed top-0 left-0 right-0 z-50">
          <AppToolbar />
        </header>
      )}
      <main className={`pt-16 px-4 md:px-8 xl:px-16 max-w-screen-xl mx-auto w-full ${ isLoginPage ? 'h-screen' : '' }`}>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
