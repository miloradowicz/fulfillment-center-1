import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectLoadingFetchTask } from '@/store/slices/taskSlice'
import { fetchTasksWithPopulate } from '@/store/thunks/tasksThunk'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText } from 'lucide-react'
import CustomTitle from '@/components/CustomTitle/CustomTitle'
import TaskReport from '../taskPeport/components/TaskReport'
import ClientReport from '../clientReport/components/ClientReport'
import Loader from '@/components/Loader/Loader.tsx'
import { tabTriggerStyles } from '@/utils/commonStyles.ts'

export default function ReportTabs() {
  const [value, setValue] = useState('tasks')
  const loadingTask = useAppSelector(selectLoadingFetchTask)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const tabNames = useMemo(() => ['tasks', 'clients'], [])

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
    <div className="max-w-[1000px] mx-auto">
      <div className="my-7">
        <CustomTitle
          className="flex justify-center"
          text="Отчеты"
          icon={<FileText size={25} />} />
      </div>

      <Tabs value={value} onValueChange={handleChange}>
        <div className="flex justify-center">
          <TabsList className="mb-5 sm:w-auto w-full rounded-2xl">
            <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
              <TabsTrigger className={tabTriggerStyles} value="tasks">
                Задачи
              </TabsTrigger>
              <TabsTrigger className={tabTriggerStyles} value="clients">
                Клиенты
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <TabsContent value="tasks">
          {loadingTask ? (
            <div className="mt-8 mb-7 flex justify-center">
              <Loader />
            </div>
          ) : (
            <TaskReport />
          )}
        </TabsContent>

        {value === 'clients' && (
          <TabsContent value="clients">
            <ClientReport />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
