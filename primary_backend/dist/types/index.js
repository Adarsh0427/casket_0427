"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapCreateSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    userName: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
exports.zapCreateSchema = zod_1.z.object({
    AvailabletriggerId: zod_1.z.string(),
    triggerMetadata: zod_1.z.any().optional(),
    actions: zod_1.z.array(zod_1.z.object({
        AvailableactionId: zod_1.z.string(),
        actionMetadata: zod_1.z.any().optional(),
    })),
});
