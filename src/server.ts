import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './database';
import { router } from './routes';


dotenv.config();

const app: any = express();

app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT;
const HOST = '0.0.0.0';



app.listen(port, (): void => {
  sequelize.authenticate().then(() => {
    console.log('DB connection successfull.');
  });
  console.log(`Server started successfuly at port ${port}.`);
}, HOST);
