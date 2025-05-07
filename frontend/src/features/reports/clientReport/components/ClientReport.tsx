import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useClientReport } from '../../hooks/useClientReport.ts'
import ClientReportDataList from '@/features/reports/clientReport/components/ClientReportDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Card } from '@/components/ui/card.tsx'
import ClientInvoiceBarChart from '@/features/reports/clientReport/components/clientInvoicesBarChart.tsx'

const ClientReport = () => {
  const { clientReport, endDate, startDate, loadingReport } = useClientReport()

  return (
    <>
      <div className="w-full flex flex-col xl:flex-row xl:items-start xl:justify-between items-center gap-4 px-2">
        <Card className="w-auto">
          <DateRangePicker />
        </Card>
        {clientReport && clientReport.clientReport? <ClientInvoiceBarChart data={clientReport.clientReport} />:null}
      </div>
      <div className="w-full relative min-h-[200px] overflow-x-auto">
        {loadingReport ? (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
            <Loader />
          </div>
        ) : clientReport ? (
          !startDate || !endDate ? (
            <h6 className="text-center text-base sm:text-xl mt-5">Период не выбран</h6>
          ) : clientReport.clientReport.every(
            item => item.orders.length === 0 && item.arrivals.length === 0 && item.invoices.length === 0,
          ) ? (
              <h6 className="text-center text-base mt-5 sm:text-xl">
              В выбранном периоде нет заказов, поставок и счетов
              </h6>
            ) : (
              <ClientReportDataList ClientFullReport={clientReport.clientReport} />
            )
        ) : null}
      </div>
    </>
  )
}

export default ClientReport
