import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { Arrival, InvoiceMutation, Order, ServiceArrival } from '@/types'
import { initialErrorState, initialServiceState, initialState } from '../state/invoiceState.ts'
import { toast } from 'react-toastify'
import { fetchClients } from '@/store/thunks/clientThunk.ts'
import {
  fetchArrivalByIdWithPopulate,
  fetchArrivalsByClientId,
  fetchPopulatedArrivals,
} from '@/store/thunks/arrivalThunk.ts'
import { selectAllClients } from '@/store/slices/clientSlice.ts'
import { selectAllArrivals, selectCreateError, selectLoadingAddArrival } from '@/store/slices/arrivalSlice.ts'
import { ErrorMessagesList } from '@/messages.ts'
import { fetchServices } from '@/store/thunks/serviceThunk.ts'
import { ErrorMessages, InvoiceData, ServiceField } from '../types/invoiceTypes.ts'
import { selectAllServices } from '@/store/slices/serviceSlice.ts'
import { useLocation } from 'react-router-dom'
import { PopoverType } from '@/components/CustomSelect/CustomSelect.tsx'
import { fetchOrdersByClientId } from '@/store/thunks/orderThunk.ts'
import { createInvoices, updateInvoice } from '@/store/thunks/invoiceThunk.ts'
import { selectAllOrders } from '@/store/slices/orderSlice.ts'
import { addDummyOption } from '@/utils/addDummuOption.ts'

