import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectArrivalWithPopulate, selectLoadingFetchArrival, selectArrivalError } from "../store/slices/arrivalSlice"
import { deleteArrival, fetchArrivalByIdWithPopulate } from "../store/thunks/arrivalThunk"
import { toast } from "react-toastify"

const useArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)
  const error = useAppSelector(selectArrivalError)

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])

  const navigateBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (error) {
      toast.error(error?.message)
    }
  }, [error])

  const handleDelete = async () => {
    if (arrivalId) {
      await dispatch(deleteArrival(arrivalId))
    }

    navigateBack()
  }

  const handleEdit = () => {
    if (arrivalId) {
      navigate(`/arrivals/${arrivalId}/edit`)
    }

    navigate('/not-found')
  }

  return {
    arrivalId,
    arrival,
    loading,
    error,
    handleDelete,
    handleEdit,
    navigateBack
  }
}

export default useArrivalDetails