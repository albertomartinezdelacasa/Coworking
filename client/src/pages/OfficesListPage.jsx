import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const OfficeListPage = () => {
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para los filtros
  const [filters, setFilters] = useState({
    capacity: '',
    price: '',
    workspace: '',
    equipments: [],
  });

  // Equipamientos disponibles
  const equipments = [
    'Pizarra',
    'Proyector',
    'Catering',
    'Cafetera',
    'Monitor',
    'Equipo de Sonido',
    'TV',
    'Dispensador de Agua',
  ];

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
        setFilteredOffices(body.data.offices);

        // Aplicar filtro inicial basado en el parámetro de la URL
        const params = new URLSearchParams(location.search);
        const workspaceParam = params.get('workspace');
        if (workspaceParam) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            workspace: workspaceParam,
          }));
        }
      } catch (err) {
        setError(`Error al cargar las oficinas: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [location.search]);

  // Función para manejar los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'equipments') {
      // Manejar el cambio de checkboxes de equipamientos
      setFilters((prevFilters) => {
        const newEquipments = checked
          ? [...prevFilters.equipments, value] // Añadir equipamiento
          : prevFilters.equipments.filter((eq) => eq !== value); // Eliminar equipamiento

        return {
          ...prevFilters,
          equipments: newEquipments,
        };
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
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

        // Filtro por equipamientos
        if (filters.equipments.length > 0) {
          const hasAllEquipments = filters.equipments.every((equipment) =>
            office.equipments.some((eq) => eq.name === equipment)
          );
          if (!hasAllEquipments) {
            return false;
          }
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
    <main className='list-page'>
      <h1>Coworking Spaces :</h1>

      {/* Formulario para filtros */}
      <form>
        <input
          type='number'
          name='capacity'
          placeholder='Capacidad mínima'
          value={filters.capacity}
          onChange={handleFilterChange}
        />
        <input
          type='number'
          name='price'
          placeholder='Precio máximo'
          value={filters.price}
          onChange={handleFilterChange}
        />
        <select
          name='workspace'
          value={filters.workspace}
          onChange={handleFilterChange}
        >
          <option value=''>Todos los espacios</option>
          <option value='OFFICE'>Office</option>
          <option value='DESK'>Desk</option>
        </select>

        {/* Filtro de equipamientos */}
        <fieldset>
          <legend>Equipamientos:</legend>
          {equipments.map((equipment) => (
            <label key={equipment}>
              <input
                type='checkbox'
                name='equipments'
                value={equipment}
                onChange={handleFilterChange}
                checked={filters.equipments.includes(equipment)}
              />
              {equipment}
            </label>
          ))}
        </fieldset>
      </form>

      {/* Lista de oficinas */}
      <ul>
        {filteredOffices.map((office) => (
          <li
            className='element'
            key={office.id}
            onClick={() => navigate(`/office/details/${office.id}`)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: '11px 10px 5px -8px rgba(0,0,0,0.11)',
              padding: '10px',
              margin: '10px 30px',
              width: '500px',
              cursor: 'pointer',
            }}
          >
            <div className='photo'>
              {office.photos && office.photos.length > 0 ? (
                <img
                  src={`${VITE_API_URL}/${office.photos[0].name}`}
                  alt={`Foto ${office.photos[0].name}`}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    boxShadow: '11px 10px 5px -8px rgba(0,0,0,0.11)',
                    borderRadius: '10px',
                  }}
                />
              ) : (
                <p>No hay fotos disponibles.</p>
              )}
            </div>
            <ul
              className='element-details'
              style={{ listStyleType: 'none', padding: '0', margin: '0' }}
            >
              <li className='element-title'>
                <strong>{office.name}</strong>
              </li>
              <li>{office.address}</li>
              <li>Capacidad: {office.capacity}</li>
              <li>€{office.price}</li>
              <li>{office.workspace}</li>
              <li>Horario de Apertura: {office.opening}</li>
              <li>Horario de Cierre: {office.closing}</li>
              <li>Valoración: {Number(office.votesAvg).toFixed(1)}/5</li>
              <li>Cantidad de valoraciones: {office.totalVotes}</li>
              <li>
                <strong>Equipamientos:</strong>
                <ul>
                  {office.equipments && office.equipments.length > 0 ? (
                    office.equipments.map((equipment) => (
                      <li key={equipment.id}>{equipment.name}</li>
                    ))
                  ) : (
                    <li>No hay equipamientos disponibles.</li>
                  )}
                </ul>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default OfficeListPage;
