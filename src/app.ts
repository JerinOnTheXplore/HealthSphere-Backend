import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialityRoutes } from "./app/module/speciality/speciality.route";
import { IndexRoutes } from "./app/routes";

const app : Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

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

export default app;