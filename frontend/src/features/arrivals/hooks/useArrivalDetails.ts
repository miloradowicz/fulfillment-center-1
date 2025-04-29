import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  selectArrivalWithPopulate,
  selectLoadingFetchArrival,
} from '@/store/slices/arrivalSlice.ts'
import { archiveArrival, fetchArrivalByIdWithPopulate } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'
import { hasMessage } from '@/utils/helpers.ts'

const useArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)

  const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [tabs, setTabs] = useState(0)

  const arrivalStatusStyles: Record<string, string> = {
    'ожидается доставка': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors',
    'получена': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors',
    'отсортирована': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors',
    'default': 'bg-primary/10 text-primary/80 border hover:bg-primary/20 hover:text-primary transition-colors',
  }

  const tabStyles =
    'data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/5 hover:text-primary sm:px-3 py-1 my-1 text-sm rounded-xl transition-all cursor-pointer font-bold'

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])

  const handleArchive = async () => {
    if (arrivalId) {
      try {
        await dispatch(archiveArrival(arrivalId)).unwrap()
        toast.success('Поставка успешно архивирована!')
        setIsArchived(!isArchived)
        navigate('/arrivals')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка архивирования')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    setConfirmArchiveModalOpen(false)
  }

  return {
    arrival,
    loading,
    confirmArchiveModalOpen,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    setConfirmArchiveModalOpen,
    tabs,
    setTabs,
    arrivalStatusStyles,
    tabStyles,
  }
}

export default useArrivalDetails
