import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const deleteBookingController = async (req, res, next) => {
    try {
        const { idBooking } = req.params;
        const idUser = req.user.id;

        const pool = await getPool();

        const [booking] = await pool.query(
            'SELECT * FROM bookings WHERE id=? AND idUser=?',
            [idBooking, idUser],
        );

        if (booking.length < 1) {
            throw generateErrorUtil(
                'No se ha encontrado ninguna reserva con ese id y usuario',
                404,
            );
        }

        await pool.query('DELETE FROM bookings WHERE id=? AND idUser=?', [
            idBooking,
            idUser,
        ]);

        res.send({
            status: 'ok',
            message: 'La reserva se ha eliminado correctamente',
        });
    } catch (error) {
        next(error);
    }
};

export default deleteBookingController;
