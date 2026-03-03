import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"

function Menu({ session }) {

  const [hamburguesas, setHamburguesas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHamburguesas = async () => {
      const { data, error } = await supabase
        .from("hamburguesas")
        .select("*")

      if (!error) {
        setHamburguesas(data)
      }

      setLoading(false)
    }

    fetchHamburguesas()
  }, [])

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Cargando menú...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">

      {hamburguesas.map((burger) => {

        // Aplicamos 10% si hay sesión
        const precioFinal = session
          ? Math.round(burger.precio * 0.9)
          : burger.precio

        return (
          <div
            key={burger.id}
            className="bg-gray-800 p-6 rounded-lg text-white"
          >
            <h2 className="text-xl font-bold text-yellow-400">
              {burger.nombre}
            </h2>

            <p className="mt-2 text-gray-300">
              {burger.descripcion}
            </p>

            <p className="mt-4 text-lg font-bold">
              ${precioFinal}
              {session && (
                <span className="text-green-400 text-sm ml-2">
                  (10% OFF)
                </span>
              )}
            </p>
          </div>
        )
      })}

    </div>
  )
}

export default Menu