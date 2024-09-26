//  esta version era solo para ver si tenia que cambiar algo por el tema de modificadr un enum

// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite editar las propiedades de una oficina
const updateOfficeController = async (req, res, next) => {
    try {
        // obtenemos el ID de la oficina a editar
        const { IdOffice } = req.params;

        // obtenemos los datos del body
        const { name, price, description, address, workspace, capacity } =
            req.body;

        // Si no hay ningún campo a actualizar, lanzamos un error
        if (
            typeof name === 'undefined' &&
            typeof price === 'undefined' &&
            typeof description === 'undefined' &&
            typeof address === 'undefined' &&
            typeof workspace === 'undefined' &&
            typeof capacity === 'undefined'
        ) {
            throw generateErrorUtil('Faltan campos para actualizar', 400);
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Tratamos de obtener la información de la oficina que queremos editar
        const [offices] = await pool.query(
            `SELECT IdUser FROM offices WHERE id = ?`,
            [IdOffice],
        );

        // Si la oficina no existe, lanzamos un error
        if (offices.length < 1) {
            throw generateErrorUtil('Coworking space not found', 404);
        }

        // Si no somos los propietarios (admin), lanzamos un error
        if (req.user.id !== offices[0].IdUser) {
            throw generateErrorUtil('Only Admin can edit this space', 403);
        }

        // Construimos la consulta de actualización dinámicamente
        const fieldsToUpdate = [];
        const values = [];

        if (typeof name !== 'undefined') {
            fieldsToUpdate.push('name = ?');
            values.push(name);
        }

        if (typeof price !== 'undefined') {
            fieldsToUpdate.push('price = ?');
            values.push(price);
        }

        if (typeof description !== 'undefined') {
            fieldsToUpdate.push('description = ?');
            values.push(description);
        }

        if (typeof address !== 'undefined') {
            fieldsToUpdate.push('address = ?');
            values.push(address);
        }

        if (typeof workspace !== 'undefined') {
            // Verificamos si workspace es válido antes de actualizar
            if (!['OFFICE', 'DESK'].includes(workspace)) {
                throw generateErrorUtil(
                    'El valor de workspace no es válido',
                    400,
                );
            }
            fieldsToUpdate.push('workspace = ?');
            values.push(workspace);
        }

        if (typeof capacity !== 'undefined') {
            fieldsToUpdate.push('capacity = ?');
            values.push(capacity);
        }

        // Solo hacemos el UPDATE si hay campos a modificar
        if (fieldsToUpdate.length > 0) {
            values.push(IdOffice); // Agregamos el ID de la oficina al final para la cláusula WHERE
            const query = `UPDATE offices SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
            await pool.query(query, values);
        }

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Office updated',
            data: {
                office: {
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
