import TeleBot from "telebot"
// const openai = require('openai');
// const { MongoClient } = require('mongodb');
import { MongoClient,ObjectId } from 'mongodb';
import { nanoid } from 'nanoid'

const bot = new TeleBot( {token: process.env.TELEGRAM_BOT_TOKEN})
let lastUserMessage = {};
let userStatus = {};
let userClass = {};
let userChat = {};
let userAction = {};
bot.on('/del', async msg => {
    // const markup = updateKeyboard('apples');

    // return bot.sendMessage(
    //     msg.from.id, 'This is a editMessageReplyMarkup example. So, apples or oranges?', {markup}
    // ).then(re => {
    //     // Start updating message
    //     lastMessage = [msg.from.id, re.result.message_id];
    // });
    let replyMarkup = bot.keyboard([
        ["Журнал","Статистика","Учасники"],
        ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
        ["Матеріали","Cтворення матеріалу","Д/з", "Задати д/з"],
        ["Файли", "Завантаження файла","Події","Створення події"],
        ["Написати учаснику","Зробити оголошення","Класи"]
    ], {resize: true});

    return bot.sendMessage(msg.from.id, `🤖 Привіт, ${msg.from.first_name}! Я ваш особистий навчальний асистент! З моєю допомогою ви зможете легко керувати навчальним процесом. Ось деякі з функцій, які я можу виконувати:
    
    🏫 Створення та управління навчальними групами
    📚 Посилання на корисні матеріали від викладачів
    📌 Важливі контакти та оголошення
    📋 Завдання від викладачів та їх здача
    📁 Передавання файлів у групі
    📝 Створення та виконання тестів
    🗓️ Планування подій та зустрічей
    📊 Оцінки та відвідуваність уроків
    📚 Матеріали для навчання та підсумки уроків
    
    ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓`, {replyMarkup});
})

bot.on('/delS', async msg => {
    // const markup = updateKeyboard('apples');

    // return bot.sendMessage(
    //     msg.from.id, 'This is a editMessageReplyMarkup example. So, apples or oranges?', {markup}
    // ).then(re => {
    //     // Start updating message
    //     lastMessage = [msg.from.id, re.result.message_id];
    // });
    let replyMarkup = bot.keyboard([
        ["Щоденик","Події","Учасники"],
        ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
        ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
        ["Матеріали","Cтворення матеріалу"],
        ["Написати учаснику","Класи"]
    ], {resize: true});

    return bot.sendMessage(msg.from.id, `🤖 Привіт, ${msg.from.first_name}! Я ваш особистий навчальний асистент! З моєю допомогою ви зможете легко керувати навчальним процесом. Ось деякі з функцій, які я можу виконувати:
    
    🏫 Створення та управління навчальними групами
    📚 Посилання на корисні матеріали від викладачів
    📌 Важливі контакти та оголошення
    📋 Завдання від викладачів та їх здача
    📁 Передавання файлів у групі
    📝 Створення та виконання тестів
    🗓️ Планування подій та зустрічей
    📊 Оцінки та відвідуваність уроків
    📚 Матеріали для навчання та підсумки уроків
    
    ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓`, {replyMarkup});
})


// bot.on("text", async msg =>{
//     console.log(msg)
//     await fetch("https://artem-school-bot.vercel.app/api/keyboard", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(msg),
//     })
    
//     return null;
// })
// bot.on('text', async msg => {
// if(lastUserMessage[msg.from.username]){
//     console.log(lastUserMessage[msg.from.username])
//     lastUserMessage[msg.from.username] = msg.text;
// }else{
//     lastUserMessage[msg.from.username] = msg.text;

// }
// return null 
// })

