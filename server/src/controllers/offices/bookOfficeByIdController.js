// Importamos la funcion que retorna una conexion a la base de datos

import getPool from '../../db/getPool.js';

// Importamos la función que genera un error

import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Importamos la función para enviar correos

import sendMailUtil from '../../utils/sendMailUtil.js';

//Función Controladora que crea una reserva de una oficina por su id y usuario

const bookOfficeByIdController = async (req, res, next) => {
    try {
        // Obtenemos el id de la oficina a reservar y el id del usuario
        const { idOffice } = req.params;
        const { idUser } = req.body;

        // Verificamos que se haya proporcionado el idUser
        if (!idUser) {
            generateErrorUtil(
                'Se requiere el ID del usuario para hacer la reserva',
                400,
            );
        }

        //Obtenemos una conexión con la base de datos 
        const pool = await getPool();

        // Verificamos si la oficina existe
        const [office] = await pool.query(
            'SELECT id FROM offices WHERE id = ?',
            [idOffice],
        );

        if (office.length === 0) {
            generateErrorUtil('No existe la oficina solicitada', 404);
        }

        // Comprobamos si ya hay una reserva pendiente o confirmada sobre esta oficina
        const [existingBookings] = await pool.query(
            `SELECT id FROM Bookings 
             WHERE idOffice = ? AND status IN ('PENDING', 'CONFIRMED')`,
            [idOffice],
        );

        if (existingBookings.length > 0) {
            generateErrorUtil('Esta oficina ya está reservada o pendiente de confirmación', 403);
        }

        // Creamos la reserva con estado 'PENDING'
        await pool.query(
            `INSERT INTO bookings (idUser, idOffice, status, createdAt) 
             VALUES (?, ?, 'PENDING', NOW())`,
            [idUser, idOffice],
        );

        // Obtenemos los datos del usuario para enviar el correo
        const [userData] = await pool.query(
            'SELECT email, name FROM users WHERE id = ?',
            [idUser],
        );

        // Enviamos un correo al usuario
        const emailSubject = 'Reserva realizada con éxito';
        const emailBody = `
        Hola ${userData[0].name},

        Tu reserva para la oficina #${idOffice} ha sido realizada con éxito y está pendiente de confirmación por un administrador.

        Te notificaremos cuando tu reserva sea confirmada.

        Gracias por usar nuestro servicio.
        `;

        await sendMailUtil(userData[0].email, emailSubject, emailBody);

        // Obtenemos el correo del administrador
        const [adminData] = await pool.query(
            'SELECT email FROM users WHERE role = "ADMIN" LIMIT 1'
        );

        if (adminData.length > 0) {
            // Enviamos un correo al administrador
            const adminEmailSubject = 'Nueva reserva pendiente de confirmación';
            const adminEmailBody = `
            Hola Administrador,

            Se ha realizado una nueva reserva que requiere tu confirmación:

            Usuario: ${userData[0].name} (ID: ${idUser})
            Oficina: #${idOffice}

            Por favor, accede al panel de administración para confirmar o rechazar esta reserva.

            Gracias.
            `;

            await sendMailUtil(adminData[0].email, adminEmailSubject, adminEmailBody);
        }

        // Enviamos la respuesta
        res.status(201).send({
            status: 'ok',
            message: 'Reserva creada con éxito y pendiente de confirmación',
            data: {
                idUser,
                idOffice,
                status: 'PENDING',
            },
        });
    } catch (error) {
        next(error);
    }
};

export default bookOfficeByIdController;

