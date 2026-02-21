/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/', checkAuth(Role.ADMIN,Role.SUPER_ADMIN),SpecialityController.createSpeciality);
router.get('/',SpecialityController.getAllSpecialities);
router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialityController.deleteSpecialities);
router.patch('/:id', SpecialityController.updateSpeciality);

export const SpecialityRoutes = router;