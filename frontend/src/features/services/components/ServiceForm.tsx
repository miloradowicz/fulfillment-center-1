import useServiceForm from '../hooks/useServiceForm'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Button } from '@/components/ui/button'
import { CheckIcon, ChevronDownIcon, LoaderCircle, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChangeEvent } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea.tsx'

const ServiceForm = ({ serviceId, onClose }: { serviceId?: string; onClose: () => void }) => {
  const {
    form,
    loading,
    serviceCategories,
    addCategoryLoading,
    fetchCategoryLoading,
    handleInputChange,
    handleAutocompleteChange,
    handleDeleteCategory,
    onSubmit,
    errors,
    inputValue,
    setInputValue,
    open,
    setOpen,
  } = useServiceForm(serviceId, onClose)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {serviceId ? 'Редактировать услугу' : 'Добавить новую услугу'}
      </h3>

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
                form.serviceCategory && 'text-primary',
                errors.serviceCategory && 'border-destructive',
              )}
            >
              {form.serviceCategory?.name || 'Выберите/создайте категорию'}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command shouldFilter={true}>
              <CommandInput
                placeholder="Поиск категории..."
                value={inputValue}
                onValueChange={value => {
                  setInputValue(value)
                }}
              />
              {inputValue && !serviceCategories.some(cat => cat.name.toLowerCase() === inputValue.toLowerCase()) && (
                <CommandEmpty>
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer text-sm"
                    onClick={() => {
                      void handleAutocompleteChange(null, inputValue)
                      setInputValue('')
                    }}
                  >
                    Добавить категорию «{inputValue}»
                  </Button>
                </CommandEmpty>
              )}
              <ScrollArea>
                <CommandGroup>
                  {serviceCategories.map(category => (
                    <CommandItem
                      key={category._id}
                      value={category.name}
                      onSelect={() => {
                        void handleAutocompleteChange(null, category)
                        setInputValue('')
                        setOpen(false)
                      }}
                      className="rounded-md truncate"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              form.serviceCategory?._id === category._id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {category.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-transparent"
                          onClick={e => {
                            e.stopPropagation()
                            handleDeleteCategory(category._id)
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
        {(addCategoryLoading || fetchCategoryLoading) && <Progress value={0} className="h-1" />}
        {errors.serviceCategory && <p className="text-sm font-medium text-destructive">{errors.serviceCategory}</p>}
      </div>

      <div className="space-y-1">
        <Select
          name="type"
          value={form.type}
          onValueChange={value =>
            handleInputChange({
              target: { name: 'type', value },
            } as ChangeEvent<HTMLInputElement>)
          }
        >
          <SelectTrigger
            className={cn(
              'w-full flex justify-between items-center px-2 py-2 border rounded-md text-sm',
              errors.type && 'border-destructive',
            )}
          >
            <SelectValue placeholder="Выберите тип услуги" />
          </SelectTrigger>

          <SelectContent className="max-w-full">
            <SelectItem value="внутренняя">Внутренняя услуга</SelectItem>
            <SelectItem value="внешняя">Внешняя услуга</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm font-medium text-destructive">{errors.type}</p>}
      </div>

      <InputWithError
        name="name"
        placeholder="Название"
        value={form.name}
        onChange={handleInputChange}
        error={errors.name}
      />

      <InputWithError
        name="price"
        placeholder="Цена"
        value={form.price}
        onChange={handleInputChange}
        error={errors.price}
      />

      <Textarea
        name="description"
        placeholder="Описание"
        value={form.description}
        onChange={handleInputChange}
        className="resize-y min-h-[40px] max-h-[250px] text-sm"
      />

      <Button type="submit" className="w-full mt-3" disabled={loading || addCategoryLoading || fetchCategoryLoading}>
        {serviceId ? 'Сохранить' : 'Создать'}
        {loading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : null}
      </Button>
    </form>
  )
}

export default ServiceForm
