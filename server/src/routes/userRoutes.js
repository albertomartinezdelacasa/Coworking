import express from 'express';

// Importamos las funciones controladores finales
import {
    newUserController, //Alberto
    activateUserController, //Mauro
    loginUserController, //Alberto
    getProfileUserController, //Alberto
    userAvatarController, //Joseba
    getUserBookingListController, //Joseba
} from '../controllers/users/index.js';

// importamos las funciones controladoras intermedias
import authUserController from '../middlewares/authUserController.js'; //Mauro

// Aqui se importan los controladores.

const router = express.Router();

// Aqui van los endpoints.

//Controlador que permite registrar un usuario.
router.post('/users/register', newUserController);

// Controlador que permite activar un usuario. Inicialmente un PUT, pero sugerido que se cambiara a PATCH
router.patch('/users/activate/:registrationCode', activateUserController);

// Controlador que permite loguear un usuario.
router.post('/users/login', loginUserController);

// Controlador de gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)
router.get('/users/profile', authUserController, getProfileUserController);

// Controlador que actualiza el avatar de un usuario. Inicialmente un put, pero sugerido que sea un PATCH
router.patch('/users/avatar', authUserController, userAvatarController);

// Controlador que retorna la lista de reservas
router.get(
    '/users/bookingsList',
    authUserController,
    getUserBookingListController,
);

// controlador que retorna al ADMIN la lista de TODAS las reservas (bookings)

router.get(
    '/users/bookingsList',
    authUserController,
    // authAdminController,
    getUserBookingListController,
);

export default router;
