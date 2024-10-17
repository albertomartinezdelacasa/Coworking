import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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

        if (body.status === "error") {
          throw new Error(body.message);
        }

        setOffices(body.data.offices); // Asumiendo que tu respuesta incluye esta estructura
      } catch (err) {
        setError("Error al cargar las oficinas");
      } finally {
        setLoading(false); // Asegúrate de establecer loading en false al final
      }
    };

    fetchOffices();
  }, []); // El array vacío hace que esto se ejecute solo una vez al montar el componente

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        margin: "30px",
      }}
    >
      <h1>Lista de Oficinas</h1>
      <div>
        {offices.map((office) => (
          <div
            key={office.id}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "11px 10px 5px -8px rgba(0,0,0,0.11)",
              padding: "10px",
              margin: "10px 30px",
              width: "400px",
            }}
          >
            <div>
              {office.photos && office.photos.length > 0 ? (
                office.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={`${VITE_API_URL}/${office.photos[0].name}`} // Nota Alex :no estoy seguro que hay que hace aqui
                    alt={`Foto ${photo.name}`}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      boxShadow: "11px 10px 5px -8px rgba(0,0,0,0.11)",
                      borderRadius: "10px",
                    }}
                  />
                ))
              ) : (
                <p>No hay fotos disponibles.</p>
              )}
            </div>
            <div>
              <ul
                style={{
                  listStyleType: "none",
                  padding: "0",
                  margin: "0",
                }}
              >
                <li>
                  <strong>{office.name}</strong>
                </li>
                <li>{office.address}</li>
                <li>{office.description}</li>
                <li>Capacidad: {office.capacity}</li>
                <li>£{office.price}</li>
                <li>{office.workspace}</li>
                <li>
                  <NavLink to={`/booking/${office.id}`}>Reservar</NavLink>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficeListPage;
