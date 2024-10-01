// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que retorna el listado de todas las reservas (solo para admin).
const adminAllBookingsListController = async (req, res, next) => {
    try {
        // Comprobamos si el usuario tiene permisos de administrador.
        if (req.user.role !== 'ADMIN') {
            throw generateErrorUtil(
                'No tienes permisos, Solo los ADMIN pueden ver el listado de todos los bookings',
                403,
            );
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos el listado de todas las reservas.
        const [bookings] = await pool.query(
            `
            SELECT  
                b.id,
                b.idUser,
                b.idOffice,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt,
                u.username AS userName,
                o.name AS officeName

            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            GROUP BY b.id 
            ORDER BY b.createdAt DESC
            `,
        );

        // Si no hay ninguna reserva, lanzamos un error
        if (bookings.length < 1) {
            throw generateErrorUtil('No hay ninguna reserva disponible', 400);
        }

        // Enviamos una respuesta al cliente con el listado de reservas.
        res.send({
            status: 'ok',
            data: {
                bookings,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default adminAllBookingsListController;
