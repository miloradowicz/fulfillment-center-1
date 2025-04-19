import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserPage from './UserPage'
import { Settings } from 'lucide-react'
import ServicesPage from '@/features/services/containers/ServicesPage.tsx'

const tabs = [
  { value: 'users', label: 'Сотрудники' },
  { value: 'services', label: 'Услуги' },
  { value: 'invoices', label: 'Счета на оплату' },
]

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'users'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="w-full flex justify-center items-center gap-2 mt-6 mb-6">
        <Settings size={28} className="text-primary" />
        <h1 className="text-xl sm:text-2xl font-semibold">Админ-панель</h1>
      </div>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="flex justify-center">
          <TabsList className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4 sm:mb-10">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm sm:text-base rounded-xl transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="h-px bg-muted mb-3 w-full" />

        <TabsContent value="users" className="mt-0">
          <UserPage />
        </TabsContent>
        <TabsContent value="services">
          <ServicesPage />
        </TabsContent>
        <TabsContent value="invoices">
          <div>Счета на оплату</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage
