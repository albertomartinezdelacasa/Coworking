// Importamos los hooks.
import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSingleBooking from '../hooks/useSingleBooking';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos moment para manipular fechar.
import moment from 'moment';

// Importamos el carrusel de fotos
import Carrusel from '../components/CarruselFotosOfi';

// Importamos el formulario de votaciones
import AddVoteForm from '../Forms/AddVoteForm';

// Inicializamos el componente.
const BookingDetailsPage = () => {
  // Obtenemos los datos del usuario.
  const { authToken, authUser } = useContext(AuthContext);

  // Obtenemos el ID de la entrada.
  const { idBooking } = useParams();

  // Importamos los datos de la entrada.
  const { booking } = useSingleBooking(idBooking);
  const navigate = useNavigate();

  // Declaramos una variable para indicar cuando estamos haciendo fetch al servidor y poder
  // deshabilitar así los botones durante ese proceso.
  const [loading, setLoading] = useState(false);

  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    if (booking) {
      const checkoutDate = moment(booking.checkOut);
      const now = moment();
      setCanVote(
        now.isAfter(checkoutDate) &&
          !booking.vote &&
          booking.status !== 'CANCELED'
      );
    }
  }, [booking]);

  const handleDeleteBooking = async () => {
    try {
      // Si el usuario NO confirma que desea eliminar finalizamos la función.
      if (!confirm('¿Estás seguro de que deseas cancelar la reserva?')) {
        return;
      }

      // Obtenemos la respuesta del servidor.
      const res = await fetch(
        `${VITE_API_URL}/api/bookings/${idBooking}/cancel`,
        {
          method: 'PATCH',
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
        id: 'bookingDetails',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'bookingDetails',
      });
    }
  };

  const handleConfirmBooking = async (action) => {
    try {
      // Si el usuario NO confirma que desea eliminar finalizamos la función.
      if (!confirm('¿Confirmar reserva?')) {
        return;
      }
      console.log(action);
      // Obtenemos la respuesta del servidor.
      const res = await fetch(
        `${VITE_API_URL}/api/bookings/${idBooking}/admin`,
        {
          method: 'PATCH',
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: action,
          }),
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
        id: 'bookingDetails',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'bookingDetails',
      });
    }
  };

  return (
    booking && (
      <main className='booking-details-page'>
        <h1 className='page-title'>Gestión Reservas</h1>
        <div className='booking-details-card'>
          {<Carrusel images={booking.photos}></Carrusel>}
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
          {booking.status !== 'CANCELED' && booking.status !== 'REJECTED' && (
            <>
              {authUser.role === 'ADMIN' && booking.status !== 'CONFIRMED' && (
                <button onClick={() => handleConfirmBooking('aprobada')}>
                  Confirmar reserva
                </button>
              )}
              {new Date(booking.checkOut) > new Date() &&
                (authUser.role === 'ADMIN' ? (
                  <button onClick={() => handleConfirmBooking('rechazada')}>
                    Rechazar reserva
                  </button>
                ) : (
                  <button onClick={() => handleDeleteBooking()}>
                    Cancelar reserva
                  </button>
                ))}
            </>
          )}

          {/* Comprobamos si se puede votar. */}
          {canVote && (
            <AddVoteForm
              idBooking={idBooking}
              onVoteSubmit={() => {
                setCanVote(false);
              }}
            />
          )}
        </div>
      </main>
    )
  );
};

export default BookingDetailsPage;
