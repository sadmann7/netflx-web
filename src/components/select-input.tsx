import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form"

import { formatEnum } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectInputProps<
  TFieldValues extends FieldValues,
  TContext = unknown
> {
  control: Control<TFieldValues, TContext>
  name: Path<TFieldValues>
  options: PathValue<TFieldValues, Path<TFieldValues>>[]
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
  label?: string
}

const SelectInput = <TFieldValues extends FieldValues>({
  control,
  name,
  options,
  defaultValue,
  label,
}: SelectInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px] rounded-none">
            <SelectValue placeholder={defaultValue} />
          </SelectTrigger>
          <SelectContent className="rounded-none text-slate-400 bg-neutral-950/95 dark:bg-neutral-950/95">
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {options.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="focus:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  {formatEnum(option)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  )
}

export default SelectInput
