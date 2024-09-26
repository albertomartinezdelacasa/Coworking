// Importamos las dependencias.
import express from 'express';

// Importamos las funciones controladoras finales.**
import {
    createOfficeController, //Alex
    updateOfficeController, //Alex
    listOfficeController, //Alex
    getOfficeByIdController, //Claudio
    bookOfficeByIdController, //Claudio
    adminBookingsController, //Claudio
    deleteOfficeController, //Mauro
} from '../controllers/offices/index.js';

import authUserController from '../middlewares/authUserController.js';
// Importamos las funciones controladoras intermedias.**

// Creamos un router.

const router = express.Router();

// Middleware que permite crear un office ( office o desk )
router.post('/office/create', authUserController, createOfficeController);

// Middleware que permite editar los detalles de un Office
router.put(
    '/office/edit/:idOffice',
    authUserController,
    updateOfficeController,
);

// Middleware que retorna el listado de offices.
router.get('/office/list', listOfficeController);

// Middleware que retorna un office concreto por ID.
router.get('/office/:idOffice', getOfficeByIdController);

// Middleware que permite reservar una officina por ID.
router.post(
    '/office/:idOffice/booking',
    authUserController,
    bookOfficeByIdController,
);

// Middleware que permite al admin administrar las reservas.
router.put(
    '/office/:idOffice/booking/:idBooking',
    authUserController,
    adminBookingsController,
);

// Middleware que elimina un producto concreto por ID.
router.delete('/office/:idOffice', authUserController, deleteOfficeController);

export default router;
