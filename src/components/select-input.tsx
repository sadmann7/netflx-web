import * as React from "react"
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form"

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
  defaultValue: PathValue<TFieldValues, Path<TFieldValues>>
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
          <SelectContent className="w-96 rounded-none dark:bg-neutral-950/80">
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {options.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="dark:focus:bg-neutral-800"
                >
                  {option}
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
