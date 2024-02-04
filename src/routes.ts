import express from 'express';
import consumeMessages from './consume';
import publishMessages from './publish';

const router = express.Router();

router.get('/', async (req: any, res: any): Promise<void> => {
  try {
    // await publishMessages();
    await consumeMessages();
    res.json('Retorno de teste');
  } catch (error) {
    console.error('Erro na rota:', error);
    res.status(500).json({ error: 'Erro na rota' });
  }
});

export { router };
