
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

    return data;
}

export const AuthService = {
    registerPatient,
    loginUser
}