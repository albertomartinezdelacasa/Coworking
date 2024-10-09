// Importamos los hooks.
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSingleBooking from '../hooks/useSingleBooking';

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
  const { authUser } = useContext(AuthContext);

  // Obtenemos el ID de la entrada.
  const { idBooking } = useParams();
  console.log(idBooking);

  // Importamos los datos de la entrada.
  const { booking } = useSingleBooking(idBooking);

  // Declaramos una variable para indicar cuando estamos haciendo fetch al servidor y poder
  // deshabilitar así los botones durante ese proceso.
  const [loading, setLoading] = useState(false);

  return (
    booking && (
      <main>
        <h2>Tu Reserva</h2>

        {/* Establecemos las fotos. */}
        {/* <EntryPhotos
          authUser={authUser}
          booking={booking}
          //deleteEntryPhotos={deleteEntryPhotos}
          loading={loading}
          setLoading={setLoading}
        /> */}

        <ul>
          <li>{booking.place}</li>
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
