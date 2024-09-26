// // Importamos la función que retorna una conexión con la base de datos.

// import getPool from '../../db/getPool.js';

// import generateErrorUtil from '../../utils/generateErrorUtil.js';

// // funcion controladora que nos va a devolver la lista de officinas

// const getOfficeByIdController = async (req, res, next) => {
//     try {
//         // Obtenemos el id de la officina

//         const { idOffice } = req.params;

//         // obtenemos un conexion co la base de datos.

//         const pool = await getPool();

//         // obtenemos la entrada con el ID proporcionado

//         const [offices] = await pool.query(
//             `
//             SELECT
//             o.id,
//             o.name,
//             o.description,
//             o.address,
//             o.workspace,
//             o.capacity,
//             o.price,
//             o.IdUser,
//             u.username AS owner,
//             INULL(AVG(v.value), "No votes yet") AS votes,
//             e.createdAt

//             FROM offices o
//             INNER JOIN users u ON u.id = e.userId
//             LEFT JOIN officeVotes v ON v.IdOffice = o.id
//             WHERE o.id = ?
//             `,
//             [idOffice],

//             // no estoy seguro del workspace ya que es enum, y el avg vote ahora que
//             // tenems una tabla votes no se si hace hace falta el ratingAvarage
//         );

//         // Si no hay productos lanzamos un error.

//         if (offices.length < 1) {
//             generateErrorUtil('Producto no encontrado', 404);
//         }

//         // buscamos las fotos de la officina

//         const [photos] = await pool.query(
//             `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
//             [offices[0].id],
//         );

//         // Agregamos el array de fotos a la entrada.
//         offices[0].photos = photos;

//         // Enviamos una respuesta al cliente.
//         res.send({
//             status: 'ok',
//             data: {
//                 entry: offices[0],
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// export default getOfficeByIdController;
