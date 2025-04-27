import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { onDragEnd } from '../hooks/onDragEnd.ts'
import { useTaskBoard } from '../hooks/useTaskBoard.ts'
import TaskLine from './TaskLine.tsx'
import TaskForm from './TaskForm.tsx'
import TaskDetails from '@/features/tasks/components/TaskDetails.tsx'
import UserList from './UserList'
import Modal from '@/components/Modal/Modal.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import TaskCard from './TaskCard.tsx'
import RightPanel from '@/components/RightPanel/RightPanel.tsx'

const TaskBoard = () => {
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)
  const {
    id,
    todoItems,
    doneItems,
    inProgressItems,
    setDoneItems,
    setTodoItems,
    setInProgressItems,
    searchQuery,
    users,
    loading,
    openDetailsModal,
    draggingTask,
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
    dispatch,
    handleCloseDetailsModal,
  } = useTaskBoard()

  return (<>
    <Modal handleClose={handleClose} open={open}>
      <TaskForm onSuccess={handleClose} />
    </Modal>
    <RightPanel onOpenChange={handleCloseDetailsModal} open={openDetailsModal} >
      <TaskDetails taskId={id}/>
    </RightPanel>
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={e => {
        setTimeout(() => setActiveColumnId(null), 50)
        onDragEnd({
          e,
          todoItems: filterTasks(todoItems),
          setTodoItems,
          doneItems: filterTasks(doneItems),
          setDoneItems,
          inProgressItems: filterTasks(inProgressItems),
          setInProgressItems,
          dispatch,
        })
      }}
      onDragCancel={() => setTimeout(() => setActiveColumnId(null), 50)}
      onDragOver={({ over }) => {
        if (over?.id) {
          setActiveColumnId(over.id.toString())
        }
      }}
    >
      {selectFetchUser || loading ? (
        <div className="mt-5">
          <Loader/>
        </div>

      ) : (
        <div className="flex flex-col p-2 justify-between min-w-[950px] overflow-hidden">
          <div className="flex items-center space-x-1 w-full ml-5 mt-2.5 mb-0">
            <div className="relative inline-block max-w-[300px] min-w-[230px]">
              <div className="relative w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Поиск по содержанию"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  ref={inputRef}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {searchQuery ? (
                    <Button variant="link" size="sm" onClick={clearSearch}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  ) : (
                    <Search className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {users ? <UserList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            /> : null}

            <div className="flex flex-row items-center max-w-[700px] pr-5 mb-0 flex-grow">
              <div className="mx-3">
                <Button variant="outline" onClick={clearAllFilters}>Сбросить фильтры</Button>
              </div>
              <div className="ml-auto mr-5">
                <CustomButton text='Добавить задачу' onClick={handleOpen} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-1">
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="к выполнению" items={filterTasks(todoItems)} activeColumnId={activeColumnId}/>
            </div>
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="в работе" items={filterTasks(inProgressItems)} activeColumnId={activeColumnId}/>
            </div>
            <div className="w-1/3">
              <TaskLine selectedUser={selectedUser} title="готово" items={filterTasks(doneItems)} activeColumnId={activeColumnId}/>
            </div>
          </div>
        </div>
      )}
      {draggingTask ? (
        <DragOverlay>
          <TaskCard task={draggingTask}  selectedUser={selectedUser} />
        </DragOverlay>
      ) : null}
    </DndContext>
  </>
  )
}

export default TaskBoard
