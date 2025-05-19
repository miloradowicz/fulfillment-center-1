import * as React from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks.ts'
import ArchivedClients from '../components/ArchivedClients.tsx'
import ArchivedArrivals from '../components/ArchivedArrivals.tsx'
import ArchivedProducts from '../components/ArchivedProducts.tsx'
import ArchivedStocks from '../components/ArchivedStocks.tsx'
import ArchivedCounterparties from '../components/ArchivedCounterparties.tsx'
import ArchivedTasks from '../components/ArchivedTasks.tsx'
import ArchivedOrders from '../components/ArchivedOrders.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { ArchiveRestore } from 'lucide-react'
import ArchivedUsers from '@/features/archive/components/ArchivedUsers.tsx'
import ArchivedServices from '@/features/archive/components/ArchivedServices.tsx'
import ArchivedInvoices from '@/features/archive/components/ArchivedInvoices.tsx'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { tabTriggerStyles } from '@/utils/commonStyles.ts'
import { fetchArchivedArrivals } from '@/store/thunks/arrivalThunk.ts'
import { fetchArchivedOrders } from '@/store/thunks/orderThunk.ts'
import { fetchArchivedTasks } from '@/store/thunks/tasksThunk.ts'
import { fetchArchivedStocks } from '@/store/thunks/stocksThunk.ts'
import { fetchArchivedClients } from '@/store/thunks/clientThunk.ts'
import { fetchArchivedProducts } from '@/store/thunks/productThunk.ts'
import { fetchArchivedUsers } from '@/store/thunks/userThunk.ts'
import { fetchArchivedServices } from '@/store/thunks/serviceThunk.ts'
import { fetchArchivedInvoices } from '@/store/thunks/invoiceThunk.ts'
import { fetchAllArchivedCounterparties } from '@/store/thunks/counterpartyThunk.ts'

const ArchivePage = () =>  {
  const [value, setValue] = useState('clients')
  const location = useLocation()
  const navigate = useNavigate()

  const tabNames = React.useMemo(() => ['clients', 'products','arrivals', 'orders', 'tasks', 'stocks', 'counterparties', 'users', 'services', 'invoices'], [])

  const handleChange = (newTab: string) => {
    navigate({
      pathname: '/archives',
      search: `?tab=${ newTab }`,
    })
    setValue(newTab)
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tab = queryParams.get('tab')
    if (tab && tabNames.includes(tab)) {
      setValue(tab)
    }
  }, [location, tabNames])

  const dispatch = useAppDispatch()

  useEffect(() => {
    switch (value) {
    case 'clients':
      dispatch(fetchArchivedClients())
      break
    case 'products':
      dispatch(fetchArchivedProducts())
      break
    case 'arrivals':
      dispatch(fetchArchivedArrivals())
      break
    case 'orders':
      dispatch(fetchArchivedOrders())
      break
    case 'tasks':
      dispatch(fetchArchivedTasks())
      break
    case 'stocks':
      dispatch(fetchArchivedStocks())
      break
    case 'counterparties':
      dispatch(fetchAllArchivedCounterparties())
      break
    case 'users':
      dispatch(fetchArchivedUsers())
      break
    case 'services':
      dispatch(fetchArchivedServices())
      break
    case 'invoices':
      dispatch(fetchArchivedInvoices())
      break
    default:
      break
    }
  }, [value, dispatch])

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="my-7">
        <CustomTitle className="flex justify-center" text="Архив" icon={<ArchiveRestore size={25} />} />
      </div>

      <Tabs value={value} onValueChange={handleChange} className="w-full">
        <TabsList className="mb-5 w-full h-auto rounded-3xl">
          <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
            <TabsTrigger className={tabTriggerStyles} value="clients">Клиенты</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="products">Товары</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles}  value="arrivals">Поставки</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="orders">Заказы</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="tasks">Задачи</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="stocks">Склады</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="counterparties">Контрагенты</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="users">Сотрудники</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="services">Услуги</TabsTrigger>
            <TabsTrigger className={tabTriggerStyles} value="invoices">Счета</TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="clients">
          < ArchivedClients/>
        </TabsContent>

        <TabsContent value="products">
          < ArchivedProducts/>
        </TabsContent>

        <TabsContent value="arrivals">
          < ArchivedArrivals/>
        </TabsContent>

        <TabsContent value="orders">
          < ArchivedOrders/>
        </TabsContent>

        <TabsContent value="tasks">
          < ArchivedTasks/>
        </TabsContent>

        <TabsContent value="stocks">
          < ArchivedStocks/>
        </TabsContent>

        <TabsContent value="counterparties">
          < ArchivedCounterparties/>
        </TabsContent>

        <TabsContent value="users">
          < ArchivedUsers/>
        </TabsContent>

        <TabsContent value="services">
          < ArchivedServices/>
        </TabsContent>

        <TabsContent value="invoices">
          < ArchivedInvoices/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ArchivePage
