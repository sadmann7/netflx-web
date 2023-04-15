interface ShowsLayotutProps {
  children: React.ReactNode
}

export default function ShowsLayout({ children }: ShowsLayotutProps) {
  return <div className="min-h-screen">{children}</div>
}
