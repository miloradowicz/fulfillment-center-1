import { MoreHorizontal, RotateCcw, Trash } from 'lucide-react'
import { Button } from '../../ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu.tsx'

interface Props<T> {
  row: T
  onRestore: (essenceId: string) => void
  onDelete: (essenceId: string) => void
}

const TableArchivedActionsMenu = <T extends { _id: string }>({
  row,
  onRestore,
  onDelete,
}: Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="hover:shadow-sm">
          <span className="sr-only">Открыть меню</span>
          <MoreHorizontal size={25} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col items-stretch">
        <DropdownMenuLabel>Действия</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="!bg-transparent px-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => onRestore(row._id)}
            className="text-green-600 hover:bg-green-100 bg-transparent w-full transition-colors shadow-sm"
          >
            Восстановить
            <RotateCcw size={18} className="stroke-green-600 ml-2" />
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem className="!bg-transparent px-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => onDelete(row._id)}
            className="text-destructive hover:bg-destructive/10 bg-transparent w-full transition-colors shadow-sm"
          >
            Удалить
            <Trash size={18} className="stroke-destructive ml-2" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableArchivedActionsMenu
