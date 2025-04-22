import React, { useEffect, useState } from 'react'
import { UserStripped } from '@/types'
import { useAppDispatch } from '@/app/hooks'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate } from '@/store/thunks/tasksThunk'
import { UserListProps } from '../hooks/TypesProps'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'

const UserList: React.FC<UserListProps> = ({ users, selectedUser, setSelectedUser }) => {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [topUsers, setTopUsers] = useState<UserStripped[]>(users.slice(0, 4))
  const [remainingUsers, setRemainingUsers] = useState<UserStripped[]>(users.slice(4))
  const [open, setOpen] = useState(false)

  const handleUserClick = async (userId: string) => {
    setOpen(false)
    if (selectedUser === userId) {
      setSelectedUser(null)
      await dispatch(fetchTasksWithPopulate())
    } else {
      setSelectedUser(userId)
      await dispatch(fetchTasksByUserIdWithPopulate(userId))
    }
  }

  const getInitialUsers = (name: string) => {
    if (!name) return ''
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || ''
    }
    const initials = parts[0][0] + parts[1][0]
    return initials.toUpperCase()
  }

  const user = remainingUsers.find(u => u._id === selectedUser)

  useEffect(() => {
    if (user) {
      setTopUsers(prevTopUsers => {
        const newTopUsers = [...prevTopUsers, user]
        const firstTopUser = newTopUsers[0]
        const finalTopUsers = newTopUsers.slice(1)

        setRemainingUsers(prevRemainingUsers => {
          const newRemainingUsers = prevRemainingUsers.filter(u => u._id !== user._id)
          return [...newRemainingUsers, firstTopUser]
        })

        return finalTopUsers
      })
    }
  }, [user])

  return (
    <div className="flex items-center">
      {topUsers.map(user => (
        <Tooltip key={user._id}>
          <TooltipTrigger asChild>
            <div
              className={`relative h-[44px] w-[44px] -ml-2 first:ml-0 z-0 cursor-pointer
                      hover:z-10 transition-transform duration-100
                      ${ selectedUser === user._id ? 'z-10' : '' }`}
              onClick={() => handleUserClick(user._id)}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-full bg-white
                        ${ selectedUser === user._id
          ? 'border-0'
          : 'hover:border-2 hover:border-blue-500' }
                      `}
              >
                <div
                  className="flex items-center justify-center bg-blue-500 text-white text-[18px] rounded-full w-[85%] h-[85%] font-bold"
                >
                  {getInitialUsers(user.displayName)}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <strong>{user.displayName}</strong>
          </TooltipContent>
        </Tooltip>
      ))}

      {remainingUsers.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <div
                  onClick={() => setOpen(!open)}
                  className={`relative h-[44px] w-[44px] first:ml-0 z-0 cursor-pointer
                      hover:z-10 transition-transform duration-100`}
                >
                  <div
                    className="w-full h-full flex items-center justify-center rounded-full bg-white hover:border-2 hover:border-blue-500"
                  >
                    <div
                      className="flex items-center justify-center bg-gray-200 text-gray-500 text-[18px] tracking-[-0.1em] rounded-full w-[85%] h-[85%]"
                    >
                      +{remainingUsers.length}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Выбрать пользователя
            </TooltipContent>
          </Tooltip>

          <PopoverContent className="w-60 p-2">
            <Command>
              <CommandInput
                placeholder="Поиск..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <ScrollArea className="h-[200px]">
                  <CommandEmpty>Пользователи не найдены</CommandEmpty>
                  {remainingUsers
                    .filter(user =>
                      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map(user => (
                      <CommandItem
                        key={user._id}
                        onSelect={() => handleUserClick(user._id)}
                        className="cursor-pointer"
                      >
                        {user.displayName}
                      </CommandItem>
                    ))}
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default UserList
