import TeleBot from "telebot"
// const openai = require('openai');
// const { MongoClient } = require('mongodb');
import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid'

const bot = new TeleBot( {token: process.env.TELEGRAM_BOT_TOKEN,usePlugins: ['askUser']})

bot.on('/start', msg => {
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
    
    ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓`, {ask: 'class',replyMarkup});

});

bot.on('ask.class', async msg => {
console.log(msg.text,msg.text === "Створити клас",msg.text === "Приєднатися в клас, як учень",msg.text === "Приєднатися в клас, як вчитель")
if(msg.text === "Створити клас"){
    let idClass = [nanoid(),nanoid()]
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('artem-school').collection('classrooms');
    const result = await coll.insertOne({idT:idClass[1],idS:idClass[0],files:[],events:[],homework:[],marks:[],lessons:[],statisticks:[],users:[{name:msg.from.name, username:msg.from.username, id:msg.from.id, role:"Вчитель"}]})
    await client.close();
    return await bot.sendMessage(msg.from.id, `Клас успішно створився!
    <code>${idClass[0]}</code> - id для приєднання учня в клас
    <code>${idClass[1]}</code> - id для приєднання вчителя в клас
    `, {ask: 'actiont', parseMode: 'html'});
}else if(msg.text === "Приєднатися в клас, як учень"){
    return await bot.sendMessage(msg.from.id, `Надішліть id учня`, {ask: 'joins'});
}else if(msg.text === "Приєднатися в клас, як вчитель"){
    return await bot.sendMessage(msg.from.id, `Надішліть id вчителя `, {ask: 'joint'});
}else{
    let replyMarkup = bot.keyboard([
        ['Створити клас'],
        ['Приєднатися в клас, як учень', 'Приєднатися в клас, як вчитель']
    ], {resize: true});
    return bot.sendMessage(msg.from.id, `Error`, {ask: 'class',replyMarkup});
}
});

bot.on('ask.joins', async msg => {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('artem-school').collection('classrooms');
            const filter = {idS: msg.text};
            const cursor = coll.find(filter);
            const result = await cursor.toArray();
            if(result[0]){
                const users = {"users": [{name:msg.from.name, username:msg.from.username, id:msg.from.id, role:"Вчитель"},...result[0].users]}
                coll.updateOne(
                    {_id: new ObjectId(id._id)},
                    {
                      $set: { ...users},
                      $currentDate: { lastModified: true }
                    }
                 );
                 await client.close();
                 return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {ask: 'actiont'});
            }else{
                await client.close();
                return await bot.sendMessage(msg.from.id, `Ви вели неправильний id класу`, {ask: 'class'});
            }  
})

bot.on('ask.joint', async msg => {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const coll = client.db('artem-school').collection('classrooms');
            const filter = {idS: msg.text};
            const cursor = coll.find(filter);
            const result = await cursor.toArray();
            if(result[0]){
                const users = {"users": [{name:msg.from.name, username:msg.from.username, id:msg.from.id, role:"Учень"},...result[0].users]}
                coll.updateOne(
                    {_id: new ObjectId(id._id)},
                    {
                      $set: { ...users},
                      $currentDate: { lastModified: true }
                    }
                 );
                 await client.close();
                 return await bot.sendMessage(msg.from.id, `Ви успішно доєдналися до класу`, {ask: 'actions'});
            }else{
                await client.close();
                return await bot.sendMessage(msg.from.id, `Ви вели неправильний id класу`, {ask: 'class'});
            }   
})


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