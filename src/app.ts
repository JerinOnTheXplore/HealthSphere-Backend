import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app : Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {
  const speciality = await prisma.speciality.upsert({
  where: { title: 'Cardiology' },
  update: {},
  create: { title: 'Cardiology' },
});
  res.status(201).json({
      success: true,
      messsage: 'API is working',
      data: speciality
  })
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;