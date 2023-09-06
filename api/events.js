import { MongoClient,ObjectId } from 'mongodb';
import TeleBot from "telebot"

export default async function handler(req, res) {
    const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)
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
        let userClassroom = result1.filter(arr => result[i].role ? arr.idT === result.classId : arr.idS === result.classId)
        console.log(userClassroom)
        if(userClassroom.events.length){
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0!
            let dd = today.getDate();
    
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const formattedToday = dd + '.' + mm + '.' + yyyy;
    
            let countEvent = userClassroom[0].events.filter(arr => formattedToday === arr.date)
            console.log(countEvent)
            await bot.sendMessage(result[i].id, `Сьогодні у вас ${countEvent.length}`)
        }else{
            await bot.sendMessage(result[i].id, `У вас немає подій`)
        }
    }

    await res.status(200)
}
