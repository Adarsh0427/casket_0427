"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const zap_1 = require("./router/zap");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const port = process.env.PORT || 4001;
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({ secret: "your-secret-key", "saveUninitialized": false, "resave": false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/zap", zap_1.zapRouter);
app.listen(port, () => {
    console.log("Server started at http://localhost:" + port + "/api/v1/user \n Server started at http://localhost:" + port + "/api/v1/zap");
});
