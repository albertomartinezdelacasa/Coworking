import { useEffect, useState } from 'react';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const OfficeListPage = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/list`);
        const body = await res.json();

        if (body.status === 'error') {
          throw new Error(body.message);
        }

        setOffices(body.data.offices); // Asumiendo que tu respuesta incluye esta estructura
      } catch (err) {
        setError('Error al cargar las oficinas');
      } finally {
        setLoading(false); // Asegúrate de establecer loading en false al final
      }
    };

    fetchOffices();
  }, []); // El array vacío hace que esto se ejecute solo una vez al montar el componente

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Lista de Oficinas</h1>
      <div>
        {offices.map((office) => (
          <div
            key={office.id}
            style={{
              border: '1px solid black',
              padding: '10px',
              margin: '10px 0',
            }}
          >
            <h2>{office.name}</h2>
            <p>
              <strong>Dirección:</strong> {office.address}
            </p>
            <p>
              <strong>Descripción:</strong> {office.description}
            </p>
            <p>
              <strong>Capacidad:</strong> {office.capacity}
            </p>
            <p>
              <strong>Precio:</strong> ${office.price}
            </p>
            <p>
              <strong>Tipo de Espacio:</strong> {office.workspace}
            </p>
            <div>
              <strong>Fotos:</strong>

              <div>
                {office.photos && office.photos.length > 0 ? (
                  office.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={`${VITE_API_URL}/uploads/${photo.name}`} // Nota Alex :no estoy seguro que hay que hace aqui
                      alt={`Foto ${photo.name}`}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  ))
                ) : (
                  <p>No hay fotos disponibles.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficeListPage;
