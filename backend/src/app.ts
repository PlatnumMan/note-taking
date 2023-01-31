import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import notesRoutes from './routes/notes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/notes', notesRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, `Can't find ${req.url} on this server!`));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'Internal Server Error';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
