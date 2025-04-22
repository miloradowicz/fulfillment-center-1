import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.tsx'
import { Button } from '../ui/button.tsx'
import { User } from '@/types'
import { NavLink, useNavigate } from 'react-router-dom'

import { logoutUser } from '@/store/thunks/userThunk.ts'
import { unsetUser } from '@/store/slices/authSlice.ts'
import { useAppDispatch } from '@/app/hooks.ts'
import { toast } from 'react-toastify'
import React from 'react'
import { Separator } from '../ui/separator.tsx'
import { LogOut, Settings } from 'lucide-react'

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
        <Button variant="secondary" className="h-11 w-11 p-0 rounded-full transition-colors">
          <span className="text-xl font-bold uppercase">{user.displayName?.[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-1.5 text-md font-bold text-center">{user.displayName}</div>
        <Separator />
        {(user.role === 'admin' || user.role === 'super-admin') && (
          <DropdownMenuItem className="text-md mt-2 cursor-pointer" asChild>
            <NavLink to="/admin">
              <Settings size={25} />
              Админ-панель
            </NavLink>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="text-md mt-2 my-1 cursor-pointer">
          <LogOut size={25} />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
