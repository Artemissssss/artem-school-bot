import { MongoClient,ObjectId } from 'mongodb';
import moment from 'moment';

import TeleBot from "telebot"

export default async function handler(req, res) {
    let time = moment().format('L').split("/").join(".");

    const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('artem-school').collection('users');
    const cursor = coll.find();
    const result = await cursor.toArray();
    const coll1 = client.db('artem-school').collection('classrooms');
    const cursor1 = coll1.find();
    const result1 = await cursor1.toArray();
    await client.close();
    
    for(let i = 0; i < result.length;i++){
        let userClassroom = result1.filter(arr => result[i].role ? arr.idT === result[i].classId : arr.idS === result[i].classId)
        console.log(userClassroom)
        if(userClassroom[i].events.length){
            let countEvent = userClassroom[i].events.filter(arr => time === arr.date)
            console.log(userClassroom[i].events.filter(arr => time === arr.date))
            console.log(countEvent.length)
            // await bot.sendMessage(result[i].id, `Сьогодні у вас ${countEvent.length}`)
        }else{
            await bot.sendMessage(result[i].id, `У вас немає подій`)
        }
    }

    await res.status(200)
}
