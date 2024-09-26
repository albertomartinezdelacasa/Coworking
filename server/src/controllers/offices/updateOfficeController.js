// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite editar las propiedades de una officina

const updateOfficeController = async (req, res, next) => {
    try {
        // obtenemos el ID de la officina a editar
        const { IdOffice } = req.params;

        // obtenemos los datos del body .

        const { name, price, description, address, workspace, capacity } =
            req.body;

        // Si faltan los dos campos lanzamos un error. Esto es porque si el usuario solo quiere editar
        // uno de ellos quiero permitírselo sin necesidad de que me envíe ambos valores.
        if (
            !name &&
            !price &&
            !description &&
            !address &&
            !workspace &&
            !capacity
        ) {
            generateErrorUtil('Faltan campos', 400);
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Tratamos de obtener la información del producto que queremos editar para ver
        // si somos los dueños.
        const [offices] = await pool.query(
            `SELECT IdUser FROM offices WHERE id = ?`,
            [IdOffice],
        );

        // Si la officina  no existe lanzamos un error.
        if (offices.length < 1) {
            generateErrorUtil('Coworking space not found', 404);
        }

        // Si no somos los propietarios lanzamos un error.
        if (req.user.id !== offices[0].IdUser) {
            generateErrorUtil('Only Admin can edit this space', 403);
        }

        // Si el Admin ha enviado un nombre lo actualizamos.
        if (name) {
            await pool.query(`UPDATE offices SET name = ? WHERE id = ?`, [
                name,
                IdOffice,
            ]);
        }

        // Si el Admin ha enviado un precio lo actualizamos.
        if (price) {
            await pool.query(`UPDATE offices SET price = ? WHERE id = ?`, [
                price,
                IdOffice,
            ]);
        }
        // Si el Admin ha enviado un descripcion lo actualizamos.
        if (description) {
            await pool.query(
                `UPDATE offices SET description = ? WHERE id = ?`,
                [description, IdOffice],
            );
        }

        // Si el Admin ha enviado una nueva direccion la actualizamos.
        if (address) {
            await pool.query(`UPDATE offices SET address = ? WHERE id = ?`, [
                address,
                IdOffice,
            ]);
        }

        // Si el Admin ha enviado un nuevo work space " officina o desk " la actualizamos.
        if (workspace) {
            await pool.query(`UPDATE offices SET workspace = ? WHERE id = ?`, [
                workspace,
                IdOffice,
            ]);
        }
        // Si el Admin ha modifiado la capacidad del escpacio la actualizamos.
        if (capacity) {
            await pool.query(`UPDATE offices SET capacity = ? WHERE id = ?`, [
                capacity,
                IdOffice,
            ]);
        }

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Office updated',
            data: {
                product: {
                    name,
                    price,
                    description,
                    address,
                    workspace,
                    capacity,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

export default updateOfficeController;
