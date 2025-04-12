
import { useState } from 'react'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MenuIcon from '@mui/icons-material/Menu'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DescriptionIcon from '@mui/icons-material/Description'
import GroupIcon from '@mui/icons-material/Group'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  useMediaQuery,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import ArchiveIcon from '@mui/icons-material/Archive'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state)
  }

  enum DrawerWidth {
    Small = 200,
    Default = 250,
  }

  const drawerWidth = isSmallScreen ? DrawerWidth.Small : DrawerWidth.Default

  return (
    <Box className="absolute top-[12px] left-[30px]">
      <IconButton onClick={toggleDrawer(true)} className="!text-white mr-[50px] z-[100]">
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
            <ListItemButton component={NavLink} to="/tasks">
              <ListItemIcon><AssignmentIcon/></ListItemIcon>
              <ListItemText primary="Задачи" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/reports">
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              <ListItemText primary="Отчеты" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/services">
              <ListItemIcon><LocalShippingIcon  /></ListItemIcon>
              <ListItemText primary="Услуги" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/stocks">
              <ListItemIcon>
                <WarehouseOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Склады" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/counterparties">
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Контрагенты" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/archives">
              <ListItemIcon>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Архив" />
            </ListItemButton>
          </ListItem>


        </List>
      </Drawer>
    </Box>
  )
}
