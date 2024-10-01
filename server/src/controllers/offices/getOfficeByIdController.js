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
              o.capacity,
              o.price,
              o.ratingAverage,
              o.totalRatings,
              o.createdAt,
              e.name AS equipment
         FROM officesEquipments oe
            INNER JOIN offices o ON oe.id = o.id
            INNER JOIN equipments e ON oe.id = e.id
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
            `SELECT id, name FROM officePhotos WHERE idOffce = ?`,
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
