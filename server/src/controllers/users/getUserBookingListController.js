// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

import generateErrorUtil from '../../utils/generateErrorUtil.js';
// Función controladora que retorna el listado de reservas.
const getUserBookingListController = async (req, res, next) => {
    try {
        // Obtenemos los datos del usuario necesarios.
        let searchingUser = req.user.id;

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos el listado de reservas.
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
                u.username AS searchingUser

            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            WHERE u.username LIKE ?
            GROUP BY b.id 
            `,
            /*
                INNER JOIN officeEquipments oe ON oe.id = o.idOffice
                    INNER JOIN equipments e ON e.id = oe.idEquipment
                INNER JOIN officePhotos op ON op.id = o.idOffice
                */
            [searchingUser],
        );
        // Si no hay ninguna reserva , lanzamos un error
        if (bookings.length < 1) {
            generateErrorUtil('No tienes reservas', 400);
        }
        // Enviamos una respuesta al cliente.
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

export default getUserBookingListController;
