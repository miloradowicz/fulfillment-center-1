import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useClientReport } from '../../hooks/useClientReport.ts'
import ClientReportDataList from '@/features/reports/clientReport/components/ClientReportDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'

const ClientReport = () => {

  const { clientReport,
    endDate,
    startDate,
    loadingReport,
  } = useClientReport()

  return (
    <div className="flex flex-wrap justify-around mb-3">
      <div className="flex flex-wrap justify-around items-start gap-2 mb-3">
        <div className="flex justify-center max-w-[700px] w-full sm:w-full">
          <DateRangePicker />
        </div>
      </div>

      {loadingReport ? (
        <div className="mt-5 mb-2 mx-auto">
          <Loader />
        </div>
      ) : (
        clientReport && (
          <>
            {!startDate || !endDate ? (
              <h6 className="text-center text-base sm:text-xl">
                Период не выбран
              </h6>
            ) : (
              <>
                {clientReport?.clientOrderReport.every(item => item.orderCount === 0) ? (
                  <h6 className="text-center text-base sm:text-xl">
                    В выбранном периоде нет заказов
                  </h6>
                ) : (
                  <div className="flex flex-wrap justify-around mt-2">
                    <div className="flex-grow w-full sm:w-[600px] lg:w-[620px] mx-4 sm:mx-0">
                      <ClientReportDataList clientOrderReport={clientReport.clientOrderReport} />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )
      )}
    </div>
  )}

export default ClientReport
