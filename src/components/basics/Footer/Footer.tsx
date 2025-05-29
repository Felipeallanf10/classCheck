export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-96 h-18 bg-sky-950">
        <div className="h-0.5 w-full bg-zinc-700" />
        <nav className="h-full flex items-center justify-center">
          <div className="flex gap-6">
            <img src="/dashboard.svg" alt="" />
            <img src="/star.svg" alt="" />
            <img src="/home.svg" alt="" />
            <img src="/search.svg" alt="" />
            <img src="/configuration.svg" alt="" />
          </div>
        </nav>
      </footer>
    )
}