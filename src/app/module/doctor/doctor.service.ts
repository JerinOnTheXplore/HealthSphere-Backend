
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include:{
            user:true,
            specialities:{
                include:{
                    speciality:true
                }
            }
        }
    })
    return doctors;
}

const getDoctorById = async (id:string)=>{
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            specialities: {
                include:{
                    speciality:true
                }
            },
            appointments:{
                include: {
                    patient:true,
                    schedule:true,
                    prescription:true,
                }
            },
            doctorSchedules:{
                include:{
                    schedule:true,
                }
            },
            reviews:true
        }
    })
    return doctor;
}

const updateDoctor = async (id:string,payload:IUpdateDoctorPayload)=>{
    const isDoctorExist = await prisma.doctor.findUnique({
        where:{
            id,
        }
    })
    if (!isDoctorExist){
        throw new AppError(status.NOT_FOUND,"Doctor not found");
    }
    const {doctor:doctorData, specialities} = payload;
    await prisma.$transaction(async(tx)=>{
        if (doctorData){
            await tx.doctor.update({
                where:{
                    id,
                },
                data:{
                    ...doctorData
                }
            })
        }
        if (specialities && specialities.length >0){
            for(const speciality of specialities){
                const {specialityId, shouldDelete}= speciality;
                if(shouldDelete){
                    await tx.doctorSpeciality.delete({
                        where:{
                            doctorId_specialityId:{
                                doctorId:id,
                                specialityId
                            }
                        }
                    })
                } else {
                    await tx.doctorSpeciality.upsert({
                        where:{
                            doctorId_specialityId:{
                                doctorId:id,
                                specialityId,
                            }
                        },
                        create:{
                            doctorId:id,
                            specialityId
                        },
                        update: {}
                    })
                }
            }
        }
    })
    const doctor = await getDoctorById(id);
    return doctor;
}
//soft delete..
const deleteDoctor = async (id: string) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isDoctorExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: ami chaile user k block korte pari
            },
        })

        await tx.session.deleteMany({
            where: { userId: isDoctorExist.userId }
        })

        await tx.doctorSpeciality.deleteMany({
            where: { doctorId: id }
        })
    })

    return { message: "Doctor deleted successfully" };
}

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}