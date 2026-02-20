import status from "http-status";
import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload:ICreateDoctorPayload )=>{
    const specialities : Speciality[] = [];
    for (const specialityId of payload.specialties){
        const speciality = await prisma.speciality.findUnique({
            where:{
                id:specialityId
            }
        })
        if (!speciality){
            // throw new Error(`Speciality with id ${specialityId} not found`);
            throw new AppError(status.NOT_FOUND,`Speciality with id ${specialityId} not found`);
        }
        specialities.push(speciality);
    }
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    if (userExists){
        // throw new Error("User with the email already exists");
        throw new AppError(status.CONFLICT,"User with the email already exists")
    }
    let userData;

try {
   userData = await auth.api.signUpEmail({
      body: {
         email: payload.doctor.email,
         password: payload.password,
         role: Role.DOCTOR,
         name: payload.doctor.name,
         needPasswordChange: true,
      }
   })
} catch (error: any) {
   throw new AppError(
      status.BAD_REQUEST,
      error?.message || "User registration failed"
   );
}
    try {
   const result = await prisma.$transaction(async(tx)=>{

      const doctorData = await tx.doctor.create({
         data:{
            userId: userData.user.id,
            ...payload.doctor,
         }
      })

      await tx.doctorSpeciality.createMany({
         data: specialities.map((speciality)=>({
            doctorId: doctorData.id,
            specialityId: speciality.id,
         }))
      })

      return tx.doctor.findUnique({
         where:{ id: doctorData.id },
         select: {
   id: true,
   userId: true,
   name: true,
   email: true,
   profilePhoto: true,
   contactNumber: true,
   address: true,
   registrationNumber: true,
   experience: true,
   gender: true,
   appointmentFee: true,
   qualification: true,
   currentWorkingPlace: true,
   designation: true,
   createdAt: true,
   updatedAt: true,
   user: {
      select: {
         id: true,
         email: true,
         name: true,
         role: true,
      }
   },
   specialities: {
      select: {
         speciality: {
            select: {
               title: true,
               id: true
            }
         }
      }
   }
}
      })
   })

   return result;

} catch (error) {

   await prisma.user.delete({
      where: { id: userData.user.id }
   })

   throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Doctor creation failed"
   );
}
}

export const UserService = {
    createDoctor,
}