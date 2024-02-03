import express from 'express';
import cors from 'cors';
import { sequelize } from './database';
import { router } from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

const PORT = 3000;

app.listen(PORT, () => {
  sequelize.authenticate().then(() => {
    console.log('DB connection successfull.');
  });

  console.log(`Server started successfuly at port ${PORT}.`);
});
