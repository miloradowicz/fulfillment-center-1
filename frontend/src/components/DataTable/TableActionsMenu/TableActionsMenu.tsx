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
        <Button type="button" variant="ghost" className="cursor-pointer hover:shadow-sm">
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
            variant="ghost"
            size="sm"
            className="text-primary bg-transparent cursor-pointer transition-colors shadow-sm"
          >
            Редактировать
            <Edit size={18} className="stroke-primary" />
          </Button>
        </DropdownMenuItem>

        {showDetailsLink && detailsPathPrefix && (
          <DropdownMenuItem className="!bg-transparent px-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary bg-transparent cursor-pointer transition-colors shadow-sm w-full"
            >
              <NavLink
                to={`/${ detailsPathPrefix }/${ row._id }`}
                className="inline-flex items-center content-center gap-0.5"
              >
                Подробнее
                <ChevronRight size={20} className="stroke-primary" />
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
            className="text-destructive hover:bg-destructive/10 bg-transparent w-full cursor-pointer transition-colors shadow-sm"
          >
            Удалить
            <Trash size={18} className="stroke-destructive" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableActionsMenu
