import {Router} from "express";
import {authMiddleware , getDataFromCookie} from "../middleware";
import { Response, Request } from "express";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
import { Cookie } from "express-session";

const router = Router();

router.post("/createZap",authMiddleware, async (req, res) => {
    const parsedData = zapCreateSchema.safeParse(req.body);
    const userId = getDataFromCookie(req).uniqueId;
    if (!parsedData.success) {
        return res.status(400).json({error: parsedData.error});
    }

    let zapID = "";
    await prismaClient.$transaction( async tx => {
        const createdZap = await tx.zap.create({    
            data: {
                userId: userId,
                triggerId : "",
                actions: {
                    create: parsedData.data.actions.map(( x, index) => ({
                        actionId: x.AvailableactionId,
                        priority : index,
                    }))
                }
            }
        })
        
        const createdTrigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.AvailabletriggerId,
                zapId: createdZap.id
            }
        })

        await tx.zap.update({
            where: {
                id: createdZap.id
            },
            data: {
                triggerId: createdTrigger.id
            }
        })
        zapID = createdZap.id;
    })
    res.json({"zapId" : zapID});
    
})

router.post("/Zaps_page", authMiddleware , async (req, res) => {
    const userId = getDataFromCookie(req).uniqueId;
    const Allzaps = await prismaClient.zap.findMany({
        where: {
            userId: userId
        },
        include: {
            actions: {
                include: {
                    actionType : true
                }
            },
            trigger: {
                include: {
                    Type: true
                }
            }
        } 
    })
    return res.json({ "zaps" : Allzaps});
})


router.get("/Zap_detail/:zapId", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;
    const userId = getDataFromCookie(req).uniqueId;

    const Zap_detail = await prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: userId
        },
        include: {
            actions: {
                include: {
                    actionType : true
                }
            },
            trigger: {
                include: {
                    Type: true
                }
            }
        }
    })
    res.json({"zap" : Zap_detail});
})

router.get("/getAvailableTriggers", authMiddleware, async (req, res) => {
    const triggers = await prismaClient.availableTrigger.findMany(
        {
            select: {
                id: true,
                name: true
            }
        }
    );
    return res.json({"triggers" : triggers});
})

router.get("/getAvailableActions", authMiddleware, async (req, res) => {
    const actions = await prismaClient.availableAction.findMany(
        {
            select: {
                id: true,
                name: true
            }
        }
    );
    return res.json({"actions" : actions});
})

export const zapRouter = router  ;