"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/createZap", middleware_1.authMiddleware, (req, res) => {
    console.log("create a Zap here", req.body);
});
router.post("/", (req, res) => {
    console.log("All zaps of user", req.body);
});
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => {
    const zapId = req.params.zapId;
    console.log("infomation of zapId : " + zapId);
});
exports.zapRouter = router;
