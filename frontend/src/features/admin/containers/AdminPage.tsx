import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserPage from './UserPage'
import { Settings } from 'lucide-react'
import ServicesPage from '@/features/services/containers/ServicesPage.tsx'
import InvoicesPage from '@/features/invoices/containers/InvoicesPage.tsx'
import { Separator } from '@/components/ui/separator.tsx'

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
    <div className="max-w-[1000px] mx-auto">
      <div className="w-full flex justify-center items-center gap-2 mt-6 mb-6">
        <Settings size={28} className="text-primary" />
        <h1 className="text-xl sm:text-2xl font-semibold">Админ-панель</h1>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="flex justify-center">
          <TabsList className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4 sm:mb-10">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/5 hover:text-primary px-4 py-2 text-sm sm:text-base rounded-xl transition-all cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Separator />

        <TabsContent value="users" className="mt-0">
          <UserPage />
        </TabsContent>
        <TabsContent value="services">
          <ServicesPage />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoicesPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage
