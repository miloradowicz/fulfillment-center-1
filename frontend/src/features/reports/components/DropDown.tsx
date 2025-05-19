import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Search, ChevronDown } from 'lucide-react'
import useBreakpoint from '@/hooks/useBreakpoint.ts'

type CommonDropdownItem = {
  _id: string
  isArchived?: boolean
}

type GenericDropdownProps<T extends CommonDropdownItem> = {
  items: T[]
  getLabel: (item: T) => string
  getLink: (item: T) => string
  buttonText?: string
  statusFilterOptions?: string[]
  getStatus?: (item: T) => string
}

const Dropdown = <T extends CommonDropdownItem>({
  items,
  getLabel,
  getLink,
  buttonText = 'Список',
  statusFilterOptions,
  getStatus,
}: GenericDropdownProps<T>) => {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Все')
  const { isMobile } = useBreakpoint()

  const clearSearch = () => setSearch('')

  const filtered = items
    .filter(item => getLabel(item).toLowerCase().includes(search.toLowerCase()))
    .filter(item =>
      selectedStatus === 'Все' || (getStatus ? getStatus(item) === selectedStatus : true),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'secondary'} className="text-sm md:text-base">
          {isMobile ? buttonText : `${ buttonText }`}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44 p-2 space-y-2">
        {statusFilterOptions && (
          <div className="px-2">
            <select
              className="w-full text-sm bg-background border border-input rounded-md px-2 py-1"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="Все">Все</option>
              {statusFilterOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative px-2">
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-8 text-sm"
          />
          {search ? (
            <X
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={clearSearch}
            />
          ) : (
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="max-h-60 overflow-y-auto px-2 space-y-1">
          {filtered.map(item => (
            <div
              key={item._id}
              className="px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted"
            >
              {item.isArchived ? (
                <span className="text-muted-foreground">{getLabel(item)}</span>
              ) : (
                <NavLink to={getLink(item)} className="text-blue-600 underline">
                  {getLabel(item)}
                </NavLink>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-2 text-sm text-muted-foreground">Ничего не найдено</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown
