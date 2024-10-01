// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Importamos la función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite votar una oficina con un valor del 1 al 5, tras usarla.
const voteOfficeAfterUseController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la reserva que queremos votar.
        const { idBooking } = req.params;

        // Obtenemos los datos del body.
        const { value } = req.body;

        //ESTE CONSOLE LOG ES PARA COMPROBAR QUE VA BIEN MIENTRAS PROGRAMAMOS
        //HABRÁ QUE QUITARLO
        console.log(value);

        // Si faltan campos lanzamos un error.
        if (!value) {
            generateErrorUtil('Faltan campos', 400);
        }

        // Array de votos válidos.
        const validVotes = [1, 2, 3, 4, 5];

        // Si el valor del voto no es correcto lanzamos un error.
        if (!validVotes.includes(value)) {
            generateErrorUtil(
                'Solo se admiten valores enteros comprendidos entre el 1 y el 5',
                400,
            );
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos el checkout de la reserva.
        const { bookingCheckout } = await pool.query(
            'SELECT checkOut FROM bookings WHERE idUser = ? AND idBooking = ?',
            [req.user.id, idBooking],
        );

        //Comprobamos que la fecha del checkout sea anterior a la actual y lanzamos un error.
        if (new Date(bookingCheckout) > new Date()) {
            generateErrorUtil('La fecha del checkout aún no ha pasado.', 400);
        }

        // Comprobamos si existen votos previos por esa reserva por parte del usuario.
        const [bookingVotes] = await pool.query(
            `SELECT id FROM votes WHERE idUser = ? AND idBooking = ?`,
            [req.user.id, idBooking],
        );

        // Si ya existe un voto por parte del usuario lanzamos un error.
        if (bookingVotes.length > 0) {
            generateErrorUtil('Ya has votado esta reserva', 403);
        }

        // Obtenemos el ID de la oficina que queremos votar.
        const { idOffice } = await pool.query(
            'SELECT idOffice FROM votes WHERE idBooking = ?',
            [idBooking],
        );

        // Insertamos el voto.
        await pool.query(
            `INSERT INTO votes(value, idUser, idUser) VALUES(?, ?, ?)`,
            [value, idBooking, req.user.id],
        );

        // Obtenemos la nueva media de votos de la entrada para poder actualizar el State
        // en el cliente.
        const [votes] = await pool.query(
            `SELECT AVG(value) AS avg FROM votes WHERE idBooking = ?`,
            [idBooking],
        );

        //Obtenemos la cantidad de votos de la oficina para poder actualizar el State
        // en el cliente
        const [totalVotes] = await pool.query('SELECT Count(*) FROM votes');

        //ESTOS CONSOLE LOG SON PARA COMPROBAR QUE VA BIEN MIENTRAS PROGRAMAMOS
        //HABRÁ QUE QUITARLOS
        console.log(votes);
        console.log(totalVotes);

        // Enviamos una respuesta al cliente.
        res.status(201).send({
            status: 'ok',
            message: 'Voto agregado',
            data: {
                votesAvg: Number(votes[0].avg),
            },
        });
    } catch (err) {
        next(err);
    }
};

export default voteOfficeAfterUseController;
