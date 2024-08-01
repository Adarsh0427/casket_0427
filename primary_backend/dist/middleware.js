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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.getDataFromCookie = getDataFromCookie;
const encryption_1 = require("./encryption");
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const data_cookie = getDataFromCookie(req);
        let email = data_cookie.userID;
        const token = data_cookie.token;
        if (!email || !token) {
            res.status(401).send("No session found");
            return;
        }
        email = data_cookie.userID.replace("%40", "@");
        const data = yield encryption_1.AuthDB.verifyToken(email, token);
        if (data.status) {
            next();
        }
        else
            res.status(401).send("Unauthorized, Login again !!");
    });
}
function getDataFromCookie(req) {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return {};
    }
    const cookies = cookie.split(';');
    let cookie_json = {}; // Add index signature
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        cookie_json[key] = value;
    }
    return cookie_json;
}
