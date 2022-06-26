import { Router } from 'express';
import { router as AppRouter } from './AppRoutes';
import { router as AuthRouter } from './AuthRoutes';
import { router as AdminRouter } from './AdminRoutes';
import verifySuperUser from '../middlewares/verifySuperUser';

const router = Router();

router.use('/user', AppRouter);
router.use('/auth', AuthRouter);
router.use('/admin', verifySuperUser, AdminRouter);

router.use('/test', (req, res) => {
  return res.status(200).json({ message: 'Its working!' });
});

export default router;
