import { Router } from 'express';
import { AuthController } from '../controllers/Auth/AuthController';
import { ForgotPasswordController } from '../controllers/Auth/ForgotPasswordController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/resetpassword', ForgotPasswordController.resetPassword);
router.post('/forgotpassword', ForgotPasswordController.forgotpassword);

router.patch('/sendnewpassword', ForgotPasswordController.sendNewPassword);

export default router;
