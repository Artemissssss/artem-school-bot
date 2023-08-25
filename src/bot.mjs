import TeleBot from "telebot"
// const openai = require('openai');
// const { MongoClient } = require('mongodb');

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)


bot.on("text", async msg => {
    let replyMarkup = bot.keyboard([
        ['/buttons', '/inlineKeyboard'],
        ['/start', '/hide']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Keyboard example.', {replyMarkup});
});

export default bot

//YsbcVL8dXcW0lAY7