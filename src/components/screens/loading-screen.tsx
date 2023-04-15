const LoadingScreen = () => {
  return (
    <section
      aria-label="Loading screen"
      role="presentation"
      className="grid min-h-screen w-full max-w-screen-2xl place-items-center px-4"
    >
      <div
        role="progressbar"
        className="aspect-square w-20 animate-spin rounded-full border-y-4 border-solid border-red-600 border-t-transparent"
      />
    </section>
  )
}

export default LoadingScreen
