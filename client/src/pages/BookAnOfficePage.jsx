// Importamos React y el hook useState para manejar el estado del componente
import React, { useState } from 'react';
// Importamos useParams para obtener parámetros de la URL
import { useParams } from 'react-router-dom';
// Importamos el hook personalizado useBookings para manejar las reservas
import useBookings from '../hooks/UseBookings';

// Definimos el componente funcional BookingOfficePage
const BookAnOfficePage = () => {
  // Obtenemos el id de la oficina de los parámetros de la URL
  const { id } = useParams();
  // Utilizamos el hook useBookings para obtener las funciones de reserva
  const { bookings, createBooking } = useBookings();
  // Definimos el estado inicial para la nueva reserva
  const [newBooking, setNewBooking] = useState({
    officeId: id,
    userId: '', // ID del usuario (se asume que se obtiene de alguna manera)
    date: '', // Fecha de la reserva
    // Aquí se pueden agregar más campos necesarios para la reserva
  });

  // Función para manejar los cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking(newBooking);
  };

  // Renderizamos el componente
  return (
    <div>
      <h1>Reservar Oficina</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='userId'
          value={newBooking.userId}
          onChange={handleInputChange}
          placeholder='ID del Usuario'
        />
        <input
          type='date'
          name='date'
          value={newBooking.date}
          onChange={handleInputChange}
        />
        {/* Aquí se pueden agregar más campos según sea necesario */}
        <button type='submit'>Reservar</button>
      </form>
      {/* Aquí se podrían mostrar las reservas existentes si fuera necesario */}
    </div>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default BookAnOfficePage;
