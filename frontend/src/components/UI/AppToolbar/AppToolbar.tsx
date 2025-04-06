import { AppBar,  Container , styled, Toolbar, Typography } from '@mui/material'
import { Link as NavLink } from 'react-router-dom'
import UserMenu from './UserMenu.tsx'
import SideBar from '../SideBar/SideBar.tsx'
import { selectUser } from '../../../store/slices/userSlice.ts'
import { useAppSelector } from '../../../app/hooks.ts'
import { featureProtection } from '../../../constants.ts'

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: '12px',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#ffffff',
    color: '#32363F',
    borderColor: '#32363F',
  },
})

const AppToolbar = () => {
  const user = useAppSelector(selectUser)

  return (
    <AppBar
      position="fixed"
      sx={{
        mb: 2,
        backgroundColor: '#32363F',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 1201,
      }}
    >
      {(!featureProtection || user) && <SideBar />}
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to="/">
              <img src={'logo.jpeg'} alt="logo" className="h-[43px] rounded-[7px] xl:ms-0 ms-10" />
            </NavLink>
          </Typography>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link to="/login">
              <Typography variant="button" color="inherit">
                Войти
              </Typography>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppToolbar
