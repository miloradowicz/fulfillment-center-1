import React, { useEffect, useState } from 'react'
import { IconButton, Stack, Tooltip, Menu, MenuItem, TextField, InputAdornment } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { UserStripped } from '@/types'
import { useAppDispatch } from '@/app/hooks.ts'
import {
  fetchTasksByUserIdWithPopulate,
  fetchTasksWithPopulate,
} from '@/store/thunks/tasksThunk.ts'
import { UserListProps } from '../hooks/TypesProps'


const UserList: React.FC<UserListProps> = ({ users, selectedUser, setSelectedUser }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useAppDispatch()
  const [topUsers, setTopUsers] = useState<UserStripped[]>(users.slice(0, 4))
  const [remainingUsers, setRemainingUsers] = useState<UserStripped[]>(users.slice(4))

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserClick = async (userId: string) => {
    if (selectedUser === userId) {
      setSelectedUser(null)
      await dispatch(fetchTasksWithPopulate())
    } else {
      setSelectedUser(userId)
      await dispatch(fetchTasksByUserIdWithPopulate(userId))
    }
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

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {topUsers.map(user => (
        <Tooltip key={user._id} title={user.displayName}>
          <IconButton
            onClick={() => handleUserClick(user._id)}
            sx={{
              width: screenWidth < 1100 ? '60px' : '80px',
              border: selectedUser === user._id ? '2px solid #75BDEC' : 'none',
              padding: screenWidth < 1100 ? '5px 10px' : '6px 12px',
              fontSize: screenWidth < 1100 ? '14px' : '16px',
              backgroundColor: selectedUser === user._id ? '#A2D2F2' : '#CFE8F8',
              borderRadius: '8px',
              color: 'black',
              '&:hover': {
                backgroundColor: selectedUser === user._id ? '#1F91DC' : '#75BDEC',
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                maxWidth: '100%',
              }}
            >
              {user.displayName}
            </span>
          </IconButton>
        </Tooltip>
      ))}

      {remainingUsers.length > 0 && (
        <Tooltip title={`+${ remainingUsers.length } других пользователей`}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              width: screenWidth < 1100 ? '50px' : '70px',
              padding: screenWidth < 1100 ? '5px 10px' : '6px 12px',
              fontSize: screenWidth < 1100 ? '15px' : '17px',
              backgroundColor: '#CFE8F8',
              borderRadius: '8px',
              color: 'black',
              '&:hover': {
                backgroundColor: '#75BDEC',
              },
            }}
          >
            +{remainingUsers.length} <ArrowDropDownIcon />
          </IconButton>
        </Tooltip>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem disableRipple>
          <TextField
            variant='standard'
            placeholder="Поиск..."
            value={searchTerm}
            size={'small'}
            sx={{ width:'170px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm ? (
                      <IconButton onClick={clearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </MenuItem>
        {remainingUsers
          .filter(user => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(user => (
            <div key={user._id} onClick={() => handleUserClick(user._id)} style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              {user.displayName}
            </div>
          ))}
      </Menu>
    </Stack>
  )
}

export default UserList
