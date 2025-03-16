import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { User } from '../../../types'
import { NavLink, useNavigate } from 'react-router-dom'

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const HandleLogout = () => {
  //   dispatch(logout())
  //   dispatch(unsetUser())
  // } // добавить после сщздания userSlice

  return (
    <>
      <Button onClick={handleClick} color="inherit">
        Привет, {user.displayName}!
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user && user.role === 'admin' && (
          <MenuItem
            onClick={() => {
              navigate('/admin')
              setAnchorEl(null)
            }}
            component={NavLink}
            to={'/admin'}
          >
            Admin
          </MenuItem>
        )}

        <MenuItem
          // onClick={HandleLogout}
        >Logout</MenuItem>
      </Menu>
    </>
  )
}

export default UserMenu
