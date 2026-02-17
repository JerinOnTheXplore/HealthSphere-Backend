import { Router } from "express";
import { DoctorController } from "./doctor.contoller";

const router = Router();

router.get("/",DoctorController.getAllDoctors);

export const DoctorRoutes = router;
