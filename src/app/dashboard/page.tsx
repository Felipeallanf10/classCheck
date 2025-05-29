export default function Dashboard() {
    return (
      <main className="w-96 h-[812px] bg-gray-200 font-['Poppins'] relative">
        {/* Header */}
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
  
       <main>
        tesadfaksdçjfalçskdjfasdçlfjk 
       </main>
  
        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-4 w-12 h-12 z-50">
          <div className="w-14 h-14 bg-violet-950 rounded-full shadow-[0px_8px_24px_0px_rgba(130,87,229,0.25)] flex items-center justify-center">
            <div className="w-7 h-7 relative">
              <img src="/chat-teardrop-dots-regular-24px.svg" alt="" />
          </div>
          </div>
        </button>
  
        {/* Footer */}
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
      </main>
    );
  }
    