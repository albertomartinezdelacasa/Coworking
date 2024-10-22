// Importamos la funcion que retorna una conexion con la base de datos

import getPool from '../../db/getPool.js';

// Funcion que genera un error.

import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Funcion controladora que retorna el listado de oficinas

const getOfficeByIdController = async (req, res, next) => {
    try {
        // Obtenemos id de la oficina que buscamos de los path params.
        let { idOffice } = req.params;

        // Obtenemos la conexión con la base de datos
        const pool = await getPool();

        //Obtenemos las oficinas con el ID recibido

        const [offices] = await pool.query(
            `
          SELECT
              o.id,
              o.name,
              o.description,
              o.address,
              o.workspace,
              o.capacity,
              o.price,
              o.opening,
              o.closing,
              o.createdAt,
              AVG(b.vote) AS votesAvg,
              COUNT(b.vote) AS totalVotes

         FROM offices o
         LEFT JOIN bookings b ON o.id = b.idOffice
         WHERE o.id = ?
         GROUP BY o.id
         `,
            [idOffice],
        );

        // Si no existe ninguna oficina con ese ID, generamos un error.

        if (offices.length < 1) {
            generateErrorUtil('No existe esa oficina', 404);
        }

        // Buscamos la foto de la oficina   (crear tabla fotos)

        const [photos] = await pool.query(
            `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
            [offices[0].id],
        );

        // Agregamos el array de fotos a la officina

        offices[0].photos = photos;

        //Enviamos una respuesta al usuario
        res.send({
            status: 'ok',
            data: {
                offices: offices[0],
            },
        });
    } catch (err) {
        next(err);
    }
};

export default getOfficeByIdController;

// --------------------------------- nuevo modelo que incluye equipamientos

// // Importamos la funcion que retorna una conexion con la base de datos
// import getPool from '../../db/getPool.js';
// // Funcion que genera un error.
// import generateErrorUtil from '../../utils/generateErrorUtil.js';

// // Funcion controladora que retorna el detalle de una oficina, incluyendo equipamientos
// const getOfficeByIdController = async (req, res, next) => {
//     try {
//         // Obtenemos id de la oficina que buscamos de los path params.
//         const { idOffice } = req.params;

//         // Obtenemos la conexión con la base de datos
//         const pool = await getPool();

//         // Obtenemos la oficina con el ID recibido
//         const [offices] = await pool.query(
//             `
//           SELECT
//               o.id,
//               o.name,
//               o.description,
//               o.address,
//               o.workspace,
//               o.capacity,
//               o.price,
//               o.opening,
//               o.closing,
//               o.createdAt,
//               AVG(b.vote) AS votesAvg,
//               COUNT(b.vote) AS totalVotes
//           FROM offices o
//           LEFT JOIN bookings b ON o.id = b.idOffice
//           WHERE o.id = ?
//           GROUP BY o.id
//          `,
//             [idOffice],
//         );

//         // Si no existe ninguna oficina con ese ID, generamos un error.
//         if (offices.length < 1) {
//             return next(generateErrorUtil('No existe esa oficina', 404));
//         }

//         // Buscamos la foto de la oficina
//         const [photos] = await pool.query(
//             `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
//             [offices[0].id],
//         );

//         // Agregamos el array de fotos a la oficina
//         offices[0].photos = photos;

//         // Obtenemos los equipamientos asociados a la oficina
//         const [equipments] = await pool.query(
//             `SELECT e.id, e.name
//              FROM officesEquipments oe
//              INNER JOIN equipments e ON e.id = oe.idEquipment
//              WHERE oe.idOffice = ?`,
//             [offices[0].id],
//         );

//         // Agregamos el array de equipamientos a la oficina
//         offices[0].equipments = equipments;

//         // Enviamos una respuesta al usuario
//         res.send({
//             status: 'ok',
//             data: {
//                 office: offices[0],
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// export default getOfficeByIdController;
