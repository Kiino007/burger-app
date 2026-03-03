import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"

function Menu({ session, rol }) {
  const [hamburguesas, setHamburguesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", precio: "" })

  useEffect(() => {
    fetchHamburguesas()
  }, [])

  const fetchHamburguesas = async () => {
    const { data, error } = await supabase
      .from("hamburguesas")
      .select("*")
      .order('created_at', { ascending: true })

    if (!error) setHamburguesas(data)
    setLoading(false)
  }
  const prepararEdicion = (burger) => {
   setEditandoId(burger.id)
    setFormEdit({ 
      nombre: burger.nombre, 
      descripcion: burger.descripcion, 
      precio: burger.precio 
    })
  }
  const actualizarHamburguesa = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from("hamburguesas")
      .update({ 
        nombre: formEdit.nombre, 
        descripcion: formEdit.descripcion, 
        precio: parseInt(formEdit.precio) 
      })
      .eq("id", editandoId)

    if (error) {
      alert("Error al actualizar: " + error.message)
    } else {
      // Refrescamos la lista localmente
      setHamburguesas(hamburguesas.map(b => b.id === editandoId ? { ...b, ...formEdit, precio: parseInt(formEdit.precio) } : b))
      setEditandoId(null) // Cerramos el modo edición
      alert("¡Actualizada correctamente!")
    }
  }

  // --- LÓGICA DE ADMIN: AGREGAR ---
  const agregarHamburguesa = async () => {
    const nombre = prompt("Nombre de la hamburguesa:")
    const descripcion = prompt("Descripción:")
    const precio = prompt("Precio (solo números):")

    if (!nombre || !precio) return

    const { data, error } = await supabase
      .from("hamburguesas")
      .insert([{ nombre, descripcion, precio: parseInt(precio) }])
      .select()

    if (error) {
      alert("Error al agregar: " + error.message)
    } else {
      setHamburguesas([...hamburguesas, data[0]])
      alert("¡Añadida con éxito!")
    }
  }

  // --- LÓGICA DE ADMIN: ELIMINAR ---
  const eliminarHamburguesa = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta hamburguesa?")
    if (!confirmar) return

    const { error } = await supabase
      .from("hamburguesas")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar: " + error.message)
    } else {
      setHamburguesas(hamburguesas.filter(h => h.id !== id))
      alert("Hamburguesa eliminada correctamente")
    }
  }

  if (loading) return <div className="text-white text-center mt-10">Cargando menú...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {hamburguesas.map((burger) => {
        
        // REGLA: 10% de descuento solo si hay sesión (usuario ingresado)
        const tieneSesion = session !== null
        const precioOriginal = burger.precio
        const precioFinal = tieneSesion 
          ? Math.round(precioOriginal * 0.90) 
          : precioOriginal

        if (editandoId === burger.id) {
          return (
            <form key={burger.id} onSubmit={actualizarHamburguesa} className="bg-gray-700 border-2 border-yellow-500 p-6 rounded-2xl text-white space-y-3 shadow-2xl scale-105 transition-transform">
              <h3 className="text-yellow-400 font-bold">Editando Hamburguesa</h3>
              <input 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-sm focus:border-yellow-500 outline-none"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({...formEdit, nombre: e.target.value})}
                placeholder="Nombre" required
              />
              <textarea 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-sm focus:border-yellow-500 outline-none"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({...formEdit, descripcion: e.target.value})}
                placeholder="Descripción"
              />
              <input 
                type="number"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-sm focus:border-yellow-500 outline-none"
                value={formEdit.precio}
                onChange={(e) => setFormEdit({...formEdit, precio: e.target.value})}
                placeholder="Precio" required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded text-xs font-bold uppercase transition-colors">Guardar</button>
                <button type="button" onClick={() => setEditandoId(null)} className="flex-1 bg-gray-500 hover:bg-gray-600 py-2 rounded text-xs font-bold uppercase transition-colors">Cancelar</button>
              </div>
            </form>
          )
        }

        return (
          <div key={burger.id} className="bg-gray-800 border border-gray-700 p-6 rounded-2xl text-white relative flex flex-col justify-between">
            
            <div>
              {tieneSesion && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg">
                  OFERTA -10%
                </span>
              )}

              <h2 className="text-xl font-bold text-yellow-400">{burger.nombre}</h2>
              <p className="mt-2 text-gray-400 text-sm italic">{burger.descripcion}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold">${precioFinal.toLocaleString()}</span>
                {tieneSesion && (
                  <span className="text-gray-500 line-through text-sm">${precioOriginal.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN ADMIN */}
            {rol === 'admin' && (
              <div className="mt-6 flex gap-2 border-t border-gray-700 pt-4">
                <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded font-bold uppercase"
                onClick={() => prepararEdicion(burger)}
                >
                Editar
                </button>
                <button 
                  onClick={() => eliminarHamburguesa(burger.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded font-bold uppercase"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* BOTÓN DE AGREGAR (SOLO ADMIN) */}
      {rol === 'admin' && (
        <div 
          onClick={agregarHamburguesa}
          className="border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center p-6 hover:border-yellow-500 cursor-pointer transition-colors group"
        >
           <span className="text-gray-500 group-hover:text-yellow-500 font-bold text-lg">+ Agregar Nueva</span>
        </div>
      )}
    </div>
  )
}

export default Menu