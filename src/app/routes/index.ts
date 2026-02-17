import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialities", SpecialityRoutes);
router.use("/users",UserRoutes);
router.use("/doctors",DoctorRoutes);

export const IndexRoutes = router;