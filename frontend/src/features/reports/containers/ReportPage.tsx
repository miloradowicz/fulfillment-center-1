import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectLoadingFetchTask } from '@/store/slices/taskSlice'
import { fetchTasksWithPopulate } from '@/store/thunks/tasksThunk'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileText } from 'lucide-react'
import CustomTitle from '@/components/CustomTitle/CustomTitle'
import TaskReport from '../taskPeport/components/TaskReport'
import ClientReport from '../clientReport/components/ClientReport'
import Grid from '@mui/material/Grid2'
import Loader from '@/components/Loader/Loader.tsx'

export default function ReportTabs() {
  const [value, setValue] = useState('tasks')
  const loadingTask = useAppSelector(selectLoadingFetchTask)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const tabNames = useMemo(() => ['tasks', 'clients', 'orders', 'arrivals', 'stocks'], [])

  useEffect(() => {
    dispatch(fetchTasksWithPopulate())
  }, [dispatch])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tab = queryParams.get('tab')
    if (tab && tabNames.includes(tab)) {
      setValue(tab)
    }
  }, [location, tabNames])


  const handleChange = (newTab: string) => {
    navigate({
      pathname: '/reports',
      search: `?tab=${ newTab }`,
    })
  }

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="text-center ml-5 my-4">
        <CustomTitle text="Отчеты" icon={<FileText size={25} />} />
      </div>
      <Tabs value={value} onValueChange={handleChange} className="w-full">
        <TabsList className="mb-5 w-full h-auto">
          <div className="inline-flex gap-2 flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
            <TabsTrigger className="mx-1 md:mx-0" value="tasks">Задачи</TabsTrigger>
            <TabsTrigger className="mx-1 md:mx-0" value="clients">Клиенты</TabsTrigger>
            <TabsTrigger className="mx-1 md:mx-0" value="orders">Заказы</TabsTrigger>
            <TabsTrigger className="mx-1 md:mx-0" value="arrivals">Поставки</TabsTrigger>
            <TabsTrigger className="mx-1 md:mx-0" value="stocks">Склады</TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="tasks">
          {loadingTask ? (
            <Grid className="mt-8 mb-7 flex justify-center">
              <Loader/>
            </Grid>
          ) : (
            <TaskReport />
          )}
        </TabsContent>

        {value === 'clients' && (
          <TabsContent value="clients">
            <ClientReport />
          </TabsContent>
        )}

        <TabsContent value="orders">Заказы</TabsContent>
        <TabsContent value="arrivals">Поставки</TabsContent>
        <TabsContent value="stocks">Склады</TabsContent>
      </Tabs>

    </div>
  )
}
