import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";

const router = Router();

router.use("/specialities", SpecialityRoutes);

export const IndexRoutes = router;