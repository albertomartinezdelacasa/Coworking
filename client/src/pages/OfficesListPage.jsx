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

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/list`);
        const body = await res.json();

        if (body.status === 'error') {
          throw new Error(body.message);
        }

        setOffices(body.data.offices);
        setFilteredOffices(body.data.offices); // Inicializamos las oficinas filtradas con todas las oficinas
      } catch (err) {
        setError('Error al cargar las oficinas');
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  // Función para aplicar los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

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
      <h1>Lista de Oficinas</h1>

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
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '11px 10px 5px -8px rgba(0,0,0,0.11)',
              padding: '10px',
              margin: '10px 30px',
              width: '400px',
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
                <li>{office.description}</li>
                <li>Capacidad: {office.capacity}</li>
                <li>€{office.price}</li>
                <li>{office.workspace}</li>
                <li>
                  <NavLink to={`/office/details/${office.id}`}>
                    Mas detalles
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
