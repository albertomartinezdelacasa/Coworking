// Obtenemos la conexión con la base de datos.
import getPool from '../../db/getPool.js';
// Obtenemos el codigo de gestion de errores.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Funcion que elimina una reserva.
const deleteBookingController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la reserva.
        const { idBooking } = req.params;

        // Conectamos con la base de datos.
        const pool = await getPool();

        // Si el rol del usuario logeado no es ADMIN, obtenemos su id.
        // Solo mostramos las reservas que estan a su nombre.
        if (req.user.role !== 'ADMIN') {
            const idUser = req.user.id;
            const [booking] = await pool.query(
                'SELECT * FROM bookings WHERE id=? AND idUser=?',
                [idBooking, idUser],
            );

            // Si no hay reservas, generamos un error.
            if (booking.length < 1) {
                throw generateErrorUtil(
                    'No se ha encontrado ninguna reserva coincidente',
                    404,
                );
            }
        }

        // Eliminamos la reserva de la base de datos.
        await pool.query('DELETE FROM bookings WHERE id=?', [idBooking]);

        // Enviamos un mensaje de OK al usuario.
        res.send({
            status: 'ok',
            message: 'La reserva se ha eliminado correctamente',
        });
    } catch (err) {
        next(err);
    }
};

export default deleteBookingController;
