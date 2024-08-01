"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDB = void 0;
const db_1 = require("../db");
const secret = "zapier first program";
const salt = "this needs to be a long string";
const tokenLength = 128;
const crypto_1 = __importDefault(require("crypto"));
class AuthDB {
    static verifyToken(userID, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = {
                status: false,
                token: "",
                userName: "",
                email: "",
                error: ""
            };
            const user = yield db_1.prismaClient.user.findFirst({
                where: {
                    email: userID
                }
            });
            if (user && (user.token == this.hash(token))) {
                res.status = true;
                res.userName = user.name;
                res.email = user.email;
            }
            else
                res.status = false;
            return res;
        });
    }
    static verifyCreds(userID, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = {
                status: false,
                token: "",
                userName: "",
                email: "",
                error: ""
            };
            const user = yield db_1.prismaClient.user.findFirst({
                where: {
                    email: userID
                }
            });
            if (user) {
                if (user.password === AuthDB.hash(pass)) {
                    res.status = true;
                    res.token = AuthDB.genToken();
                    res.userName = user.name;
                    res.email = user.email;
                    yield db_1.prismaClient.user.update({
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
            if (!res.status)
                res.error = "Invalid credentials";
            return res;
        });
    }
    static createPasswordHash(pass) {
        return AuthDB.hash(pass);
    }
    static deleteToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findFirst({
                where: {
                    email: userID
                }
            });
            if (!user)
                return;
            yield db_1.prismaClient.user.update({
                where: {
                    email: userID
                },
                data: {
                    token: ""
                }
            });
        });
    }
    static genToken() {
        let token = "";
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < tokenLength; i++)
            token += charSet.charAt(Math.floor(Math.random() * charSet.length));
        return token;
    }
    static hash(input) {
        return crypto_1.default.pbkdf2Sync(input, salt, 100000, 64, 'sha512').toString('hex');
    }
}
exports.AuthDB = AuthDB;
