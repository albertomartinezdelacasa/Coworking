import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import useAnOffice from '../hooks/useAnOffice';
const { VITE_API_URL } = import.meta.env;

const BookAnOfficePage = () => {
  const { authUser, authToken } = useContext(AuthContext);
  const { idOffice } = useParams();

  /* const officeData = async ()=>{
    const { office } = await useSingleOffice(idOffice);
    return office;
  }
  officeData(office); */
  // Obtenemos la oficina.
  const { oficina, loading } = useAnOffice(idOffice);

  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('8');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('9');
  const [guests, setGuests] = useState(1);

  // Si está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando oficina...</div>;
  }

  // Verificar si oficina tiene datos antes de continuar con la lógica
  // Esto es porque a veces tarda el fetch y oficina termina siendo Null.
  if (!oficina || !oficina.closing || !oficina.opening) {
    return <div>No se encontraron los datos de la oficina.</div>;
  }
  // Verificamos cuantas horas esta abierto.
  const open = parseInt(oficina.opening);
  const close = parseInt(oficina.closing);
  const horasAbierto = close - open + 1;

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
              {Array.from({ length: horasAbierto }, (_, i) => i + open).map(
                (hour) => (
                  <>
                    <option key={hour} value={hour}>
                      {`${hour}:00`}
                    </option>
                  </>
                )
              )}
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
              {Array.from({ length: horasAbierto }, (_, i) => i + open).map(
                (hour) => (
                  <option key={hour} value={hour}>
                    {`${hour}:00`}
                  </option>
                )
              )}
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
