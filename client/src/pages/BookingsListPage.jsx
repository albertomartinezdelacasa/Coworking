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
  const [isLoading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(false);
  // Estado para gestionar el filtro de estado
  const [filterStatus, setFilterStatus] = useState("");
  // Obtenemos los bookings del hook
  const { bookings, setBookings } = useBookings();
  // Obtenemos el token y usuario autenticado
  const { authToken, authUser } = useContext(AuthContext);

  // Redirigimos al login si no hay sesion iniciada
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  // useEffect para cargar las reservas
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Obtenmemos una respuesta del servidor.
        const res = await fetch(`${VITE_API_URL}/api/list/booking`, {
          headers: {
            Authorization: authToken,
          },
        });

        // Obtenemos el body de la respuesta
        const body = await res.json();

        if (body.status === "error") {
          throw new Error(body.message);
        }

        setBookings(body.data.bookings); // Asumiendo que tu respuesta incluye esta estructura
      } catch (err) {
        setError("Error al cargar las revesvas");
      } finally {
        setLoading(false); // Asegúrate de establecer loading en false al final
      }
    };

    fetchBookings();
  }, []); // El array vacío hace que esto se ejecute solo una vez al montar el componente

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
  if (error) {
    <main>
      <h1>Error al obtener las reservas</h1>
      <p>Intenta recargar la página o intenta de nuevo más tarde.</p>
      <p>ERROR: {error}</p>
    </main>;
  }

  // Función para gestionar el cambio de selección en el menú
  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };
  // Filtrar las reservas según el estado seleccionado
  const filteredBookings = filterStatus
    ? bookings.filter((booking) => booking.status === filterStatus)
    : bookings;

  return (
    <main>
      {/* Menú desplegable para filtrar por estado */}
      <label htmlFor="statusFilter">Filtrar por estado:</label>
      <select
        id="statusFilter"
        value={filterStatus}
        onChange={handleStatusChange}
      >
        <option value="">Todas</option>
        <option value="CONFIRMED">Confirmadas</option>
        <option value="CANCELLED">Canceladas</option>
        <option value="PENDING">Pendientes</option>
        <option value="REJECTED">Rechazada</option>
      </select>
      <h2>Listado de reservas</h2>

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
            <li key={booking.idBooking}>
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
              <NavLink to={`/users/bookings/${booking.idBooking}`}>
                Ver detalles
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default BookingsListPage;
