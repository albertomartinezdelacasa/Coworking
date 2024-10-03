// Aqui se importan los controladores de la carpeta users
import activateUserController from './activateUserController.js';
import adminAllBookingsListController from './adminAllBookingsListController.js';
import editProfileUserController from './editProfileUserController.js';
import getProfileUserController from './getProfileUserController.js';
import getUserBookingListController from './getUserBookingListController.js';
import loginUserController from './loginUserController.js';
import newUserController from './newUserController.js';
import userAvatarController from './userAvatarController.js';
import resetUserPassController from './resetUserPassController.js';
import sendRecoverPassController from './sendRecoverPassController.js';

// Aqui se exportan los controladores
export {
    activateUserController,
    adminAllBookingsListController,
    editProfileUserController,
    newUserController,
    loginUserController,
    getProfileUserController,
    getUserBookingListController,
    userAvatarController,
    resetUserPassController,
    sendRecoverPassController,
};
