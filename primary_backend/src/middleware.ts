import { NextFunction, Request, Response } from "express";
import { AuthDB } from "./encryption";



export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const data_cookie = getDataFromCookie(req);
    let email = data_cookie.userID;
    const token = data_cookie.token;

    if (!email || !token) {
        res.status(401).send("No session found");
        return;
    }
    email = data_cookie.userID.replace("%40", "@");
    const data = await AuthDB.verifyToken(email, token)
    if (data.status) {
        next();
    }
    else
        res.status(401).send("Unauthorized, Login again !!");
}

export function getDataFromCookie( req: Request) {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return {};
    }
    const cookies = cookie.split(';');
    let cookie_json: { [key: string]: string } = {}; // Add index signature
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        cookie_json[key] = value;
    }
    return cookie_json;
}