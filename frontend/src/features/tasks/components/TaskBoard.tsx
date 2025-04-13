import { Box, CircularProgress, TextField, Stack, IconButton, InputAdornment } from '@mui/material'
import { DndContext, rectIntersection } from '@dnd-kit/core'
import { useAppDispatch } from '@/app/hooks.ts'
import { useTaskBoard } from '../hooks/useTaskBoard.ts'
import TaskLine from './TaskLine.tsx'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import UserList from './UserList'
import { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import TaskForm from './TaskForm.tsx'
import { onDragEnd } from '../hooks/onDragEnd.ts'

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
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col p-2 justify-between min-w-[950px] overflow-hidden">
          <div className="flex items-center space-x-1 w-full ml-5 mt-2.5 mb-0">
            <div className="relative inline-block max-w-[300px] min-w-[230px]">
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
            </div>

            {users? <UserList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />:null }
            <Stack sx={{ display:'flex', flexDirection:'row', paddingRight:'20px', justifyContent:'flex-start',flexGrow:'1', maxWidth:'700px', marginBottom: '0', alignItems: 'center' }}>
              <Box className={'mx-3'}><CustomButton text={'Сбросить фильтры'} onClick={clearAllFilters}/></Box>
              <Box marginLeft={'auto'} ><CustomButton text={'Добавить задачу'} onClick={handleOpen}/></Box>
            </Stack>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="к выполнению" items={filterTasks(todoItems)} />
            </div>
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="в работе" items={filterTasks(inProgressItems)} />
            </div>
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="готово" items={filterTasks(doneItems)} />
            </div>
          </div>
        </div>
      )}
    </DndContext>
  </>
  )
}

export default TaskBoard
