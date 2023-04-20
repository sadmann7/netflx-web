"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/api"

const schema = z.object({
  name: z.string(),
  image: z.string(),
})
type Inputs = z.infer<typeof schema>

const UpdateProfileForm = () => {
  // update profile mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onMutate: () => toast.success("Profile updated"),
    onError: () => toast.error("Failed to update profile"),
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

  return <div>Update Profile Form</div>
}

export default UpdateProfileForm
