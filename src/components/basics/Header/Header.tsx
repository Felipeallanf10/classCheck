export default function Header() {
    return (
        <header className="h-20 bg-sky-950 flex items-center justify-between px-4">
        <button className="w-8 h-8">
          <img src="/lg_menu.svg" alt="Menu" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-100/95 rounded-lg flex justify-center items-center p-1">
            <img src="/notifications.svg" alt="" />
          </div>
          <div className="w-8 h-8 bg-zinc-100/95 rounded-lg flex justify-center items-center p-1">
            <img src="/config.svg" alt="" />
          </div>
          <div className="w-12 h-12 relative">
            <div className="w-12 h-12 bg-zinc-700 rounded-full" />
            <img
              className="w-12 h-12 absolute top-0 left-0 rounded-full"
              src="/perfil.jpg"
              alt="Avatar"
            />
          </div>
        </div>
      </header>
    )
}