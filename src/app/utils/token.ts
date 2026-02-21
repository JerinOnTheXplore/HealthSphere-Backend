import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { CookieUtils } from "./cookie";


//creating access token..
const getAccessToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    envVars.ACCESS_TOKEN_EXPIRES_IN
  );
};

const getRefreshToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    envVars.REFRESH_TOKEN_EXPIRES_IN
  );
};

const setAccessTokenCookie = (res:Response, token:string)=>{
    CookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge: 60 * 60 * 60 * 24 ,
    })
}

const setRefreshTokenCookie = (res:Response, token:string)=>{
    CookieUtils.setCookie(res, 'refreshToken', token,{
        httpOnly:true,
        secure:true,
        sameSite:true,
        path:'/',
        maxAge:60 * 60 * 24 * 7,
    });
}

const setBetterAuthSessionCookie = (res:Response, token:string)=>{
    CookieUtils.setCookie(res, 'better-auth.session_token',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path: '/',
        maxAge: 60 * 60 * 60 * 24,
    })
}

export const tokenUtils ={
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
}