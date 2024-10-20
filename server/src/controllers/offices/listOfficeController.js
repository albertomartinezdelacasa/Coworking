// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que retorna el listado de oficinas. Se puede filtrar por palabra clave.
const listOfficeController = async (req, res, next) => {
    try {
        // Obtenemos el query param que nos permitirá filtrar por palabra clave.
        let { keyword } = req.query;

        // Si "keyword" contiene un valor considerado falso por JS, asignamos un string vacío.
        keyword = keyword || '';

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos las oficinas.

        const [offices] = await pool.query(
            `
       SELECT 
            o.id,
            o.name,
            o.price,
            o.workspace,
            o.capacity,
            o.address,
            o.createdAt,
            o.opening,      
            o.closing,     
            AVG(b.vote) AS votesAvg,
            COUNT(b.vote) AS totalVotes
        FROM offices o
        LEFT JOIN bookings b ON b.idOffice = o.id  
        WHERE o.name LIKE ?
        GROUP BY o.id
    `,
            [`%${keyword}%`],
        );

        // Recorremos las oficinas en busca de las fotos.
        for (const office of offices) {
            // Buscamos las fotos de la oficina.
            const [photos] = await pool.query(
                `SELECT id, name FROM officePhotos WHERE IdOffice = ?`,
                [office.id],
            );

            // Agregamos el array de fotos a la oficina.
            office.photos = photos;
        }
        console.log(offices);
        // Si no hay ninguna officina coworking space , lanzamos un error
        if (offices.length < 1) {
            generateErrorUtil('No hay oficinas', 400);
        }
        // Enviamos una respuesta al cliente.
        await res.send({
            status: 'ok',
            data: {
                offices,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default listOfficeController;
