import { Router } from 'express';
import AppRouter from './AppRoutes';
import AuthRouter from './AuthRoutes';
import AdminRouter from './AdminRoutes';
import ProductRouter from './ProductRoutes';
import isTokenValid from '../middlewares/isTokenValid';
import verifySuperUser from '../middlewares/verifySuperUser';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/product', ProductRouter);
router.use('/user', isTokenValid, AppRouter);
router.use('/admin', isTokenValid, verifySuperUser, AdminRouter);

router.use('/test', (req, res) => {
  return res.status(200).json({ message: 'Its working!' });
});

export default router;
