// import { IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material'
// import React, { useState } from 'react'
// import ClearIcon from '@mui/icons-material/Clear'
// import SearchIcon from '@mui/icons-material/Search'
// import { NavLink } from 'react-router-dom'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import Box from '@mui/material/Box'
// import useIMobile from '../../utils/UseIMobile.ts'
//
// const Dropdown = ({ tasks }: { tasks: { _id: string; taskNumber: string; }[] }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const [searchTask, setSearchTask] = useState('')
//
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//
//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }
//
//   const clearSearch = () => {
//     setSearchTask('')
//   }
//   const isMobile = useIMobile()
//   return (
//     <Box width={'auto'}>
//       <IconButton
//         onClick={handleMenuOpen}
//         sx={{
//           fontSize: { xs: '0.875rem', md: '1rem' },
//           backgroundColor: '#639dc6',
//           borderRadius: '8px',
//           color: 'white',
//           '&:hover': {
//             backgroundColor: '#75BDEC',
//           },
//         }}
//       >
//         {isMobile ? 'Задачи' : 'Список задач'}<ArrowDropDownIcon />
//       </IconButton>
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         <MenuItem disableRipple>
//           <TextField
//             variant='standard'
//             placeholder="Поиск..."
//             value={searchTask}
//             size={'small'}
//             sx={{ width:'110px' }}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               setSearchTask(e.target.value)
//             }}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     {searchTask? (
//                       <IconButton onClick={clearSearch} size="small">
//                         <ClearIcon />
//                       </IconButton>
//                     ) : (
//                       <SearchIcon />
//                     )}
//                   </InputAdornment>
//                 ),
//               },
//             }}
//           />
//         </MenuItem>
//         {tasks
//           .filter(task => task.taskNumber.toLowerCase().includes(searchTask.toLowerCase()))
//           .map(task => (
//             <div key={task._id}
//               style={{
//                 marginLeft:'5px',
//                 padding: '4px 10px',
//                 cursor: 'pointer',
//                 borderRadius: '6px',
//                 fontSize: '14px',
//                 transition: 'background-color 0.2s ease',
//               }}
//               onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
//               onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
//               <NavLink to={`/tasks/${ task._id }`}  style={{
//                 textDecoration: 'underline',
//                 color: '#1A73E8',
//               }}>{task.taskNumber}</NavLink>
//             </div>
//           ))}
//       </Menu>
//     </Box>
//   )
// }
//
// export default Dropdown
import { IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material'
import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { NavLink } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import useIMobile from '../../utils/UseIMobile.ts'

type CommonDropdownItem = {
  _id: string
}

type TaskDropdownProps<T extends CommonDropdownItem> = {
  items: T[]
  getLabel: (item: T) => string
  getLink: (item: T) => string
  buttonText?: string
}

const GenericDropdown = <T extends CommonDropdownItem>({
  items,
  getLabel,
  getLink,
  buttonText = 'Список',
}: TaskDropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [search, setSearch] = useState('')
  const isMobile = useIMobile()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const clearSearch = () => {
    setSearch('')
  }

  const filtered = items.filter(item =>
    getLabel(item).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Box width={'auto'}>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          fontSize: { xs: '0.875rem', md: '1rem' },
          backgroundColor: '#639dc6',
          borderRadius: '8px',
          color: 'white',
          '&:hover': {
            backgroundColor: '#75BDEC',
          },
        }}
      >
        {isMobile ? buttonText : `${ buttonText }`}
        <ArrowDropDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem disableRipple>
          <TextField
            variant='standard'
            placeholder="Поиск..."
            value={search}
            size={'small'}
            sx={{ width: '110px' }}
            onChange={e => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {search ? (
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
        {filtered.map(item => (
          <div
            key={item._id}
            style={{
              marginLeft: '5px',
              padding: '4px 10px',
              cursor: 'pointer',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <NavLink
              to={getLink(item)}
              style={{
                textDecoration: 'underline',
                color: '#1A73E8',
              }}
            >
              {getLabel(item)}
            </NavLink>
          </div>
        ))}
      </Menu>
    </Box>
  )
}

export default GenericDropdown
