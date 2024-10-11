// Importamos la funcion que retorna una conexion con la base de datos

import getPool from '../../db/getPool.js';

// Funcion que genera un error.

import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Funcion controladora que retorna el listado de oficinas

const getBookingByIdController = async (req, res, next) => {
    try {
        // Obtenemos id de la oficina que buscamos de los path params.
        let { idBooking } = req.params;
        // Obtenemos el id del usuario.
        let searchingUser = req.user.id;
        // Obtenemos la conexión con la base de datos
        const pool = await getPool();

        //Obtenemos las oficinas con el ID recibido

        const [bookings] = await pool.query(
            `
            SELECT  
                b.id,
                b.idUser,
                b.idOffice,
                o.name AS officeName,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt

            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            WHERE b.id = ?
            GROUP BY b.id 
            `,
            /*
                INNER JOIN officeEquipments oe ON oe.id = o.idOffice
                    INNER JOIN equipments e ON e.id = oe.idEquipment
                INNER JOIN officePhotos op ON op.id = o.idOffice
                */
            [idBooking],
        );

        // Si no existe ninguna oficina con ese ID, generamos un error.

        if (bookings.length < 1 || searchingUser !== bookings[0].idUser) {
            generateErrorUtil('No existe esa reserva', 404);
        }

        // Buscamos la foto de la oficina   (crear tabla fotos)

        const [photos] = await pool.query(
            `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
            [bookings[0].idOffice],
        );

        // Agregamos el array de fotos a la officina

        bookings[0].photos = photos;

        //Enviamos una respuesta al usuario
        res.send({
            status: 'ok',
            data: {
                booking: bookings[0],
            },
        });
    } catch (err) {
        next(err);
    }
};

export default getBookingByIdController;
