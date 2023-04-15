import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ErrorScreenProps {
  error: Error
  reset: () => void
}

const ErrorScreen = ({ error, reset }: ErrorScreenProps) => {
  return (
    <section
      aria-label="Error screen"
      className="container grid h-screen max-w-screen-2xl items-center justify-center gap-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-24 lg:pt-16"
    >
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <Icons.warning
          className="aspect-square w-24 text-red-500 md:w-28"
          aria-hidden="true"
        />
        <h2 className="text-center text-3xl font-bold text-slate-50 md:text-4xl lg:text-5xl">
          {error.message ?? "Something went wrong!"}
        </h2>
        <Button
          aria-label="Try again"
          variant="destructive"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </section>
  )
}

export default ErrorScreen
