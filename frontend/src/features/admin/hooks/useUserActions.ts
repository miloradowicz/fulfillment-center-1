import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useCallback, useEffect, useState } from 'react'
import {
  archiveUser, fetchArchivedUsers,
  fetchUserById,
  fetchUsers,
} from '@/store/thunks/userThunk'
import { toast } from 'react-toastify'
import {
  selectUsersLoading,
  selectUsersError,
  selectAllUsers,
  selectSelectedUser,
} from '@/store/slices/userSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWithPopulate } from '@/types'
import { hasMessage, isGlobalError } from '@/utils/helpers'

const useUserActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [userToArchiveId, setUserToArchiveId] = useState<string | null>(null)
  const users = useAppSelector(selectAllUsers)
  const [selectedUser, setSelectedUser] = useState<UserWithPopulate | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector(selectSelectedUser)
  const loading = useAppSelector(selectUsersLoading)
  const error = useAppSelector(selectUsersError)

  const fetchAllUsers = useCallback(async () => {
    await dispatch(fetchUsers())
  }, [dispatch])

  const fetchUser = useCallback(async (id: string) => {
    await dispatch(fetchUserById(id))
  }, [dispatch])

  useEffect(() => {
    void fetchAllUsers()
  }, [fetchAllUsers])

  useEffect(() => {
    if (id) {
      void fetchUser(id)
    }
  }, [id, fetchUser])

  const archiveOneUser = async (id: string) => {
    try {
      await dispatch(archiveUser(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllUsers()
      } else {
        navigate('/users')
      }
      await dispatch(fetchArchivedUsers())
      toast.success('Пользователь успешно архивирован!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось архивировать пользователя')
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

  const handleConfirmationOpen = (id: string) => {
    setUserToArchiveId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setUserToArchiveId(null)
  }

  const handleConfirmationArchive = async () => {
    if (userToArchiveId) await archiveOneUser(userToArchiveId)
    handleConfirmationClose()
  }

  return {
    users,
    user,
    selectedUser,
    archiveOneUser,
    fetchAllUsers,
    fetchUser,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
    userToArchiveId,
  }
}

export default useUserActions
