import express from 'express';
import cors  from 'cors';
import { router as AuthRouter } from './routes/Auth/AuthRoutes';
import { router as AdminRouter } from './routes/Admin/AdminRoutes';

import './config/env';
import verifySuperUser from './middlewares/verifySuperUser';

const app = express();
const port = 5000;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

//user
app.use('/user', AuthRouter);

//admin
app.use('/admin', verifySuperUser, AdminRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
