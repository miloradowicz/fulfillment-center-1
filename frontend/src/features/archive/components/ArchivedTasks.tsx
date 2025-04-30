import { ColumnDef } from '@tanstack/react-table'
import { TaskWithPopulate } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedTasksActions from '@/features/archive/hooks/useArchivedTasksActions.ts'

const ArchivedTasks = () => {
  const {
    tasks,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedTasksActions()

  const columns: ColumnDef<TaskWithPopulate>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'taskNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер задачи" />,
      cell: ({ row }) => {
        const tableTask = row.original

        return (
          <div
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {tableTask.taskNumber}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'user.displayName',
      header: 'Исполнитель',
      cell: ({ row }) => row.original.user?.displayName ?? 'Неизвестный исполнитель',
    },
    {
      accessorKey: 'title',
      header: 'Содержание',
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.original.status

        const statusStyles: Record<'к выполнению' | 'готово' | 'в работе', string> = {
          'к выполнению':
            'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'готово':
            'bg-emerald-100 text-emerald-700 transition-colors rounded-lg font-bold px-4 py-2',
          'в работе':
            'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        const capitalizeFirstLetter = (str: string) => {
          return str.charAt(0).toUpperCase() + str.slice(1)
        }

        const statusClass = statusStyles[status as keyof typeof statusStyles] || 'bg-primary/10 text-primary/80 border font-bold px-4 py-2'

        return (
          <span className={statusClass}>
            {capitalizeFirstLetter(status as string)}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableTasks = row.original

        return (
          <TableArchivedActionsMenu<TaskWithPopulate>
            row={tableTasks}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={tasks ?? []}/>

      <ConfirmationModal
        open={confirmationOpen}
        entityName="эту задачу"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedTasks
