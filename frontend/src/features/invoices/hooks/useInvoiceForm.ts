import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { Arrival, InvoiceMutation, Order, ServiceArrival, ServiceType } from '@/types'
import { initialErrorState, initialServiceState, initialState } from '../state/invoiceState.ts'
import { toast } from 'react-toastify'
import { fetchClients } from '@/store/thunks/clientThunk.ts'
import { fetchArrivalsByClientId } from '@/store/thunks/arrivalThunk.ts'
import { selectAllClients } from '@/store/slices/clientSlice.ts'
import { ErrorMessagesList } from '@/messages.ts'
import { fetchServices } from '@/store/thunks/serviceThunk.ts'
import { ErrorMessages, InvoiceData, ServiceField } from '../types/invoiceTypes.ts'
import { selectAllServices } from '@/store/slices/serviceSlice.ts'
import { useLocation } from 'react-router-dom'
import { PopoverType } from '@/components/CustomSelect/CustomSelect.tsx'
import { fetchOrdersByClientId } from '@/store/thunks/orderThunk.ts'
import { createInvoices, fetchInvoiceById, fetchInvoices, updateInvoice } from '@/store/thunks/invoiceThunk.ts'
import { selectAllOrders } from '@/store/slices/orderSlice.ts'
import { addDummyOption } from '@/utils/addDummuOption.ts'
import { clearCreateAndUpdateError, clearErrors, selectInvoiceCreateAndUpdateError, selectLoadingAdd } from '@/store/slices/invoiceSlice.ts'
import { selectAllArrivals } from '@/store/slices/arrivalSlice.ts'

