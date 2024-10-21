import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const OfficeListPage = () => {
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para los filtros
  const [filters, setFilters] = useState({
    capacity: '',
    price: '',
    workspace: '',
  });

  // Fetch para obtener las oficinas
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/list`);
        if (!res.ok) {
          throw new Error('Error al cargar las oficinas');
        }
        const body = await res.json();

        setOffices(body.data.offices);
        setFilteredOffices(body.data.offices); // Inicializamos las oficinas filtradas con todas las oficinas
      } catch (err) {
        setError(`Error al cargar las oficinas: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  // Función para manejar los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filtrar oficinas cuando cambian los filtros o las oficinas originales
  useEffect(() => {
    const filterOffices = () => {
      const filtered = offices.filter((office) => {
        // Filtro por capacidad
        if (
          filters.capacity &&
          office.capacity < parseInt(filters.capacity, 10)
        ) {
          return false;
        }

        // Filtro por precio
        if (
          filters.price &&
          parseFloat(office.price) > parseFloat(filters.price)
        ) {
          return false;
        }

        // Filtro por tipo de espacio (workspace)
        if (filters.workspace && office.workspace !== filters.workspace) {
          return false;
        }

        return true;
      });

      setFilteredOffices(filtered);
    };

    filterOffices();
  }, [filters, offices]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ margin: '30px' }}>
      <h1>Coworking Spaces :</h1>

      {/* Formulario para filtros */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type='number'
          name='capacity'
          placeholder='Capacidad mínima'
          value={filters.capacity}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type='number'
          name='price'
          placeholder='Precio máximo'
          value={filters.price}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <select
          name='workspace'
          value={filters.workspace}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        >
          <option value=''>Tipo de Espacio</option>
          <option value='OFFICE'>Office</option>
          <option value='DESK'>Desk</option>
        </select>
      </div>

      <div>
        {filteredOffices.map((office) => (
          <div
            key={office.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: '11px 10px 5px -8px rgba(0,0,0,0.11)',
              padding: '10px',
              margin: '10px 30px',
              width: '500px',
            }}
          >
            <div>
              {office.photos && office.photos.length > 0 ? (
                office.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={`${VITE_API_URL}/${photo.name}`}
                    alt={`Foto ${photo.name}`}
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      boxShadow: '11px 10px 5px -8px rgba(0,0,0,0.11)',
                      borderRadius: '10px',
                    }}
                  />
                ))
              ) : (
                <p>No hay fotos disponibles.</p>
              )}
            </div>
            <div>
              <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                <li>
                  <strong>{office.name}</strong>
                </li>
                <li>{office.address}</li>
                <li>Capacidad: {office.capacity}</li>
                <li>€{office.price}</li>
                <li>{office.workspace}</li>
                <li>Horario de Apertura: {office.opening}</li>
                <li>Horario de Cierre: {office.closing}</li>
                <li>
                  <NavLink to={`/office/details/${office.id}`}>
                    Más detalles
                  </NavLink>
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
