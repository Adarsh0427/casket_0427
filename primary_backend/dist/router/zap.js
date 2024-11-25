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
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/createZap", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.zapCreateSchema.safeParse(req.body);
    const userId = (0, middleware_1.getDataFromCookie)(req).uniqueId;
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error });
    }
    let zapID = "";
    yield db_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdZap = yield tx.zap.create({
            data: {
                userId: userId,
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.AvailableactionId,
                        priority: index,
                    }))
                }
            }
        });
        const createdTrigger = yield tx.trigger.create({
            data: {
                triggerId: parsedData.data.AvailabletriggerId,
                zapId: createdZap.id
            }
        });
        yield tx.zap.update({
            where: {
                id: createdZap.id
            },
            data: {
                triggerId: createdTrigger.id
            }
        });
        zapID = createdZap.id;
    }));
    res.json({ "zapId": zapID });
}));
router.post("/Zaps_page", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, middleware_1.getDataFromCookie)(req).uniqueId;
    const Allzaps = yield db_1.prismaClient.zap.findMany({
        where: {
            userId: userId
        },
        include: {
            actions: {
                include: {
                    actionType: true
                }
            },
            trigger: {
                include: {
                    Type: true
                }
            }
        }
    });
    return res.json({ "zaps": Allzaps });
}));
router.get("/Zap_detail/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zapId = req.params.zapId;
    const userId = (0, middleware_1.getDataFromCookie)(req).uniqueId;
    const Zap_detail = yield db_1.prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: userId
        },
        include: {
            actions: {
                include: {
                    actionType: true
                }
            },
            trigger: {
                include: {
                    Type: true
                }
            }
        }
    });
    res.json({ "zap": Zap_detail });
}));
router.get("/getAvailableTriggers", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const triggers = yield db_1.prismaClient.availableTrigger.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return res.json({ "triggers": triggers });
}));
router.get("/getAvailableActions", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actions = yield db_1.prismaClient.availableAction.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return res.json({ "actions": actions });
}));
exports.zapRouter = router;
