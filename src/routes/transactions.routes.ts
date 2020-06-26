import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import { Router } from 'express';

import csvUpload from '../configs/csvUpload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(csvUpload);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepostory = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepostory.find();
  const balance = await transactionsRepostory.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.json(204);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const csv = request.file.path;

    const importTransaction = new ImportTransactionsService();

    const transactions = await importTransaction.execute(csv);

    return response.json(transactions);
  },
);

export default transactionsRouter;
