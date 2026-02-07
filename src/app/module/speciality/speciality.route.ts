import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router = Router();

router.post('/', SpecialityController.createSpeciality);
router.get('/', SpecialityController.createSpeciality);

export const SpecialityRoutes = router;