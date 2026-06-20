import { useState, useEffect } from "react";

export default function ProductosTable({ productos }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!productos || productos.length === 0) {
    return <p className="p-4 text-gray-500">No hay productos disponibles.</p>;
  }

  // Vista móvil (cards)
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-bold">{p.nombre}</span>
              <span className="text-sm text-gray-500">ID: {p.id}</span>
            </div>

            <div className="text-gray-700">
              <p><strong>Precio:</strong> ${p.precio}</p>
              <p><strong>Stock:</strong> {p.stock}</p>
              <p><strong>Categoría:</strong> {p.categoria}</p>
            </div>

            <button className="w-full mt-2 bg-black text-white py-2 rounded">
              Editar
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Vista desktop (tabla)
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">${p.precio}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">{p.categoria}</td>
              <td className="p-3">
                <button className="bg-black text-white px-3 py-1 rounded">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
