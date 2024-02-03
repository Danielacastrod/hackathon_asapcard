import express from 'express';

const router = express.Router();

router.get('/', (req: any, res: any): void => {
  res.send('Hello, world!');
});

export { router };