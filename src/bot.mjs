// import { BingChat } from 'bing-chat'
import { ChatBot } from 'bingai-js'
import { conversation_style } from './src/Utility';
export default async function handler(req, res) {
  if(req.method === "POST"){
    try {
      const cookie = process.env.BING_COOKIE
    
      const a = new ChatBot(cookie);
      // // Initialize Bard with your API key
      // const api = new BingChat({
      //   cookie: process.env.BING_COOKIE
      // })
      // // Use the askAI function here
      // const response = await api.sendMessage(req.body.prompt, {
      //   variant: 'Precise',
      //   text: prompt,
      //   // change the variant to 'Creative'
      // })
      
      // // Send the response back as JSON
      // await res.status(200).json({ response: response.text });
        await a.init();
    
    
        /**
        *   balanced : conversation_style.balanced
        *   creative : conversation_style.creative
        *   precise  : conversation_style.precise
        */
       let i = await a.ask(req.body.prompt , conversation_style.balanced)
        console.log(i)
        await res.status(200).json({response:i})
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }else{
    res.status(403).json({message:"Not for this"})
  }
}
