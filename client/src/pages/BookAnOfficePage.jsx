/* // Importamos los hooks necesarios de React
import { useState, useEffect, useContext } from 'react';
// Importamos useParams y useNavigate para la navegación y obtención de parámetros de la URL
import { useParams, useNavigate } from 'react-router-dom';
// Importamos los hooks personalizados
import useBookings from '../hooks/UseBookings';
import useOffice from '../hooks/UseOffice';
// Importamos el contexto de autenticación
import { AuthContext } from '../contexts/AuthContext';
// Importamos toast para mostrar notificaciones
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

// Definimos el componente funcional BookAnOfficePage
const BookAnOfficePage = () => {
  // Obtenemos los datos del usuario y el token.
  const { authUser, authToken } = useContext(AuthContext);

  const { idOffice } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${VITE_API_URL}/api/booking/${idOffice}`, {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
        }),
      });

      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }
      navigate('/');

      toast.success(body.message, {
        id: 'newBooking',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'newBooking',
      });
    }
  };
  // Si NO estamos logueados redirigimos a la página de login.
  if (!authUser) {
    navigate('/login');
  }

  return (
    <main>
      <h1>Reservar Oficina</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor='checkIn'>Check In:</label>
            <input
              type='datetime-local'
              id='checkIn'
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              step='3600'
            />
          </li>
          <li>
            <label htmlFor='checkOut'>Check Out:</label>
            <input
              type='datetime-local'
              id='checkOut'
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              step='3600'
            />
          </li>
          <li>
            <label htmlFor='guests'>Número de invitados</label>
            <input
              type='number'
              id='guests'
              name='guests'
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              title='Introduce el número de invitados'
              min='1'
              required
            />
          </li>
        </ul>
        <button type='submit'>Reservar</button>
      </form>
    </main>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default BookAnOfficePage;
 */

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const BookAnOfficePage = () => {
  const { authUser, authToken } = useContext(AuthContext);
  const { idOffice } = useParams();
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('8');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('8');
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Combinar la fecha y la hora en un solo string para enviar al backend
      const checkIn = `${checkInDate}T${checkInTime.padStart(2, '0')}:00:00`;
      const checkOut = `${checkOutDate}T${checkOutTime.padStart(2, '0')}:00:00`;

      const res = await fetch(`${VITE_API_URL}/api/booking/${idOffice}`, {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
        }),
      });

      const body = await res.json();

      if (body.status === 'error') {
        throw new Error(body.message);
      }
      navigate('/');

      toast.success(body.message, {
        id: 'newBooking',
      });
    } catch (err) {
      toast.error(err.message, {
        id: 'newBooking',
      });
    }
  };

  if (!authUser) {
    navigate('/login');
  }

  return (
    <main>
      <h1>Reservar Oficina</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor='checkInDate'>Check In - Fecha:</label>
            <input
              type='date'
              id='checkInDate'
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor='checkInTime'>Check In - Hora:</label>
            <select
              id='checkInTime'
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              required
            >
              {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                <>
                  <option key={hour} value={hour}>
                    {`${hour}:00`}
                  </option>
                  <option key={hour} value={hour}>
                    {`${hour}:30`}
                  </option>
                </>
              ))}
            </select>
          </li>
          <li>
            <label htmlFor='checkOutDate'>Check Out - Fecha:</label>
            <input
              type='date'
              id='checkOutDate'
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor='checkOutTime'>Check Out - Hora:</label>
            <select
              id='checkOutTime'
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              required
            >
              {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                <option key={hour} value={hour}>
                  {`${hour}:00`}
                </option>
              ))}
            </select>
          </li>
          <li>
            <label htmlFor='guests'>Número de invitados:</label>
            <input
              type='number'
              id='guests'
              name='guests'
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              title='Introduce el número de invitados'
              min='1'
              required
            />
          </li>
        </ul>
        <button type='submit'>Reservar</button>
      </form>
    </main>
  );
};

export default BookAnOfficePage;
