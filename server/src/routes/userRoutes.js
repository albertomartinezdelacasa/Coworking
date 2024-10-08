import express from 'express';

// Importamos las funciones controladores finales
import {
    newUserController,
    activateUserController,
    loginUserController,
    getProfileUserController,
    userAvatarController,
    getUserBookingListController,
    editProfileUserController,
    sendRecoverPassController,
    resetUserPassController,
    getBookingByIdController,
} from '../controllers/users/index.js';

// importamos las funciones controladoras intermedias
import authUserController from '../middlewares/authUserController.js'; //Mauro
import authAdminController from '../middlewares/authAdminController.js'; // Claudio

// Aqui se importan los controladores.

const router = express.Router();

// Aqui van los endpoints.

//Controlador que permite registrar un usuario.
router.post('/users/register', newUserController);

// Controlador que permite activar un usuario. Inicialmente un PUT, pero sugerido que se cambiara a PATCH
router.patch('/users/activate/:registrationCode', activateUserController);

// Controlador que permite loguear un usuario.
router.post('/users/login', loginUserController);

// Controlador que retorna el perfil de un usuario
router.get('/users/profile', authUserController, getProfileUserController);

//Controlador que permite actualizar el perfil de un usuario
router.patch(
    '/users/editProfile',
    authUserController,
    editProfileUserController,
);

// Controlador que actualiza el avatar de un usuario. Inicialmente un put, pero sugerido que sea un PATCH
router.patch('/users/avatar', authUserController, userAvatarController);

// Controlador que retorna la lista de reservas del usuario
router.get(
    '/users/bookings/:idBooking',
    authUserController,
    getBookingByIdController,
);

// Controlador que retorna la lista de reservas del usuario
router.get(
    '/users/bookingsList',
    authUserController,
    getUserBookingListController,
);

// controlador que retorna al ADMIN la lista de TODAS las reservas (bookings)

router.get(
    '/users/bookingsList',
    authUserController,
    authAdminController,
    getUserBookingListController,
);

// Middleware que permite enviar un correo de recuperación de contraseña.
router.put('/users/password/recover', sendRecoverPassController);

// Middleware que permite resetear la contraseña con un código.
router.put('/users/password/reset/:recoverPassCode', resetUserPassController);

export default router;
