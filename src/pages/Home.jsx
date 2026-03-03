import Login from "./Login"
import Menu from "./Menu"

function Home() {

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <div className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-yellow-400">
          🍔 Burger App
        </h1>

        <Login />
      </div>

      <Menu session={null} rol={null}/>

    </div>
  )
}

export default Home