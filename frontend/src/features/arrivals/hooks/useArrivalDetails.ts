import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  selectArrivalWithPopulate,
  selectLoadingFetchArrival,
} from '@/store/slices/arrivalSlice.ts'
import { archiveArrival, cancelArrival, fetchArrivalByIdWithPopulate } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'
import { hasMessage } from '@/utils/helpers.ts'
import { ExtendedNavigator, getOS } from '@/utils/getOS.ts'

const useArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)

  const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false)
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false)
  const [isCanceled, setIsCanceled] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [tabs, setTabs] = useState(0)
  const [os, setOS] = useState<string>('Detecting...')

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])


  useEffect(() => {
    getOS(navigator as ExtendedNavigator).then(setOS)
  }, [])

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


  const paddingTop = os === 'Mac OS' ? 'pt-0' : os === 'Windows' ? 'pt-0': os === 'Android' ? 'pt-0' : 'pt-2'
  const heightTab = os === 'Mac OS' ? 'h-[45px]' : os === 'Windows' ? 'h-[50px]' : os === 'Android' ? 'h-auto' : 'h-[45px]'

  const handleCancel = async () => {
    if (arrivalId) {
      try {
        await dispatch(cancelArrival(arrivalId)).unwrap()
        toast.success('Поставка успешно отменена!')
        setIsCanceled(!isCanceled)
        navigate('/arrivals')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка отмены')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    setConfirmCancelModalOpen(false)
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
    handleCancel,
    confirmCancelModalOpen,
    setConfirmCancelModalOpen,
    paddingTop,
    heightTab,
  }
}

export default useArrivalDetails
