import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generatToken = (
  payload: { id: string; email: string; role: string },
  secret: Secret,
  exprireIn: string | any
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: exprireIn,
  });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  generatToken,
  verifyToken,
};
