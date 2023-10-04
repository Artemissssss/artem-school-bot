import TeleBot from "telebot"
import pkg from 'telebot';
const { Markup } = pkg;
import { MongoClient,ObjectId } from 'mongodb';
import { nanoid } from 'nanoid'
import moment from 'moment-timezone';


const bot = new TeleBot( {token: process.env.TELEGRAM_BOT_TOKEN})
let lastUserMessage = {};
let userStatus = {};
let userClass = {};
let userChat = {};
let userAction = {};

function getWeeks() {
    const weeks = [];
    const now = moment().tz("Europe/Kiev");

    for(let i = -3; i <= 1; i++) {
        const week = [];
        const monday = now.clone().add(i, 'weeks').startOf('isoWeek');

        for(let j = 0; j < 5; j++) {
            week.push(monday.clone().add(j, 'days').format('DD.MM.YYYY'));
        }

        weeks.push(week.reverse());
    }

    return weeks.reverse();
}

function isValidFormat(text) {
    var parts = text.split('-');
    if (parts.length !== 2) {
        return false;
    }

    var start = parts[0].split(':');
    var end = parts[1].split(':');

    if (start.length !== 2 || end.length !== 2) {
        return false;
    }

    var startHour = parseInt(start[0], 10);
    var startMinute = parseInt(start[1], 10);
    var endHour = parseInt(end[0], 10);
    var endMinute = parseInt(end[1], 10);

    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        return false;
    }

    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        return false;
    }

    if (startMinute < 0 || startMinute > 59 || endMinute < 0 || endMinute > 59) {
        return false;
    }

    if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
        return false;
    }

    return true;
}

function sortTimes(times) {
    return times.sort(function(a, b) {
        var startA = a.split('-')[0];
        var endA = a.split('-')[1];
        var startB = b.split('-')[0];
        var endB = b.split('-')[1];

        var startHourA = parseInt(startA.split(':')[0], 10);
        var startMinuteA = parseInt(startA.split(':')[1], 10);
        var endHourA = parseInt(endA.split(':')[0], 10);
        var endMinuteA = parseInt(endA.split(':')[1], 10);

        var startHourB = parseInt(startB.split(':')[0], 10);
        var startMinuteB = parseInt(startB.split(':')[1], 10);
        var endHourB = parseInt(endB.split(':')[0], 10);
        var endMinuteB = parseInt(endB.split(':')[1], 10);

        if (startHourA !== startHourB) {
            return startHourA - startHourB;
        } else if (startMinuteA !== startMinuteB) {
            return startMinuteA - startMinuteB;
        } else if (endHourA !== endHourB) {
            return endHourA - endHourB;
        } else {
            return endMinuteA - endMinuteB;
        }
    });
}

