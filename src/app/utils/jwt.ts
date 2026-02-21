import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

const decodeToken = (token: string) => {
  return jwt.decode(token) as JwtPayload;
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};