import { Router } from 'express';
import { imageupload } from '../utils/multerConfig';
import { ProductsController } from '../controllers/Products/ProductsController';
import verifySuperUser from '../middlewares/verifySuperUser';

const router = Router();

router.post(
  '/add',
  verifySuperUser,
  ProductsController.addProduct,
  imageupload.single('image')
);
router.patch(
  '/edit',
  verifySuperUser,
  imageupload.single('image'),
  ProductsController.editProduct
);

export default router;
