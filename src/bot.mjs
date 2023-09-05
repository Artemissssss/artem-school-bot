import TeleBot from "telebot"
// const openai = require('openai');
// const { MongoClient } = require('mongodb');
import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid'

const bot = new TeleBot( {token: process.env.TELEGRAM_BOT_TOKEN})
let lastUserMessage = {};
let userStatus = {};
bot.on('/del', async msg => {
    // const markup = updateKeyboard('apples');

    // return bot.sendMessage(
    //     msg.from.id, 'This is a editMessageReplyMarkup example. So, apples or oranges?', {markup}
    // ).then(re => {
    //     // Start updating message
    //     lastMessage = [msg.from.id, re.result.message_id];
    // });
    let replyMarkup = bot.keyboard([
        ["Журнал","Події","Статистика","Розклад"],
        ["Файли", "Видалення файла"],
        ["Матеріали","Cтворення матеріалу"],
        ["Д/з", "Задати д/з"]
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
    const text = msg.text
    let replyMarkup = bot.keyboard([
        ["Журнал","Події","Статистика","Розклад"],
        ["Файли", "Видалення файла"],
        ["Матеріали","Cтворення матеріалу"],
        ["Д/з", "Задати д/з"]
    ], {resize: true});


    console.log(lastUserMessage)
    if(text === "Створити клас" && lastUserMessage[msg.from.id] === "/start"){

        let idClass = [nanoid(),nanoid()]
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('classrooms');
        const result = await coll.insertOne({idT:idClass[1],idS:idClass[0],files:[],events:[],homework:[],marks:[],lessons:[],statisticks:[]})
        const coll2 = client.db('artem-school').collection('users');
        const result2 = await coll2.insertOne({name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: idClass[1]})
        await client.close();
        lastUserMessage[msg.from.id] = text;
        userStatus[msg.from.id] = 1;
        return bot.sendMessage(msg.from.id, `Клас успішно створився!\n<code>${idClass[0]}</code> - id для приєднання учня в клас\n<code>${idClass[1]}</code> - id для приєднання вчителя в клас
        `, { parseMode: 'html',replyMarkup});
    }else if((lastUserMessage[msg.from.id] === "Приєднатися в клас, як вчитель" || lastUserMessage[msg.from.id] === "Приєднатися в клас, як учень") && text === "Назад"){
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
    }else if(text === "Приєднатися в клас, як учень" && lastUserMessage[msg.from.id] === "/start"){
        let replyMarkup = bot.keyboard([
            ["Назад"],
        ], {resize: true});
        lastUserMessage[msg.from.id] = text;
        return  bot.sendMessage(msg.from.id, `Надішліть id учня`, {replyMarkup});
    }else if(lastUserMessage[msg.from.id] === "Приєднатися в клас, як учень"){
        let replyMarkup = bot.keyboard([
            ["Щоденик","Події","Статистика","Розклад"],
            ["Файли", "Видалення файла"],
            ["Матеріали","Cтворення матеріалу"],
            ["Д/з", "Здати д/з"]
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
                    const result2 = await coll2.insertOne({name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:0, classId: result[0].idS})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 0;
                     return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, replyMarkup);
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
                const filter = {idS: msg.text};
                const cursor = coll.find(filter);
                const result = await cursor.toArray();
                if(result[0]){
                    const coll2 = client.db('artem-school').collection('users');
                    const result2 = await coll2.insertOne({name:msg.from.first_name, username:msg.from.username, id:msg.from.id, role:1, classId: result[0].idT})
                     await client.close();
                     lastUserMessage[msg.from.id] = text;
                     userStatus[msg.from.id] = 1;
                     return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, replyMarkup);
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

    if(!userStatus[msg.from.id] && text !== "/start"){
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const coll = client.db('artem-school').collection('users');
        const filter = {id: msg.from.id};
        const cursor = coll.find(filter);
        const result = await cursor.toArray();
        if(result[0]){
            userStatus[msg.from.id] = result[0].role;
        }else{
            console.log(msg)
            // return bot.sendMessage(msg.from.id)
        }
    }

if(userStatus[msg.from.id]){
return null;
}else if(userStatus[msg.from.id] === 0){
return null;
}

})

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

// // Inline button callback
// bot.on('callbackQuery', msg => {
//     // User message alert
//     console.log(msg)
//     bot.sendMessage(msg.from.id,msg.data)
//     return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);
// });

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
