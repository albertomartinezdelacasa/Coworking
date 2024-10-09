import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useBookings from '../hooks/UseBookings';

const BookingOfficePage = () => {
    const { id } = useParams();
    const { bookings, createBooking } = useBookings();
    const [newBooking, setNewBooking] = useState({
        officeId: id,
        userId: '', // Asume que tienes el ID del usuario de alguna manera
        date: '', // Fecha de la reserva
        // Otros campos necesarios para la reserva
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking({ ...newBooking, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createBooking(newBooking);
    };

    return (
        <div>
            <h1>Reservar Oficina</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userId"
                    value={newBooking.userId}
                    onChange={handleInputChange}
                    placeholder="ID del Usuario"
                />
                <input
                    type="date"
                    name="date"
                    value={newBooking.date}
                    onChange={handleInputChange}
                />
                {/* Agrega más campos según sea necesario */}
                <button type="submit">Reservar</button>
            </form>
            {/* Aquí podrías mostrar las reservas existentes si es necesario */}
        </div>
    );
};

export default BookingOfficePage;
