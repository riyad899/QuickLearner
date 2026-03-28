import express, { Application, NextFunction, Request, Response } from 'express';
import { IndexRoute } from './app/routes';
import { globalErrorHandler } from './middleware/globalErrorHandeler';
import { notFoundHandler } from './middleware/notFound';


const app:Application = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1",IndexRoute);


app.use(globalErrorHandler);
app.use(notFoundHandler);


// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app;