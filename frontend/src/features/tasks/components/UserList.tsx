// import { useState } from 'react'
// import { Menu, MenuItem, IconButton, Tooltip, Stack } from '@mui/material'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import { User } from '../../../types'
//
// const UserList = ({ users }: { users: User[] }) => {
//   const [selectedUser, setSelectedUser] = useState<string | null>(null)
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//
//   // Если пользователей больше 2, то покажем кнопку для открытия выпадающего списка
//   const remainingUsers = users.slice(2) // Это будут оставшиеся пользователи, если их больше двух
//
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//
//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }
//
//   const handleUserSelect = (userId: string) => {
//     setSelectedUser(selectedUser === userId ? null : userId)
//     handleMenuClose()
//   }
//
//   return (
//     <Stack direction="row" spacing={1}>
//       {users.slice(0, 2).map(user => (
//         <Tooltip key={user._id} title={user.displayName}>
//           <IconButton
//             onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
//             sx={{
//               width: '70px',
//               border: selectedUser === user._id ? '2px solid blue' : 'none',
//               padding: '6px 12px',
//               fontSize: '17px',
//               backgroundColor: selectedUser === user._id ? '#e3f2fd' : '#ADD8E6',
//               borderRadius: '8px',
//               color: '#fff',
//               '&:hover': {
//                 backgroundColor: selectedUser === user._id ? '#b0d7f7' : '#80c8e1',
//               },
//             }}
//           >
//             {user.displayName}
//           </IconButton>
//         </Tooltip>
//       ))}
//
//       {/* Если пользователей больше 2, отображаем кнопку с количеством оставшихся */}
//       {remainingUsers.length > 0 && (
//         <Tooltip title={`Остальные (${ remainingUsers.length })`}>
//           <IconButton onClick={handleMenuOpen} sx={{ fontSize: '17px', backgroundColor: '#ADD8E6', borderRadius: '8px', color: '#fff' }}>
//             +{remainingUsers.length} <ArrowDropDownIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//
//       {/* Выпадающий список с остальными пользователями */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         {remainingUsers.map(user => (
//           <MenuItem key={user._id} onClick={() => handleUserSelect(user._id)}>
//             {user.displayName}
//           </MenuItem>
//         ))}
//       </Menu>
//     </Stack>
//   )
// }
//
// // export default UserList
//
// import React, { useState } from 'react'
// import { IconButton, Stack, Tooltip, Menu, MenuItem } from '@mui/material'
// import { User } from '../../../types'
//
// interface UserListProps {
//   users: User[]
//   selectedUser: string | null
//   setSelectedUser: (userId: string | null) => void
// }
//
// const UserList: React.FC<UserListProps> = ({ users, selectedUser, setSelectedUser }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//
//   const handleClose = () => {
//     setAnchorEl(null)
//   }
//
//   return (
//     <Stack direction="row" spacing={1} alignItems="center">
//       {/* Если пользователей больше двух, показываем кнопку для открытия меню */}
//       {users.length > 2 ? (
//         <>
//           <Tooltip title={`+${ users.length - 2 } других пользователей`}>
//             <IconButton
//               onClick={handleClick}
//               sx={{
//                 width: '70px',
//                 padding: '6px 12px',
//                 fontSize: '17px',
//                 backgroundColor: '#CFE8F8',
//                 borderRadius: '8px',
//                 color: 'black',
//                 '&:hover': {
//                   backgroundColor: '#75BDEC',
//                 },
//               }}
//             >
//               {`+${ users.length - 2 }`}
//             </IconButton>
//           </Tooltip>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             {users.slice(2).map(user => (
//               <MenuItem key={user._id} onClick={() => setSelectedUser(user._id)}>
//                 <Tooltip title={user.displayName}>
//                   <IconButton
//                     sx={{
//                       width: '70px',
//                       padding: '6px 12px',
//                       fontSize: '17px',
//                       backgroundColor: selectedUser === user._id ? '#A2D2F2' : '#CFE8F8',
//                       borderRadius: '8px',
//                       color: 'black',
//                       '&:hover': {
//                         backgroundColor: selectedUser === user._id ? '#1F91DC' : '#75BDEC',
//                       },
//                     }}
//                   >
//                     {user.displayName}
//                   </IconButton>
//                 </Tooltip>
//               </MenuItem>
//             ))}
//           </Menu>
//         </>
//       ) : (
//         // Отображаем всех пользователей, если их меньше 3
//         users.map(user => (
//           <Tooltip key={user._id} title={user.displayName}>
//             <IconButton
//               onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
//               sx={{
//                 width: '70px',
//                 border: selectedUser === user._id ? '2px solid #75BDEC' : 'none',
//                 padding: '6px 12px',
//                 fontSize: '17px',
//                 backgroundColor: selectedUser === user._id ? '#A2D2F2' : '#CFE8F8',
//                 borderRadius: '8px',
//                 color: 'black',
//                 '&:hover': {
//                   backgroundColor: selectedUser === user._id ? '#1F91DC' : '#75BDEC',
//                 },
//               }}
//             >
//               {user.displayName}
//             </IconButton>
//           </Tooltip>
//         ))
//       )}
//     </Stack>
//   )
// }
//
// export default UserList
//
import React, { useState } from 'react'
import { IconButton, Stack, Tooltip, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { User } from '../../../types'

interface UserListProps {
  users: User[]
  selectedUser: string | null
  setSelectedUser: (userId: string | null) => void
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, setSelectedUser }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Открытие меню
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // Закрытие меню
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Функция выбора пользователя
  const handleUserSelect = (userId: string) => {
    setSelectedUser(selectedUser === userId ? null : userId)
    handleMenuClose()
  }

  // Отображаем оставшихся пользователей, если их больше 2
  const remainingUsers = users.slice(5)

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Отображаем первых двух пользователей */}
      {users.slice(0, 5).map(user => (
        <Tooltip key={user._id} title={user.displayName}>
          <IconButton
            onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
            sx={{
              width: '70px',
              border: selectedUser === user._id ? '2px solid #75BDEC' : 'none',
              padding: '6px 12px',
              fontSize: '17px',
              backgroundColor: selectedUser === user._id ? '#A2D2F2' : '#CFE8F8',
              borderRadius: '8px',
              color: 'black',
              '&:hover': {
                backgroundColor: selectedUser === user._id ? '#1F91DC' : '#75BDEC',
              },
            }}
          >
            {user.displayName}
          </IconButton>
        </Tooltip>
      ))}

      {/* Если пользователей больше 2, отображаем кнопку с количеством оставшихся */}
      {remainingUsers.length > 0 && (
        <Tooltip title={`+${ remainingUsers.length } других пользователей`}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              width: '70px',
              padding: '6px 12px',
              fontSize: '17px',
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

      {/* Выпадающее меню с оставшимися пользователями */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {remainingUsers.map(user => (
          <MenuItem key={user._id} onClick={() => handleUserSelect(user._id)}>
            {user.displayName}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}

export default UserList
