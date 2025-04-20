import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '@/components/ui/button.tsx'

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
  const [open, setOpen] = useState(false)

  const selectedClientName = clients.find(c => c._id === selectedClientId)?.name

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
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
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
        >
          <Command shouldFilter={true}>
            <CommandInput placeholder="Поиск клиента…" />
            <CommandEmpty>Клиент не найден</CommandEmpty>
            <ScrollArea>
              <CommandGroup className="p-1">
                {clients.map(client => (
                  <CommandItem
                    key={client._id}
                    value={client.name}
                    onSelect={() => {
                      onSelectClient(client._id)
                      setOpen(false)
                    }}
                    className="rounded-md"
                  >
                    {client.name}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedClientId === client._id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default ClientCombobox
