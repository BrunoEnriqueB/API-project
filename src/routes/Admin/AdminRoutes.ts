import { Router } from "express";
import { ProductsController } from "../../controllers/Admin/ProductsController";
import { LoginController } from "../../controllers/Auth/LoginController";
import { imageupload } from "../../utils/multerConfig";
import multer from "multer";

const router = Router();

router.post('/add', imageupload.single('image'),  ProductsController.addProduct);
router.patch('/edit', imageupload.single('image'), ProductsController.editProduct);

export { router }; 
