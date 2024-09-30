// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Importamos la función que guarda una foto.
import savePhotoUtil from '../../utils/savePhotoUtil.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite registrar una oficina.
const createOfficeController = async (req, res, next) => {
    try {
        // Obtenemos los datos del body.
        const {
            name,
            price,
            description,
            address,
            workspace,
            capacity,
            equipments,
        } = req.body;

        // comprobamos que eres un admin para poder crear una officina
        // Obtenemos los datos del user.
        const { role } = req.user;

        // Verificamos que el usuario sea un admin.

        if (role !== 'ADMIN') {
            throw generateErrorUtil(
                'No tienes permisos para crear una oficina,solo admin pueden crearla',
                403,
            );
        }

        // Verificamos que el equipamiento sea un array.
        if (!Array.isArray(equipments) || equipments.length === 0) {
            throw generateErrorUtil(
                'Se requiere al menos un equipamiento.',
                400,
            );
        }

        // Obtenemos el array de fotos, limitamos a 3 fotos.
        const photosArr = Object.values(req.files).slice(0, 3);

        // Si faltan campos lanzamos un error. Como mínimo es obligatoria una foto.
        if (
            !name ||
            !price ||
            !description ||
            !address ||
            !workspace ||
            !capacity ||
            photosArr.length < 1
        ) {
            throw generateErrorUtil('Faltan campos obligatorios', 400);
        }

        // Obtenemos una conexión con la base de datos usando el pool.
        const pool = await getPool();

        // Insertamos la oficina en la tabla `offices`.
        const [newOffice] = await pool.query(
            `INSERT INTO offices (name, description, address, workspace, capacity, price) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, address, workspace, capacity, price],
        );

        // Obtenemos el ID de la nueva oficina.
        const idOffice = newOffice.idInsert;

        // Guardamos las fotos de la oficina.
        for (const photo of photosArr) {
            const photoName = await savePhotoUtil(photo, 1000); // Guardar la foto en el servidor.

            // Insertamos la foto en la tabla `officePhotos`.
            await pool.query(
                `INSERT INTO officePhotos (name, idOffice) VALUES (?, ?)`,
                [photoName, idOffice],
            );
        }

        // Guardamos los equipamientos asociados a la oficina en `officesEquipments`.
        for (const idEquipment of equipments) {
            // Validamos que el equipamiento exista en la tabla `equipments`.
            const [equipmentExists] = await pool.query(
                `SELECT id FROM equipments WHERE id = ?`,
                [idEquipment],
            );

            if (equipmentExists.length === 0) {
                throw generateErrorUtil(
                    `El equipamiento con ID ${idEquipment} no existe`,
                    404,
                );
            }

            // Insertamos la relación entre la oficina y el equipamiento en `officesEquipments`.
            await pool.query(
                `INSERT INTO officesEquipments (idOffice, idEquipment) VALUES (?, ?)`,
                [idOffice, idEquipment],
            );
        }

        // Establecemos el código 201 (elemento creado) y enviamos una respuesta al cliente.
        res.status(201).send({
            status: 'ok',
            message: 'Oficina creada con éxito',
        });
    } catch (err) {
        // En caso de error, lo pasamos al middleware de errores.
        next(err);
    }
};

export default createOfficeController;
