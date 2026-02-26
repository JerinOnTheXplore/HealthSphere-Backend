import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

const registerPatient = catchAsync (
    async (req: Request, res: Response)=>{
        const payload = req.body;

        const result = await AuthService.registerPatient(payload);

        const {accessToken,refreshToken,token, ...rest} = result
        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            }
        })
    }
)

const loginUser = catchAsync(
    async (req:Request,res:Response)=>{
        const payload = req.body;
        const result = await AuthService.loginUser(payload);
        const {accessToken,refreshToken,token, ...rest} = result
        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);
        sendResponse(res,{
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,

            }
        })
    }
)

const getMe = catchAsync(
    async (req:Request,res:Response)=>{
        const user = req.user;
        console.log(user);
        const result = await AuthService.getMe(user);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User profile fetched successfully",
            data: result,
        })
    }
)
//express e async function e eerror hole normally crash korte pare..tai catchAsync e internally try/catch kori jeta next(errror) e pathay..eki sathe global error handler hanlde kore
const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];//cookies theke token nisi..bracket notation? karon key er modhdhe - ache jeta dot notation e kaj korbena..
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
        }//cokiee te jodi refresh token ta na thake tahole user logged out hobe,malicious req pabe ..401 dibe
        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);//controller nije token generate korena..just req handle kore..business logic mainly service laye e..

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;//result k destructure kortesi.
//ekhane special jinish ta holo refreshToken: newRefreshToken.. mane result.refreshToken k rename kore newRefreshToken kora hoise..
//why?? .. as agei ekta refreshToken variable ache jeta cookie theke newa..renamed in order to avoid conflict..
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);//abar cookie set keno korlam?? ... karon old token expired and new token browser e store korte hobe..ar egulo  normally HttpOnly,Secure,SameSite,Expiry time soho set hoy..

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
)

export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
}