bot.on('/del', async msg => {
    await fetch("https://artem-school-api.onrender.com/api/zustrich", {
        method: 'POST', // Метод запиту (GET, POST, PUT, DELETE тощо)
        headers: {
          'Content-Type': 'application/json', // Заголовок запиту
          // Інші заголовки, якщо потрібно
        },
        body:JSON.stringify({type:1, time:"18:00-18:21"})    
        // Тіло запиту, якщо потрібно передати дані
        // body: JSON.stringify({ key: 'value' }),
      });
    // const markup = updateKeyboard('apples');

    // return bot.sendMessage(
    //     msg.from.id, 'This is a editMessageReplyMarkup example. So, apples or oranges?', {markup}
    // ).then(re => {
    //     // Start updating message
    //     lastMessage = [msg.from.id, re.result.message_id];
    // });
    console.log(getWeeks());
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
        ["Матеріали", "Події"],
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
    if (text?.indexOf("/gpt") === 0) return null;
    console.log(lastUserMessage[msg.from.id],userChat[msg.from.id])
    if(msg.from.id === 1052973544  || msg.from.id === 5551509960){
        if(text?.indexOf("!чат") === 0){
            lastUserMessage[msg.from.id] = "!чат"
            userChat[msg.from.id] = parseInt(text.split(" ")[1]);
            return null;
        }else if(text === "!стоп"){
            userChat[msg.from.id] = undefined;
            return null;
        }else if(lastUserMessage[msg.from.id] === "!чат" && userChat[msg.from.id]){
            console.log(text)
            if(text){
                return bot.sendMessage(userChat[msg.from.id], text);
            }else if(msg?.photo[0].file_id){
                console.log(msg?.photo[0].file_id)
                if(msg.photo?.caption){
                    return bot.sendPhoto(userChat[msg.from.id], msg.photo[0].file_id, {caption:msg.photo.caption})
                }else{
                    return bot.sendPhoto(userChat[msg.from.id], msg.photo[0].file_id)
                }
            }else if(msg?.document.thumbnail.file_id){
                if(msg.document.caption){
                    return bot.sendDocument(userChat[msg.from.id], msg.document.thumbnail.file_id,{caption:msg.document.caption})
                }else{
                    return bot.sendDocument(userChat[msg.from.id], msg.document.thumbnail.file_id)
                }
            }
        }else if(msg.reply_to_message?.forward_from.id && text !== "Видалити"){
            if(text){
                return bot.sendMessage(userChat[msg.from.id], text);
            }else if(msg?.photo[0].file_id){
                if(msg.photo?.caption){
                    return bot.sendPhoto(userChat[msg.from.id], msg.photo[0].file_id, {caption:msg.photo.caption})
                }else{
                    return bot.sendPhoto(userChat[msg.from.id], msg.photo[0].file_id)
                }
            }else if(msg?.document.thumbnail.file_id){
                if(msg.document.caption){
                    return bot.sendDocument(userChat[msg.from.id], msg.document.thumbnail.file_id,{caption:msg.document.caption})
                }else{
                    return bot.sendDocument(userChat[msg.from.id], msg.document.thumbnail.file_id)
                }
            }
        }else if(text?.indexOf("!розсилка") === 0){
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            const coll = client.db('artem-school').collection('users');
            const cursor = coll.find();
            const result = await cursor.toArray();
            await client.close();
            const stringWithoutFirst11Chars = text.slice(10);
            let newArr = [];
            for(let i =0;i<result.length;i++){
                if(newArr.indexOf(result[i].id) === -1){
                    await bot.sendMessage(result[i].id, stringWithoutFirst11Chars);
                    newArr = [result[i].id,...newArr];
                }
            };
            return null;
        }
    }


    if(msg.from.id !== 1052973544 && msg.from.id !== 5551509960 && text === "/chat"){
        userChat[msg.from.id] = 5551509960;
        lastUserMessage[msg.from.id] = "/chat";
        let replyMarkup = bot.keyboard([
            ["Стоп"]
        ], {resize: true});
        return bot.sendMessage(msg.from.id, "Ви в чаті з куратором, щоб вийти з нього натиснітсть Стоп", {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "/chat" && text === "Стоп"){
        userChat[msg.from.id] = undefined;
        lastUserMessage[msg.from.id] = "kfsdklfjksdfl";
        let replyMarkup = bot.keyboard([
            ["Журнал","Статистика","Учасники"],
            ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
            ["Матеріали","Cтворення матеріалу","Д/з", "Задати д/з"],
            ["Файли", "Завантаження файла","Події","Створення події"],
            ["Написати учаснику","Зробити оголошення","Класи"]
        ], {resize: true});
        if(userStatus[msg.from.id]){
            return bot.sendMessage(msg.from.id, "Повернув вас у меню",{replyMarkup});
        }else if(userStatus[msg.from.id] === 0){
            let replyMarkup = bot.keyboard([
                ["Щоденик","Події","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                ["Матеріали", "Події"],
                ["Написати учаснику","Класи"]
            ], {resize: true});
            return bot.sendMessage(msg.from.id, "Повернув вас у меню",{replyMarkup});
        }else{
            let replyMarkup = bot.keyboard([
                ['Створити клас'],
                ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
            ], {resize: true});
            lastUserMessage[msg.from.id] = "/start";
            return bot.sendMessage(msg.from.id, "Повернув вас у меню",{replyMarkup});
        }
    }else if(lastUserMessage[msg.from.id] === "/chat" && userChat[msg.from.id]){
        return bot.forwardMessage(userChat[msg.from.id], msg.from.id, msg.message_id);
    };
    if(text === "/help"){
        return bot.sendMessage(msg.chat.id,`Привіт! 😊

Якщо вам потрібна допомога з використанням цього бота, ось посилання на сторінку з інструкцією: 👉 https://artem-school-doc.vercel.app/docs/intro 👈
        
На цій сторінці ви знайдете всю необхідну інформацію щодо використання бота. Якщо у вас виникнуть які-небудь додаткові питання, не соромтесь питати! 🤖💬
        
Удачі у використанні бота! 👍😄`)
    }
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
    }else if(lastUserMessage[msg.from.id] === "Створити клас" && userAction[msg.from.id].actionReg){
        let idClass = [nanoid(),nanoid()]
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('classrooms');
        const result = await coll.insertOne({name:text,_id:idClass[1],idS:idClass[0],files:[],events:[],marks:[],statisticks:[],materials:[]});
        const coll2 = client.db('artem-school').collection('users');
        const result2 = await coll2.insertOne({nameC: text,name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: idClass[1]});
        await client.close();
        lastUserMessage[msg.from.id] = text;
        userStatus[msg.from.id] = 1;
        userClass[msg.from.id] = idClass[1];
        userAction[msg.from.id] = undefined;
        return bot.sendMessage(msg.from.id, `Клас успішно створився!\n\n<code>${idClass[0]}</code> - id для приєднання учня в клас\nабо посилання для приєдання учня https://t.me/artemisSchool_bot?start=${idClass[0]}\n\n<code>${idClass[1]}</code> - id для приєднання вчителя в клас\nабо посилання для приєдання вчителя https://t.me/artemisSchool_bot?start=${idClass[1]}
        `, { parseMode: 'html',replyMarkup});
    }else if(text === "Назад"){
        lastUserMessage[msg.from.id] = 'someText';
        userAction[msg.from.id] = undefined;
        userChat[msg.from.id] = undefined;
        if(userStatus[msg.from.id]){
            return  bot.sendMessage(msg.from.id, `Ви повернулися в головне меню`, {replyMarkup});
        }else if(userStatus[msg.from.id] === 0){
            let replyMarkup = bot.keyboard([
                ["Щоденик","Події","Учасники"],
                ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                ["Матеріали", "Події"],
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
            ["Матеріали", "Події"],
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
                    const result2 = await coll2.insertOne({nameC: result[0].name, name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:0, classId: `${result[0]._id}`})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 0;
                     userClass[msg.from.id] = `${result[0]._id}`;
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
                const filter = {_id: msg.text};
                const cursor = coll.find(filter);
                const result = await cursor.toArray();
                if(result[0]){
                    const coll2 = client.db('artem-school').collection('users');
                    const result2 = await coll2.insertOne({nameC: result[0].name,name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: `${result[0]._id}`})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 1;
                     userClass[msg.from.id] = `${result[0]._id}`;
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

    if(userStatus[msg.from.id] === undefined && text.indexOf("/start") !== 0){
        console.log(text.indexOf("/start") !== 0, text)
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
    console.log(userChat[msg.from.id])
if(userChat[msg.from.id]){
    if(userChat[userChat[msg.from.id]] !== msg.from.id){
        await bot.sendMessage(userChat[msg.from.id], `${msg.from.first_name} надіслав вам повідомлення(напишіть учаснику, щоб увійти з ним в переписку)`)
    }
    return await bot.forwardMessage(userChat[msg.from.id], msg.chat.id,msg.message_id)
}

if(text === "Написати учаснику"){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll1 = client.db('artem-school').collection('classrooms');
    const filter1 = {_id: userClass[msg.from.id]};
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
    
    let conArr = [...result2,...result];
        let arr = [];
        userAction[msg.from.id] = {users:[...conArr]};
        lastUserMessage[msg.from.id] = "Написати учаснику";
        for(let i = 0; i< conArr.length;i++){
            if(conArr[i].id !== msg.from.id){
                arr = [[bot.inlineButton(`${conArr[i].name}`, {callback: `${conArr[i]._id}`})],...arr]
            }
        };
    let replyMarkup = bot.inlineKeyboard(arr);

    return bot.sendMessage(msg.chat.id,`Виберіть кому ви хочете написати:`, {replyMarkup});

}
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
        const filter1 = {_id: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        await client.close();
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
        const filter1 = {_id: userClass[msg.from.id]};
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
                        ["Матеріали", "Події"],
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
        const filter1 = {_id: userClass[msg.from.id]};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        await client.close();
        console.log(userStatus[msg.from.id]  ?  {idT: userClass[msg.from.id]} : {idS: userClass[msg.from.id]})
        if(result1[0]){
            console.log(result1[0].materials || !result1[0].materials[0])
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
        const filter1 = {_id: userClass[msg.from.id]};
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
    if(text === "Учасники" && userAction[msg.from.id] === undefined){
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
        const coll = client.db('artem-school').collection('users');
        const filter = {classId: userClass[msg.from.id]};
        const cursor = coll.find(filter);
        const result = await cursor.toArray();
        await client.close();
        
        let conArr = [...result];
        let msgRep = ``;
        for(let i = 0; i<conArr.length;i++){
            msgRep+= `<code>${conArr[i].id}</code> - це ${conArr[i].name} та ${conArr[i].role ? "вчитель" : "учень"}\n`;
        }

        return  await bot.sendMessage(msg.chat.id, msgRep,{parseMode: 'html'});

    }

}
if(lastUserMessage[msg.from.id] === "Завантаження файлів для урокуГА"){
userAction[msg.from.id] = {...userAction[msg.from.id],file:[{msgId:msg.message_id , chatId:msg.from.id},...userAction[msg.from.id].file]}
}else if(text === "Це всі файли уроку"){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    // const coll = client.db('artem-school').collection('users');
    // const filter = {id: msg.from.id};
    // const cursor = coll.find(filter);
    // const result = await cursor.toArray();


    const coll1 = client.db('artem-school').collection('lessons');
            const file = {file : userAction[msg.from.id].file}
            console.log(result1)
            await coll1.updateOne(
                {_id: new ObjectId(userAction[msg.from.id]._id)},
                {
                  $set: { ...file},
                  $currentDate: { lastModified: true }
                }
             )
            await client.close();
            lastUserMessage[msg.from.id] = "textФайл";
            userAction[msg.from.id] = undefined;
            if(userStatus[msg.from.id]){
                return await bot.sendMessage(msg.chat.id, 'Файл додано', {replyMarkup});
            }else if(userStatus[msg.from.id] === 0){
                let replyMarkup = bot.keyboard([
                    ["Щоденик","Події","Учасники"],
                    ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                    ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                    ["Матеріали", "Події"],
                    ["Написати учаснику","Класи"]
                ], {resize: true});
                return await bot.sendMessage(msg.chat.id, 'Файл додано', {replyMarkup});
            }
    return await bot.sendMessage(msg.chat.id, 'Файл додано');
}
if(text === "Розклад"){
    lastUserMessage[msg.from.id] = "Розклад";
    let arrBtn = () => {
        let arr = [];
        for(let i = 0; i< getWeeks().length;i++){
            arr = [[bot.inlineButton(`${getWeeks()[i][4]} - ${getWeeks()[i][0]}`, {callback: `${i}`})],...arr]
        };
        return arr;
    };
    let replyMarkup = bot.inlineKeyboard(arrBtn());
    return bot.sendMessage(msg.from.id, `Виберіть навчальний тиждень:`, {replyMarkup})
}
if(text === "Файли уроку"){
    lastUserMessage[msg.from.id] = "Файли уроку";
    let arrBtn = () => {
        let arr = [];
        for(let i = 0; i< getWeeks().length;i++){
            arr = [[bot.inlineButton(`${getWeeks()[i][4]} - ${getWeeks()[i][0]}`, {callback: `${i}`})],...arr]
        };
        return arr;
    };
    let replyMarkup = bot.inlineKeyboard(arrBtn());
    return bot.sendMessage(msg.from.id, `Виберіть навчальний тиждень:`, {replyMarkup})
}
if(text === "Завантаження файлів для уроку"){
    lastUserMessage[msg.from.id] = "Завантаження файлів для уроку";
    let arrBtn = () => {
        let arr = [];
        for(let i = 0; i< getWeeks().length;i++){
            arr = [[bot.inlineButton(`${getWeeks()[i][4]} - ${getWeeks()[i][0]}`, {callback: `${i}`})],...arr]
        };
        return arr;
    };
    let replyMarkup = bot.inlineKeyboard(arrBtn());
    return bot.sendMessage(msg.from.id, `Виберіть навчальний тиждень:`, {replyMarkup})
}
if(text === "Д/з"){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
        );
    const coll = client.db('artem-school').collection('homework');
    const cursor = coll.find({id:userClass[msg.from.id]});
    const result = await cursor.toArray();
    await client.close();
    let arrNew = [];

    for(let i =0; i<result.length;i++){
        arrNew = [[
            bot.inlineButton(result[i].name, {callback: `${result[i]._id}`}),
        ],...arrNew]
    }
    let replyMarkup = bot.inlineKeyboard(arrNew);
    userAction[msg.from.id] = {task:result};
    lastUserMessage[msg.from.id] = "Д/з";
    return bot.sendMessage(msg.chat.id, `Виберіть домашнє завдання:`, {replyMarkup});
}

if(userStatus[msg.from.id]){
    if(lastUserMessage[msg.from.id] === "РозкладТижденьЗадати"){
        userAction[msg.from.id] = {...userAction[msg.from.id], text:text};
        lastUserMessage[msg.from.id] = "РозкладТижденьЗадатиДату"
        return bot.sendMessage(msg.from.id, "Вкажіть час уроку у форматі гг:хх-гг:хх(приклад 08:30-9:15):");
    }else if(lastUserMessage[msg.from.id] === "РозкладТижденьЗадатиДату"){
    if(isValidFormat(text)){
        let replyMarkup = bot.inlineKeyboard([[bot.inlineButton(`Створити урок на Зустрічі`, {callback: `Зустріч`})],[bot.inlineButton(`Своє посилання на урок`, {callback: `Своє`})],[bot.inlineButton(`Зустрічі не буде`, {callback: `Немає`})]]);
        userAction[msg.from.id] = {...userAction[msg.from.id], time:text};
        return bot.sendMessage(msg.from.id, "Чи буде у вас зучтріч\nЯкщо вибрати Зустріч, то буде збиратися статистика та автоматично генерується Зустріч, але додаток в бета тесті",{replyMarkup})
    }else{
        return bot.sendMessage(msg.from.id, "Неправильно вказаний формат часу, напишіть у форматі гг:хх-гг:хх(приклад 08:30-9:15)")
    }
    }else if(lastUserMessage[msg.from.id] ==="Своє"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('lessons');
        const result1 = await coll.insertOne({classId: userClass[msg.from.id], ...userAction[msg.from.id], meet:text});
        await client.close();
          await bot.sendMessage(msg.from.id, "Подія в розкладі")
    }
    if(text === "Задати д/з"){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = "Задати д/з";
        userAction[msg.from.id] = {id:"",name:"",task:[],date:"", time:"",teacher:msg.from.first_name, status:0};
        return bot.sendMessage(msg.chat.id, `Напишіть назву домашнього завдання`, {replyMarkup});
    }else if(text === "Це всі файли" && lastUserMessage[msg.from.id] === "Задати д/з" && userAction[msg.from.id].name && userAction[msg.from.id].task.length && !userAction[msg.from.id].date && !userAction[msg.from.id].time && userAction[msg.from.id].status){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        userAction[msg.from.id] = {id:"",name:userAction[msg.from.id].name,task:userAction[msg.from.id].task,date:"", time:"",teacher:userAction[msg.from.id].teacher, status:0};
        console.log(userAction[msg.from.id])
        return bot.sendMessage(msg.chat.id, `Тепер надішліть до котрого числа потрібно надіслати домашнє завдання у форматі дд:мм:рррр`,{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Задати д/з" && userAction[msg.from.id].name && !userAction[msg.from.id].date && !userAction[msg.from.id].time && userAction[msg.from.id].status){
        userAction[msg.from.id] = {id:"",name:userAction[msg.from.id].name,task:[{chatId: msg.from.id,msgId:msg.message_id },...userAction[msg.from.id].task],date:"", time:"",teacher:userAction[msg.from.id].teacher, status:1};
        console.log(userAction[msg.from.id])
        return null;
    }else if(lastUserMessage[msg.from.id] === "Задати д/з" && !userAction[msg.from.id].name && !userAction[msg.from.id].task.length && !userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].status){
        let replyMarkup = bot.keyboard([
            ["Це всі файли"],
            ["Назад"],
        ], {resize: true});
        userAction[msg.from.id] = {id:"",name:text,task:[],date:"", time:"",teacher:userAction[msg.from.id].teacher, status:1};
        return bot.sendMessage(msg.chat.id, `Надішліть всі файли домашнього завдання та тексти\nТобто напишіть все що потрібно для цього д/з(фото завдань, текст завдань, аудіо та подібне)\nПісля того як надіслали всі файли натисніть на "Це всі файли"`,{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Задати д/з" && userAction[msg.from.id].name && userAction[msg.from.id].task.length && !userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].status){
        userAction[msg.from.id] = {id:"",name:userAction[msg.from.id].name,task:userAction[msg.from.id].task,date:text, time:"",teacher:userAction[msg.from.id].teacher, status:0};
        return bot.sendMessage(msg.chat.id, `Надішліть час здачі у форматі гг:хх`);
    }else if(lastUserMessage[msg.from.id] === "Задати д/з" && userAction[msg.from.id].name && userAction[msg.from.id].task.length && userAction[msg.from.id].date && !userAction[msg.from.id].time && !userAction[msg.from.id].status){
            userAction[msg.from.id] = {type:0,whoMade:[],name:userAction[msg.from.id].name,task:userAction[msg.from.id].task,date:userAction[msg.from.id].date, time:text,teacher:userAction[msg.from.id].teacher};
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
                );                
            const coll1 = client.db('artem-school').collection('homework');
            // const filter1 = {idT: userClass[msg.from.id]} 
            const result1 = await coll1.insertOne({...userAction[msg.from.id],id:userClass[msg.from.id],type:0,tchId:msg.from.id});
            // const result1 = await cursor1.toArray();
            // const homework = {homework : [...result1[0].homework, {task:userAction[msg.from.id],whoMade:[]}]}
            // console.log(result1)
            // await coll1.updateOne(
            //     {_id: new ObjectId(result1[0]._id)},
            //     {
            //       $set: { ...homework},
            //       $currentDate: { lastModified: true }
            //     }
            //  )
            await client.close();
            lastUserMessage[msg.from.id] === "Зада";
            userAction[msg.from.id] = undefined;
            return await bot.sendMessage(msg.chat.id, `Домашнє завдання успішно створене`,{replyMarkup});
    }
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

        const coll = client.db('artem-school').collection('users');
        const filter = {classId: userClass[msg.from.id]};
        const cursor = coll.find(filter);
        const result = await cursor.toArray();;
        await client.close();

        for(let i = 0; i<result.length;i++){
            if(result[i].id !== msg.from.id){
                await bot.sendMessage(result[i].id, `У вас нове оголошення від ${msg.from.first_name}:\n${text}`);
            }
        }

        if(userStatus[msg.from.id]){
            lastUserMessage[msg.from.id] = "оголошення зроблене";
            return  await bot.sendMessage(msg.from.id, `Оголошення надіслане`, {replyMarkup});
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
        const filter1 = {_id: userClass[msg.from.id]};
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
                        ["Матеріали", "Події"],
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
        const filter1 = {_id: userClass[msg.from.id]}
        console.log(userClass[msg.from.id])
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        console.log(result1)
                const materials = {materials : [...result1[0].materials, {chatID:msg.chat.id, msgID:msg.message_id}]}
                await coll1.updateOne(
                    {_id: new ObjectId(result1[0]._id)},
                    {
                      $set: { ...materials},
                      $currentDate: { lastModified: true }
                    }
                 )
                await client.close();
                lastUserMessage[msg.from.id] = "textФайл";
                return await bot.sendMessage(msg.chat.id, 'Матеріал додано', {replyMarkup});
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
    const filter1 = {_id: userClass[msg.from.id]}
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
    const filter1 = {_id: userClass[msg.from.id]}
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
    if(text === "Здати д/з"){
        // let replyMarkup = bot.keyboard([
        //     ["Назад"],
        // ], {resize: true});
        lastUserMessage[msg.from.id] = "Здати д/з";
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
            );
        const coll = client.db('artem-school').collection('homework');
        const cursor = coll.find({id: userClass[msg.from.id]});
        const result = await cursor.toArray();

        let arrNew = [];

        for(let i =0; i<result.length;i++){
            arrNew = [[
                bot.inlineButton(result[i].name, {callback: result[i]._id}),
            ],...arrNew]
        }
        let replyMarkup = bot.inlineKeyboard(arrNew);
        userAction[msg.from.id] = {task:result,typeHm:true};
        lastUserMessage[msg.from.id] = "Здати д/з";
        return bot.sendMessage(msg.chat.id, `Виберіть домашнє завдання:`, {replyMarkup});
    }
    if(text === "Це всі файли" && lastUserMessage[msg.from.id] === "Здати д/з" && userAction[msg.from.id].status ){
        let replyMarkup = bot.keyboard([
            ["Щоденик","Події","Учасники"],
            ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
            ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
            ["Матеріали", "Події"],
            ["Написати учаснику","Класи"]
        ], {resize: true});
        console.log(userAction[msg.from.id])
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
            );
        const coll1 = client.db('artem-school').collection('homework');
        const filter1 = {_id: new ObjectId(userAction[msg.from.id].id)};
        const cursor1 = coll1.find(filter1);
        const result1 = await cursor1.toArray();
        moment.tz.setDefault('Europe/Kiev');
        // Отримуємо поточну дату та час в Україні
        const currentDateInUkraine = moment().format('YYYY-MM-DD');
console.log(result1[0])
        // Отримуємо поточний час в Україні без секунд
        const currentTimeInUkraine = moment().format('HH:mm');
        const whoMade = {whoMade : [...result1[0].whoMade, {files:userAction[msg.from.id].files, who:msg.from.first_name, id:msg.from.id,date: currentDateInUkraine, time:currentTimeInUkraine}]}
        console.log(result1)
        await coll1.updateOne(
            {_id: result1[0]._id},
            {
              $set: { ...whoMade},
              $currentDate: { lastModified: true }
            }
         )
        await client.close();
        await bot.sendMessage(userAction[msg.from.id].teach, `Вам була надіслана відповідь на домашнє завдання від ${msg.from.first_name}\nЗадане дз:`);
        for(let i = 0; i<userAction[msg.from.id].hm.length;i++){
            await bot.forwardMessage(userAction[msg.from.id].teach,userAction[msg.from.id].hm[i].chatId,userAction[msg.from.id].hm[i].msgId);
        };
        await bot.sendMessage(userAction[msg.from.id].teach, `Відповідь:`);
        for(let i = 0; i<userAction[msg.from.id].files.length;i++){
            await bot.forwardMessage(userAction[msg.from.id].teach,userAction[msg.from.id].files[i].chatId,userAction[msg.from.id].files[i].msgId);
        };
        lastUserMessage[msg.from.id] = "Зд"; 
        userAction[msg.from.id] = undefined;
        return await bot.sendMessage(msg.chat.id, `Відповідь була надіслана`,{replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Здати д/з" && userAction[msg.from.id].status){
        userAction[msg.from.id] = {...userAction[msg.from.id],files:[{chatId: msg.from.id,msgId:msg.message_id },...userAction[msg.from.id].files]};
        console.log(userAction[msg.from.id])
        return null;
    }else{
        return null;
    }
}
});

bot.on('/start', async msg => {
    lastUserMessage[msg.from.id] = msg.text;
    console.log(msg.text.split(" ")[1])
    let replyMarkup = bot.keyboard([
        ['Створити клас'],
        ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
    ], {resize: true});
if(msg.text.split(" ")[1]){
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('artem-school').collection('classrooms');
            const filter = {idS: msg.text.split(" ")[1]};
            const cursor = coll.find(filter);
            const result = await cursor.toArray();
            console.log(result)
            if(result[0]){
                let replyMarkup = bot.keyboard([
                    ["Щоденик","Події","Учасники"],
                    ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                    ["Файли", "Завантаження файла","Д/з", "Здати д/з"],
                    ["Матеріали", "Події"],
                    ["Написати учаснику","Класи"]
                ], {resize: true});
                const coll2 = client.db('artem-school').collection('users');
                const result2 = await coll2.insertOne({nameC: result[0].name, name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:0, classId: `${result[0]._id}`})
                 await client.close();
                 lastUserMessage[msg.from.id] = msg.text;
                 userStatus[msg.from.id] = 0;
                 userClass[msg.from.id] = `${result[0]._id}`;
                 return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {replyMarkup});
            }else{
                let replyMarkup = bot.keyboard([
                    ["Журнал","Статистика","Учасники"],
                    ["Розклад","Файли уроку", "Завантаження файлів для уроку"],
                    ["Матеріали","Cтворення матеріалу","Д/з", "Задати д/з"],
                    ["Файли", "Завантаження файла","Події","Створення події"],
                    ["Написати учаснику","Зробити оголошення","Класи"]
                ], {resize: true});
                const coll = client.db('artem-school').collection('classrooms');
                        const filter = {_id: msg.text.split(" ")[1]};
                        const cursor = coll.find(filter);
                        const result = await cursor.toArray();
                        if(result[0]){
                            const coll2 = client.db('artem-school').collection('users');
                            const result2 = await coll2.insertOne({nameC: result[0].name,name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: `${result[0]._id}`})
                             await client.close();
                             lastUserMessage[msg.from.id] = msg.text;
                             userStatus[msg.from.id] = 1;
                             userClass[msg.from.id] = `${result[0]._id}`;
                             return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {replyMarkup});
                }else{
                            await client.close();
                            return await bot.sendMessage(msg.from.id, `Ви вели неправильний id класу, натисніть на /start та використайте id для доєднанання або попросіть правильне посилання!`);
                } 
            }  
    

}else{
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
}

});





bot.on('callbackQuery', async msg => {
    console.log(msg.data)
    if(lastUserMessage[msg.from.id] === "Розклад" || lastUserMessage[msg.from.id] ===  "Файли уроку" || lastUserMessage[msg.from.id] === "Завантаження файлів для уроку"){
            userAction[msg.from.id] = {week:parseInt(msg.data)};
            if(lastUserMessage[msg.from.id] === "Розклад"){
                lastUserMessage[msg.from.id] = "РозкладТиждень";
            }else if(lastUserMessage[msg.from.id] === "Завантаження файлів для уроку"){
                lastUserMessage[msg.from.id] = "Завантаження файлів для урокуА";
            }else{
                lastUserMessage[msg.from.id] = "Файли урокуТа";
            }
        let arrBtn = () => {
            let arr = [];
            for(let i = 0; i< getWeeks()[parseInt(msg.data)].length;i++){
                arr = [[bot.inlineButton(`${getWeeks()[parseInt(msg.data)][i]}`, {callback: `${i}`})],...arr]
            };
            return arr;
        };
        let replyMarkup = bot.inlineKeyboard(arrBtn());
        bot.sendMessage(msg.from.id, `Виберіть навчальний день:`, {replyMarkup})
    }else if(lastUserMessage[msg.from.id] === "РозкладТиждень" || lastUserMessage[msg.from.id] ===  "Файли урокуТа" || lastUserMessage[msg.from.id] === "Завантаження файлів для урокуА"){
        if(msg.data === "Створити урок"){
            lastUserMessage[msg.from.id] = "РозкладТижденьЗадати";
            bot.sendMessage(msg.from.id, "Опис/завдання уроку:")
        }else if(lastUserMessage[msg.from.id] === "Завантаження файлів для урокуА"){
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            const coll = client.db('artem-school').collection('lessons');
                    const filter = {classId:userClass[msg.from.id],day:getWeeks()[userAction[msg.from.id].week][parseInt(msg.data)]};
                    const cursor = coll.find(filter);
                    const result = await cursor.toArray();
                    userAction[msg.from.id] = result;
                    await client.close();
                    if(result.length){
                        let newArr = [];
                        for(let i = 0; i< sortTimes(result).length;i++){
                            newArr =[...newArr,result[i].time]
                        };
                        let arrBtn = () => {
                            let arr = [];
                            for(let i = 0; i< sortTimes(result).length;i++){
                                arr = [[bot.inlineButton(`${sortTimes(newArr)[i]}`, {callback: sortTimes(newArr)[i]})],...arr]
                            };
                            return arr;
                        };
                        lastUserMessage[msg.from.id] = "Завантаження файлів для урокуГА"
                        let replyMarkup = bot.inlineKeyboard(arrBtn());
                        await bot.sendMessage(msg.from.id, "Виберіть годину:", {replyMarkup})
                    }else{
                        bot.sendMessage(msg.from.id, "Сьгодні нічого немає")
                    }
        }else if(lastUserMessage[msg.from.id] ===  "Файли урокуТа"){
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            const coll = client.db('artem-school').collection('lessons');
                    const filter = {classId:userClass[msg.from.id],day:getWeeks()[userAction[msg.from.id].week][parseInt(msg.data)]};
                    const cursor = coll.find(filter);
                    const result = await cursor.toArray();
                    userAction[msg.from.id] = result;
                    await client.close();
                    if(result.length){
                        let newArr = [];
                        for(let i = 0; i< sortTimes(result).length;i++){
                            newArr =[...newArr,result[i].time]
                        };
                        let arrBtn = () => {
                            let arr = [];
                            for(let i = 0; i< sortTimes(result).length;i++){
                                arr = [[bot.inlineButton(`${sortTimes(newArr)[i]}`, {callback: sortTimes(newArr)[i]})],...arr]
                            };
                            return arr;
                        };
                        lastUserMessage[msg.from.id] = "Файли урокуТ"
                        let replyMarkup = bot.inlineKeyboard(arrBtn());
                        await bot.sendMessage(msg.from.id, "Виберіть годину:", {replyMarkup})
                    }else{
                        bot.sendMessage(msg.from.id, "Сьгодні нічого немає")
                    }
        }else if(msg.data === `Уроки сьогодні`){
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            const coll = client.db('artem-school').collection('lessons');
                    const filter = {classId:userClass[msg.from.id],day:userAction[msg.from.id].day};
                    const cursor = coll.find(filter);
                    const result = await cursor.toArray();
                    await client.close();
                    userAction[msg.from.id] = result;
                    if(result.length){
                        let newArr = [];
                        for(let i = 0; i< sortTimes(result).length;i++){
                            newArr =[...newArr,result[i].time]
                        };
                        let arrBtn = () => {
                            let arr = [];
                            for(let i = 0; i< sortTimes(result).length;i++){
                                arr = [[bot.inlineButton(`${sortTimes(newArr)[i]}`, {callback: sortTimes(newArr)[i]})],...arr]
                            };
                            return arr;
                        };
                        lastUserMessage[msg.from.id] = "dayChoose"
                        let replyMarkup = bot.inlineKeyboard(arrBtn());
                        await bot.sendMessage(msg.from.id, "Виберіть годину:", {replyMarkup})
                    }else{
                        bot.sendMessage(msg.from.id, "Сьгодні нічого немає")
                    }
        }else if(userStatus[msg.from.id]){
            userAction[msg.from.id] = {...userAction[msg.from.id], day:getWeeks()[userAction[msg.from.id].week][parseInt(msg.data)], file:[]};
            let replyMarkup = bot.inlineKeyboard([[bot.inlineButton(`Створити урок`, {callback: `Створити урок`})],[bot.inlineButton(`Уроки сьогодні`, {callback: `Уроки сьогодні`})]]);
            bot.sendMessage(msg.from.id, `Виберіть:`, {replyMarkup})
        }else {
            const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            const coll = client.db('artem-school').collection('lessons');
                    const filter = {classId:userClass[msg.from.id],day:getWeeks()[userAction[msg.from.id].week][parseInt(msg.data)]};
                    const cursor = coll.find(filter);
                    const result = await cursor.toArray();
                    userAction[msg.from.id] = result;
                    await client.close();
                    if(result.length){
                        let newArr = [];
                        for(let i = 0; i< sortTimes(result).length;i++){
                            newArr =[...newArr,result[i].time]
                        };
                        let arrBtn = () => {
                            let arr = [];
                            for(let i = 0; i< sortTimes(result).length;i++){
                                arr = [[bot.inlineButton(`${sortTimes(newArr)[i]}`, {callback: sortTimes(newArr)[i]})],...arr]
                            };
                            return arr;
                        };
                        lastUserMessage[msg.from.id] = lastUserMessage[msg.from.id] === "Файли урокуТра" ? "Файли урокуТ": "dayChoose";
                        let replyMarkup = bot.inlineKeyboard(arrBtn());
                        await bot.sendMessage(msg.from.id, "Виберіть годину:", {replyMarkup})
                    }else{
                        bot.sendMessage(msg.from.id, "Нічого немає")
                    }
        }
    }else if(lastUserMessage[msg.from.id] === "dayChoose" || lastUserMessage[msg.from.id] ===  "Файли урокуТ" || lastUserMessage[msg.from.id] === "Завантаження файлів для урокуГА"){
        let newUs = userAction[msg.from.id].filter((arr) => arr.time === msg.data);
        
        if(lastUserMessage[msg.from.id] === "Завантаження файлів для урокуГА"){
            userAction[msg.from.id] = newUs[0];
            let replyMarkup = bot.keyboard([
                ["Це всі файли уроку"]
            ], {resize: true});
            bot.sendMessage(msg.from.id, "Надішліть файли для завантаження",{replyMarkup})
        }else if(lastUserMessage[msg.from.id] ===  "Файли урокуТ"){
        if(newUs[0].file.length){
            for(let i = 0; i<newUs[0].file.length;i++){
                await bot.forwardMessage(msg.from.id,newUs[0].file[i].chatId,newUs[0].file[i].msgId)
            }
        }else{
            await bot.sendMessage(msg.from.id, "Немає файлів")
        }
        userAction[msg.from.id] = undefined;
        lastUserMessage[msg.from.id] ="fdsfsdfsdf";
    }else if(newUs[0]?.idmeet){
        bot.sendMessage(msg.from.id, `${newUs[0].time} ${newUs[0].day}
        
        ${newUs[0].text}
        
        Посилання, щоб долучитися до конференції у Зустрічі:
        Ви можете зайти нас сайт zustrich.artemissssss.de та долучитися, за допомогою Id зустрічі <code>/join/${newUs[0].idmeet}</code>.
        Або перейдіть за посиланням https://zustrich.artemissssss.de/join/${newUs[0].idmeet}.`,{parseMode:'html'});
        userAction[msg.from.id] = undefined;
        lastUserMessage[msg.from.id] ="fdsfsdfsdf";
    }else if(newUs[0]?.meet === false){
        bot.sendMessage(msg.from.id, `${newUs[0].time} ${newUs[0].day}
        
        ${newUs[0].text}
        
        Зучтрічі немає.`);
        userAction[msg.from.id] = undefined;
        lastUserMessage[msg.from.id] ="fdsfsdfsdf";
    }else{
        bot.sendMessage(msg.from.id, `${newUs[0].time} ${newUs[0].day}
        
        ${newUs[0].text}
        
        ${newUs[0].meet}`,{parseMode:'html'});
        userAction[msg.from.id] = undefined;
        lastUserMessage[msg.from.id] ="fdsfsdfsdf";
    }

}else if(msg.data ==="Зустріч"){
    await fetch("https://artem-school-api.onrender.com/api/zustrich", {
        method: 'POST', // Метод запиту (GET, POST, PUT, DELETE тощо)
        headers: {
            'Content-Type': 'application/json', // Заголовок запиту
            // Інші заголовки, якщо потрібно
        },
                body:JSON.stringify({type:1, time:userAction[msg.from.id].time, date:userAction[msg.from.id].date})    
                // Тіло запиту, якщо потрібно передати дані
                // body: JSON.stringify({ key: 'value' }),
            }).then(response => {
                return response.json(); // Повернути відповідь у форматі JSON
            })
            .then(async data => {
                // Обробка отриманих даних
                console.log(data);
                await bot.sendMessage(msg.from.id, `Посилання, щоб долучитися до конференції на період ${userAction[msg.from.id].time} ${userAction[msg.from.id].date} у Зустрічі:
Ви можете зайти нас сайт zustrich.artemissssss.de та долучитися, за допомогою Id зустрічі <code>/join/${data.idRoom}</code>.
Або перейдіть за посиланням https://zustrich.artemissssss.de/join/${data.idRoom}.`,{parseMode:"html"});
lastUserMessage[msg.from.id] = data.idRoom;
              });
            const client = await MongoClient.connect(
              `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
              { useNewUrlParser: true, useUnifiedTopology: true }
          );
          const coll = client.db('artem-school').collection('lessons');
          const result1 = await coll.insertOne({classId: userClass[msg.from.id], idmeet:lastUserMessage[msg.from.id], ...userAction[msg.from.id]});
          await client.close();
            await bot.sendMessage(msg.from.id, "Зустріч створена та подія в розкладі")
    }else if(msg.data==="Своє"){
        lastUserMessage[msg.from.id] = "Своє";
        bot.sendMessage(msg.from.id, "Надішлість своє посилання:");
    }else if(msg.data==="Немає"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('lessons');
        const result1 = await coll.insertOne({classId: userClass[msg.from.id],...userAction[msg.from.id], meet:false});
        await client.close();
          await bot.sendMessage(msg.from.id, "Подія створена")
    }
    if(lastUserMessage[msg.from.id] === "Д/з" && userStatus[msg.from.id] === 0){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === msg.data);
        console.log(userAction[msg.from.id],msg.data, newArr)
        if(!newArr[0].type){
            userAction[msg.from.id] = undefined;
            lastUserMessage[msg.from.id] = "fgfds";
            await bot.sendMessage(msg.from.id, "Завдання:");
            for(let i = 0; i<newArr[0].task.length;i++){
                 await bot.forwardMessage(msg.from.id,newArr[0].task[i].chatId,newArr[0].task[i].msgId);
            }
        }else{
            await bot.sendMessage(msg.from.id, "Це д/з тест");
        }
        await bot.sendMessage(msg.from.id, `Завдання потрібно виконати до ${newArr[0].time} ${newArr[0].date}`)

    }
    if(lastUserMessage[msg.from.id] === "Д/з" && userStatus[msg.from.id]){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === msg.data);
        console.log(userAction[msg.from.id],msg.data, newArr)
        userAction[msg.from.id] = {...userAction[msg.from.id],_id:msg.data}
        if(!newArr[0].type){
            let replyMarkup = bot.inlineKeyboard([[
                bot.inlineButton("Завдання", {callback: "Завдання"}),
            ],
            [
                bot.inlineButton("Хто виконав", {callback: "Хто виконав"}),
            ]]);
            bot.sendMessage(msg.from.id, "Виберіть дію:",{replyMarkup})
            lastUserMessage[msg.from.id] = "fgfds";
        }
    }
if(lastUserMessage[msg.from.id] === "Написати учаснику"){
    let newArr = userAction[msg.from.id].users.filter(arr => `${arr._id}` === msg.data);
    userChat[msg.from.id] = newArr[0].id;
    let replyMarkup = bot.keyboard([
        ["Назад"]
    ], {resize: true});
    bot.sendMessage(msg.from.id, `Тепер всі наступні повідомлення надсилаються ${newArr[0].name}\nЩоб зупинити відправку повідомлень цьому користувачу натисніть Назад`,{replyMarkup})
}
 
    if(msg.data === "Завдання"){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === userAction[msg.from.id]._id);
        console.log(userAction[msg.from.id],msg.data, newArr)
        if(!newArr[0].type){
            userAction[msg.from.id] = undefined;
            lastUserMessage[msg.from.id] = "fgfds";
            await bot.sendMessage(msg.from.id, "Завдання:");
            for(let i = 0; i<newArr[0].task.length;i++){
                 await bot.forwardMessage(msg.from.id,newArr[0].task[i].chatId,newArr[0].task[i].msgId);
            }
        }else{
            await bot.sendMessage(msg.from.id, "Це д/з тест");
        }
        await bot.sendMessage(msg.from.id, `Завдання потрібно виконати до ${newArr[0].time} ${newArr[0].date}`)
    }else if(msg.data === "Хто виконав"){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === userAction[msg.from.id]._id);
        console.log(userAction[msg.from.id],msg.data, newArr)
        userAction[msg.from.id] = {...userAction[msg.from.id], idSTHM:true};
        let arrNew  = [];
        if(newArr[0].whoMade.length >0){
            for(let i =0; i<newArr[0].whoMade.length;i++){
                arrNew = [[
                    bot.inlineButton(newArr[0].whoMade[i].who, {callback: newArr[0].whoMade[i].id}),
                ],...arrNew]
            }
            let replyMarkup = bot.inlineKeyboard(arrNew);
            bot.sendMessage(msg.from.id, `Виберіть учня для перевірки д/з`,{replyMarkup});
        }else{
            userAction[msg.from.id] = undefined;
            bot.sendMessage(msg.from.id, `Ніхто не виконав д/з`)
        }
    }else if(userAction[msg.from.id]?.idSTHM){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === userAction[msg.from.id]._id)[0].whoMade.filter(arr => `${arr.id}` === msg.data);
        console.log(userAction[msg.from.id],msg.data, newArr)
            userAction[msg.from.id] = undefined;
            lastUserMessage[msg.from.id] = "fgfds";
            for(let i = 0; i<newArr[0].files.length;i++){
                 await bot.forwardMessage(msg.from.id,newArr[0].files[i].chatId,newArr[0].files[i].msgId);
            }
            await bot.sendMessage(msg.from.id,`Робота була надіслана о ${newArr[0].time} ${newArr[0].date}`)
    }
    if(userAction[msg.from.id] !== undefined && userAction[msg.from.id][userAction[msg.from.id].length-1]?.act){
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
                ["Матеріали", "Події"],
                ["Написати учаснику","Класи"]
            ], {resize: true});
            bot.sendMessage(msg.from.id,`Ви успішно увійшли в кімнату ${newArr[0].name}`,{replyMarkup})
        }

    }else if(userAction[msg.from.id]?.typeHm){
        let newArr = userAction[msg.from.id].task.filter(arr => `${arr._id}` === msg.data);
        console.log(userAction[msg.from.id],msg.data, newArr)
        if(!newArr[0].type){
            let replyMarkup = bot.keyboard([
                ["Це всі файли"],
                ["Назад"],
            ], {resize: true});
            userAction[msg.from.id] = {id:`${newArr[0]._id}`,teach:newArr[0].tchId,typeHMUP:1,files:[],status:1, hm:newArr[0].task};
            await bot.sendMessage(msg.from.id, "Завдання:");
            for(let i = 0; i<newArr[0].task.length;i++){
                 await bot.forwardMessage(msg.from.id,newArr[0].task[i].chatId,newArr[0].task[i].msgId);
            }
            await bot.sendMessage(msg.from.id, "Надішліть текст/файли/зображення вирішення дз",{replyMarkup});
        }
    }
    return bot.answerCallbackQuery(msg.from.id, `Inline button callback: ${ msg.data }`, true);
});
bot.on(/^\/gpt (.+)$/, async (msg, props) =>{
    console.log(props.match[1]);
    try{
        await fetch("https://artem-school-api.onrender.com/api/gpt", {
            method: 'POST', // Метод запиту (GET, POST, PUT, DELETE тощо)
            headers: {
              'Content-Type': 'application/json', // Заголовок запиту
              // Інші заголовки, якщо потрібно
            },
            body:JSON.stringify({text:props.match[1], id:msg.chat.id})    
            // Тіло запиту, якщо потрібно передати дані
            // body: JSON.stringify({ key: 'value' }),
          });
        }catch{
            return bot.sendMessage(msg.from.id, "Помилка")
        }
    // await fetch('https://artem-school-bot.vercel.app/api/ai', {
    //     method: 'POST', // Метод запиту (GET, POST, PUT, DELETE тощо)
    //     headers: {
    //       'Content-Type': 'application/json', // Заголовок запиту
    //       // Інші заголовки, якщо потрібно
    //     },
    //     body:JSON.stringify({ prompt: props.match[1]})
    //     // Тіло запиту, якщо потрібно передати дані
    //     // body: JSON.stringify({ key: 'value' }),
    //   })
        // .then(response => {
        //   return response.json(); // Повернути відповідь у форматі JSON
        // })
        // .then(data => {
        //   // Обробка отриманих даних
        //   console.log(data);
        //   bot.sendMessage(msg.from.id, data.response);
        // })
    //     .catch(error => {
    //       // Обробка помилок
    //       console.error('Виникла помилка:', error);
    //     });
    return null
      
})
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