export const useInvoiceForm = (initialData?: InvoiceData, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const error = useAppSelector(selectInvoiceCreateAndUpdateError)
  const isLoading = useAppSelector(selectLoadingAdd)
  const services = useAppSelector(selectAllServices)
  const location = useLocation()
  const [invoiceStatus, setInvoiceStatus] = useState<'в ожидании' | 'частично оплачено' | 'оплачено'>('в ожидании')

  const [form, setForm] = useState<InvoiceMutation>(
    initialData
      ? {
        client: initialData.client._id,
        services: [],
        associatedArrival: initialData.associatedArrival,
        associatedOrder: initialData.associatedOrder,
        paid_amount: initialData.paid_amount,
        discount: initialData.discount,
      }
      : { ...initialState },
  )

  const [lockArrival, setLockArrival] = useState(!!initialData?.associatedArrival)
  const [lockOrder, setLockOrder] = useState(!!initialData?.associatedOrder)

  const normalizeField = <T extends ServiceField>(items?: T[]): (Omit<T, 'service'> & { service: string, service_type: ServiceType })[] =>
    items?.map(item => ({
      ...item,
      ...({
        service: typeof item.service === 'string' ? item.service : item.service._id,
        service_type: item.service_type ?? 'внутренняя',
      }),
    })) || []

  const [arrivalServicesForm, setArrivalServicesForm] = useState<ServiceArrival[]>(
    normalizeField((initialData?.associatedArrivalServices) || []),
  )

  const [orderServicesForm, setOrderServicesForm] = useState<ServiceArrival[]>(
    normalizeField((initialData?.associatedOrderServices) || []),
  )

  const [servicesForm, setServicesForm] = useState<ServiceArrival[]>(
    normalizeField((initialData?.services) || []),
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
    dispatch(clearErrors())
    setErrors({ ...initialErrorState })
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchServices())

    if (form.client) {
      dispatch(fetchArrivalsByClientId(form.client))
      dispatch(fetchOrdersByClientId(form.client))
    }
  }, [dispatch, form.client])

  useEffect(() => {
    if (lockArrival && form.associatedArrival !== initialData?.associatedArrival) {
      setLockArrival(false)
    }
  }, [form.associatedArrival, initialData?.associatedArrival, lockArrival])

  useEffect(() => {
    if (lockOrder && form.associatedOrder !== initialData?.associatedOrder) {
      setLockOrder(false)
    }
  }, [form.associatedOrder, initialData?.associatedOrder, lockOrder])

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
    if (!lockArrival && availableArrivals?.length) {
      const arrival = availableArrivals.find(x => x._id === form.associatedArrival)
      setArrivalServicesForm(arrival?.services?.map(x => {
        const service = services.find(y => y._id === x.service)

        return ({
          ...x,
          service_amount: x.service_amount ?? 1,
          service_price: x.service_price ?? service?.price,
          service_type: x.service_type ?? service?.type,
        })
      }) ?? [])
    }

    if (!lockOrder && availableOrders?.length) {
      const order = availableOrders.find(x => x._id === form.associatedOrder)
      setOrderServicesForm(order?.services?.map(x => {
        const service = services.find(y => y._id === x.service)

        return {
          ...x,
          service_amount: x.service_amount ?? 1,
          service_price: x.service_price ?? service?.price,
          service_type: x.service_type ?? service?.type,
        }
      }) ?? [],
      )
    }
  },
  [
    lockArrival,
    lockOrder,
    form.associatedArrival,
    form.associatedOrder,
    availableArrivals,
    availableOrders,
    services,
  ])

  useEffect(() => {
    const totalAmount = servicesForm.concat(arrivalServicesForm, orderServicesForm)
      .map(x => {
        const service = services.find(y => y._id === x.service)

        return (
          x.service_amount *
                  (x.service_price ?? service?.price) *
                  ((x.service_type ?? service?.type) === 'внутренняя' ? 1 - (form.discount ?? 0) / 100 : 1)
        )
      })
      .reduce((a, x) => a + x, 0)

    setTotalAmount(totalAmount)
  },
  [
    arrivalServicesForm,
    orderServicesForm,
    servicesForm,
    form.discount,
    services,
  ])

  useEffect(() => {
    const paid = Number(form.paid_amount) || 0

    if (!paid) {
      setInvoiceStatus('в ожидании')
    } else if (paid < totalAmount) {
      setInvoiceStatus('частично оплачено')
    } else {
      setInvoiceStatus('оплачено')
    }
  }, [totalAmount, form.paid_amount])

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
      service_type: newService.service_type,
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

  const validate = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      service: !value ? ErrorMessagesList.ServiceName : ErrorMessagesList.Default,
      service_amount: Number(value) <= 0 ? ErrorMessagesList.ServiceAmount : ErrorMessagesList.Default,
      discount: value !== '' && (Number(value) < 0 || Number(value) > 100) ? ErrorMessagesList.Discount : '',
      paid_amount: value !== '' && (Number(value) < 0 || Number(value) > totalAmount) ? ErrorMessagesList.PaidAmount : '',
    }

    if (field === 'associatedArrival') {
      errorMessages.associatedArrival = !form.associatedOrder && !value ? ErrorMessagesList.AssociatedArrival : ErrorMessagesList.Default
      errorMessages.associatedOrder = !form.associatedOrder && !value ? ErrorMessagesList.AssociatedArrival : ErrorMessagesList.Default
    } else if (field === 'associatedOrder') {
      errorMessages.associatedArrival = !form.associatedArrival && !value ? ErrorMessagesList.AssociatedArrival : ErrorMessagesList.Default
      errorMessages.associatedOrder = !form.associatedArrival && !value ? ErrorMessagesList.AssociatedArrival : ErrorMessagesList.Default
    }

    return errorMessages[field]
  }

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const message = validate(field, value)

    if (field === 'associatedArrival' || field === 'associatedOrder') {
      field = 'associatedArrival'
      dispatch(clearCreateAndUpdateError(field))
    }

    setErrors(prev => ({
      ...prev,
      [field]: message || '',
    }))
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (['client', 'associatedArrival', 'associatedOrder'].map(key => {
      try {
        return validate(key as keyof ErrorMessages, form[key as keyof Pick<InvoiceMutation, 'client' | 'associatedArrival' | 'associatedOrder'>] ?? '')
      } catch {
        return ''
      }
    }).some(x => x !== '')) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    if (Object.values(errors).filter(Boolean).length) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    try {
      const updatedForm = {
        client: form.client,
        services: servicesForm,
        associatedArrival: form.associatedArrival || null,
        associatedOrder: form.associatedOrder || null,
        associatedArrivalServices: arrivalServicesForm,
        associatedOrderServices: orderServicesForm,
        paid_amount: form.paid_amount || 0,
        discount: form.discount || 0,
      }

      if (initialData) {
        await dispatch(updateInvoice({ id: initialData._id, data: { ...updatedForm } })).unwrap()

        if (location.pathname === `/invoices/${ initialData._id }`) {
          await dispatch(fetchInvoiceById(initialData._id))
        } else {
          await dispatch(fetchInvoices())
        }

        toast.success('Счет успешно обновлен!')
      } else {
        await dispatch(createInvoices(updatedForm)).unwrap()
        toast.success('Счет успешно создан!')
        await dispatch(fetchInvoices())
      }

      setForm({ ...initialState })
      setArrivalServicesForm([])
      setOrderServicesForm([])
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
    invoiceStatus,
  }
}
