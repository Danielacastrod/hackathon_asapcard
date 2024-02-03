import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';

dotenv.config();

const app: any = express();

app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT;



app.listen(port, (): void => {
  console.log(`Server started successfuly at port ${port}.`);
});
