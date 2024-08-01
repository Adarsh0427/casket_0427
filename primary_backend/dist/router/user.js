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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const encryption_1 = require("../encryption");
const router = (0, express_1.Router)();
function verify_creds_token(res, req, data, out) {
    return __awaiter(this, void 0, void 0, function* () {
        if (out.status) {
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
        }
        res.send(out);
    });
}
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error });
    }
    const userExists = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });
    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }
    // model User {
    //     id       Int      @id  @default(autoincrement()) 
    //     name     String
    //     email    String   @unique
    //     password String
    //     varified Boolean  @default(false) !! to be done
    //   }
    const hashedPassword = encryption_1.AuthDB.hash(parsedData.data.password);
    const gen_token = encryption_1.AuthDB.genToken();
    yield db_1.prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            name: parsedData.data.userName,
            password: hashedPassword,
            token: gen_token
        }
    });
    res.json({ status: "User created",
        userId: parsedData.data.email,
        token: gen_token
    });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.loginSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error });
    }
    const response = yield encryption_1.AuthDB.verifyCreds(parsedData.data.email, parsedData.data.password);
    if (!response.status) {
        const data_cookie = (0, middleware_1.getDataFromCookie)(req);
        let email = data_cookie.userID.replace("%40", "@");
        encryption_1.AuthDB.deleteToken(email);
        console.log(email);
        return res.status(400).json({ error: "Invalid credentials" });
    }
    verify_creds_token(res, req, { userID: parsedData.data.email }, response);
}));
router.get("/user", middleware_1.authMiddleware, (req, res) => {
    return res.json({
        message: "User is authenticated",
    });
});
exports.userRouter = router;
