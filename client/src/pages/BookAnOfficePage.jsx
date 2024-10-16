// Importamos los hooks necesarios de React
import { useState, useEffect, useContext } from "react";
// Importamos useParams y useNavigate para la navegación y obtención de parámetros de la URL
import { useParams, useNavigate } from "react-router-dom";
// Importamos los hooks personalizados
import useBookings from "../hooks/UseBookings";
import useOffice from "../hooks/UseOffice";
// Importamos el contexto de autenticación
import { AuthContext } from "../contexts/AuthContext";
// Importamos toast para mostrar notificaciones
import toast from "react-hot-toast";

// Definimos el componente funcional BookAnOfficePage
const BookAnOfficePage = () => {
    // Obtenemos el id de la oficina de los parámetros de la URL
    const { id: idOffice } = useParams();
    const navigate = useNavigate();

    // Utilizamos el hook useOffice para obtener la información de la oficina
    const { office, loading } = useOffice(idOffice);
    // Utilizamos el hook useBookings para obtener las funciones de reserva
    const { createBooking } = useBookings();

    // Obtenemos el usuario autenticado del contexto
    const { authUser } = useContext(AuthContext);

    // Definimos el estado inicial para la nueva reserva
    const [newBooking, setNewBooking] = useState({
        officeId: idOffice,
        checkIn: "",
        checkOut: "",
        guests: 1,
        checkInTime: "",
        checkOutTime: "",
    });

    // Efecto para actualizar el officeId cuando se carga la oficina
    useEffect(() => {
        if (office && !loading) {
            setNewBooking((prevBooking) => ({
                ...prevBooking,
                officeId: office.id,
            }));
        }
    }, [office, loading]);

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
            navigate("/login");
            return;
        }
        try {
            await createBooking(newBooking);
            toast.success("Reserva creada con éxito");
            navigate("/bookings");
        } catch (err) {
            toast.error("Error al crear la reserva: " + err.message);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Renderizamos el componente
    return (
        <div>
            <h1>Reservar Oficina</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    <li>
                        <label htmlFor="officeId">Selecciona una Oficina</label>
                        <select
                            id="officeId"
                            name="officeId"
                            value={newBooking.officeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>
                                Selecciona una oficina
                            </option>
                            {Array.isArray(office) &&
                                office.map((o) => (
                                    <option key={o.id} value={o.name}>
                                        {o.name}
                                    </option>
                                ))}
                        </select>
                    </li>
                    <li>
                        <label htmlFor="checkIn">Fecha de Check-In</label>
                        <input
                            type="date"
                            id="checkIn"
                            name="checkIn"
                            value={newBooking.checkIn}
                            onChange={handleInputChange}
                            title="Selecciona la fecha de check-in"
                            required
                        />
                    </li>
                    <li>
                        <label htmlFor="checkInTime">Hora de Check-In</label>
                        <input
                            type="time"
                            id="checkInTime"
                            name="checkInTime"
                            value={newBooking.checkInTime}
                            onChange={handleInputChange}
                            title="Selecciona la hora de check-in"
                            required
                        />
                    </li>
                    <li>
                        <label htmlFor="checkOut">Fecha de Check-Out</label>
                        <input
                            type="date"
                            id="checkOut"
                            name="checkOut"
                            value={newBooking.checkOut}
                            onChange={handleInputChange}
                            title="Selecciona la fecha de check-out"
                            required
                        />
                    </li>
                    <li>
                        <label htmlFor="checkOutTime">Hora de Check-Out</label>
                        <input
                            type="time"
                            id="checkOutTime"
                            name="checkOutTime"
                            value={newBooking.checkOutTime}
                            onChange={handleInputChange}
                            title="Selecciona la hora de check-out"
                            required
                        />
                    </li>
                    <li>
                        <label htmlFor="guests">Número de invitados</label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            value={newBooking.guests}
                            onChange={handleInputChange}
                            title="Introduce el número de invitados"
                            min="1"
                            required
                        />
                    </li>
                </ul>
                <button type="submit">Reservar</button>
            </form>
        </div>
    );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default BookAnOfficePage;
