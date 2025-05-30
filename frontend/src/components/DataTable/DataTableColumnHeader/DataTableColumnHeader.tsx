import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils.ts'
import { Button } from '../../ui/button.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu.tsx'
import React from 'react'

interface Props<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

const DataTableColumnHeader = <TData, TValue>({ column, title, className }: Props<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-0.5 h-8 data-[state=open]:bg-accent hover:shadow-sm">
            <span className="font-bold">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={18} />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp size={18} />
            ) : (
              <ChevronsUpDown size={18} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)} className="cursor-pointer">
            <ArrowUp className="h-3.5 w-3.5" />
            Сортировать по возрастанию
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)} className="cursor-pointer">
            <ArrowDown className="h-3.5 w-3.5" />
            Сортировать по убыванию
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DataTableColumnHeader
