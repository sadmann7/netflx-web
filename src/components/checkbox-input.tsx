import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxInputProps<
  TFieldValues extends FieldValues,
  TContext = unknown
> {
  control: Control<TFieldValues, TContext>
  name: Path<TFieldValues>
  id: string
  label: string
}

const CheckboxInput = <TFieldValues extends FieldValues>({
  control,
  name,
  id,
  label,
}: CheckboxInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            onChange={(value) => {
              onChange(value)
            }}
            checked={value}
          />
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      )}
    />
  )
}

export default CheckboxInput
