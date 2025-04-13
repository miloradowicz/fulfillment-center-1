import { Checkbox } from '@/components/ui/checkbox.tsx'
import type { Row, Table } from '@tanstack/react-table'

const SelectableColumn = <TData,>(input: Table<TData> | Row<TData>, type: 'header' | 'cell') => {
  if (type === 'header' && 'getIsAllPageRowsSelected' in input) {
    return (
      <Checkbox
        className="
            text-white
            border-slate-300
            group-hover:border-slate-400
            data-[state=checked]:bg-slate-800
            data-[state=checked]:border-slate-800
            cursor-pointer
          "
        checked={input.getIsAllPageRowsSelected() || (input.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => input.toggleAllPageRowsSelected(!!value)}
        aria-label="Выбрать все"
      />
    )
  }

  if (type === 'cell' && 'getIsSelected' in input) {
    return (
      <Checkbox
        className="
            text-white
            border-slate-300
            group-hover:border-slate-400
            data-[state=checked]:bg-slate-800
            data-[state=checked]:border-slate-800
            cursor-pointer
          "
        checked={input.getIsSelected()}
        onCheckedChange={value => input.toggleSelected(!!value)}
        aria-label="Выбрать эту строку"
      />
    )
  }

  return null
}

export default SelectableColumn
