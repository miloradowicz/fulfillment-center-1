// import { Box, CircularProgress, TextField, Stack, IconButton, Tooltip } from '@mui/material'
// import Grid from '@mui/material/Grid2'
// import { DndContext, rectIntersection } from '@dnd-kit/core'
// import { useCallback, useEffect, useRef, useState } from 'react'
// import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
// import { onDragEnd } from '../hooks/onDragEnd.ts'
// import { useTaskBoard } from '../hooks/useTaskBoard.ts'
// import TaskLine from './TaskLine.tsx'
// import { TaskWithPopulate, User } from '../../../types'
// import ClearIcon from '@mui/icons-material/Clear'
// import SearchIcon from '@mui/icons-material/Search'
// import { selectAllUsers } from '../../../store/slices/userSlice.ts'
// import { fetchUsers } from '../../../store/thunks/userThunk.ts'
//
// const TaskBoard = () => {
//   const dispatch = useAppDispatch()
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedUser, setSelectedUser] = useState<string | null>(null) // ID выбранного пользователя
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const users = useAppSelector(selectAllUsers)
//
//   const fetchAllUsers = useCallback(() => {
//     dispatch(fetchUsers())
//   }, [dispatch])
//
//   useEffect(() => {
//     void fetchAllUsers()
//   }, [dispatch, fetchAllUsers])
//
//   const {
//     todoItems,
//     setTodoItems,
//     doneItems,
//     setDoneItems,
//     inProgressItems,
//     setInProgressItems,
//     fetchLoading,
//   } = useTaskBoard()
//
//   const filterTasks = (items: TaskWithPopulate[]) =>
//     items.filter(item =>
//       (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
//       (selectedUser === null || item.user._id === selectedUser),
//     )
//   return (
//     <DndContext
//       collisionDetection={rectIntersection}
//       onDragEnd={e =>
//         onDragEnd({
//           e,
//           todoItems,
//           setTodoItems,
//           doneItems,
//           setDoneItems,
//           inProgressItems,
//           setInProgressItems,
//           dispatch,
//         })}
//     >
//       {fetchLoading ? (
//         <Box textAlign={'center'} mt={5}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box display="flex" flexDirection="column" p={2}>
//           {/* Поисковая строка и фильтр пользователей */}
//           <Stack direction="row" spacing={2} sx={{ marginLeft: '20px', marginBottom: '0', marginTop: '10px', alignItems: 'center' }}>
//             {/* Поле поиска */}
//             <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: 300 }}>
//               <TextField
//                 label="Поиск по содержанию"
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 inputRef={inputRef}
//               />
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: '50%',
//                   right: 10,
//                   transform: 'translateY(-50%)',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 {searchQuery ? (
//                   <IconButton
//                     size="small"
//                     onClick={() => {
//                       setSearchQuery('')
//                       inputRef.current?.focus()
//                     }}
//                   >
//                     <ClearIcon />
//                   </IconButton>
//                 ) : (
//                   <SearchIcon color="action" />
//                 )}
//               </Box>
//             </Box>
//             <Stack direction="row" spacing={'5px'} >
//               {users?.map((user: User) => (
//                 <Tooltip key={user._id} title={user.displayName}>
//                   <IconButton
//                     onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
//                     sx={{
//                       width: '70px',
//                       border: selectedUser === user._id ? '2px solid #75BDEC' : 'none',
//                       padding: '6px 12px',
//                       fontSize: '17px',
//                       backgroundColor: selectedUser === user._id ? '#A2D2F2' : '#CFE8F8', // Светло-голубой фон
//                       borderRadius: '8px',
//                       color: 'black',
//                       '&:hover': {
//                         backgroundColor: selectedUser === user._id ? '#1F91DC' : '#75BDEC', // Темнее при наведении
//                       },
//                     }}
//                   >
//                     {user.displayName}
//                   </IconButton>
//                 </Tooltip>
//               ))}
//             </Stack>
//           </Stack>
//
//           {/* Список задач */}
//           <Grid container spacing={2} mt={2}>
//             <Grid size={{ xs: 4 }}>
//               <TaskLine title="к выполнению" items={filterTasks(todoItems)} />
//             </Grid>
//             <Grid size={{ xs: 4 }}>
//               <TaskLine title="в работе" items={filterTasks(inProgressItems)} />
//             </Grid>
//             <Grid size={{ xs: 4 }}>
//               <TaskLine title="готово" items={filterTasks(doneItems)} />
//             </Grid>
//           </Grid>
//         </Box>
//       )}
//     </DndContext>
//   )
// }
//
// export default TaskBoard
//
import { Box, CircularProgress, TextField, Stack, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DndContext, rectIntersection } from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { onDragEnd } from '../hooks/onDragEnd.ts'
import { useTaskBoard } from '../hooks/useTaskBoard.ts'
import TaskLine from './TaskLine.tsx'
import { TaskWithPopulate } from '../../../types'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { selectAllUsers } from '../../../store/slices/userSlice.ts'
import { fetchUsers } from '../../../store/thunks/userThunk.ts'
import UserList from './UserList'

const TaskBoard = () => {
  const dispatch = useAppDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null) // ID выбранного пользователя
  const inputRef = useRef<HTMLInputElement | null>(null)
  const users = useAppSelector(selectAllUsers)

  const fetchAllUsers = useCallback(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    void fetchAllUsers()
  }, [dispatch, fetchAllUsers])

  const {
    todoItems,
    setTodoItems,
    doneItems,
    setDoneItems,
    inProgressItems,
    setInProgressItems,
    fetchLoading,
  } = useTaskBoard()

  const filterTasks = (items: TaskWithPopulate[]) =>
    items.filter(item =>
      (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (selectedUser === null || item.user._id === selectedUser),
    )

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={e =>
        onDragEnd({
          e,
          todoItems,
          setTodoItems,
          doneItems,
          setDoneItems,
          inProgressItems,
          setInProgressItems,
          dispatch,
        })}
    >
      {fetchLoading ? (
        <Box textAlign={'center'} mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" p={2} paddingBottom={'150px'} overflow={'hidden'}>
          {/* Поисковая строка и фильтр пользователей */}
          <Stack direction="row" spacing={2} sx={{ marginLeft: '20px', marginBottom: '0', marginTop: '10px', alignItems: 'center' }}>
            {/* Поле поиска */}
            <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: 300 }}>
              <TextField
                label="Поиск по содержанию"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                inputRef={inputRef}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {searchQuery ? (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('')
                      inputRef.current?.focus()
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon color="action" />
                )}
              </Box>
            </Box>

            {/* Отображение списка пользователей */}
            {users? <UserList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />:null }

          </Stack>

          {/* Список задач */}
          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 4 }}>
              <TaskLine title="к выполнению" items={filterTasks(todoItems)} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TaskLine title="в работе" items={filterTasks(inProgressItems)} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TaskLine title="готово" items={filterTasks(doneItems)} />
            </Grid>
          </Grid>
        </Box>
      )}
    </DndContext>
  )
}

export default TaskBoard
