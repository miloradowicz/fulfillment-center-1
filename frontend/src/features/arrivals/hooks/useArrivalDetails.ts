import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  selectArrivalError,
  selectArrivalWithPopulate,
  selectLoadingFetchArrival,
} from '../../../store/slices/arrivalSlice'
import { deleteArrival, fetchArrivalByIdWithPopulate } from '../../../store/thunks/arrivalThunk'
import { toast } from 'react-toastify'
import { hasMessage } from '../../../utils/helpers'

const useArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)
  const error = useAppSelector(selectArrivalError)
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])

  const navigateBack = () => {
    navigate(-1)
  }

  const handleDelete = async () => {
    if (arrivalId) {
      try {
        await dispatch(deleteArrival(arrivalId)).unwrap()
        toast.success('Поставка удалена')
        setIsDeleted(true)
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка удаления')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }

    hideConfirmDeleteModal()
  }

  const handleEdit = () => {
    if (arrivalId) {
      navigate(`/arrivals/${ arrivalId }/edit`)
    }

    navigate('/not-found')
  }

  const showConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(true)
  }

  const hideConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(false)
  }

  return {
    arrivalId,
    arrival,
    loading,
    error,
    confirmDeleteModalOpen,
    isDeleted,
    showConfirmDeleteModal,
    hideConfirmDeleteModal,
    handleDelete,
    handleEdit,
    navigateBack,
  }
}

export default useArrivalDetails
