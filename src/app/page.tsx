export default function Home() {
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

      {/* Main Content */}
      <div className="h-[calc(812px-5rem-4.5rem)] overflow-y-auto p-5 space-y-6">
        {/* Humor Card */}
        <section className="w-full h-28 bg-sky-950 rounded-lg p-4 relative">
          <div className="flex flex-col">
            <h2 className="text-white text-4xl font-medium font-['Poppins'] leading-9">
              Como está o seu <span className="text-yellow-400 font-bold text-4xl font-['Poppins'] leading-9">humor</span> hoje?
            </h2>
          </div>
          <div className="absolute right-12 bottom-6 w-9 h-9 shadow-[0_0_20px_4px_rgba(211,25,148,0.1)]">
            <img src="/emoji-happy.png" className="w-9 h-9" />
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <section className="h-32 bg-sky-950 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="text-white text-5xl font-medium text-center">7</h3>
            <p className="text-white text-base font-medium text-center">Avaliações</p>
          </section>
          <section className="h-32 bg-sky-950 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="text-white text-5xl font-medium text-center">24</h3>
            <p className="text-white text-base font-medium text-center">Aulas</p>
          </section>
        </div>

        {/* Subject Cards */}
        <div className="space-y-4">
          {[
            { title: "Matemática", subtitle: "Aulas" },
            { title: "Gramática", subtitle: "Aulas" },
            { title: "História", subtitle: "Aulas" },
          ].map((subject, index) => (
            <section key={index} className="h-28 bg-sky-950 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex justify-between p-6 items-end">
                <div>
                  <p className="text-white text-[10px] font-medium">{subject.subtitle}</p>
                  <h3 className="text-white text-2xl font-medium">{subject.title}</h3>
                </div>
                
                <img src="/heart.svg" alt="heart" className="w-5 h-5"/>
              </div>
            </section>
          ))}
        </div>
      </div>

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
  