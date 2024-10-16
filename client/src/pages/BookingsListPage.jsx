// Importamos los hooks.
import useBookings from "../hooks/UseBookings";
import { useContext, useState, useEffect } from "react";

// Importamos los componentes.
import { NavLink, Navigate } from "react-router-dom";

// Importamos el contexto.
import { AuthContext } from "../contexts/AuthContext";

// Importamos la función toast.
import toast from "react-hot-toast";

// Importamos la librería moment
import moment from "moment";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const BookingsListPage = () => {
  // Estado para controlar si se está cargando y si hay error.
  const [isLoading, setIsLoading] = useState(true);
  // Estado para manejar errores
  const [hasError, setHasError] = useState(false);
  // Obtenemos los bookings del hook
  const { bookings, fetchBookings } = useBookings();
  // Obtenemos el token y usuario autenticado
  const { authToken, authUser } = useContext(AuthContext);

  // Redirigimos al login si no hay sesion iniciada
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  // useEffect para cargar las reservas
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtenemos la respuesta del servidor.
        const res = await fetch(`${VITE_API_URL}/api/list/booking`, {
          method: "GET",
          headers: {
            Authorization: authToken,
          },
        });

        // Procesamos la respuesta
        const body = await res.json();

        // Si hay algún error lo lanzamos.
        if (body.status === "error") {
          throw new Error(body.message);
        }

        // Actualizamos el estado de las reservas usando el hook
        fetchBookings(body.bookings);

        // Mostramos un mensaje satisfactorio al usuario.
        toast.success("Reservas obtenidas con éxito", {
          id: "get-bookings",
        });
      } catch (err) {
        setHasError(true); // Establecemos el estado de error
        toast.error(err.message, {
          id: "get-bookings",
        });
      } finally {
        // Indicamos que ha finalizado el proceso de carga.
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken, fetchBookings]); // Dependencias del efecto

  // Mientras se está cargando, mostramos un mensaje de carga.
  if (isLoading) {
    return (
      <main>
        <h1>Obteniendo reservas...</h1>
        <p>Por favor, espera un momento mientras procesamos tu solicitud.</p>
      </main>
    );
  }

  // Si hay un error, mostramos un mensaje de error.
  if (hasError) {
    return (
      <main>
        <h1>Error al obtener las reservas</h1>
        <p>Intenta recargar la página o intenta de nuevo más tarde.</p>
      </main>
    );
  }

  return (
    <main>
      <h2>Listado de reservas</h2>

      {/* Desplegable para filtrar por estado */}
      <label htmlFor="statusFilter">Filtrar por estado:</label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="CONFIRMED">Confirmado</option>
        <option value="PENDING">Pendiente</option>
        <option value="CANCELED">Cancelado</option>
        <option value="REJECTED">Rechazado</option>
      </select>

      {/* Si no hay reservas, muestra un mensaje */}
      {filteredBookings.length === 0 ? (
        <>
          <p>
            No hay reservas disponibles. Haz click en el siguiente enlace para
            hacer una reserva:
          </p>
          <NavLink to="/office/list">
            Ver listado de oficinas disponibles
          </NavLink>
        </>
      ) : (
        <ul>
          {filteredBookings.map((booking) => (
            <li key={booking.id}>
              <NavLink to={`/bookings/${booking.id}`}>Ver detalles</NavLink>
              {/* Fotos de la oficina */}
              {booking.photos.map((photo) => (
                <img
                  src={`${VITE_API_URL}/${photo.name}`}
                  key={photo.id}
                  alt="Foto de la oficina"
                />
              ))}
              <ul>
                {/* Información de la reserva */}
                <li>
                  <h2>{booking.nameOffice}</h2>
                </li>
                <li>
                  Check In:{" "}
                  {moment(booking.checkIn).format("DD/MM/YYYY [a las] HH:mm")}
                </li>
                <li>
                  Check Out:{" "}
                  {moment(booking.checkOut).format("DD/MM/YYYY [a las] HH:mm")}
                </li>
                <li>Estado de reserva: {booking.status}</li>
                <li>Precio: {booking.price} €</li>
              </ul>
              {/* Si es admin, añade esta información */}
              {authUser.role === "ADMIN" && (
                <ul>
                  <li>Usuario: {booking.username}</li>
                  <li>
                    {booking.guests} Invitados / {booking.capacity} Capacidad
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default BookingsListPage;
