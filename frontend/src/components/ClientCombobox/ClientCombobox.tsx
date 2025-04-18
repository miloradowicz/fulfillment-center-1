import React, { useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface Client {
  _id: string
  name: string
}

interface Props {
  clients: Client[]
  selectedClientId: string | null
  onSelectClient: (clientId: string) => void
  error?: string
}

const ClientCombobox: React.FC<Props> = ({
  clients,
  selectedClientId,
  onSelectClient,
  error,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  const selectedClientName = clients.find(c => c._id === selectedClientId)?.name

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            className={cn(
              'w-full flex justify-between items-center px-2 py-2 border rounded-md text-sm cursor-pointer text-muted-foreground',
              open && 'bg-muted',
              selectedClientId && 'text-primary',
              error && 'border-destructive',
            )}
          >
            {selectedClientName || 'Выберите клиента...'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Поиск клиента..." />
            <CommandEmpty>Клиент не найден</CommandEmpty>
            <CommandGroup>
              {clients.map(client => (
                <CommandItem
                  key={client._id}
                  value={client.name}
                  onSelect={() => {
                    onSelectClient(client._id)
                    setOpen(false)
                  }}
                >
                  {client.name}
                  <Check
                    className={cn('ml-auto h-4 w-4', selectedClientId === client._id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default ClientCombobox
