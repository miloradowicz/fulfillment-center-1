import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '../../ui/button.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select.tsx'

interface Props<T> {
  table: Table<T>
}

const DataTablePagination = <T,>({ table }: Props<T>) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-3 items-center justify-center text-center flex-wrap">
      <div className="text-sm text-muted-foreground">
        Выбрано строк: {table.getFilteredSelectedRowModel().rows.length} из {table.getFilteredRowModel().rows.length}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-3 items-center">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Строк на странице</p>
          <Select
            value={`${ table.getState().pagination.pageSize }`}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map(pageSize => (
                <SelectItem key={pageSize} value={`${ pageSize }`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm font-medium text-center">
          {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
        </div>

        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            className="p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Первая</span>
            <ChevronsLeft size={12} />
          </Button>
          <Button
            variant="outline"
            className="p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Назад</span>
            <ChevronLeft size={12} />
          </Button>
          <Button
            variant="outline"
            className="p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Вперёд</span>
            <ChevronRight size={12} />
          </Button>
          <Button
            variant="outline"
            className="p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Последняя</span>
            <ChevronsRight size={12} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTablePagination
