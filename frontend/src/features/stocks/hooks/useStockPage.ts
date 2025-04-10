import { useEffect, useState } from 'react'
import { selectAllStocks, selectIsStocksLoading } from '@/store/slices/stocksSlice.ts'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'

import { fetchStocks } from '@/store/thunks/stocksThunk.ts'

export const useStockPage = () => {
  const dispatch = useAppDispatch()
  const stocks = useAppSelector(selectAllStocks)
  const isLoading = useAppSelector(selectIsStocksLoading)
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = () => setOpen(true)

  useEffect(() => {
    dispatch(fetchStocks())
  }, [dispatch])

  const handleClose = async () => {
    setOpen(false)
  }

  return {
    open,
    handleOpen,
    isLoading,
    handleClose,
    stocks,
  }
}
