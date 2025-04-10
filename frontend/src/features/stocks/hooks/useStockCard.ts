import { useAppDispatch } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteStock, fetchStocks } from '@/store/thunks/stocksThunk.ts'
import { toast } from 'react-toastify'

export const useStockCard = () => {
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const fetchAllStocks = useCallback(async () => {
    await dispatch(fetchStocks())
  }, [dispatch])

  useEffect(() => {
    void fetchAllStocks()
  }, [dispatch, fetchAllStocks])

  const handleClose = () => setIsOpen(false)

  const deleteOneStock = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот склад?')) {
        await dispatch(deleteStock(id))
        await fetchAllStocks()
        toast.success('Склад успешно удален.')
      } else {
        toast.info('Вы отменили удаление склада.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    deleteOneStock,
    isOpen,
    handleClose,
  }
}
