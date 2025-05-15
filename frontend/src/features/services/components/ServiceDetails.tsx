import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { selectLoadingFetchOneService, selectService } from '@/store/slices/serviceSlice.ts'
import { fetchServiceById } from '@/store/thunks/serviceThunk.ts'
import { Badge } from '@/components/ui/badge.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import LogsAccordionView from '@/components/LogsAccordionView/LogsAccordionView.tsx'
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
        <div className="max-w-[1000px] flex flex-col mx-auto px-3 py-2 bg-white rounded-2xl space-y-6">
          <div className="flex flex-wrap">
            <Badge className="text-sm font-medium bg-green-100 text-green-800">{service.type}</Badge>
          </div>

          <Separator />

          <div className="space-y-2 text-[16px]">
            <h3 className="text-[18px] font-bold text-gray-800 mb-4">{service.name}</h3>
            <div className="flex text-gray-700 mb-1">
              <span className="w-[30%]">Категория:</span>
              <span className="w-[70%] text-blue-500 truncate font-bold text-wrap">{service.serviceCategory.name}</span>
            </div>

            <div className="flex text-gray-700">
              <span className="w-[30%]">Цена:</span>
              <span className="w-[70%] text-blue-500 font-bold text-wrap">{formatMoney(service.price)} ₽</span>
            </div>
          </div>

          {service.description ? (
            <div className="prose max-w-none text-gray-600 max-h-[300px] overflow-y-auto">
              <p>{service.description}</p>
            </div>
          ) : (
            <p className="italic text-muted-foreground">Описание отсутствует</p>
          )}
          <div className="mt-2">
            <h4 className="text-center font-bold text-gray-600 mb-4">История изменений:</h4>
            {service.logs && service.logs.length > 0 ? (
              <LogsAccordionView logs={service.logs} />
            ) : (
              <p className="px-2 text-sm text-muted-foreground">История изменений отсутствует</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-bold text-muted-foreground">Услуга не найдена...</p>
      )}
    </>
  )
}

export default ServiceDetails
