import "../../styles/hb.css";

const FileManager = () => {
  const archivos = [
    { nombre: 'App.jsx', tamaño: '2.4 KB', fecha: '2024-01-15' },
    { nombre: 'index.html', tamaño: '1.1 KB', fecha: '2024-01-14' },
    { nombre: 'styles.css', tamaño: '3.7 KB', fecha: '2024-01-13' },
    { nombre: 'package.json', tamaño: '0.8 KB', fecha: '2024-01-12' },
    { nombre: 'README.md', tamaño: '1.5 KB', fecha: '2024-01-11' },
  ];

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h2 className="hb-page-title">Gestor de Archivos</h2>
        <p className="hb-page-subtitle">Listado de archivos del proyecto</p>
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((archivo, index) => (
              <tr key={index}>
                <td>{archivo.nombre}</td>
                <td>{archivo.tamaño}</td>
                <td>{archivo.fecha}</td>
                <td>
                  <span className={`hb-badge ${index % 2 === 0 ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {index % 2 === 0 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileManager;






