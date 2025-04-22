import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils.ts'

export type PopoverType = 'user' | 'type' | 'order' | 'arrival' | 'client' | 'stock' | 'shipping_agent' | 'services' | null

interface CustomSelectProps<T> {
  value: string | undefined
  placeholder: string
  options: T[]
  onSelect: (value: string) => void
  popoverKey: PopoverType
  searchPlaceholder: string
  activePopover: PopoverType
  setActivePopover: (key: PopoverType) => void
  error?: string
  renderValue?: (item: T) => string
}

export const CustomSelect = <T extends { _id: string }>({
  value,
  placeholder,
  options,
  onSelect,
  popoverKey,
  searchPlaceholder,
  activePopover,
  setActivePopover,
  error,
  renderValue,
}: CustomSelectProps<T>) => {
  return (
    <div className="space-y-2">
      <Popover
        open={activePopover === popoverKey}
        onOpenChange={open => setActivePopover(open ? popoverKey : null)}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(
            'w-full justify-between',
            error && 'border-destructive',
          )}>
            {value || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandList>
              {options?.map(item => (
                <CommandItem
                  key={item._id}
                  onSelect={() => {
                    onSelect(item._id)
                    setActivePopover(null)
                  }}
                >
                  {renderValue ? renderValue(item) : item.toString()}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
