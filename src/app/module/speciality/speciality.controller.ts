import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async (req:Request, res:Response)=>{
    const payload = req.body;
    const result = await SpecialityService.createSpeciality(payload);
    res.status(201).json({
        success: true,
        message: 'Speciality created successfully',
        data:result
    })
}

export const SpecialityController = {
    createSpeciality
}