import {  Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";

const createSpeciality = catchAsync(
    async (req:Request, res:Response)=>{
        const payload = req.body;
        const result = await SpecialityService.createSpeciality(payload);
        res.status(201).json({
            success: true,
            message: 'Speciality created successfully',
            data: result
        });
    }
)

const getAllSpecialities = catchAsync(
    async (req: Request, res: Response)=>{
        const result = await SpecialityService.getAllSpecialities();
        res.status(200).json({
            success: true,
            message: 'Speciality fetched successfully',
            data:result
        })
    }
)

const updateSpeciality = catchAsync(
    async (req: Request, res: Response)=>{
        const {id} = req.params;
        const payload = req.body;
        const result = await SpecialityService.updateSpeciality(
        id as string ,
        payload
        );
        res.status(201).json({
            success: true,
            message: 'Speciality created successfully',
            data: result
        });
    }
)

const deleteSpecialities = catchAsync(
    async (req: Request, res:Response)=>{
        const {id} = req.params;
        const result = await SpecialityService.deleteSpecialities(id as string);
        res.status(201).json({
            success: true,
            message: 'Speciality deleted successfully',
            data: result
        });

    }
)

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpecialities,
}