bot.on('*', async msg => {
    console.log(msg)
    const text = msg.text
    let replyMarkup = bot.keyboard([
        ["Журнал","Статистика","Учасники"],
        ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
        ["Матеріали","Cтворення матеріалу","Д/з", "Задати д/з"],
        ["Файли", "Завантаження файла","Події","Створення події"],
        ["Написати учаснику","Зробити оголошення","Класи"]
    ], {resize: true});


    
    if(text === "Створити клас" && lastUserMessage[msg.from.id] === "/start" && userAction[msg.from.id] === undefined){
        let replyMarkup = bot.keyboard([
            ['Назад'],
        ], {resize: true});
        userAction[msg.from.id] = {actionReg:true}
        lastUserMessage[msg.from.id] = "Створити клас";
        return  bot.sendMessage(msg.from.id, `Напишіть назву класу`, {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Створити клас" && userAction[msg.from.id].actionReg){
        let idClass = [nanoid(),nanoid()]
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('classrooms');
        const result = await coll.insertOne({name:text,idT:idClass[1],idS:idClass[0],files:[],events:[],homework:[],marks:[],lessons:[],statisticks:[],materials:[]})
        const coll2 = client.db('artem-school').collection('users');
        const result2 = await coll2.insertOne({nameC: text,name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: idClass[1]})
        await client.close();
        lastUserMessage[msg.from.id] = text;
        userStatus[msg.from.id] = 1;
        userClass[msg.from.id] = idClass[1];
        userAction[msg.from.id] = undefined;
        return bot.sendMessage(msg.from.id, `Клас успішно створився!\n<code>${idClass[0]}</code> - id для приєднання учня в клас\n<code>${idClass[1]}</code> - id для приєднання вчителя в клас
        `, { parseMode: 'html',replyMarkup});
    }else if((lastUserMessage[msg.from.id] === "Приєднатися в клас, як вчитель" || lastUserMessage[msg.from.id] === "Приєднатися в клас, як учень" || lastUserMessage[msg.from.id] === "Створити клас") && text === "Назад"){
        lastUserMessage[msg.from.id] = '/start';
        userAction[msg.from.id] = undefined;
        let replyMarkup = bot.keyboard([
            ['Створити клас'],
            ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
        ], {resize: true});
    
        return bot.sendMessage(msg.from.id, `🤖 Привіт, ${msg.from.first_name}! Я ваш особистий навчальний асистент! З моєю допомогою ви зможете легко керувати навчальним процесом. Ось деякі з функцій, які я можу виконувати:
        
        🏫 Створення та управління навчальними групами
        📚 Посилання на корисні матеріали від викладачів
        📌 Важливі контакти та оголошення
        📋 Завдання від викладачів та їх здача
        📁 Передавання файлів у групі
        📝 Створення та виконання тестів
        🗓️ Планування подій та зустрічей
        📊 Оцінки та відвідуваність уроків
        📚 Матеріали для навчання та підсумки уроків
        
        ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓`, {replyMarkup});
    }else if(text === "Назад"){
        lastUserMessage[msg.from.id] = 'someText';
        userAction[msg.from.id] = undefined;
        if(userStatus[msg.from.id]){
            return  bot.sendMessage(msg.from.id, `Ви повернулися в головне меню`, {replyMarkup});
        }else if(userStatus[msg.from.id] === 0){
            let replyMarkup = bot.keyboard([
                ["Щоденик","Події","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                ["Матеріали","Cтворення матеріалу"],
                ["Написати учаснику","Класи"]
            ], {resize: true});
            return  bot.sendMessage(msg.from.id, `Ви повернулися в головне меню`, {replyMarkup});
        }
    }else if(text === "Приєднатися в клас, як учень" && lastUserMessage[msg.from.id] === "/start"){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = text;
        return  bot.sendMessage(msg.from.id, `Надішліть id учня`, {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Приєднатися в клас, як учень"){
        let replyMarkup = bot.keyboard([
            ["Щоденик","Події","Учасники"],
            ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
            ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
            ["Матеріали","Cтворення матеріалу"],
            ["Написати учаснику","Класи"]
        ], {resize: true});
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('classrooms');
                const filter = {idS: msg.text};
                const cursor = coll.find(filter);
                const result = await cursor.toArray();
                console.log(result)
                if(result[0]){
                    const coll2 = client.db('artem-school').collection('users');
                    const result2 = await coll2.insertOne({nameC: result[0].name, name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:0, classId: result[0].idS})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 0;
                     userClass[msg.from.id] = result[0].idS;
                     return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {replyMarkup});
                }else{
                    await client.close();
                    return await bot.sendMessage(msg.from.id, `Ви вели неправильний id класу`);
                }  
    }else if(text === "Приєднатися в клас, як вчитель" && lastUserMessage[msg.from.id] === "/start"){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = text;
        return  bot.sendMessage(msg.from.id, `Надішліть id вчителя `, {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Приєднатися в клас, як вчитель"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('classrooms');
                const filter = {idT: msg.text};
                const cursor = coll.find(filter);
                const result = await cursor.toArray();
                if(result[0]){
                    const coll2 = client.db('artem-school').collection('users');
                    const result2 = await coll2.insertOne({nameC: result[0].name,name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: result[0].idT})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 1;
                     userClass[msg.from.id] = result[0].idT;
                     return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {replyMarkup});
                }else{
                    await client.close();
                    return await bot.sendMessage(msg.from.id, `Ви вели неправильний id класу`);
                } 
    }else if(lastUserMessage[msg.from.id] === "/start" && text !== "Приєднатися в клас, як вчитель" && text !== "Приєднатися в клас, як учень" && text !== "Створити клас"){
        let replyMarkup = bot.keyboard([
            ['Створити клас'],
            ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
        ], {resize: true});
        return bot.sendMessage(msg.from.id, `Error`, {replyMarkup});
    }

    if(userStatus[msg.from.id] === undefined && text !== "/start"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('users');
        const filter = {id: msg.from.id};
        const cursor = coll.find(filter);
        const result = await cursor.toArray();

        await client.close();
        if(result[0]){
            if(result.length === 1){
                userStatus[msg.from.id] = result[0].role;
                userClass[msg.from.id] = result[0].classId;
            }else{
                let arrBtn = () => {
                    let arr = [];
                    userAction[msg.from.id] =[{act:true}];
                    for(let i = 0; i< result.length;i++){
                        let joinId =nanoid()
                        userAction[msg.from.id] = [{name:result[i].nameC,id:result[i].classId, role:result[i].role, joinId:joinId},...userAction[msg.from.id]]
                        arr = [[bot.inlineButton(`${result[i].nameC}`, {callback: joinId})],...arr]
                    };
                    return arr;
                };
                let replyMarkup = bot.inlineKeyboard(arrBtn());

                return bot.sendMessage(msg.chat.id,`Ви знаходитесь в декількох класах, тому натисніть на кнопку знизу в якому ви хочете зараз взаємодіяти:`, {replyMarkup});
            }
        }else{
            return bot.sendMessage(msg.from.id, "Не зареєстрований натисніть /start")
        }
    }
//.filter((arr) => arr.id === msg.from.id)
if(userStatus[msg.from.id] !== undefined){
    if(text === "Класи"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('users');
        const filter = {id: msg.from.id};
        const cursor = coll.find(filter);
        const result = await cursor.toArray();

        await client.close();
        if(result[0]){
            if(result.length === 1){
                return bot.sendMessage(msg.chat.id,`Ви знаходитеся тільки в одному класі`);
            }else{
                let arrBtn = () => {
                    let arr = [];
                    userAction[msg.from.id] =[{act:true}];
                    for(let i = 0; i< result.length;i++){
                        let joinId =nanoid()
                        userAction[msg.from.id] = [{name:result[i].nameC,id:result[i].classId, role:result[i].role, joinId:joinId},...userAction[msg.from.id]]
                        arr = [[bot.inlineButton(`${result[i].nameC}`, {callback: joinId})],...arr]
                    };
                    return arr;
                };
                let replyMarkup = bot.inlineKeyboard(arrBtn());

                return bot.sendMessage(msg.chat.id,`Ви знаходитесь в декількох класах, тому натисніть на кнопку знизу в якому ви хочете зараз взаємодіяти:`, {replyMarkup});
            }
            console.log(userClass[msg.from.id],userStatus[msg.from.id])
        }
    }


    if(text === "Файли" && userAction[msg.from.id] === undefined){
        // let replyMarkup = bot.inlineKeyboard([
        //     [
        //         bot.inlineButton('Загрузити файл', {callback: "Загрузити файл"}),
        //     ], [
        //         bot.inlineButton('Отримати файли', {callback: "Отримати файли"})
        //     ]
        // ]);
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();

        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        await client.close();
        console.log(userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]})
        if(result1[0]){
            if(result1[0].files.length===0){
                return bot.sendMessage(msg.chat.id, 'В цьому класі ще немає файлів');
            }else{
                for(let i = 0; i<result1[0].files.length;i++){
                    await bot.forwardMessage(msg.chat.id,result1[0].files[i].chatID,result1[0].files[i].msgID);
                    if(msg.chat.type ==="private" && userStatus[msg.from.id]){
                        await bot.sendMessage(msg.chat.id,`${result1[0].files[i].chatID}&&${result1[0].files[i].msgID}`);
                    }
                }
                return bot.sendMessage(msg.chat.id, 'Це всі файли в цьому класі');
            }
        }else{
            return bot.sendMessage(msg.chat.id, 'Error');
        }
    }else if(text === "Завантаження файла" && userAction[msg.from.id] === undefined){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});

        lastUserMessage[msg.from.id] = text;
        return bot.sendMessage(msg.chat.id, 'Надішліть файл',{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Завантаження файла" && msg.text === undefined){
        console.log(lastUserMessage[msg.from.id])
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();


        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
                const files = {files : [...result1[0].files, {chatID:msg.chat.id, msgID:msg.message_id}]}
                console.log(result1)
                await coll1.updateOne(
                    {_id: new ObjectId(result1[0]._id)},
                    {
                      $set: { ...files},
                      $currentDate: { lastModified: true }
                    }
                 )
                await client.close();
                lastUserMessage[msg.from.id] = "textФайл";
                if(userStatus[msg.from.id]){
                    return await bot.sendMessage(msg.chat.id, 'Файл додано', {replyMarkup});
                }else if(userStatus[msg.from.id] === 0){
                    let replyMarkup = bot.keyboard([
                        ["Щоденик","Події","Учасники"],
                        ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                        ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                        ["Матеріали","Cтворення матеріалу"],
                        ["Написати учаснику","Класи"]
                    ], {resize: true});
                    return await bot.sendMessage(msg.chat.id, 'Файл додано', {replyMarkup});
                }
        return await bot.sendMessage(msg.chat.id, 'Файл додано');
    }

    if(text === "Матеріали" && userAction[msg.from.id] === undefined){
        // let replyMarkup = bot.inlineKeyboard([
        //     [
        //         bot.inlineButton('Загрузити файл', {callback: "Загрузити файл"}),
        //     ], [
        //         bot.inlineButton('Отримати файли', {callback: "Отримати файли"})
        //     ]
        // ]);
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();

        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        await client.close();
        console.log(userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]})
        if(result1[0]){
            if(result1[0].materials.length===0){
                return bot.sendMessage(msg.chat.id, 'В цьому класі ще немає файлів');
            }else{
                for(let i = 0; i<result1[0].materials.length;i++){
                    await bot.forwardMessage(msg.chat.id,result1[0].materials[i].chatID,result1[0].materials[i].msgID);
                    if(msg.chat.type ==="private" && userStatus[msg.from.id]){
                        await bot.sendMessage(msg.chat.id,`${result1[0].materials[i].chatID}&&${result1[0].materials[i].msgID}`);
                    }
                }
                return bot.sendMessage(msg.chat.id, 'Це всі файли в цьому класі');
            }
        }else{
            return bot.sendMessage(msg.chat.id, 'Error');
        }
    }

    if(text === "Події" && userAction[msg.from.id] === undefined){
        // let replyMarkup = bot.inlineKeyboard([
        //     [
        //         bot.inlineButton('Загрузити файл', {callback: "Загрузити файл"}),
        //     ], [
        //         bot.inlineButton('Отримати файли', {callback: "Отримати файли"})
        //     ]
        // ]);
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();

        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]}
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        await client.close();
        if(result1[0]){
            if(result1[0].events.length===0){
                return bot.sendMessage(msg.chat.id, 'В цьому класі ще немає подій');
            }else{
                console.log(result1[0].events)
                for(let i = 0; i<result1[0].events.length;i++){
                    await bot.sendMessage(msg.chat.id, `${result1[0].events[i].text}\n\n\nО ${result1[0].events[i].date} ${result1[0].events[i].time}\n\nДля: ${result1[0].events[i].who}`);
                    if(msg.chat.type ==="private" && userStatus[msg.from.id]){
                        await bot.sendMessage(msg.from.id, `${result1[0].events[i].id}`);
                    }
                }
                return bot.sendMessage(msg.chat.id, 'Це всі події в цьому класі');
            }
        }else{
            return bot.sendMessage(msg.chat.id, 'Error');
        }
    }

}

if(userStatus[msg.from.id]){
    console.log(userAction[msg.from.id])
    if(text ==="Зробити оголошення"){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = "Зробити оголошення";
        return bot.sendMessage(msg.chat.id, `Надішліть текст для оголошення/n(оголошення буде надіслано зразу після насилання тексту)`, {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Зробити оголошення"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]}
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();

        const coll = client.db('artem-school').collection('users');
        const filter = {classId: result1[0].idS};
        const filter2 = {classId: result1[0].idT};
        const cursor = coll.find(filter);
        const cursor2 = coll.find(filter2);
        const result = await cursor.toArray();
        const result2 = await cursor2.toArray();
        await client.close();

        for(let i = 0; i<result.length;i++){
            await bot.sendMessage(result[i].id, `У вас нове оголошення від ${msg.from.first_name}:\n${text}`);
        }

        for(let i = 0; i<result2.length;i++){
            console.log(result2[i])
            if(result2[i].id !== msg.from.id){
                await bot.sendMessage(result2[i].id, `У вас нове оголошення від ${msg.from.first_name}:\n${text}`);
            }
        }

        if(userStatus[msg.from.id]){
            return  await bot.sendMessage(msg.from.id, `Ви повернулися в головне меню`, {replyMarkup});
        }else if(userStatus[msg.from.id] === 0){
            let replyMarkup = bot.keyboard([
                ["Щоденик","Події","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                ["Матеріали","Cтворення матеріалу"],
                ["Написати учаснику","Класи"]
            ], {resize: true});
            return  await bot.sendMessage(msg.from.id, `Ви повернулися в головне меню`, {replyMarkup});
        }
    }
    if(text === "Створення події" && userAction[msg.from.id] === undefined){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = text;
        userAction[msg.from.id] = {id:nanoid(),text:"",date:"", time:"",who:""}
        return bot.sendMessage(msg.chat.id, 'Надішліть текст події',{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Створення події" && lastUserMessage[msg.from.id] === "Створення події" && !userAction[msg.from.id].text && !userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].who){
        userAction[msg.from.id] = {id:nanoid(),text:text,date:"", time:"",who:""}
        return bot.sendMessage(msg.chat.id, 'Надішліть дату події у форматі дд.мм.рррр');
    }else if(lastUserMessage[msg.from.id] === "Створення події" && userAction[msg.from.id].text && !userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].who){
        userAction[msg.from.id] = {...userAction[msg.from.id], date:text};
        console.log(userAction[msg.from.id])
        return bot.sendMessage(msg.chat.id, 'Надішліть час події у форматі гг:хх');
    }else if(lastUserMessage[msg.from.id] === "Створення події" && userAction[msg.from.id].text && userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].who){
        userAction[msg.from.id] = {...userAction[msg.from.id], time:text};
        return bot.sendMessage(msg.chat.id, 'Надішліть для кого призначена ця подія у довільному форматі');
    }else if(lastUserMessage[msg.from.id] === "Створення події" && userAction[msg.from.id].text && userAction[msg.from.id].date && userAction[msg.from.id].time && !userAction[msg.from.id].who){
        userAction[msg.from.id] = {...userAction[msg.from.id],who:text};
        
        console.log(lastUserMessage[msg.from.id])
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();


        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
                const events = {events : [...result1[0].events, userAction[msg.from.id]]}
                console.log(result1)
                await coll1.updateOne(
                    {_id: new ObjectId(result1[0]._id)},
                    {
                      $set: { ...events},
                      $currentDate: { lastModified: true }
                    }
                 )
                await client.close();
                lastUserMessage[msg.from.id] = "textФайл";
                userAction[msg.from.id] = undefined;
                if(userStatus[msg.from.id]){
                    return await bot.sendMessage(msg.chat.id, 'Подія додана',{replyMarkup});
                }else if(userStatus[msg.from.id] === 0){
                    let replyMarkup = bot.keyboard([
                        ["Щоденик","Події","Учасники"],
                        ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                        ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                        ["Матеріали","Cтворення матеріалу"],
                        ["Написати учаснику","Класи"]
                    ], {resize: true});
                    return await bot.sendMessage(msg.chat.id, 'Подія додана',{replyMarkup});
                }
    }

    if(text === "Cтворення матеріалу" && userAction[msg.from.id] === undefined){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});

        lastUserMessage[msg.from.id] = text;
        return bot.sendMessage(msg.chat.id, 'Надішліть матеріал текст/зображення/посилання/файл',{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Cтворення матеріалу"){
        console.log(lastUserMessage[msg.from.id])
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        // const coll = client.db('artem-school').collection('users');
        // const filter = {id: msg.from.id};
        // const cursor = coll.find(filter);
        // const result = await cursor.toArray();


        const coll1 = client.db('artem-school').collection('classrooms');
        const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
                const materials = {materials : [...result1[0].materials, {chatID:msg.chat.id, msgID:msg.message_id}]}
                console.log(result1)
                await coll1.updateOne(
                    {_id: new ObjectId(result1[0]._id)},
                    {
                      $set: { ...materials},
                      $currentDate: { lastModified: true }
                    }
                 )
                await client.close();
                lastUserMessage[msg.from.id] = "textФайл";
                if(userStatus[msg.from.id]){
                    return await bot.sendMessage(msg.chat.id, 'Матеріал додано', {replyMarkup});
                }
    }

if (text === "Видалити" && msg.reply_to_message !== undefined && userAction[msg.from.id] === undefined && msg.reply_to_message.text.includes("&&")){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    // const coll = client.db('artem-school').collection('users');
    // const filter = {id: msg.from.id};
    // const cursor = coll.find(filter);
    // const result = await cursor.toArray();
    

    const coll1 = client.db('artem-school').collection('classrooms');
    const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
    const cursor1 = coll1.find(filter1);
    const result1 = await cursor1.toArray();
    console.log(msg.reply_to_message.text)
            const files = {files : [...result1[0].files.filter((arr) => arr.chatID !== parseInt(msg.reply_to_message.text.split("&&")[0]) && arr.msgID !== parseInt(msg.reply_to_message.text.split("&&")[1]))]}
            console.log(files)
            await coll1.updateOne(
                {_id: new ObjectId(result1[0]._id)},
                {
                  $set: { ...files},
                  $currentDate: { lastModified: true }
                }
             )
            await client.close();
            lastUserMessage[msg.from.id] = "textФайл";
    return await bot.sendMessage(msg.chat.id, 'Файл видалено');
}else if (text === "Видалити" && msg.reply_to_message !== undefined && userAction[msg.from.id] === undefined){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    // const coll = client.db('artem-school').collection('users');
    // const filter = {id: msg.from.id};
    // const cursor = coll.find(filter);
    // const result = await cursor.toArray();
    

    const coll1 = client.db('artem-school').collection('classrooms');
    const filter1 = userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]};
    const cursor1 = coll1.find(filter1);
    const result1 = await cursor1.toArray();
    console.log(msg.reply_to_message.text)
            const events = {events : [...result1[0].events.filter((arr) => arr.id !== msg.reply_to_message.text)]}
            console.log(events)
            await coll1.updateOne(
                {_id: new ObjectId(result1[0]._id)},
                {
                  $set: { ...events},
                  $currentDate: { lastModified: true }
                }
             )
            await client.close();
            lastUserMessage[msg.from.id] = "textФайл";
    return await bot.sendMessage(msg.chat.id, 'Подію видалено');
}else{
        return null;
    }
}else if(userStatus[msg.from.id] === 0){
return null;
}
});

