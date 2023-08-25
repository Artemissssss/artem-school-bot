import TeleBot from "telebot"

import { MongoClient } from 'mongodb';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)



bot.on(["/start","/help"], async msg => {
    let replyMarkup = bot.keyboard([
        [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], {resize: true});
   return await bot.sendMessage(msg.chat.id, `🤖 Привіт! Я ваш особистий навчальний асистент! З моєю допомогою ви зможете легко керувати навчальним процесом. Ось деякі з функцій, які я можу виконувати:
   \n
   🏫 Створення та управління навчальними групами\n
   📚 Посилання на корисні матеріали від викладачів\n
   📌 Важливі контакти та оголошення\n
   📋 Завдання від викладачів та їх здача\n
   📁 Передавання файлів у групі\n
   📝 Створення та виконання тестів\n
   🗓️ Планування подій та зустрічей\n
   📊 Оцінки та відвідуваність уроків\n
   📚 Матеріали для навчання та підсумки уроків\n
   \n
   ...та багато іншого! Просто введіть команду або натисніть на кнопку, щоб розпочати. Я готовий допомогти вам у всьому, пов'язаному з навчанням. Почнімо разом! 🎓\n
    `,{replyMarkup})
});


export default bot

//YsbcVL8dXcW0lAY7