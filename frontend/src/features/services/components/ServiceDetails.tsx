import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { selectService } from '@/store/slices/serviceSlice.ts'
import { fetchServiceById } from '@/store/thunks/serviceThunk.ts'
import { Badge } from '@/components/ui/badge.tsx'

interface Props {
  serviceId?: string
}

const ServiceDetails: React.FC<Props> = ({ serviceId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const service = useAppSelector(selectService)

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId))
      navigate(`/services/${ serviceId }`, { replace: true })
    }
  }, [dispatch, serviceId, navigate])

  if (!service) {
    return (
      <div className="text-center py-10 text-gray-500">
        Услуга не найдена...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-2 bg-white rounded-2xl space-y-6">
      <div className="flex flex-wrap">
        <Badge className="text-sm font-medium bg-green-100 text-green-800">
          {service.type}
        </Badge>
      </div>

      <hr className="border-t border-gray-200"/>


      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">{service.name}</h1>
        <p className="text-lg font-semibold text-gray-700">
          Категория: <span className="text-blue-700">{service.serviceCategory.name}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          Цена: <span className="text-blue-700">{service.price}</span>
        </p>
      </div>

      {service.description ? (
        <div className="prose max-w-none text-gray-600">
          <p>{service.description}</p>
        </div>
      ) : (
        <p className="italic text-gray-400">Описание отсутствует</p>
      )}
    </div>
  )
}

export default ServiceDetails
