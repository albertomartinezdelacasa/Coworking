// Importamos la funcion que retorna una conexion a la base de datos

import getPool from "../../db/getPool.js";

// Importamos la función que genera un error

import generateErrorUtil from "../../utils/generateError.js";

//Función Controladora que crea una reserva de una oficina por su id y usuario

const bookOfficeByIdController = async (req, res, next) => {
    try {
        // Obtenemos el id de la oficina a reservar y el id del usuario
        const { idOffice } = req.params;
        const { idUser } = req.body;

        // Verificamos que se haya proporcionado el idUser
        if (!idUser) {
            generateErrorUtil('Se requiere el ID del usuario para hacer la reserva', 400);
        }

        //Obtenemos una conexión con la base de datos
        const pool = await getPool();

        // Verificamos si la oficina existe
        const [office] = await pool.query(
            'SELECT id FROM offices WHERE id = ?',
            [idOffice]
        );

        if (office.length === 0) {
            generateErrorUtil('No existe la oficina solicitada', 404);
        }

        // Comprobamos si ya hay una reserva sobre esta oficina cuyo estado sea "confirmed".
        const [bookings] = await pool.query(
            `SELECT id FROM Bookings 
             WHERE idOffice = ? AND status = 'CONFIRMED'`,
            [idOffice]
        );

        // Si ya existe una reserva confirmada, lanzamos un error
        if (bookings.length > 0) {
            generateErrorUtil('Esta oficina ya está reservada', 403);
        }

        // Si llegamos aquí, podemos crear la reserva
        await pool.query(
            `INSERT INTO bookings (idUser, idOffice, status, createdAt) 
             VALUES (?, ?, 'CONFIRMED', NOW())`,
            [idUser, idOffice]
        );

        // Enviamos la respuesta
        res.status(201).send({
            status: 'ok',
            message: 'Reserva creada con éxito',
            data: {
                idUser,
                idOffice,
                status: 'CONFIRMED'
            }
        });

    } catch (error) {
        next(error);
    }
};
