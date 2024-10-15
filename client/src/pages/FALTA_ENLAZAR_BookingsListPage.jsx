// Importamos los hooks.
import useBookings from "../hooks/UseBookings";
import { useContext, useState } from "react";

// Importamos los componentes.
import { NavLink } from "react-router-dom";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const BookingsListPage = async () => {
  // Estado para controlar si se está cargando.
  const [isLoading, setIsLoading] = useState(true);

  try {
    // Prevenimos el comportamiento por defecto.
    e.preventDefault();

    // Importamos el token.
    const { authToken, authUser } = useContext(AuthContext);

    //Si no estamos logueados redirigimos a la página de login.
    if (!authUser) {
      return <Navigate to="/login" />;
    }

    // Obtenemos una respuesta del servidor.
    const res = await fetch(`${VITE_API_URL}/api/list/booking`, {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
      body: formData,
    });

    // Obtenemos el body.
    const body = await res.json();

    // Si hay algún error lo lanzamos.
    if (body.status === "error") {
      throw new Error(body.message);
    }

    // Mostramos un mensaje satisfactorio al usuario.
    toast.success(body.message, {
      id: "get bookings",
    });
  } catch (err) {
    setHasError(true);
    toast.error(err.message, {
      id: "get bookings",
    });
  } finally {
    // Indicamos que ha finalizado el proceso.
    setIsLoading(false);
  }

  // Obtenemos los bookings.
  const { bookings } = useBookings();

  // Mientras se está cargando, mostramos un mensaje de carga.
  if (isLoading) {
    return (
      <main>
        {/*<img src="/path/to/logo.png" alt="Logo de InovaSpace" />*/}
        <h1>Obteniendo reservas...</h1>
        <p>Por favor, espera un momento mientras procesamos tu solicitud.</p>
      </main>
    );
  }

  return (
    <main>
      <h2>Listado de reservas</h2>
      {/* Si no hay reservas, muestra un mensaje */}
      {bookings.length === 0 ? (
        <>
          <p>
            No hay reservas disponibles. Haz clik en el siguiente enlace para
            hacer una reserva:{" "}
          </p>
          {/* Enlace al listado de oficinas */}
          <NavLink to="/office/list">
            Ver listado de oficinas disponibles
          </NavLink>
        </>
      ) : (
        <ul>
          {bookings.map((booking) => {
            return (
              <li key={booking.id}>
                <NavLink to={`/bookings/${booking.id}`}></NavLink>
                {/* Fotos de la oficina */}
                {booking.photos.map((photo) => {
                  return (
                    <img
                      src={`${VITE_API_URL}/${photo.name}`}
                      key={photo.id}
                      alt="Foto de la oficina"
                    />
                  );
                })}

                <ul>
                  {/* Info de la reserva */}
                  <li>
                    <h2>{booking.nameOffice}</h2>
                  </li>
                  <li>
                    Check In:{" "}
                    {moment(booking.checkIn).format("DD/MM/YYYY [a las] HH:mm")}
                  </li>
                  <li>
                    Check Out:{" "}
                    {moment(booking.checkOut).format(
                      "DD/MM/YYYY [a las] HH:mm"
                    )}
                  </li>
                  <li>Estado de reserva: {booking.status}</li>
                  <li>Precio: {booking.price} €</li>
                </ul>
                {/* Si es admin, añade esta informacion */}
                {authUser.role === "ADMIN" && (
                  <ul>
                    <li>Usuario: {booking.username}</li>
                    <li>
                      {booking.guests} Invitados / {booking.capacity} Capacidad
                    </li>
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default BookingsListPage;
