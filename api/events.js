import { MongoClient,ObjectId } from 'mongodb';
import moment from 'moment-timezone';

import TeleBot from "telebot"

export default async function handler(req, res) {
    moment.tz.setDefault('Europe/Kiev');
    const currentDateInUkraine = moment().format('DD-MM-YYYY');

    let time = currentDateInUkraine.split("-").join(".");

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
    let newArr = [];
    let newObj = {};
    for(let i =0;i<result.length;i++){
        if(newArr.indexOf(result[i].id) === -1){
            newArr = [result[i].id,...newArr];
            result[i].role ? newObj[result[i].id] = {id:result[i].id, idT:[result[i].classId], idS:[]} : newObj[result[i].id] = {id:result[i].id, idT:[], idS:[result[i].classId]};
        }else{
            result[i].role ? newObj[result[i].id] = {id:result[i].id, idT:[result[i].classId,...newObj[result[i].id].idT], idS:[]} : newObj[result[i].id] = {id:result[i].id, idT:[], idS:[result[i].classId,...newObj[result[i].id].idS]};
        }
    };
    for(let i = 0; i<newArr.length;i++){
        let eventArr = 0;
        for(let y =0; y<newObj[newArr[i]].idT.length;y++){
            let newEvent = result1.filter(arr => arr.idT === newObj[newArr[i]].idT[y]);
            if(newEvent[0]?.events){
                let eventList = newEvent[0].events.filter(arr => arr.date === time);
                eventArr = eventArr+eventList.length;
            }
        };
        for(let y =0; y<newObj[newArr[i]].idS.length;y++){
            let newEvent = result1.filter(arr => arr.idS === newObj[newArr[i]].idS[y]);
            if(newEvent[0]?.events){
                let eventList = newEvent[0].events.filter(arr => arr.date === time);
                eventArr = eventArr+eventList.length;
            }
        };
        if(eventArr){
            await bot.sendMessage(newArr[i], `У вас сьогодні ${eventArr} подій`)
        }
    }

    await res.status(200).json({hello:true})
}
