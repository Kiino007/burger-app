import Login from "./Login"
import Menu from "./Menu"

function Home() {
  return (
    /* CAMBIO AQUÍ: Cambiamos bg-gray-900 por bg-burger */
    <div className="min-h-screen bg-burger text-white flex flex-col">
      
      {/* HEADER: Logo Izquierda, Login Derecha */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-start">
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-yellow-400 leading-tight uppercase">
            🍔 BURGER APP
          </h1>
          <p className="text-gray-300 text-[10px] tracking-[0.2em] font-bold">
            THE REAL TASTE
          </p>
        </div>

        {/* LADO DERECHO: Login compacto */}
        <div className="w-[300px] mt-0"> 
          <Login />
        </div>
      </header>

      {/* SECCIÓN DEL MENÚ */}
      <main className="w-full max-w-7xl mx-auto px-6 mt-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-yellow-500 inline-block pb-1">
            Nuestro Menú
          </h2>
        </div>

        {/* El Menú ahora se verá transparente sobre la imagen */}
        <Menu session={null} rol={null} />
      </main>

    </div>
  )
}

export default Home