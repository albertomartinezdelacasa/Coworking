// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función controladora que retorna el listado de reservas.
const getBookingsListController = async (req, res, next) => {
    try {
        // Obtenemos la palabra clave del equipamiento que buscamos
        let { keyword } = req.query;

        // Si "keyword" contiene un valor considerado falso por JS, asignamos un string vacío.
        keyword = keyword || 'PENDING';

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        let arrayQuery = [];
        let strQuery = `
            SELECT  
                b.id,
                b.idUser,
                b.idOffice,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt,
                u.name,
                u.lastname,
                o.name,
                o.workspace,
                o.capacity,
                o.price
            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            `;

        // Si el usuario no es admin, filtra con un WHERE y muestra sus reservas
        if (req.user.role !== 'ADMIN') {
            strQuery = strQuery + 'WHERE u.id = ?';
            arrayQuery.push(req.user.id);
        } else {
            strQuery = strQuery + 'WHERE b.status = ? ORDER BY b.checkIn';
            arrayQuery.push(keyword);
        }

        // Obtenemos el listado de reservas.
        const [bookings] = await pool.query(strQuery, arrayQuery);

        // Si no hay ninguna reserva , devuelve un array vacio que en el Front usaremos
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

export default getBookingsListController;
