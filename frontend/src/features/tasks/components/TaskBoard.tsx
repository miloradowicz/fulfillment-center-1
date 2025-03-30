import { Box, CircularProgress, TextField, Stack, IconButton, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DndContext, rectIntersection } from '@dnd-kit/core'
import { useAppDispatch } from '../../../app/hooks.ts'
import { onDragEnd } from '../hooks/onDragEnd.ts'
import { useTaskBoard } from '../hooks/useTaskBoard.ts'
import TaskLine from './TaskLine.tsx'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import UserList from './UserList'
import { useEffect, useState } from 'react'
import CustomButton from '../../../components/UI/CustomButton/CustomButton.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import TaskForm from './TaskForm.tsx'

const TaskBoard = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const {
    todoItems,
    doneItems,
    inProgressItems,
    setDoneItems,
    setTodoItems,
    setInProgressItems,
    searchQuery,
    users,
    selectFetchUser,
    clearAllFilters,
    clearSearch,
    filterTasks,
    setSearchQuery,
    inputRef,
    selectedUser,
    setSelectedUser,
    sensors,
    handleOpen,
    open,
    handleClose,
  } = useTaskBoard()

  useEffect(() => {
    if (selectFetchUser) {
      setLoading(false)
    }
  }, [selectFetchUser])
  return (<>
    <Modal handleClose={handleClose} open={open}>
      <TaskForm onSuccess={handleClose} />
    </Modal>
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={e =>
        onDragEnd({
          e,
          todoItems: filterTasks(todoItems),
          setTodoItems,
          doneItems: filterTasks(doneItems),
          setDoneItems,
          inProgressItems: filterTasks(inProgressItems),
          setInProgressItems,
          dispatch,
        })}
    >
      {selectFetchUser || loading ? (
        <Box textAlign={'center'} mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" p={2} paddingBottom={'150px'} justifyContent={'space-between'} overflow={'hidden'} minWidth={'950px'} >
          <Stack direction="row" spacing={1} sx={{ display:'flex', width:'100%', marginLeft: '20px', marginBottom: '0', marginTop: '10px', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: 300, minWidth: 230 }}>
              <TextField
                label="Поиск по содержанию"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                inputRef={inputRef}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchQuery ? (
                          <IconButton size="small" onClick={clearSearch}>
                            <ClearIcon />
                          </IconButton>
                        ) : (
                          <SearchIcon color="action" />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {users? <UserList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />:null }
            <Stack sx={{ display:'flex', flexDirection:'row', paddingRight:'20px', justifyContent:'flex-start',flexGrow:'1', maxWidth:'700px', marginBottom: '0', marginTop: '10px', alignItems: 'center' }}>
              <Box className={'mx-3'}><CustomButton text={'Сбросить фильтры'} onClick={clearAllFilters}/></Box>
              <Box marginLeft={'auto'} ><CustomButton text={'Добавить задачу'} onClick={handleOpen}/></Box>
            </Stack>
          </Stack>

          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 4 }}>
              <TaskLine selectedUser={selectedUser} title="к выполнению" items={filterTasks(todoItems)} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TaskLine  selectedUser={selectedUser} title="в работе" items={filterTasks(inProgressItems)} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TaskLine  selectedUser={selectedUser} title="готово" items={filterTasks(doneItems)} />
            </Grid>
          </Grid>
        </Box>
      )}
    </DndContext>
  </>
  )
}

export default TaskBoard
