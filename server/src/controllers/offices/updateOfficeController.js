// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite editar las propiedades de una officina

const updateOfficeController = async (req, res, next) => {
    try {
        // obtenemos el ID de la officina a editar
        const { idOffice } = req.params;

        // obtenemos los datos del body .

        const {
            name,
            price,
            description,
            address,
            workspace,
            capacity,
            equipments,
            opening,
            closing,
        } = req.body;

        // Verificamos si `equipments` ya es un array o si es una cadena JSON y la convertimos.
        const equipmentsArray = Array.isArray(equipments)
            ? equipments
            : JSON.parse(equipments);
        // Si faltan los dos campos lanzamos un error. Esto es porque si el usuario solo quiere editar
        // uno de ellos quiero permitírselo sin necesidad de que me envíe ambos valores.
        if (
            !name &&
            !price &&
            !description &&
            !address &&
            !workspace &&
            !capacity &&
            !equipmentsArray &&
            !opening &&
            !closing
        ) {
            generateErrorUtil('Faltan campos', 400);
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Tratamos de obtener la información del producto que queremos editar para ver
        // si somos los dueños.
        const [offices] = await pool.query(
            `SELECT * FROM offices WHERE id = ?`,
            [idOffice],
        );

        // Si la oficina  no existe lanzamos un error.
        if (offices.length < 1) {
            generateErrorUtil(
                'No existe esa oficina en nuestro Coworking',
                404,
            );
        }

        // Si el Admin ha enviado un nombre lo actualizamos.
        if (name) {
            await pool.query(`UPDATE offices SET name = ? WHERE id = ?`, [
                name,
                idOffice,
            ]);
        }

        // Si el Admin ha enviado un precio lo actualizamos.
        if (price) {
            await pool.query(`UPDATE offices SET price = ? WHERE id = ?`, [
                price,
                idOffice,
            ]);
        }
        // Si el Admin ha enviado un descripcion lo actualizamos.
        if (description) {
            await pool.query(
                `UPDATE offices SET description = ? WHERE id = ?`,
                [description, idOffice],
            );
        }

        // Si el Admin ha enviado una nueva direccion la actualizamos.
        if (address) {
            await pool.query(`UPDATE offices SET address = ? WHERE id = ?`, [
                address,
                idOffice,
            ]);
        }

        // Si el Admin ha enviado un nuevo work space " oficina o desk " la actualizamos.
        if (workspace) {
            await pool.query(`UPDATE offices SET workspace = ? WHERE id = ?`, [
                workspace,
                idOffice,
            ]);
        }
        // Si el Admin ha modificado la capacidad del espacio la actualizamos.
        if (capacity) {
            await pool.query(`UPDATE offices SET capacity = ? WHERE id = ?`, [
                capacity,
                idOffice,
            ]);
        }
        // Si el Admin ha modificado la apertura del espacio la actualizamos.
        if (opening) {
            await pool.query(`UPDATE offices SET opening = ? WHERE id = ?`, [
                opening,
                idOffice,
            ]);
        }
        // Si el Admin ha modificado la capacidad del espacio la actualizamos.
        if (closing) {
            await pool.query(`UPDATE offices SET closing = ? WHERE id = ?`, [
                closing,
                idOffice,
            ]);
        }

        // Manejamos los equipamientos
        if (equipmentsArray) {
            // Primero, eliminamos todas las relaciones existentes
            await pool.query(
                `DELETE FROM officesEquipments WHERE idOffice = ?`,
                [idOffice],
            );

            // Luego, insertamos las nuevas relaciones
            for (const idEquipment of equipmentsArray) {
                await pool.query(
                    `INSERT INTO officesEquipments (idOffice, idEquipment) VALUES (?, ?)`,
                    [idOffice, idEquipment],
                );
            }
        }

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Oficina actualizada',
            data: {
                office: {
                    name,
                    price,
                    description,
                    address,
                    workspace,
                    capacity,
                    opening,
                    closing,
                    equipments: equipmentsArray,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

export default updateOfficeController;
