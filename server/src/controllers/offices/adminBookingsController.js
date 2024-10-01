// Importamos la función que retorna la conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Importamos la función para enviar correos
import sendMailUtil from '../../utils/sendMailUtil.js';

// Función controladora que permite aceptar o rechazar una reserva
const adminBookingsController = async (req, res, next) => {
    try {
        // Obtenemos el id de la reserva y la acción (aprobar o rechazar) de los parámetros de la solicitud
        const { idBooking } = req.params;
        const { action } = req.body;

        // Verificamos que se haya proporcionado una acción válida
        if (action !== 'aprobar' && action !== 'rechazar') {
            generateErrorUtil('La acción debe ser "aprobar" o "rechazar"', 400);
        }

        // Obtenemos una conexión con la base de datos
        const pool = await getPool();

        // Verificamos si la reserva existe y obtenemos los datos necesarios
        const [booking] = await pool.query(
            'SELECT b.status, b.idUser, b.idOffice, b.checkIn, b.checkOut, b.guests, u.email, u.name FROM Bookings b JOIN users u ON b.idUser = u.id WHERE b.id = ?',
            [idBooking],
        );

        if (booking.length === 0) {
            generateErrorUtil('No existe la reserva solicitada', 404);
        }

        // Verificamos si la reserva ya ha sido procesada
        if (booking[0].status !== 'PENDING') {
            generateErrorUtil('Esta reserva ya ha sido procesada', 400);
        }

        // Actualizamos el estado de la reserva según la acción
        const newStatus = action === 'aprobar' ? 'CONFIRMED' : 'REJECTED';
        await pool.query('UPDATE Bookings SET status = ? WHERE id = ?', [
            newStatus,
            idBooking,
        ]);

        // Preparamos el correo para el usuario
        const emailSubject = `Actualización de tu reserva para la oficina #${booking[0].idOffice}`;
        const emailBody = action === 'aprobar'
            ? `
            Hola ${booking[0].name},

            Tu reserva para la oficina #${booking[0].idOffice} ha sido confirmada.
            Detalles de la reserva:
            - Check-in: ${booking[0].checkIn}
            - Check-out: ${booking[0].checkOut}
            - Número de invitados: ${booking[0].guests}

            Gracias por usar nuestro servicio.
            `
            : `
            Hola ${booking[0].name},

            Lamentamos informarte que tu reserva para la oficina #${booking[0].idOffice} ha sido rechazada.
            Detalles de la reserva:
            - Check-in: ${booking[0].checkIn}
            - Check-out: ${booking[0].checkOut}
            - Número de invitados: ${booking[0].guests}

            Si tienes alguna pregunta, por favor contáctanos.

            Gracias por tu comprensión.
            `;

        // Enviamos el correo al usuario
        await sendMailUtil(booking[0].email, emailSubject, emailBody);

        // Enviamos la respuesta
        res.send({
            status: 'ok',
            message: `Reserva ${action === 'aprobar' ? 'aprobada' : 'rechazada'} con éxito`,
            data: {
                idBooking,
                status: newStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default adminBookingsController;
