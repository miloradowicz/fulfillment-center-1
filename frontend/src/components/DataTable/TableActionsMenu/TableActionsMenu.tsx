import { ChevronRight, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '../../ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu.tsx'
import { NavLink } from 'react-router-dom'

interface Props<T> {
  row: T
  handleOpen: (essence: T) => void
  handleConfirmationOpen: (essenceId: string) => void
  showDetailsLink?: boolean
  detailsPathPrefix?: string
}
const TableActionsMenu = <T extends { _id: string }>({
  row,
  handleOpen,
  handleConfirmationOpen,
  showDetailsLink = true,
  detailsPathPrefix,

}: Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="cursor-pointer" >
          <span className="sr-only">Открыть меню</span>
          <MoreHorizontal size={25} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col items-stretch">
        <DropdownMenuLabel>Действия</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="!bg-transparent px-1.5" onClick={() => handleOpen(row)}>
          <Button
            type="button"
            size="sm"
            className="text-emerald-900 bg-emerald-100 hover:bg-emerald-300 cursor-pointer transition-colors">
            Редактировать
            <Edit size={18} className="stroke-emerald-900" />
          </Button>
        </DropdownMenuItem>

        {showDetailsLink && detailsPathPrefix && (
          <DropdownMenuItem className="!bg-transparent px-1.5">
            <Button
              type="button"
              size="sm"
              className=" text-slate-800  bg-blue-200 hover:bg-blue-300 w-full transition-colors cursor-pointer">
              <NavLink
                to={`/${ detailsPathPrefix }/${ row._id }`}
                className="inline-flex items-center content-center gap-0.5">
                Подробнее
                <ChevronRight size={20} className="stroke-slate-800" />
              </NavLink>
            </Button>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="!bg-transparent px-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => handleConfirmationOpen(row._id)}
            className="text-red-600 hover:bg-red-100 bg-red-50 w-full cursor-pointer transition-colors">
            Удалить
            <Trash size={18} className="stroke-red-600" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableActionsMenu
