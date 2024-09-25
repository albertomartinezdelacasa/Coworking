import express from 'express';

// Importamos las funciones controladores finales
import {
    newUserController,
    activateUserController,
    loginUserController,
    getProfileUserController,
    userAvatarController,
    getUserBookingsListController,
} from '../controllers/users/index.js';

// importamos las funciones controladoras intermedias
import authUserController from '../middlewares/authUserController.js';

// Aqui se importan los controladores.

const router = express.Router();

// Aqui van los endpoints.

// Middleware que permite registrar un usuario.
router.post('/users/register', newUserController);

// Middleware que permite activar un usuario.
router.put('/users/activate/:registrationCode', activateUserController);

// Middleware que permite loguear un usuario.
router.post('/users/login', loginUserController);

// Middleware Gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)
router.get('/users/profile', authUserController, getProfileUserController);

// Middleware que actualiza el avatar de un usuario.
router.put('/users/avatar', authUserController, userAvatarController);

// Middleware que retorna la lista de reservas

router.get(
    '/users/bookingsList',
    authUserController,
    getUserBookingsListController,
);

export default router;
