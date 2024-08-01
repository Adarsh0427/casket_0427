import { Kafka } from "kafkajs"; 

const TopicName= "zap-events";
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
  })

async function main ()
{
    const consumer = kafka.consumer({groupId: "outbox-processor-group"});
    await consumer.connect();

    await consumer.subscribe({topic: TopicName, fromBeginning: true});
    
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic : TopicName, partition, message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })

            await new Promise(resolve => setTimeout(resolve, 5000));

            await consumer.commitOffsets([{topic: TopicName, partition, offset: (parseInt(message.offset) + 1).toString()}]);
        }
    });

}

main().catch(console.error)