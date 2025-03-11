import { useState } from 'react'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MenuIcon from '@mui/icons-material/Menu'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DescriptionIcon from '@mui/icons-material/Description'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Theme,
  Box } from '@mui/material'
import { NavLink } from 'react-router-dom'


export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state)
  }

  const drawerWidth = isSmallScreen ? 200 : 250

  return (
    <Box position="absolute" top={'12px'} left={'30px'}>
      <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white', marginRight: '50px', zIndex: 100  }}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          flexShrink: 0,
          mt: '75px' ,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: { xs: '57px', sm: '65px' },
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        <List sx={{ width: drawerWidth }}>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/clients">
              <ListItemIcon><PeopleIcon/></ListItemIcon>
              <ListItemText primary="Клиенты" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/products">
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Товары" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/arrivals">
              <ListItemIcon><LocalShippingIcon /></ListItemIcon>
              <ListItemText primary="Поставки" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/orders">
              <ListItemIcon><ReceiptLongIcon/></ListItemIcon>
              <ListItemText primary="Заказы" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/reports">
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              <ListItemText primary="Отчеты" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  )
}
