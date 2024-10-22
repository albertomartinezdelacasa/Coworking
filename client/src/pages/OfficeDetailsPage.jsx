// Importamos los hooks y el componente Navigate.
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSingleOffice from '../hooks/useSingleOffice';
import BookAnOfficePage from './BookAnOfficePage';
// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';

// Importamos el carrusel de fotos
import Carrusel from '../components/CarruselFotosOfi';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const OfficeDetailsPage = () => {
  // Obtenemos los path params necesarios.
  const { idOffice } = useParams();
  // Recibimos los datos del usuario.
  const { authUser } = useContext(AuthContext);

  // Obtenemos la oficina.
  const { office } = useSingleOffice(idOffice);

  const navigate = useNavigate();

  const sendToBooking = async (e) => {
    try {
      e.preventDefault();
      navigate(`/booking/${idOffice}`);
    } catch (err) {
      toast(err.message);
    }
  };

  const sendToEditOffice = async (e) => {
    try {
      e.preventDefault();
      navigate(`/office/edit/${idOffice}`);
    } catch (err) {
      toast(err.message);
    }
  };

  return (
    office && (
      <main>
        <h2>{office.name}</h2>
        {
          // Fotos de la oficina.
          <Carrusel images={office.photos}></Carrusel>
        }
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

        {/* Este botón solo es visible si el usuario tiene el rol de ADMIN */}
        {authUser && authUser.role === 'ADMIN' && (
          <button onClick={sendToEditOffice}>Editar oficina</button>
        )}
      </main>
    )
  );
};

export default OfficeDetailsPage;
