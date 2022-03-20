import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import cookie from "cookie";
import { User } from "../types/DbModels";

export function signToken(data: any, expiresIn: number = 60 * 60) {
  const token = jwt.sign(data, process.env.JWT_KEY!, { expiresIn });
  return token;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY!);
  } catch (err) {
    return undefined;
  }
}

export function signAndAddTokenToCookies(
  res: NextApiResponse,
  user: User,
  expiresIn: number = 60 * 60
) {
  const tokenData = {
    email: user.email,
    name: user.name,
    id: user._id?.toString(),
  };
  const token = signToken(tokenData, expiresIn);

  // Set cookies
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("accessToken", token, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: expiresIn,
    })
  );

    console.log("signAndAddTokenToCookies");

}

export function removeTokenCookie(res: NextApiResponse) {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("accessToken", '', {
          httpOnly: true,
          path: '/',
          secure: true,
          sameSite: 'strict',
          maxAge: -1000000,
        })
      );
}