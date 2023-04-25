import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxInputProps<
  TFieldValues extends FieldValues,
  TContext = unknown
> {
  control: Control<TFieldValues, TContext>
  name: Path<TFieldValues>
  defaultChecked?: PathValue<TFieldValues, Path<TFieldValues>>
  id: string
  label: string
}

const CheckboxInput = <TFieldValues extends FieldValues>({
  control,
  name,
  defaultChecked = false as PathValue<TFieldValues, Path<TFieldValues>>,
  id,
  label,
}: CheckboxInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultChecked}
      render={({ field: { value, onChange } }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            onCheckedChange={(value) => {
              onChange(value)
            }}
            checked={value}
            className="h-5 w-5"
          />
          <label
            htmlFor={id}
            className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      )}
    />
  )
}

export default CheckboxInput
