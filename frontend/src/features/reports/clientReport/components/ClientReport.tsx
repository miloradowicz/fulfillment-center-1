import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useClientReport } from '../../hooks/useClientReport.ts'
import ClientReportDataList from '@/features/reports/clientReport/components/ClientReportDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Card } from '@/components/ui/card.tsx'

const ClientReport = () => {
  const { clientReport, endDate, startDate, loadingReport } = useClientReport()

  return (
    <div className="w-full flex flex-col xl:flex-row xl:items-start xl:justify-between items-center gap-4 px-2">
      <Card className="w-full lg:w-[40%]">
        <DateRangePicker />
      </Card>

      <div className="w-full sm:w-[85%] xl:w-full xl:flex-1 relative min-h-[200px] overflow-x-auto">
        {loadingReport ? (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
            <Loader />
          </div>
        ) : clientReport ? (
          !startDate || !endDate ? (
            <h6 className="text-center text-base sm:text-xl mt-5">
              Период не выбран
            </h6>
          ) : clientReport.clientOrderReport.every(item => item.orderCount === 0) ? (
            <h6 className="text-center text-base mt-5 sm:text-xl">
              В выбранном периоде нет заказов
            </h6>
          ) : (
            <ClientReportDataList clientOrderReport={clientReport.clientOrderReport} />
          )
        ) : null}
      </div>
    </div>
  )
}

export default ClientReport
