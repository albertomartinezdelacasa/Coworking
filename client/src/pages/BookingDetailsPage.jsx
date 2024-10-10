// Importamos los hooks.
import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSingleBooking from '../hooks/useSingleBooking';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos moment para manipular fechar.
import moment from 'moment';

// Importamos los componentes.
//import EntryPhotos from '../components/EntryPhotos';
//import DeleteEntryButton from '../components/DeleteEntryButton';

// Importamos los formularios.
//import AddPhotoForm from '../forms/AddPhotoForm';
//import AddVoteForm from '../forms/AddVoteForm';

// Inicializamos el componente.
const BookingDetailsPage = () => {
  // Obtenemos los datos del usuario.
  const { authToken } = useContext(AuthContext);

  // Obtenemos el ID de la entrada.
  const { idBooking } = useParams();
  console.log(idBooking);

  // Importamos los datos de la entrada.
  const { booking } = useSingleBooking(idBooking);
  const navigate = useNavigate();

  // Declaramos una variable para indicar cuando estamos haciendo fetch al servidor y poder
  // deshabilitar así los botones durante ese proceso.
  const [loading, setLoading] = useState(false);

  const handleDeleteBooking = async () => {
    try {
      // Si el usuario NO confirma que desea eliminar finalizamos la función.
      if (!confirm('¿Estás seguro de que deseas cancelar la reserva?')) {
        return;
      }

      // Obtenemos la respuesta del servidor.
      const res = await fetch(
        `${VITE_API_URL}/api/office/${idBooking}/booking`,
        {
          method: 'delete',
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Obtenemos el body.
      const body = await res.json();

      // Si hay algún error lo lanzamos.
      if (body.status === 'error') {
        throw new Error(body.message);
      }

      // Redirigimos a la página pricipal.
      navigate('/');

      // Mostramos un mensaje satisfactorio al usuario.
      toast.success(body.message, {
        id: 'productDetails',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'productDetails',
      });
    }
  };

  return (
    booking && (
      <main>
        <h2>Tu Reserva</h2>
        {
          // Fotos de la oficina.
          booking.photos.map((photo) => {
            return (
              <img
                src={`${VITE_API_URL}/${photo.name}`}
                key={photo.id}
                alt='Foto de la oficina'
              />
            );
          })
        }
        <ul>
          <li>
            <h2>{booking.officeName}</h2>
          </li>
          <li>
            Check In:{' '}
            {moment(booking.checkIn).format('DD/MM/YYYY [a las] HH:mm')}
          </li>
          <li>
            Check Out:{' '}
            {moment(booking.checkOut).format('DD/MM/YYYY [a las] HH:mm')}
          </li>
          <li>Numero de usuarios: {booking.guests}</li>
          <li>Estado de reserva: {booking.status}</li>
          <li>
            Creado el{' '}
            {moment(booking.createdAt).format('DD/MM/YYYY [a las] HH:mm')}
          </li>
        </ul>
        <button onClick={() => handleDeleteBooking()}>Cancelar reserva</button>

        {/* Formulario de votar. */}
        {/* <AddVoteForm
            entryId={bookingId}
            updateEntryVotes={updateEntryVotes}
            loading={loading}
            setLoading={setLoading}
            /> */}

        {
          // Si estamos logueados y somos los dueños podemos borrar la entrada.
          /* authUser && authUser.id === entry.userId && (
                <DeleteEntryButton
                entryId={bookingId}
                loading={loading}
                setLoading={setLoading}
                />
            ) */
        }
      </main>
    )
  );
};

export default BookingDetailsPage;
