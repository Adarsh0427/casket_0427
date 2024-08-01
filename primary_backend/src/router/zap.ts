import {Router} from "express";
import {authMiddleware , getDataFromCookie} from "../middleware";
import { Response, Request } from "express";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

router.post("/createZap",authMiddleware, async (req, res) => {
    const parsedData = zapCreateSchema.safeParse(req.body);
    const userId = getDataFromCookie(req).uniqueId;
    if (!parsedData.success) {
        return res.status(400).json({error: parsedData.error});
    }

    const zapId = await prismaClient.$transaction( async tx => {
        const createdZap = await tx.zap.create({    
            data: {
                userId: parseInt(userId) ,    
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
    })
    res.json({"zapId" : zapId});
    
})

router.post("/", authMiddleware , async (req, res) => {
    const userId = getDataFromCookie(req).uniqueId;
    const Allzaps = await prismaClient.zap.findMany({
        where: {
            userId: parseInt(userId)
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

router.get("/:zapId", authMiddleware, (req, res) => {
    const zapId = req.params.zapId;
    const userId = getDataFromCookie(req).uniqueId;

    const zap = prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: parseInt(userId)
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
    res.json({"zap" : zap});
})

export const zapRouter = router  ;