import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectPopulatedArrivals } from '../../../store/slices/arrivalSlice.ts'
import { useCallback, useEffect } from 'react'
import { deleteArrival, fetchPopulatedArrivals } from '../../../store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'

export const useArrivalsList = () => {
  const dispatch = useAppDispatch()
  const arrivals = useAppSelector(selectPopulatedArrivals)

  const fetchAllArrivals = useCallback(async () => {
    await dispatch(fetchPopulatedArrivals())
  }, [dispatch])

  useEffect(() => {
    void fetchAllArrivals()
  }, [dispatch, fetchAllArrivals])

  const deleteOneArrival = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить эту поставку?')) {
        await dispatch(deleteArrival(id))
        void fetchAllArrivals()
      } else {
        toast.info('Вы отменили удаление поставки')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    arrivals,
    deleteOneArrival,
  }
}
