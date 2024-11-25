import e, {Router} from "express";
import {authMiddleware, getDataFromCookie} from "../middleware";
import { signupSchema, loginSchema} from "../types";
import { prismaClient } from "../db";
import { AuthDB } from "../encryption";
import { Response, Request } from "express";




const router = Router();

async function verify_creds_token (res : Response, req : Request, data : any, out: any){
    if (out.status){
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        res.cookie('token', out.token, {
            expires: expirationDate,
            path: '/'
        });
   
        res.cookie('userID', out.email, {
            expires: expirationDate,
            path: '/'
        });
        res.cookie('uniqueId', out.uniqueId, {
            expires: expirationDate,
            path: '/'
        });

    }    

    res.send(out);
}

router.post("/signup",async (req, res) => {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({error: parsedData.error});
    }

    const userExists = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });
    if (userExists) {
        return res.status(400).json({error: "User already exists"});
    }


// model User {
//     id       Int      @id  @default(autoincrement()) 
//     name     String
//     email    String   @unique
//     password String
//     varified Boolean  @default(false) !! to be done
//   }
    const hashedPassword = AuthDB.hash(parsedData.data.password);
    const gen_token = AuthDB.genToken();
    await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            name: parsedData.data.userName,
            password: hashedPassword,
            token: gen_token,   
            zaps:{} 
        }
    });
    res.json({status: "User created",
        userId: parsedData.data.email,
        token: gen_token
    });
})

router.post("/login", async (req, res) => {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({error: parsedData.error});
    }

    const response = await AuthDB.verifyCreds(parsedData.data.email, parsedData.data.password);
    if (!response.status) {
        const data_cookie = getDataFromCookie(req);
        let email = data_cookie.userID.replace("%40", "@");
        AuthDB.deleteToken(email);
        return res.status(400).json({error: "Invalid credentials"});
    }

    verify_creds_token(res, req, {userID: parsedData.data.email}, response);

})

router.get("/user", authMiddleware, (req, res) => {
    return res.json({
        message : "User is authenticated",
    });
})

export const userRouter = router   ;