bot.on('/start', async msg => {
    lastUserMessage[msg.from.id] = msg.text;
    let replyMarkup = bot.keyboard([
        ['Створити клас'],
        ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, `🤖 Привіт, ${msg.from.first_name}! Я ваш особистий навчальний асистент! З моєю допомогою ви зможете легко керувати навчальним процесом. Ось деякі з функцій, які я можу виконувати:
    
    🏫 Створення та управління навчальними групами
    📚 Посилання на корисні матеріали від викладачів
    📌 Важливі контакти та оголошення
    📋 Завдання від викладачів та їх здача
    📁 Передавання файлів у групі
    📝 Створення та виконання тестів
    🗓️ Планування подій та зустрічей
    📊 Оцінки та відвідуваність уроків
    📚 Матеріали для навчання та підсумки уроків
    
    ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓`, {replyMarkup});

});




// bot.on("text", async msg => {
//     let replyMarkup = bot.keyboard([
//         ['/buttons', '/inlineKeyboard'],
//         ['/start', '/hide']
//     ], {resize: true});

//     return bot.sendMessage(msg.from.id, 'Keyboard example.', {replyMarkup});
// });

// bot.on('/inlineKeyboard', msg => {

//     let replyMarkup = bot.inlineKeyboard([
//         [
//             bot.inlineButton('callback', {callback: 'this_is_data'}),
//             bot.inlineButton('inline', {inline: 'some query'})
//         ], [
//             bot.inlineButton('url', {url: 'https://telegram.org'})
//         ]
//     ]);

//     return bot.sendMessage(msg.from.id, 'Inline keyboard example.', {replyMarkup});

// });

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    console.log(msg.data)
    if(userAction[msg.from.id] !== undefined && userAction[msg.from.id][userAction[msg.from.id].length-1].act){
        let newArr = userAction[msg.from.id].filter(arr => arr.joinId === msg.data);
        console.log(newArr)
        userStatus[msg.from.id] = newArr[0].role;
        userClass[msg.from.id] = newArr[0].id;
        userAction[msg.from.id]= undefined;
        if(userStatus[msg.from.id]){
            let replyMarkup = bot.keyboard([
                ["Журнал","Статистика","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Матеріали","Cтворення матеріалу","Д/з", "Задати д/з"],
                ["Файли", "Завантаження файла","Події","Створення події"],
                ["Написати учаснику","Зробити оголошення","Класи"]
            ], {resize: true});
            bot.sendMessage(msg.from.id,`Ви успішно увійшли в кімнату ${newArr[0].name}`,{replyMarkup})
        }else{
            let replyMarkup = bot.keyboard([
                ["Щоденик","Події","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                ["Матеріали","Cтворення матеріалу"],
                ["Написати учаснику","Класи"]
            ], {resize: true});
            bot.sendMessage(msg.from.id,`Ви успішно увійшли в кімнату ${newArr[0].name}`,{replyMarkup})
        }

    }

    return bot.answerCallbackQuery(msg.from.id, `Inline button callback: ${ msg.data }`, true);
});

// // Inline query
// bot.on('inlineQuery', msg => {

//     const query = msg.query;
//     const answers = bot.answerList(msg.id);

//     answers.addArticle({
//         id: 'query',
//         title: 'Inline Query',
//         description: `Your query: ${ query }`,
//         message_text: 'Click!'
//     });

//     return bot.answerQuery(answers);

// });

export default bot

//YsbcVL8dXcW0lAY7


