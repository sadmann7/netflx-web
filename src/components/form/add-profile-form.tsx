"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  name: z.string(),
  image: z.string(),
})
type Inputs = z.infer<typeof schema>

const AddProfileForm = () => {
  // create profile mutation
  const createProfileMutation = api.profile.create.useMutation({
    onMutate: () => toast.success("Profile created"),
    onError: () => toast.error("Failed to create profile"),
  })

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(schema) })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <form
      className="grid w-full max-w-xl gap-7"
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
    >
      <fieldset className="grid gap-5">
        <label htmlFor="name" className="text-sm font-medium sm:text-base">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
      </fieldset>
      <div className="flex items-center gap-4">
        <Button aria-label="Add profile">Find packages</Button>
        <Button type="button" aria-label="Cancel" onClick={() => reset()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default AddProfileForm
