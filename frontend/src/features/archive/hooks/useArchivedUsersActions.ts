import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useEffect, useState } from 'react'
import {
  selectAllArchivedUsers,
  selectSelectedUser,
  selectUsersError,
  selectUsersLoading,
} from '@/store/slices/userSlice.ts'
import { UserWithPopulate } from '@/types'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteUser, fetchArchivedUsers, unarchiveUser } from '@/store/thunks/userThunk.ts'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

const useArchivedUsersActions = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [userToActionId, setUserToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const users = useAppSelector(selectAllArchivedUsers)
  const [selectedUser, setSelectedUser] = useState<UserWithPopulate | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector(selectSelectedUser)
  const loading = useAppSelector(selectUsersLoading)
  const error = useAppSelector(selectUsersError)

  useEffect(() => {
    if (!users && !loading) {
      dispatch(fetchArchivedUsers())
    }
  }, [dispatch, users, loading])

  const deleteOneUser = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap()
      await dispatch(fetchArchivedUsers())
      toast.success('Пользователь успешно удален!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить пользователя')
      }
      console.error(e)
    }
  }

  const unarchiveOneUser = async (id: string) => {
    try {
      await dispatch(unarchiveUser(id)).unwrap()
      await dispatch(fetchArchivedUsers())
      toast.success('Пользователь успешно восстановлен!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить пользователя')
      }
      console.error(e)
    }
  }

  const handleOpen = (user?: UserWithPopulate) => {
    if (user) {
      setSelectedUser(user)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setUserToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setUserToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!userToActionId) return

    if (actionType === 'delete') {
      await deleteOneUser(userToActionId)
    } else {
      await unarchiveOneUser(userToActionId)
    }

    handleConfirmationClose()
  }

  return {
    users,
    user,
    selectedUser,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
    userToActionId,
  }
}

export default useArchivedUsersActions
