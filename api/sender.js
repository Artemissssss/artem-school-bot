import TeleBot from "telebot"

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).end();
    } else {
      if(req.method === "POST"){
        bot.sendMessage(req.body.id, req.body.text)
      }else{
        res.status(403).json({message:"Not for this"})
      }
    }
}
