import { useCallback, useEffect } from "react"
import Image from "next/image"
import type { SetState } from "@/types"
import { Loader2, UploadCloud } from "lucide-react"
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { twMerge } from "tailwind-merge"

type FileInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize: number
  maxFiles?: number
  selectedFile: File | null
  setSelectedFile: SetState<File | null>
  cropData?: string | null
  setCropData?: SetState<string | null>
  previewType?: "image" | "name"
  isUploading?: boolean
  disabled?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const FileInput = <TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/png": [],
    "image/jpeg": [],
  },
  maxSize,
  maxFiles = 1,
  selectedFile,
  setSelectedFile,
  cropData,
  setCropData,
  previewType = "image",
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileInputProps<TFieldValues>) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        if (!file) return
        setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setCropData?.(null)
        setSelectedFile(file)
      })
      rejectedFiles.forEach((file) => {
        setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
        setSelectedFile(null)
        switch (file.errors[0]?.code as ErrorCode) {
          case "file-invalid-type":
            toast.error("File type not supported")
            break
          case "file-too-large":
            const size = (file.file.size / 1024 / 1024).toFixed(2)
            toast.error(
              `Please select a file smaller than ${
                maxSize / 1024 / 1024
              }MB. Current size: ${size}MB`
            )
            break
          case "too-many-files":
            toast.error("Please select only one file")
            break
          default:
            toast.error(file.errors[0]?.message ?? "Error uploading file")
            break
        }
      })
    },
    [maxSize, name, setCropData, setSelectedFile, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  // revoke object URL when component unmounts
  useEffect(() => {
    if (!selectedFile) return
    return () => URL.revokeObjectURL(selectedFile.name)
  }, [selectedFile])

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        "group relative grid h-60 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed p-2 text-center transition hover:bg-gray-700/25",
        "focus:outline-none focus-visible:border-solid focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        isDragActive ? "border-gray-400" : "border-gray-500",
        selectedFile && previewType === "image"
          ? "h-full border-none p-0"
          : "h-60",
        disabled
          ? "pointer-events-none opacity-50"
          : "pointer-events-auto opacity-100",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : selectedFile ? (
        previewType === "image" ? (
          <div className="group relative aspect-square h-full max-h-[420px] w-full overflow-hidden rounded-lg">
            {isDragActive ? (
              <div className="absolute inset-0 grid h-full w-full place-items-center bg-gray-950/70">
                <DragActive isDragActive={isDragActive} />
              </div>
            ) : null}
            <Image
              src={cropData ? cropData : URL.createObjectURL(selectedFile)}
              alt={selectedFile.name ?? "preview"}
              fill
              className="absolute inset-0 -z-10 rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full rounded-lg">
            {isDragActive ? (
              <DragActive isDragActive={isDragActive} />
            ) : (
              <p className="text-base font-medium text-gray-200 sm:text-lg">
                {selectedFile.name}
              </p>
            )}
          </div>
        )
      ) : isDragActive ? (
        <DragActive isDragActive={isDragActive} />
      ) : (
        <div className="group grid place-items-center gap-1 sm:px-10">
          <UploadCloud
            className="group-hover:animate-swing h-10 w-10 text-gray-200"
            aria-hidden="true"
          />
          <p className="mt-2 text-base font-medium text-gray-200 sm:text-lg">
            Drag {`'n'`} drop file here, or click to select file
          </p>
          <p className="text-sm text-gray-400 sm:text-base">
            Please upload file with size less than{" "}
            {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}
    </div>
  )
}

export default FileInput

const DragActive = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="grid place-items-center gap-2 text-gray-200 sm:px-10">
      <UploadCloud
        className={twMerge("h-10 w-10", isDragActive ? "animate-bounce" : "")}
        aria-hidden="true"
      />
      <p className="text-base font-medium sm:text-lg">Drop the file here</p>
    </div>
  )
}
