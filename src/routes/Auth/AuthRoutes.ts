import { Router } from "express";
import { LoginController } from "../../controllers/Auth/LoginController";
import { RegisterController } from "../../controllers/Auth/RegisterController";

const router = Router();

router.post('/login', LoginController.login);
router.post('/register', RegisterController.register);

export { router };