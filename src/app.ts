import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { IndexRoute } from './app/routes/index.js';
import { globalErrorHandler } from './middleware/globalErrorHandeler.js';
import { notFoundHandler } from './middleware/notFound.js';


const app:Application = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'QuickLearner API is running',
    version: '1.0.0',
    docs: '/api/v1',
  });
});

app.use("/api/v1",IndexRoute);


app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;