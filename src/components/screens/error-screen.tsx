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
      role="alert"
      className="container grid min-h-screen max-w-5xl items-center justify-center gap-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-24 lg:pt-16"
    >
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <Icons.warning
          className="h-28 w-28 text-red-500 dark:text-red-500"
          aria-hidden="true"
        />
        <h1 className="text-center text-2xl font-bold text-red-500 dark:text-red-500 sm:text-2xl lg:text-3xl">
          {error.message ?? "Something went wrong!"}
        </h1>
        <Button aria-label="Retry" variant="flat" onClick={() => reset()}>
          <Icons.refresh className="mr-2 h-4 w-4" aria-hidden="true" />
          Retry
        </Button>
      </div>
    </section>
  )
}

export default ErrorScreen
