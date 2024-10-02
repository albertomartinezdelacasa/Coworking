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
    deleteOfficeController,
    deleteBookingController,
    getEquipmentsController,
    getOfficeEquipmentController,
    voteOfficeAfterUseController,
} from '../controllers/offices/index.js';

import authUserController from '../middlewares/authUserController.js';
import authAdminController from '../middlewares/authAdminController.js';
// Importamos las funciones controladoras intermedias.**

// Creamos un router.

const router = express.Router();

// Middleware que permite editar los detalles de un Office
router.put(
    '/office/edit/:idOffice',
    authUserController,
    authAdminController,
    updateOfficeController,
);

// Middleware que crea un una officina.
router.post(
    '/office/create',
    authUserController,
    authAdminController,
    createOfficeController,
);
// Middleware que retorna el listado de offices.
router.get('/office/list', listOfficeController);

// Middleware que retorna los equipamientos por keyword.
router.get('/office/equipamiento', getEquipmentsController);

// Middleware que retorna un office concreto por ID.
router.get('/office/:idOffice', getOfficeByIdController);

//Middleware para actualizar una oficina
router.put(
    '/office/:idOffice',
    authUserController,
    authAdminController,
    updateOfficeController,
);

// Middleware que retorna los equipamientos de una oficina.
router.get('/office/:idOffice/equipments', getOfficeEquipmentController);

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
    authAdminController,
    adminBookingsController,
);

// Middleware que elimina una officina concreto por ID.
router.delete(
    '/office/:idOffice',
    authUserController,
    authAdminController,
    deleteOfficeController,
);

//Middleware que elimina una reserva.
router.delete(
    '/office/:idBooking/booking',
    authUserController,
    deleteBookingController,
);

router.put(
    '/office/:idOffice/:idBooking',
    authUserController,
    voteOfficeAfterUseController,
);

export default router;
