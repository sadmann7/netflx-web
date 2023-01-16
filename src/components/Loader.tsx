const Loader = () => {
  return (
    <div
      aria-label="progressbar"
      role="progressbar"
      className="grid min-h-screen place-items-center"
    >
      <div className="aspect-square w-20 animate-spin rounded-full border-y-4 border-solid border-primary border-t-transparent" />
    </div>
  );
};

export default Loader;
