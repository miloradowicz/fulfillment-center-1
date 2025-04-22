import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils.ts'
import React from 'react'
import { Label } from '@/components/ui/label.tsx'

export type PopoverType =
  | 'user'
  | 'type'
  | 'order'
  | 'arrival'
  | 'client'
  | 'stock'
  | 'shipping_agent'
  | 'services'
  | 'arrival_status'
  | 'product'
  | null

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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  label?: string
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
  onBlur,
  label,
}: CustomSelectProps<T>) => {
  const handleSelection = (id: string) => {
    onSelect(id)
    setActivePopover(null)
    if (onBlur) {
      const syntheticEvent = {
        target: { value: id },
      } as React.FocusEvent<HTMLInputElement>
      onBlur(syntheticEvent)
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: value || '',
        },
      } as React.FocusEvent<HTMLInputElement>
      onBlur(syntheticEvent)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium leading-none">{label}</Label>}

      <Popover open={activePopover === popoverKey} onOpenChange={open => setActivePopover(open ? popoverKey : null)}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-full justify-between', error && 'border-destructive')}>
            {value || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} onBlur={handleInputBlur} />
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandList>
              {options?.map(item => (
                <CommandItem key={item._id} onSelect={() => handleSelection(item._id)}>
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
