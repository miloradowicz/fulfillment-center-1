import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useEffect, useState } from 'react'
import { archiveStock, fetchArchivedStocks, fetchStockById, fetchStocks } from '@/store/thunks/stocksThunk.ts'
import { selectIsStocksLoading, selectOneStock } from '@/store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage } from '@/utils/helpers.ts'

export const useStockDetails = () => {
  const { stockId } = useParams()
  const dispatch = useAppDispatch()
  const stock = useAppSelector(selectOneStock)
  const isLoading = useAppSelector(selectIsStocksLoading)
  const navigate = useNavigate()

  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [writeOffModalOpen, setWriteOffModalOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('products')

  const tabs = [
    { value: 'products', label: 'Товары' },
    { value: 'defects', label: 'Брак' },
    { value: 'write-offs', label: 'Списания' },
    { value: 'logs', label: 'История' },
  ]

  const stockColumns = [
    { field: 'client', headerName: 'Клиент', flex: 1 },
    { field: 'title', headerName: 'Наименование', flex: 1 },
    { field: 'amount', headerName: 'Количество', flex: 1 },
    { field: 'article', headerName: 'Артикул', flex: 1 },
    { field: 'barcode', headerName: 'Штрихкод', flex: 1 },
  ]

  useEffect(() => {
    if (stockId) {
      dispatch(fetchStockById(stockId))
    }
  }, [dispatch, stockId])


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab) setCurrentTab(tab)
  }, [])

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('tab', value)
    window.history.replaceState(null, '', `${ location.pathname }?${ searchParams.toString() }`)
  }

  const handleArchive = async () => {
    if (stockId) {
      try {
        await dispatch(archiveStock(stockId)).unwrap()
        await dispatch(fetchStocks())
        await dispatch(fetchArchivedStocks())
        toast.success('Склад успешно архивирован!')
        navigate('/stocks')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка архивирования')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    hideArchiveModal()
  }

  const showArchiveModal = () => {
    setArchiveModalOpen(true)
  }

  const hideArchiveModal = () => {
    setArchiveModalOpen(false)
  }

  const openWriteOffModal = () => setWriteOffModalOpen(true)
  const closeWriteOffModal = () => setWriteOffModalOpen(false)

  return {
    stock,
    stockId,
    isLoading,
    stockColumns,
    archiveModalOpen,
    showArchiveModal,
    hideArchiveModal,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    writeOffModalOpen,
    openWriteOffModal,
    closeWriteOffModal,
    tabs,
    currentTab,
    handleTabChange,
  }
}
