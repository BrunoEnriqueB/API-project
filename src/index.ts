import express from 'express';
import cors  from 'cors';
import { router } from './routes/Auth/AuthRoutes';
import './config/env';

const app = express();
const port = 5000;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

app.use('/user', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
