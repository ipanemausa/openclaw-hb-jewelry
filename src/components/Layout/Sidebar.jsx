import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón móvil */}
      <button
        className="sm:hidden p-3 fixed top-4 left-4 z-50 bg-black text-white rounded"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static sm:shadow-none`}
      >
        <div className="p-4 border-b flex justify-between items-center sm:hidden">
          <span className="font-bold text-lg">Menú</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav className="p-4 space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-black">
            Dashboard
          </Link>
          <Link to="/chat" className="block text-gray-700 hover:text-black">
            Chat Agentes
          </Link>
          <Link to="/productos" className="block text-gray-700 hover:text-black">
            Productos
          </Link>
          <Link to="/ventas" className="block text-gray-700 hover:text-black">
            Ventas
          </Link>
          <Link to="/marketing" className="block text-gray-700 hover:text-black">
            Marketing
          </Link>
          <Link to="/ordenes" className="block text-gray-700 hover:text-black">
            Órdenes
          </Link>
        </nav>
      </div>

      {/* Overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
