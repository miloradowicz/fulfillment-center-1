import { ColumnDef } from '@tanstack/react-table'
import { TaskWithPopulate } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedTasksActions from '@/features/archive/hooks/useArchivedTasksActions.ts'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge.tsx'
import { NumberBadge } from '@/components/NumberBadge/NumberBadge.tsx'

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
        return <NumberBadge number={row.original.taskNumber} />
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
        const arrivalStatusStyles = {
          'к выполнению': 'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'готова': 'bg-emerald-100 text-emerald-700 rounded-lg font-bold px-4 py-2',
          'в работе': 'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        return <StatusBadge status={status} stylesMap={arrivalStatusStyles}/>
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