export const useInvoiceForm = (initialData?: InvoiceData, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const error = useAppSelector(selectCreateError)
  const isLoading = useAppSelector(selectLoadingAddArrival)
  const services = useAppSelector(selectAllServices)
  const location = useLocation()

  const [form, setForm] = useState<InvoiceMutation>(
    initialData
      ? {
        client: initialData.client._id,
        services: [],
        associatedArrival: initialData.associatedArrival?._id,
        associatedOrder: initialData.associatedOrder?._id,
        paid_amount: initialData.paid_amount,
        discount: initialData.discount,
      }
      : { ...initialState },
  )

  const normalizeField = <T extends Partial<ServiceField>>(items?: T[]): T[] =>
    items?.map(item => ({
      ...item,
      ...(item.service !== undefined && {
        service: typeof item.service === 'string' ? item.service : item.service._id,
      }),
    })) || []

  const [servicesForm, setServicesForm] = useState<ServiceArrival[]>(
    normalizeField((initialData?.services.map(x => {
      const { _id: _, ...rest } = { ...x, service: x.service._id }
      return rest
    }) as ServiceArrival[]) || []),
  )

  const [newService, setNewService] = useState<ServiceArrival>({ ...initialServiceState })
  const [errors, setErrors] = useState<ErrorMessages>({ ...initialErrorState })
  const [activePopover, setActivePopover] = useState<PopoverType>(null)

  const [servicesModalOpen, setServicesModalOpen] = useState(false)

  const availableArrivals = useAppSelector(selectAllArrivals)
  const availableOrders = useAppSelector(selectAllOrders)
  const [totalAmount, setTotalAmount] = useState(0)

  const [availableArrivalsWithDummy, setAvailableArrivalsWithDummy] = useState<Pick<Arrival, '_id' | 'arrivalNumber'>[]>([])
  const [availableOrdersWithDummy, setAvailableOrdersWithDummy] = useState<Pick<Order, '_id' | 'orderNumber'>[]>([])

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchServices())

    if (form.client) {
      dispatch(fetchArrivalsByClientId(form.client))
      dispatch(fetchOrdersByClientId(form.client))
    }
  }, [dispatch, form.client])

  useEffect(() => {
    if (form.associatedArrival && availableArrivals?.length) {
      setAvailableArrivalsWithDummy(addDummyOption(availableArrivals, { _id: '', arrivalNumber: 'Убрать поставку' }))
    } else {
      setAvailableArrivalsWithDummy(availableArrivals ?? [])
    }

    if (form.associatedOrder && availableOrders?.length) {
      setAvailableOrdersWithDummy(addDummyOption(availableOrders, { _id: '', orderNumber: 'Убрать заказ' }))
    } else {
      setAvailableOrdersWithDummy(availableOrders ?? [])
    }
  }, [availableArrivals, availableOrders, form.associatedArrival, form.associatedOrder])

  useEffect(() => {
    const allServices: ServiceArrival[] = []

    if (availableArrivals?.length) {
      allServices.push(...(availableArrivals.find(x => x._id === form.associatedArrival)?.services ?? []))
    }

    if (availableOrders?.length) {
      allServices.push(...(availableOrders.find(x => x._id === form.associatedOrder)?.services ?? []))
    }

    if (servicesForm.length) {
      allServices.push(...servicesForm)
    }

    const totalAmount = allServices
      .map(x => {
        const service = services.find(y => y._id === x.service)

        return (
          x.service_amount *
          (x.service_price ?? service?.price) *
          (service?.type === 'внутренняя' ? 1 - (form.discount ?? 0) / 100 : 1)
        )
      })
      .reduce((a, x) => a + x, 0)

    setTotalAmount(totalAmount)
  },
  [
    form.associatedArrival,
    form.associatedOrder,
    form.services,
    servicesForm,
    form.discount,
    services,
    availableArrivals,
    availableOrders,
  ])

  const openModal = () => {
    setNewService(initialServiceState)

    setServicesModalOpen(true)
  }

  const addItem = () => {
    const selectedService = services.find(s => s._id === newService.service)

    const baseService = {
      service: newService.service,
      service_amount: Number(newService.service_amount),
      service_price: Number(newService.service_price) || Number(selectedService?.price) || 0,
    }

    if (!baseService.service || baseService.service_amount <= 0) {
      toast.warn('Заполните обязательные поля услуги.')
      return
    }

    setServicesForm(prev => [...prev, baseService as ServiceArrival])
    setServicesModalOpen(false)

    setNewService({ ...initialServiceState })
  }

  const deleteItem = <T>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      service: !value ? ErrorMessagesList.ServiceName : ErrorMessagesList.Default,
      service_amount: Number(value) <= 0 ? ErrorMessagesList.ServiceAmount : ErrorMessagesList.Default,
      discount: value !== '' && (Number(value) < 0 || Number(value) > 100) ? ErrorMessagesList.Discount : '',
      paid_amount: value !== '' && (Number(value) < 0 || Number(value) > totalAmount) ? ErrorMessagesList.PaidAmount : '',
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    try {
      const updatedForm = {
        client: form.client,
        services: servicesForm,
        ...(form.associatedArrival && { associateArrival: form.associatedArrival }),
        ...(form.associatedOrder && { associateOrder: form.associatedOrder }),
        ...(form.paid_amount && { paid_amount: form.paid_amount }),
        ...(form.discount && { discount: form.discount }),
      }

      if (initialData) {
        await dispatch(updateInvoice({ id: initialData._id, data: { ...updatedForm } })).unwrap()
        onSuccess?.()

        if (location.pathname === `/invoices/${ initialData._id }`) {
          await dispatch(fetchArrivalByIdWithPopulate(initialData._id))
        } else {
          await dispatch(fetchPopulatedArrivals())
        }

        toast.success('Счет успешно обновлен!')
      } else {
        await dispatch(createInvoices(updatedForm)).unwrap()
        toast.success('Счет успешно создан!')
        await dispatch(fetchPopulatedArrivals())
      }

      setForm({ ...initialState })
      setServicesForm([])

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        return error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message)
      } else if (typeof error === 'string') {
        toast.error(error)
      }
    }
  }

  return {
    services,
    isLoading,
    form,
    setForm,
    errors,
    servicesModalOpen,
    setServicesModalOpen,
    newService,
    setNewService,
    servicesForm,
    setServicesForm,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
    clients,
    activePopover,
    setActivePopover,
    availableArrivals,
    availableOrders,
    totalAmount,
    availableArrivalsWithDummy,
    availableOrdersWithDummy,
  }
}
