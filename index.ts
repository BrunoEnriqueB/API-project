import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes';
import './src/config/env';

const app = express();
const port = process.env.API_PORT || 5000;

app.use(cors({ credentials: true, origin: `http://localhost:${port}` }));
app.use(express.json());
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
