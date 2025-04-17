import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Table } from '@tanstack/react-table'

import { Button } from '../../ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator,
} from '../../ui/dropdown-menu.tsx'
import { Settings2 } from 'lucide-react'

interface Props<T> {
  table: Table<T>
}

const DataTableViewOptions = <T,>({ table }: Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="max-w-sm lg:flex cursor-pointer"
        >
          <Settings2 />
          Настройки видимости
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="font-bold">Скрыть столбец</DropdownMenuLabel>
        <DropdownMenuSeparator/>

        {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize cursor-pointer"
              checked={column.getIsVisible()}
              onCheckedChange={value => column.toggleVisibility(value)}
            >
              {typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTableViewOptions
