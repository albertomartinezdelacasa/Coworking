// Importamos la función que retorna la conexión con la base de datos. 

import getPool from "../../db/getPool.js";

//Función que genera un error.

import generateErrorUtil from '../../utils/generateErrorUtil.js';

//Funcion controladora que permite acepatr o rechazar una reserva 

//Importar el middleware de autentificación e integrarla 

const adminApprovalBookingConfirmationController = async (req, res, next) => {
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

        // Verificamos si la reserva existe
        const [booking] = await pool.query(
            'SELECT status FROM Bookings WHERE id = ?',
            [idBooking]
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
        await pool.query(
            'UPDATE Bookings SET status = ? WHERE id = ?',
            [newStatus, idBooking]
        );

        // Enviamos la respuesta
        res.send({
            status: 'ok',
            message: `Reserva ${action === 'aprobar' ? 'aprobada' : 'rechazada'} con éxito`,
            data: {
                idBooking,
                status: newStatus
            }
        });

    } catch (error) {
        next(error);
    }
};

export default adminApprovalBookingConfirmationController;
