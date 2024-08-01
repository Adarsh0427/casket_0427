import { prismaClient } from '../db';

const secret = "zapier first program";
const salt = "this needs to be a long string";
const tokenLength = 128;

import crypto from 'crypto';

export class AuthDB{


    static async verifyToken(userID: string, token: string){
        const res = {
            status: false,
            error : ""
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email : userID
            }
        });
        if (user && (user.token == this.hash(token))){
        
            res.status = true;
        }
        else 
            res.status = false;
        return res;
    }

    static async verifyCreds(userID : string, pass : string){
        const res = {
            status: false,
            token: "",
            userName: "",
            email : "",
            error : "",
            uniqueId: ""    
        }
        const user = await prismaClient.user.findFirst({
            where:
            { 
                email : userID
            }
        });

        if (user){
            if (user.password === AuthDB.hash(pass)){
                res.status = true;
                res.token = AuthDB.genToken();
                res.userName = user.name;
                res.email = user.email;
                res.uniqueId = user.id.toString();
                await prismaClient.user.update({
                    where: {
                        email: userID
                    },
                    data: {
                        token: AuthDB.hash(res.token)
                    }
                });
                // console.log(res.token);
            }
        }
        if (!res.status) res.error = "Invalid credentials";
        return res;
    }
    
    static createPasswordHash(pass : string){
        return AuthDB.hash(pass);
    }

    static async deleteToken(userID : string){
        const user = await prismaClient.user.findFirst({
            where: {
                email: userID
            }
        });
        if (!user)
            return;
        
        await prismaClient.user.update({
            where: {
                email: userID
            },
            data: {
                token: ""
            }
        });
    }

    static genToken(){
        let token = "";
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0 ; i < tokenLength ; i++)
            token += charSet.charAt(Math.floor(Math.random() * charSet.length));
        return token;
    }

    static hash(input: string){
        return crypto.pbkdf2Sync(input, salt, 100000, 64, 'sha512').toString('hex');
    }
}