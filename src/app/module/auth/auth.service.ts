

import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload, ILoginUserPayload, IRegisterPatientPayload } from "./auth.interface";



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
        // throw new Error("Failed to register patient");
        throw new AppError(status.BAD_REQUEST,"Failed to register patient");
    }

    //TODO create patient profile in registration after signup of patient in user model..

    try{
        const patient = await prisma.$transaction( async (tx) => {
       const patientTx = await tx.patient.create({
            data:{
                userId: data.user.id,
                name: payload.name,
                email: payload.email,
            }
        })
        return patientTx;
    })

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    
    return {
        ...data,
        accessToken,
        refreshToken,
        patient,
    }
    } catch (error) {
        console.log("Transaction error : ", error);
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw error;
    }
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
        // throw new Error("User is blocked") ;
        throw new AppError(status.FORBIDDEN, "User is blocked");
    }

    if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
        // throw new Error("User is created")
        throw new AppError(status.NOT_FOUND,"User is deleted");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken,
    }
}

const getMe = async (user : IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where : {
            id : user.userId,
        },
        include : {
            patient : {
                include : {
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                    medicalReports : true,
                    patientHealthData : true,
                }
            },
            doctor : {
                include : {
                    specialities : true,
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                }
            },
            admin : true,
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExists;
}

//refresh token flow..
//ei function er kaj old refresh token diye new acess token,refresh token banano,session validity update kora..
//refreshToken JWT verify korte..
//sessionToken Database session validate korte,..shudhu jwt thaklei safe na..database session thakao joruri..eta dual layer security..
const getNewToken = async (refreshToken:string,sessionToken:string)=>{
    const isSessionTokenExists = await prisma.session.findUnique({
        where:{
            token:sessionToken,
        },
        include:{
            user: true,//session er sathe user data o niye ashe
        }
    })
    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED,"Invalid session token");//jodi session db te na thake tahole user logout korse,admin manually revoke korse,token tampered..401 dey
    }
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)//jwt verify na korle j kew fake token banabe..verfify kore check kore j //Secret match korche?
    //Expired?
    //Corrupted??
    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED,"Invalid Refesh token")
    }
    const data = verifiedRefreshToken.data as JwtPayload;
    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    })

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const {token} = await prisma.session.update({
        where:{
            token:sessionToken
        },
        data: {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })
    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }
}

const changePassword = async (payload: IChangePasswordPayload,sessionToken:string )=>{
    console.log("Session token type:", typeof sessionToken);
    console.log("Session token length:", sessionToken?.length);
    console.log("Session token first 10 chars:", sessionToken?.substring(0, 10));
    const session = await auth.api.getSession({
        headers: new Headers({
            'Authorization': `Bearer ${sessionToken}`
        })
    })//session token diye session validate korlam.
      console.log("Session with Cookie token:", session);

console.log("Session token sent:", sessionToken);
console.log("Session response:", session);
    if (!session){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }//session invalid hole UNAUTHORIZED throw korbe..

    const {currentPassword,newPassword} = payload;//pass change req..

    const result = await auth.api.changePassword({
        body:{
            currentPassword,
            newPassword,
            revokeOtherSessions:true,//onno sob session invalidate hobe
        },
        headers:new Headers({
             'Authorization': `Bearer ${sessionToken}`
        })
    })

    if (session.user.needPasswordChange){
        await prisma.user.update({
            where:{
                id:session.user.id,
            },
            data:{
                needPasswordChange:false,
            }
        })
    }//user er db te needPasswordChange true thakle seta false set korsi..
    const accessToken = tokenUtils.getAccessToken({
        userId:session.user.id,
        role:session.user.role,
        name:session.user.name,
        email:session.user.email,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId:session.user.id,
        role:session.user.role,
        name:session.user.name,
        email:session.user.email,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified,
    });//pass change korar por new access token and refresh token generate hobe..
    return {
        ...result,
        accessToken,
        refreshToken,
    }
}//Change password result + new accessToken & refreshToken return kore

const logoutUser = async (sessionToken : string) => {
    const result = await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })
    //await auth.api.signOut eta better auth er built in method
//j session diye user logged in chilo seta invalidate or delete kore dicche..
    return result;
}
//puro function er kaj holo user j otp diyeche seta verify kora..then db te emailVerified true kore dewa...
//frontend theke 2 ta jinish ashbe ..user email r user er dewa otp
const verifyEmail = async (email : string, otp : string) => {

    const result = await auth.api.verifyEmailOTP({
        body:{
            email,
            otp,
        }
    })//ekhane better auth k bolchi ei email er jonno dewa otp verify koro..
    //ekhane inernally ja hoy---
    /**
     * db theke otp khuje..
     * expiry check kore
     * match kore..
     * valid hole success ashbe..
     */
//jodi opt valid but user.emailVerified ekhono false hoy then db update hoy...
    if(result.status && !result.user.emailVerified){
        await prisma.user.update({
            where : {
                email,
            },
            data : {
                emailVerified: true,
            }
        })
    }
}

const forgetPassword = async (email : string) => {
    const isUserExist = await prisma.user.findUnique({//prisma diye db te user khujchche..email unique field dhore..
        where : {
            email,
        }
    })
    //user na thakle
    if(!isUserExist){
        throw new AppError(status.NOT_FOUND, "User not found");
    }//db te ei email nai.404 error dibe...
//security wise onek system ekhane generic message dey
// jate attacker bujhte na pare email exist kore kina..
    if(!isUserExist.emailVerified){
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }//user regi korleo email verify na korle pass reset korte parbena..

    if(isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND, "User not found"); 
    }//ekhane soft delete ar status enum check hoy
    //mane deleted user pass reset korte parbena..
//otp request..
    await auth.api.requestPasswordResetEmailOTP({
        body:{
            email,
        }
    })
    //ekhane better auth--
    /**
     * otp generate kore,
     * otp store kore db te..
     * expiry time set kore,
     * email pathabe amar email config diye..
     */
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
}