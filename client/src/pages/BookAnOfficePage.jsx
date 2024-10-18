// Importamos los hooks necesarios de React
import { useState, useEffect, useContext } from "react";
// Importamos useParams y useNavigate para la navegación y obtención de parámetros de la URL
import { useParams, NavLink, useNavigate } from "react-router-dom";
// Importamos los hooks personalizados
import useBookings from "../hooks/UseBookings";
import useOffice from "../hooks/UseOffice";
// Importamos el contexto de autenticación
import { AuthContext } from "../contexts/AuthContext";
// Importamos toast para mostrar notificaciones
import toast from "react-hot-toast";

const { VITE_API_URL } = import.meta.env;

// Definimos el componente funcional BookAnOfficePage
const BookAnOfficePage = () => {
  // Obtenemos los datos del usuario y el token.
  const { authUser, authToken } = useContext(AuthContext);
  if (authUser.role === "ADMIN") {
    return (
      <>
        <h1>No puedes hacer una reserva con una cuenta de administración</h1>
        <NavLink to={`/office/list`}>Volver a la lista de oficinas</NavLink>
      </>
    );
  }

  const { idOffice } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${VITE_API_URL}/api/booking/${idOffice}`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
        }),
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }
      navigate("/");

      toast.success(body.message, {
        id: "newBooking",
      });
    } catch (err) {
      toast(err.message, {
        id: "newBooking",
      });
    }
  };
  // Si NO estamos logueados redirigimos a la página de login.
  if (!authUser) {
    navigate("/login");
  }

  return (
    <main>
      <h1>Reservar Oficina</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="checkIn">Check In:</label>
            <input
              type="datetime-local"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              /* step='3600' */
            />
          </li>
          <li>
            <label htmlFor="checkOut">Check Out:</label>
            <input
              type="datetime-local"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              /* step='3600' */
            />
          </li>
          <li>
            <label htmlFor="guests">Número de invitados</label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              title="Introduce el número de invitados"
              min="1"
              required
            />
          </li>
        </ul>
        <button type="submit">Reservar</button>
      </form>
    </main>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default BookAnOfficePage;
