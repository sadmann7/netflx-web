"use client"

import ErrorScreen from "@/components/screens/error-screen"

interface GlobalErrorProps {
  error: Error
  reset: () => void
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <html>
      <body>
        <ErrorScreen error={error} reset={reset} />
      </body>
    </html>
  )
}

export default GlobalError
