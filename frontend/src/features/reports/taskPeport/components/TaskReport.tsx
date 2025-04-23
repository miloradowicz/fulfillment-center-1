import TaskCountAreaChart from './TaskCountChart.tsx'
import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useTaskReport } from '../../hooks/useTaskReport.ts'
import TaskReportDataList from '@/features/reports/taskPeport/components/TaskReportDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { TaskPieChart } from '@/features/reports/taskPeport/components/PieChart.tsx'
import { Card } from '@/components/ui/card.tsx'

const TaskReport = () => {
  const {
    report,
    endDate,
    startDate,
    loadingReport,
    tasks,
    loadingTasks,
  } = useTaskReport()

  return (
    <div>
      <div className="flex flex-wrap justify-around items-center gap-2 mb-3">
        <Card className="flex justify-around w-auto min-w-[320px] max-w-[500px] md:w-full ">
          <DateRangePicker />
        </Card>
        {loadingTasks ? (
          <div className="mt-3 mb-2 flex justify-center w-full">
            <Loader />
          </div>
        ) : (
          <TaskPieChart tasks={tasks}  />
        )}
      </div>

      {loadingReport ? (
        <div className="mt-3 mb-2 flex justify-center">
          <Loader />
        </div>
      ) : (
        report && report.userTaskReports && (
          <>
            {!startDate || !endDate ? (
              <h6
                className="text-center mt-5 text-sm sm:text-base"
              >
                Период не выбран
              </h6>
            ) : (
              (report.userTaskReports.length === 0 && report.dailyTaskCounts.length === 0) ? (
                <h6
                  className="text-center mt-5 mb-5 text-sm sm:text-base"
                >
                  В выбранном периоде нет выполненных задач
                </ h6>
              ) : (
                <div className="flex flex-wrap justify-around items-start mt-2">
                  <div className="min-w-[320px] max-w-[700px] w-full md:w-full">
                    <TaskCountAreaChart data={report.dailyTaskCounts} />
                  </div>
                  <TaskReportDataList userTaskReports={report.userTaskReports} />
                </div>
              )
            )}
          </>
        )
      )}
    </div>
  )
}

export default TaskReport
