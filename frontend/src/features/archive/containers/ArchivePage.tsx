import * as React from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectLoadingArchiveClient } from '@/store/slices/clientSlice.ts'
import { useAppSelector } from '@/app/hooks.ts'
import ArchivedClients from '../components/ArchivedClients.tsx'
import ArchivedArrivals from '../components/ArchivedArrivals.tsx'
import { selectLoadingFetchArchivedArrivals } from '@/store/slices/arrivalSlice.ts'
import ArchivedProducts from '../components/ArchivedProducts.tsx'
import { selectLoadingFetchArchivedProduct } from '@/store/slices/productSlice.ts'
import ArchivedStocks from '../components/ArchivedStocks.tsx'
import { selectLoadingFetchArchivedStocks } from '@/store/slices/stocksSlice.ts'
import ArchivedCounterparties from '../components/ArchivedCounterparties.tsx'
import { selectLoadingFetchArchive } from '@/store/slices/counterpartySlices.ts'
import { selectLoadingFetchArchivedTasks } from '@/store/slices/taskSlice.ts'
import ArchivedTasks from '../components/ArchivedTasks.tsx'
import ArchivedOrders from '../components/ArchivedOrders.tsx'
import { selectLoadingFetchArchivedOrders } from '@/store/slices/orderSlice.ts'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { ArchiveRestore } from 'lucide-react'
import ArchivedUsers from '@/features/archive/components/ArchivedUsers.tsx'
import { selectUsersLoading } from '@/store/slices/userSlice.ts'
import ArchivedServices from '@/features/archive/components/ArchivedServices.tsx'
import ArchivedInvoices from '@/features/archive/components/ArchivedInvoices.tsx'
import { selectLoadingFetchArchiveService } from '@/store/slices/serviceSlice.ts'
import { selectLoadingFetchArchiveInvoice } from '@/store/slices/invoiceSlice.ts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { tabTriggerClass } from '@/features/reports/utils/StyleCinstants.ts'
import Loader from '@/components/Loader/Loader.tsx'

const ArchivePage = () =>  {
  const [value, setValue] = useState('clients')
  const location = useLocation()
  const navigate = useNavigate()
  const loadingClients = useAppSelector(selectLoadingArchiveClient)
  const loadingArrivals = useAppSelector(selectLoadingFetchArchivedArrivals)
  const loadingProducts = useAppSelector(selectLoadingFetchArchivedProduct)
  const loadingStocks = useAppSelector(selectLoadingFetchArchivedStocks)
  const loadingCounterparties = useAppSelector(selectLoadingFetchArchive)
  const loadingTasks = useAppSelector(selectLoadingFetchArchivedTasks)
  const loadingOrders = useAppSelector(selectLoadingFetchArchivedOrders)
  const loadingUsers = useAppSelector(selectUsersLoading)
  const loadingServices = useAppSelector(selectLoadingFetchArchiveService)
  const loadingInvoices = useAppSelector(selectLoadingFetchArchiveInvoice)

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

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="text-center ml-5 my-4">
        <CustomTitle text="Архив" icon={<ArchiveRestore size={25} />} />
      </div>
      <Tabs value={value} onValueChange={handleChange} className="w-full">
        <TabsList className="mb-5 w-full h-auto">
          <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
            <TabsTrigger className={tabTriggerClass} value="clients">Клиенты</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="products">Товары</TabsTrigger>
            <TabsTrigger className={tabTriggerClass}  value="arrivals">Поставки</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="orders">Заказы</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="tasks">Задачи</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="stocks">Склады</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="counterparties">Контрагенты</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="users">Сотрудники</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="services">Услуги</TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="invoices">Счета</TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="clients">
          {loadingClients ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedClients/>
          )}
        </TabsContent>

        <TabsContent value="products">
          {loadingProducts ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedProducts/>
          )}
        </TabsContent>

        <TabsContent value="arrivals">
          {loadingArrivals ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedArrivals/>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {loadingOrders ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedOrders/>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          {loadingTasks ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedTasks/>
          )}
        </TabsContent>

        <TabsContent value="stocks">
          {loadingStocks ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedStocks/>
          )}
        </TabsContent>

        <TabsContent value="counterparties">
          {loadingCounterparties ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedCounterparties/>
          )}
        </TabsContent>

        <TabsContent value="users">
          {loadingUsers ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedUsers/>
          )}
        </TabsContent>

        <TabsContent value="services">
          {loadingServices? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedServices/>
          )}
        </TabsContent>

        <TabsContent value="invoices">
          {loadingInvoices ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </div>
          ) : (
            < ArchivedInvoices/>
          )}
        </TabsContent>

      </Tabs>

    </div>
  )
}

export default ArchivePage
