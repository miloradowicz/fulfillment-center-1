import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { selectLoadingFetchOneService, selectService } from '@/store/slices/serviceSlice.ts'
import { fetchServiceById } from '@/store/thunks/serviceThunk.ts'
import { Badge } from '@/components/ui/badge.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { formatMoney } from '@/utils/formatMoney.ts'

interface Props {
  serviceId?: string
}

const ServiceDetails: React.FC<Props> = ({ serviceId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const service = useAppSelector(selectService)
  const loading = useAppSelector(selectLoadingFetchOneService)

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId))
      navigate(`/services/${ serviceId }`, { replace: true })
    }
  }, [dispatch, serviceId, navigate])

  return (
    <>
      {loading && <Loader />}

      {service ? (
        <div className="max-w-[1000px] mx-auto px-3 py-2 bg-white rounded-2xl space-y-6">
          <div className="flex flex-wrap">
            <Badge className="text-sm font-medium bg-green-100 text-green-800">{service.type}</Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">{service.name}</h1>
            <p className="text-lg font-semibold text-gray-700">
              Категория: <span className="text-blue-700">{service.serviceCategory.name}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">
              Цена: <span className="text-blue-700">{formatMoney(service.price)} ₽</span>
            </p>
          </div>

          {service.description ? (
            <div className="prose max-w-none text-muted-foreground">
              <p>{service.description}</p>
            </div>
          ) : (
            <p className="italic text-muted-foreground">Описание отсутствует</p>
          )}
        </div>
      ) : (
        <p className="text-center font-bold text-muted-foreground">Услуга не найдена...</p>
      )}
    </>
  )
}

export default ServiceDetails
