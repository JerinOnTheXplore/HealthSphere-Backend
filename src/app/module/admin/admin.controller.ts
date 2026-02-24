// import { Request, Response } from "express";
// import { catchAsync } from "../../shared/catchAsync";//eta khub important karon express default async error dhorte parena..app.get("/", async (req,res)=>{
// //    throw new Error("Oops")
// // }) eta crash korte pare..catch async er madhdhome shob async error automatically global error handler e jabe..try/catch likhte hochchena..
// import { AdminService } from "./admin.service";//controller nije db access korena..service layer k call kore..as layer seperate korsi..
// import { sendResponse } from "../../shared/sendResponse";//eta centralized rsponse format jate kore consistency maintain hoy..
// import status from "http-status";//hardcoded 200,404 na likhe readable constant use korsi..
// //route hit korle ei function run hoy ar catchAsync e error wrap kore
// const getAllAdmins = catchAsync(
//     async (req:Request,res:Response)=>{
//         const result = await AdminService.getAllAdmins();//controller service layer k bolche amake data dao..

import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmins = catchAsync(
    async (req:Request,res:Response)=>{
        const result = await AdminService.getAllAdmins();

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message: "Admins fetched successfully",
            data:result,
        })
    }
)

const getAdminById = catchAsync(
    async (req:Request,res:Response)=>{
        const {id} = req.params;//req.params object theke destructure korlam  id property ta k..

        const admin = await AdminService.getAdminById(id as string);

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Admins fetched successfully",
            data:admin,
        })
    }
)

const updateAdmin = catchAsync (
    async(req:Request,res:Response)=>{
        const {id} = req.params;//ei id holo url parameter..url diye bole dei kon admin k update korbo..
        const payload = req.body;//body te new data ache..eta diye boli j ei data diye update koro..id=kake update korbo..body=ki diye update korbo..

        const updateAdmin =await AdminService.updateAdmin(id as string , payload);

        sendResponse (res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Admins updated successfully",
            data:updateAdmin,
        })
    }
)

const deleteAdmin = catchAsync (
    async (req:Request,res:Response)=>{
        const {id} = req.params;
        const user = req.user;
        
        const result = await AdminService.deleteAdmin(id as string,user);

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Admin deleted successfully",
            data:result,
        })
    }
)

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}

 