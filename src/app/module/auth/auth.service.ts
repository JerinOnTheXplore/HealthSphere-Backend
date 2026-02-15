
import { error } from "node:console";
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}



const registerPatient = async (payload:IRegisterPatientPayload) =>{
    const {name,email,password} = payload;
    const data = await auth.api.signUpEmail({
        body:{
            name,
            email,
            password,

            //default value set in auth.ts
            // needPasswordChange:false,
            // role:Role.PATIENT
        }
    })
    if (!data.user){
        throw new Error("Failed to register patient");
    }

    //TODO create patient profile in registration after signup of patient in user model..

    // const patient = await prisma.$transaction( async (tx) => {
    //     await tx.
    // })
    
    return data;
}

interface ILoginUserPayload{
    email:string;
    password:string;
}

const loginUser = async (payload: ILoginUserPayload) => {
    const {email,password} = payload;
    const data = await auth.api.signInEmail({
        body:{
            email,
            password,
        }
    })

    if(data.user.status === UserStatus.BLOCKED){
        throw new Error("User is blocked") ;
    }

    if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
        throw new Error("User is created")
    }

    return data;
}

export const AuthService = {
    registerPatient,
    loginUser
}