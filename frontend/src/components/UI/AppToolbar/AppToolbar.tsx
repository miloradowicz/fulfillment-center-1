import { AppBar,  Container , styled, Toolbar, Typography } from '@mui/material'
import { Link as NavLink } from 'react-router-dom'
import UserMenu from './UserMenu.tsx'
import SideBar from '../SideBar/SideBar.tsx'

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
})

const AppToolbar = () => {
  // const user = useAppSelector(selectUser)
  // добавить user

  const user = {
    _id: '123',
    username: 'Мария',
    token: '77ba6207-7a6f-40fb-bf5a-e66b2203b07c',
    role: 'user',
    email:'sdg@mail.ru',
    displayName:'Мария',
  }
  // const user = null
  return (
    <AppBar position="sticky" sx={{ mb: 2, backgroundColor: '#32363F', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <SideBar/>
      <Container >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img src={'logo.jpeg'} alt="logo" className="h-[43px] rounded-[7px] xl:ms-0 ms-10" />
            </Link>
          </Typography>
          {user ? <UserMenu user={user} /> : null}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppToolbar
