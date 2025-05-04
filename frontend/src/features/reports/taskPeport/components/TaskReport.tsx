import TaskCountAreaChart from './TaskCountChart.tsx'
import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useTaskReport } from '../../hooks/useTaskReport.ts'
import TaskReportDataList from '@/features/reports/taskPeport/components/TaskReportDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { TaskPieChart } from '@/features/reports/taskPeport/components/PieChart.tsx'
import { Card } from '@/components/ui/card.tsx'

const TaskReport = () => {
  const { report, endDate, startDate, loadingReport, tasks, loadingTasks } = useTaskReport()

  return (
    <div>
      <div className="w-full flex flex-col xl:flex-row xl:items-start xl:justify-between items-center gap-4 px-2">
        <Card className="w-auto">
          <DateRangePicker />
        </Card>

        {loadingTasks ? (
          <div className="mt-3 mb-2 flex justify-center w-full">
            <Loader />
          </div>
        ) : (
          <TaskPieChart tasks={tasks} />
        )}
      </div>

      {loadingReport ? (
        <div className="mt-3 mb-2 flex justify-center">
          <Loader />
        </div>
      ) : (
        report &&
        report.userTaskReports && (
          <>
            {!startDate || !endDate ? (
              <h6 className="text-center mt-5 text-sm sm:text-base">Период не выбран</h6>
            ) : report.userTaskReports.length === 0 && report.dailyTaskCounts.length === 0 ? (
              <h6 className="text-center mt-5 mb-5 text-sm sm:text-base">В выбранном периоде нет выполненных задач</h6>
            ) : (
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between items-center mt-2 ">
                <div className="min-w-[320px] max-w-[700px] md:w-full">
                  <TaskCountAreaChart data={report.dailyTaskCounts} />
                </div>
                <TaskReportDataList userTaskReports={report.userTaskReports} />
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}

export default TaskReport
