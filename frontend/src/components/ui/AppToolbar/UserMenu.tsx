import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User } from '@/types'
import { NavLink, useNavigate } from 'react-router-dom'

import { logoutUser } from '@/store/thunks/userThunk'
import { unsetUser } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/app/hooks'
import { toast } from 'react-toastify'
import React from 'react'

interface Props {
  user: User
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    dispatch(unsetUser())
    toast.success('Вы вышли из системы')
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-11 w-11 p-0 rounded-full text-slate-800 bg-white hover:bg-slate-300 cursor-pointer  transition-colors">
          <span className="text-sm font-bold uppercase">
            {user.displayName?.[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-1.5 text-sm text-muted-foreground">
          {user.displayName}
        </div>
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <NavLink to="/admin">Админ</NavLink>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
