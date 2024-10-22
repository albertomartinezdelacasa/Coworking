import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSingleOffice from '../hooks/useSingleOffice';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Carrusel from '../components/CarruselFotosOfi';

const { VITE_API_URL } = import.meta.env;

const OfficeDetailsPage = () => {
  const { idOffice } = useParams();
  const { authToken, authUser } = useContext(AuthContext);
  const { office } = useSingleOffice(idOffice);
  const [isEditing, setIsEditing] = useState(false); // Estado para habilitar la edición
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [opening, setOpening] = useState('');
  const [closing, setClosing] = useState('');
  const [equipments, setEquipments] = useState([]); // Estado para los equipamientos

  // Estados para edicion de equipamientos.
  const [allEquipments, setAllEquipments] = useState([]); // Todos los equipamientos posibles
  const [selectedEquipments, setSelectedEquipments] = useState([]); // Equipamientos seleccionados

  const [loading, setLoading] = useState(false);

  // Inicializamos los valores de la oficina para editar
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/equipments`, {
          headers: {
            Authorization: authToken,
          },
        });
        const body = await res.json();
        console.log(body.data.equipments[0].name);

        setAllEquipments(body.data.equipments); // Todos los equipamientos
        if (body.status === 'error') {
          throw new Error(body.message);
        }
      } catch (err) {
        toast.error('Error al cargar los equipamientos');
      }
    };

    fetchEquipments();

    if (office) {
      setName(office.name);
      setDescription(office.description);
      setAddress(office.address);
      setWorkspace(office.workspace);
      setCapacity(office.capacity);
      setPrice(office.price);
      setOpening(office.opening);
      setClosing(office.closing);
      setEquipments(office.equipments);
    }
  }, [office, authToken]);

  const sendToBooking = async (e) => {
    try {
      e.preventDefault();
      navigate(`/booking/${idOffice}`);
    } catch (err) {
      toast(err.message);
    }
  };

  // Habilitar la edición
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Función para actualizar la oficina desde la misma página
  const handleUpdateOffice = async (e) => {
    e.preventDefault();

    const formattedOpening = opening.length === 5 ? `${opening}:00` : opening;
    const formattedClosing = closing.length === 5 ? `${closing}:00` : closing;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('capacity', capacity);
      formData.append('workspace', workspace);
      formData.append('price', price);
      formData.append('opening', formattedOpening);
      formData.append('closing', formattedClosing);

      // Agregar los equipamientos seleccionados al FormData
      formData.append('equipments', JSON.stringify(selectedEquipments));

      const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`, {
        method: 'PUT',
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }
      toast.success('Oficina actualizada correctamente');
      setIsEditing(false); // Deshabilitar modo de edición después de actualizar
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de selección de equipamientos
  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value); // Asegúrate de convertir el valor a número
    if (checked) {
      setSelectedEquipments((prev) => [...prev, id]); // Añadir el ID como número
    } else {
      setSelectedEquipments((prev) =>
        prev.filter((id) => id !== Number(value))
      ); // Filtrar el ID como número
    }
  };

  return (
    office && (
      <main>
        <h2>{office.name}</h2>
        <Carrusel images={office.photos}></Carrusel>
        {/* DETALLES DE OFICINA EDITABLE PARA ADMIN */}
        <br />
        {authUser && authUser.role === 'ADMIN' ? (
          <form onSubmit={handleUpdateOffice}>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              <li>
                <label htmlFor='name'>
                  <strong>Nombre:</strong>
                </label>
                <input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </li>

              <li>
                <label htmlFor='address'>
                  <strong>Dirección:</strong>
                </label>
                <input
                  type='text'
                  id='address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                />
              </li>

              <li>
                <label htmlFor='capacity'>Capacidad:</label>
                <input
                  type='number'
                  id='capacity'
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  disabled={!isEditing}
                />
              </li>

              <li>
                <label htmlFor='price'>Precio:</label>
                <input
                  type='number'
                  id='price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={!isEditing}
                />
              </li>

              <li>
                <label htmlFor='workspace'>Tipo de espacio:</label>
                <select
                  id='workspace'
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  disabled={!isEditing}
                >
                  <option value='OFFICE'>OFICINA</option>
                  <option value='DESK'>ESCRITORIO</option>
                </select>
              </li>

              <li>
                <label htmlFor='description'>Descripción:</label>
                <input
                  type='text'
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing}
                />
              </li>

              <li>
                <label htmlFor='opening'>Horario de Apertura:</label>
                <select
                  id='opening'
                  value={opening}
                  onChange={(e) => setOpening(e.target.value)}
                  disabled={!isEditing}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option
                      key={i}
                      value={`${i.toString().padStart(2, '0')}:00`}
                    >
                      {`${i.toString().padStart(2, '0')}:00`}
                    </option>
                  ))}
                </select>
              </li>

              <li>
                <label htmlFor='closing'>Horario de Cierre:</label>
                <select
                  id='closing'
                  value={closing}
                  onChange={(e) => setClosing(e.target.value)}
                  disabled={!isEditing}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option
                      key={i}
                      value={`${i.toString().padStart(2, '0')}:00`}
                    >
                      {`${i.toString().padStart(2, '0')}:00`}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
            <h2>Equipamientos disponibles</h2>

            {allEquipments.length > 0 ? (
              allEquipments.map((equipment) => (
                <div key={equipment.id}>
                  <label>
                    <input
                      type='checkbox'
                      value={equipment.id}
                      onChange={handleEquipmentChange}
                      checked={selectedEquipments.includes(equipment.id)}
                      disabled={!isEditing}
                    />
                    {equipment.name}
                  </label>
                </div>
              ))
            ) : (
              <p>No hay equipamientos disponibles.</p>
            )}
            <button onClick={sendToBooking}>Reservar oficina</button>

            {authUser.role === 'ADMIN' && (
              <>
                <button type='button' onClick={toggleEditMode}>
                  {isEditing ? 'Cancelar' : 'Editar oficina'}
                </button>
                {isEditing && (
                  <button type='submit' disabled={loading}>
                    {loading ? 'Enviando...' : 'Guardar cambios'}
                  </button>
                )}
              </>
            )}
          </form>
        ) : (
          /* DETALLE DE OFICINA NO EDITABLE PARA USUARIO NORMAL Y NO REGISTRADO */
          <>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              <li>
                <strong>{office.name}</strong>
              </li>
              <li>{office.address}</li>
              <li>Capacidad: {office.capacity}</li>
              <li>€{office.price}</li>
              <li>{office.workspace}</li>
              <li>{office.description}</li>
              <li>Horario de Apertura: {office.opening}</li>
              <li>Horario de Cierre: {office.closing}</li>
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
            {/* Este botón es visible para todos los usuarios */}
            <button onClick={sendToBooking}>Reservar oficina</button>
          </>
        )}
      </main>
    )
  );
};

export default OfficeDetailsPage;
