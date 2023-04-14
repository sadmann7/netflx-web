const LoadingScreen = () => {
  return (
    <div
      aria-label="loading screen"
      role="presentation"
      className="grid min-h-screen place-items-center px-4"
    >
      <div
        role="progressbar"
        className="aspect-square w-20 animate-spin rounded-full border-y-4 border-solid border-slate-900 border-t-transparent"
      />
    </div>
  )
}

export default LoadingScreen
