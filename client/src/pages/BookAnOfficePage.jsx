// Importamos el hook useState para manejar el estado del componente
import { useState, useContext } from 'react';
// Importamos useParams para obtener parámetros de la URL
import { useParams, useNavigate } from 'react-router-dom';
// Importamos el hook personalizado useBookings para manejar las reservas
import useBookings from '../hooks/UseBookings';
// Importamos el contexto de autenticación
import { AuthContext } from '../contexts/AuthContext';
// Importamos toast para mostrar notificaciones
import toast from 'react-hot-toast';

// Definimos el componente funcional BookingOfficePage
const BookingOfficePage = () => {
    // Obtenemos el id de la oficina de los parámetros de la URL
    const { id } = useParams();
    const navigate = useNavigate();
    // Utilizamos el hook useBookings para obtener las funciones de reserva
    const { createBooking } = useBookings();
    // Obtenemos el usuario autenticado del contexto
    const { authUser } = useContext(AuthContext);
    // Definimos el estado inicial para la nueva reserva
    const [newBooking, setNewBooking] = useState({
        officeId: id,
        checkIn: '',  // Fecha de check-in
        checkOut: '', // Fecha de check-out
        guests: 1,    // Número de invitados
    });

    // Función para manejar los cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking({ ...newBooking, [name]: value });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authUser) {
            toast.error("Debes iniciar sesión para hacer una reserva.");
            navigate('/login');
            return;
        }
        try {
            await createBooking(newBooking);
            toast.success("Reserva creada con éxito");
            navigate('/bookings');
        } catch (err) {
            toast.error("Error al crear la reserva: " + err.message);
        }
    };

    // Renderizamos el componente
    return (
        <div>
            <h1>Reservar Oficina</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="checkIn"
                    value={newBooking.checkIn}
                    onChange={handleInputChange}
                    placeholder="Fecha de Check-In"
                    required
                />
                <input
                    type="date"
                    name="checkOut"
                    value={newBooking.checkOut}
                    onChange={handleInputChange}
                    placeholder="Fecha de Check-Out"
                    required
                />
                <input
                    type="number"
                    name="guests"
                    value={newBooking.guests}
                    onChange={handleInputChange}
                    placeholder="Número de invitados"
                    min="1"
                    required
                />
                <button type="submit">Reservar</button>
            </form>
        </div>
    );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default BookingOfficePage;
