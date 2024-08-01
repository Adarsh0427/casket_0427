import { PrismaClient} from "@prisma/client";
import { Kafka } from "kafkajs";


const client = new PrismaClient();

const TopicName= "zap-events";
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
  })

async function main ()
{
    const producer = kafka.producer();

    await producer.connect();


    while (1)
    {
        const PendingRows = await client.zapExecutionLog.findMany({
            where : {},
            take : 10
        })
        
       
        producer.send({
            topic: TopicName,
            messages: PendingRows.map(row => ({
                    value : row.zapExecutionId

                }))
            
        })

        await client.zapExecutionLog.deleteMany({
            where: {
                id: {
                    in : PendingRows.map(row => row.id)
                }
            }
        })
    }
}
main().catch(console.error)