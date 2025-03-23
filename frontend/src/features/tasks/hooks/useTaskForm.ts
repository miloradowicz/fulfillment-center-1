import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllUsers } from '../../../store/slices/userSlice.ts'
import { useEffect } from 'react'
import { fetchUsers } from '../../../store/thunks/userThunk.ts'

const UseTaskForm = () => {
  const dispatch = useAppDispatch()

  const users = useAppSelector(selectAllUsers)


  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])


  return { users }
}

export default UseTaskForm
