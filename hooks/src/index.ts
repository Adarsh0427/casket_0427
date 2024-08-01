import express from "express"
import {PrismaClient} from "@prisma/client"

const client =  new PrismaClient()

const app = express();
app.use(express.json());

app.post ("/hooks/catch/:user/:zapId" , async (req, res) => {
    const userId = req.params.user;
    const zapId = req.params.zapId;
    const data = req.body;

    await client.$transaction( async tx=>{
        const run = await tx.zapExecution.create({ 
            data: {
                zapId: zapId,
                metadata: data,
            }
        });

        await tx.zapExecutionLog.create({   
            data: {
                zapExecutionId: run.id,
            }
        })
        
    })
    res.json({message: "ok"});

})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})