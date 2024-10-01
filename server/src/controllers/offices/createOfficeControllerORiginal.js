// // Importamos la función que retorna una conexión con la base de datos.
// import getPool from '../../db/getPool.js';

// // Importamos la función que guarda una foto.
// import savePhotoUtil from '../../utils/savePhotoUtil.js';

// // Función que genera un error.
// import generateErrorUtil from '../../utils/generateErrorUtil.js';

// // Importamos el middleware de autenticación de admin
// import authAdminController from '../../middlewares/authAdminController.js';

// // Función controladora que permite registrar una oficina.
// const createOfficeController = async (req, res, next) => {
//     try {
//         // Obtenemos los datos del body.
//         const {
//             name,
//             price,
//             description,
//             address,
//             workspace,
//             capacity,
//             // equipments = [],
//         } = req.body;

//         // // insertamos al array equipments
//         // req.body.equipments = equipment1;

//         // equipments = [equipment1, equipment2, equipment3, equipment4];

//         // // Agregamos un console.log para ver qué datos están llegando en req.body.

//         // console.log('Datos recibidos en req.body:', req.body);
//         // console.log('Equipments recibidos:', equipments);

//         // // Verificamos que el equipamiento sea un array.
//         // if (!Array.isArray(equipments) || equipments.length === 0) {
//         //     throw generateErrorUtil(
//         //         'Se requiere al menos un equipamiento.',
//         //         400,
//         //     );
//         // }

//         // Obtenemos el array de fotos, limitamos a 10 fotos.
//         const photosArr = Object.values(req.files).slice(0, 10);

//         // Si faltan campos lanzamos un error. Como mínimo es obligatoria una foto.
//         if (
//             !name ||
//             !price ||
//             !description ||
//             !address ||
//             !workspace ||
//             !capacity ||
//             // !equipments ||
//             photosArr.length < 1
//         ) {
//             console.log(name, price, description, address, workspace, capacity);
//             throw generateErrorUtil('Faltan campos obligatorios', 400);
//         }

//         // Obtenemos el ID del usuario del token.
//         const idUser = req.user.id;
//         console.log(idUser);

//         // Obtenemos una conexión con la base de datos usando el pool.
//         const pool = await getPool();

//         // Obtenemos al usuario con el ID recibido.
//         const [users] = await pool.query(`SELECT id FROM users WHERE id = ?`, [
//             idUser,
//         ]);

//         // Si no existe el usuario lanzamos un error.
//         if (users.length < 1) {
//             generateErrorUtil('Usuario no encontrado', 404);
//         }

//         // Insertamos la oficina en la tabla `offices`.
//         const [newOffice] = await pool.query(
//             `INSERT INTO offices (name, description, address, workspace, capacity, price)
//              VALUES (?, ?, ?, ?, ?, ?)`,
//             [
//                 name,
//                 description,
//                 address,
//                 workspace,
//                 capacity,
//                 price,
//                 // equipments,
//             ],
//         );

//         // Obtenemos el ID de la nueva oficina.
//         const idOffice = newOffice.insertId;

//         // Guardamos las fotos de la oficina.
//         for (const photo of photosArr) {
//             const photoName = await savePhotoUtil(photo, 500); // Guardar la foto en el servidor.

//             // Insertamos la foto en la tabla `officePhotos`.
//             await pool.query(
//                 `INSERT INTO officePhotos (name, idOffice) VALUES (?, ?)`,
//                 [photoName, idOffice],
//             );
//         }

//         // Guardamos los equipamientos asociados a la oficina en `officesEquipments`.

//         // for (const idEquipment of equipments) {
//         //     // Validamos que el equipamiento exista en la tabla `equipments`.

//         //     const [equipmentExists] = await pool.query(
//         //         `SELECT id FROM equipments WHERE id = ?`,
//         //         [idEquipment],
//         //     );

//         //     if (equipmentExists.length === 0) {
//         //         throw generateErrorUtil(
//         //             `El equipamiento con ID ${idEquipment} no existe`,
//         //             404,
//         //         );
//         //     }

//         //     // Insertamos la relación entre la oficina y el equipamiento en `officesEquipments`.
//         //     await pool.query(
//         //         `INSERT INTO officesEquipments (idOffice, idEquipment) VALUES (?, ?)`,
//         //         [idOffice, idEquipment],
//         //     );
//         // }

//         // Establecemos el código 201 oficina creada) y enviamos una respuesta al cliente.
//         res.status(201).send({
//             status: 'ok',
//             message: 'Oficina creada con éxito',
//         });
//     } catch (err) {
//         // En caso de error, lo pasamos al middleware de errores.
//         next(err);
//     }
// };

// export default [authAdminController, createOfficeController];
