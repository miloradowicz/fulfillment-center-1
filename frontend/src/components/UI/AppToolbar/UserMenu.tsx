import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { User } from '../../../types'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../../store/thunks/userThunk.ts'
import { unsetUser } from '../../../store/slices/userSlice.ts'
import { useAppDispatch } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const dispatch = useAppDispatch()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    dispatch(unsetUser())
    setAnchorEl(null)
    toast.success('Вы вышли из системы')
    navigate('/login')
  }

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
          onClick={handleLogout}
        >Выйти</MenuItem>
      </Menu>
    </>
  )
}

export default UserMenu
