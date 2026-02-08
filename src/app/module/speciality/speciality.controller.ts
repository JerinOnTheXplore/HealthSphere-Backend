import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import { error } from "node:console";

const createSpeciality = async (req:Request, res:Response)=>{
    try{
       const payload = req.body;
    const result = await SpecialityService.createSpeciality(payload);
    res.status(201).json({
        success: true,
        message: 'Speciality created successfully',
        data:result
    })
    } catch (error:any){
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Failed to create speciality',
        error: error.message
      })
    }
}

const getAllSpecialities = async (req:Request,res:Response)=>{
     try{
       const specialities = await SpecialityService.getAllSpecialities();
       res.status(200).json({
        success: true,
        message: 'Speciality get successfully',
        data: specialities
       })
     } catch (error:any) {
        console.log(error);
        res.status(500).json({
        success: false,
        message: 'Failed to create speciality',
        error: error.message
      })
     }
}

const updateSpeciality = async (req:Request, res: Response)=>{
    try{
      const {id} = req.params;
      const payload = req.body;
      const result = await SpecialityService.updateSpeciality(
        id as string ,
        payload
      );

      return res.status(200).json({
        success : true,
        message: 'Speciality updated successfully',
        data: result,
      })
    } catch (error:any){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Failed to update speciality',
            error:error.message
        })
    }
}

const deleteSpecialities = async (req:Request, res:Response)=>{
    try{
       const {id} = req.params;
       const result = await SpecialityService.deleteSpecialities(id as string);

       res.status(200).json({
        success: true,
        message: 'Speciality deleted successfully',
        data: result
       })
    } catch (error:any) {
       console.log(error);
       res.status(500).json({
        success: false,
        message: 'Failed to delete specialities',
        error: error.message
       })
    }
}

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpecialities,
}