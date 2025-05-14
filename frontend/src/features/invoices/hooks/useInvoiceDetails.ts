import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toast } from 'react-toastify'
import { fetchInvoiceById, archiveInvoice } from '@/store/thunks/invoiceThunk'
import { selectOneInvoice, selectLoadingFetch } from '@/store/slices/invoiceSlice'
import { hasMessage } from '@/utils/helpers'
import { saveAs } from 'file-saver'
import { Service, ServiceType } from '@/types'
import * as XLSX from 'xlsx-js-style'
import { formatMoney } from '@/utils/formatMoney.ts'

const useInvoiceDetails = () => {
  const { invoiceId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const invoice = useAppSelector(selectOneInvoice)
  const loading = useAppSelector(selectLoadingFetch)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false)
  const [tabs, setTabs] = useState(0)

  const invoiceStatusStyles: Record<'в ожидании' | 'оплачено' | 'частично оплачено', string> = {
    'оплачено': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors',
    'в ожидании': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors',
    'частично оплачено': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors',
  }

  const tabStyles =
    'data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/5 hover:text-primary sm:px-3 py-1 my-1 text-sm rounded-xl transition-all cursor-pointer font-bold'

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId))
    }
  }, [dispatch, invoiceId])

  useEffect(() => {
    if (invoice) {
      if (Array.isArray(invoice?.associatedArrivalServices) && invoice?.associatedArrivalServices.length > 0) {
        setTabs(0)
      } else if (Array.isArray(invoice?.associatedOrderServices) && invoice?.associatedOrderServices.length > 0) {
        setTabs(1)
      } else if (Array.isArray(invoice.services) && invoice.services.length > 0) {
        setTabs(3)
      } else {
        setTabs(2)
      }
    }
  }, [invoice])


  const handleArchive = async () => {
    if (invoiceId) {
      try {
        await dispatch(archiveInvoice(invoiceId)).unwrap()
        toast.success('Счёт успешно архивирован!')
        navigate('/admin?tab=invoices')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message)
        } else {
          console.error(e)
          toast.error('Ошибка архивирования')
        }
      }
    }
    setConfirmArchiveModalOpen(false)
  }

  const handleExport = () => {
    if (!invoice) return

    const {
      invoiceNumber,
      client,
      services = [],
      associatedArrivalServices = [],
      associatedOrderServices = [],
      totalAmount,
      discount = 0,
    } = invoice

    const wsData = []
    const merges: XLSX.Range[] = []
    const styles: { [cell: string]: XLSX.CellObject } = {}
    const defaultFont = { name: 'Arial', sz: 14 }
    let rowIndex = 0

    const clientInfo = [
      ['Имя клиента', client.name],
      ['Телефон', client.phone_number],
      ['Email', client.email || ''],
      ['Адрес', client.address || ''],
      [],
    ]

    clientInfo.forEach((row, i) => {
      wsData.push(row)
      row.forEach((val, colIndex) => {
        const cell = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
        const thinBorder = { style: 'thin', color: { rgb: '000000' } }
        styles[cell] = {
          v: val,
          t: typeof val === 'number' ? 'n' : 's',
          s: {
            font: { ...defaultFont, bold: colIndex === 0 },
            border: i < 4 ? { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder } : undefined,
            alignment: { vertical: 'center' },
          },
        }
      })
      rowIndex++
    })

    const addServiceSection = (
      servicesArray: Array<{ service: Service; service_amount?: number; service_price?: number; _id: string; service_type?: ServiceType }>,
      title: string,
    ) => {
      if (!servicesArray?.length) return

      wsData.push([title])
      const titleCell = `A${ rowIndex + 1 }`
      styles[titleCell] = {
        v: title,
        t: 's',
        s: {
          font: {
            ...defaultFont,
            bold: true,
            sz: 16,
            color: { rgb: '003cb3' },
          },
          alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        },
      }
      merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 5 } })
      rowIndex++

      const headers = ['Название услуги', 'Категория', 'Тип', 'Цена', 'Количество', 'Сумма']
      wsData.push(headers)
      headers.forEach((_, colIndex) => {
        const cell = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
        const thinBorder = { style: 'thin', color: { rgb: '000000' } }
        styles[cell] = {
          v: headers[colIndex],
          t: 's',
          s: {
            font: { ...defaultFont, bold: true },
            border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
            alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
            numFmt: '0.00 "₽"',
          },
        }
      })
      rowIndex++

      servicesArray.forEach(service => {
        const row = [
          service.service?.name || '',
          typeof service.service?.serviceCategory === 'object' ? service.service.serviceCategory.name : service.service?.serviceCategory || '',
          service?.service_type || '',
          `${ formatMoney(service.service_price ?? service.service?.price ?? 0) } ₽`,
          service.service_amount || 0,
          `${ formatMoney((service.service_price ?? service.service?.price ?? 0) * (service.service_amount || 0)) } ₽`,
        ]
        wsData.push(row)

        row.forEach((val, colIndex) => {
          const cell = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
          const thinBorder = { style: 'thin', color: { rgb: '000000' } }
          const cellType = typeof val === 'number' ? 'n' : 's'

          const cellStyles: XLSX.CellObject = {
            v: val,
            t: cellType,
            s: {
              font: defaultFont,
              border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
              alignment: { vertical: 'center', wrapText: true },
            },
          }

          if (colIndex === 4) {
            cellStyles.s.alignment = { vertical: 'center', horizontal: 'center' }
          }

          styles[cell] = cellStyles
        })
        rowIndex++
      })

      wsData.push([])
      rowIndex++
    }

    addServiceSection(associatedArrivalServices, 'Услуги из поставки')
    addServiceSection(associatedOrderServices, 'Услуги из заказа')
    addServiceSection(services, 'Дополнительные услуги')

    const discountValue = `${ discount }%`
    const discountRow = ['', '', '', '', 'Скидка:', discountValue]

    wsData.push(discountRow)
    discountRow.forEach((val, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
      const thinBorder = { style: 'thin', color: { rgb: '000000' } }
      styles[cell] = {
        v: val,
        t: 's',
        s: {
          font: {
            ...defaultFont,
            bold: colIndex >= 3,
            color: colIndex === 4 ? { rgb: '003cb3' } : { rgb: '000000' },
          },
          border: colIndex >= 4 ? { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder } : undefined,
          alignment: { vertical: 'center' },
        },
      }
    })
    rowIndex++

    const totalRow = ['', '', '', '', 'Итого:', `${ formatMoney(totalAmount) } ₽`]
    wsData.push(totalRow)
    totalRow.forEach((val, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
      const thinBorder = { style: 'thin', color: { rgb: '000000' } }
      styles[cell] = {
        v: val,
        t: 's',
        s: {
          font: {
            ...defaultFont,
            bold: true,
            color: colIndex === 4 ? { rgb: '003cb3' } : { rgb: '000000' },
          },
          border: colIndex >= 4 ? { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder } : undefined,
          alignment: { vertical: 'center' },
        },
      }
    })

    const ws = XLSX.utils.aoa_to_sheet(wsData)

    Object.entries(styles).forEach(([cell, cellObj]) => {
      ws[cell] = { ...ws[cell], ...cellObj }
    })

    ws['!merges'] = merges
    ws['!cols'] = [
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ]
    ws['!rows'] = Array.from({ length: rowIndex + 1 }, () => ({ hpt: 40 }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Счёт')

    const fileName = `${ invoiceNumber }.xlsx`
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
  }

  return {
    invoice,
    loading,
    editModalOpen,
    setEditModalOpen,
    confirmArchiveModalOpen,
    setConfirmArchiveModalOpen,
    handleArchive,
    tabs,
    setTabs,
    invoiceStatusStyles,
    tabStyles,
    handleExport,
  }
}

export default useInvoiceDetails
