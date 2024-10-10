// Importamos los hooks.
import useBookings from '../hooks/UseBookings';
import { useContext, useState } from 'react';

// Importamos los componentes.
import { NavLink } from 'react-router-dom';

// Importamos el contexto.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función toast.
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const UserBookingsPage = async () => {
  try {
    // Prevenimos el comportamiento por defecto.
    e.preventDefault();

    // Importamos el token.
    const { authToken, authUser } = useContext(AuthContext);

    // Obtenemos una respuesta del servidor.
    const res = await fetch(`${VITE_API_URL}/users/bookingsList`, {
      method: 'get',
      headers: {
        Authorization: authToken,
      },
      body: formData,
    });

    // Obtenemos el body.
    const body = await res.json();

    // Si hay algún error lo lanzamos.
    if (body.status === 'error') {
      throw new Error(body.message);
    }

    // Mostramos un mensaje satisfactorio al usuario.
    toast.success(body.message, {
      id: 'Bookings',
    });
  } catch (err) {
    toast.error(err.message, {
      id: 'Bookings',
    });
  }

  // Obtenemos los bookings.
  const { bookings } = useBookings();

  // Si aún no se han cargado los datos del usuario no retornamos nada.
  if (authUserLoading) {
    return <></>;
  }

  // Ahora que el fetch de usuarios ya ha terminado, si NO estamos logueados redirigimos a la página de login.
  if (!authUser) {
    return <Navigate to='/login' />;
  }

  return (
    <main>
      <h2>Listado de reservas</h2>

      <ul>
        {bookings.map((booking) => {
          return (
            <li key={booking.id}>
              <NavLink to={`/bookings/${booking.id}`}>
                <div>
                  {booking.idOffice}: {booking.price}€
                </div>
                <div>
                  Tiempo reservado: {booking.checkIn} - {booking.checkOut}
                </div>
                <div>Estado: {booking.status}</div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default UserBookingsPage;
