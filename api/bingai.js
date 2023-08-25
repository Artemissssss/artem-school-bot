import { BingChat } from 'bing-chat'

export default async function handler(req, res) {
  if(req.method === "POST"){
    try {
      // Initialize Bard with your API key
      const api = new BingChat({
        cookie: process.env.BING_COOKIE
      })
      // Use the askAI function here
      const response = await api.sendMessage(req.body.prompt, {
        variant: 'Precise',
        text: prompt,
        // change the variant to 'Creative'
      })
      
      // Send the response back as JSON
      await res.status(200).json({ response: response.text });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }else{
    res.status(403).json({message:"Not for this"})
  }
}
