import TeleBot from "telebot"
// const openai = require('openai');
// const { MongoClient } = require('mongodb');


export default async function handler(req, res) {
    const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)
    
    await bot.sendMessage(-1001955166931, `Добраніч!`);
    await res.status(200).json({
        response: "hello"
    });

}

