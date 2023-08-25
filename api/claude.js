
import Claude  from 'claude-ai'; 

export default async function handler(req, res) {
  console.log(req.body.prompt)
  if(req.method === "POST"){
    try {
      // Initialize Bard with your API key
      const claude = new Claude({
        sessionKey: process.env.CLAUDE_SES
      });
      
      await claude.init();
      
      const conversation = await claude.startConversation("hello");
      await conversation.sendMessage(`${req.body.prompt}`,{done:(ress) =>{res.status(200).json({ response: ress.completion });}})
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }else{
    const claude = new Claude({
      sessionKey: process.env.CLAUDE_SES
    });
    
    await claude.init();
    
    const conversation = await claude.startConversation("hello");
    await conversation.sendMessage(`You are provided with a specific text that discusses LGBT+ and heterosexual individuals. Your task is to analyze the text and determine the sentiment expressed towards LGBT+ and heterosexual individuals. Based on the text's portrayal, provide a concise response according to the following criteria:
    If there is no mention of LGBT+ individuals but a negative portrayal of heterosexual individuals is present, return **null true**.
If there is no mention of LGBT+ individuals and a positive or neutral portrayal of heterosexual individuals is present, return **null false**.
If there is a positive or neutral portrayal of LGBT+ individuals but no mention of heterosexual individuals, return **false null**.
If there is a negative portrayal of LGBT+ individuals but no mention of heterosexual individuals, return **true null**.
If there is no mention of both LGBT+ and heterosexual individuals, return **null null**.
If the text contains a positive or neutral portrayal of LGBT+ individuals and a negative portrayal of heterosexual individuals, return **false true**.
If the text contains a negative portrayal of LGBT+ individuals and a positive or neutral portrayal of heterosexual individuals, return **true false**.
If the text contains a positive or neutral portrayal of both LGBT+ and heterosexual individuals, return **false false**.
If the text contains a negative portrayal of both LGBT+ and heterosexual individuals, return **true true**.
Example 1: heterosexuals are bad. Answer **null true**.
Example 2: heterosexuals are cool. Answer **null false**.
Example 3: gays cool. Answer **false null**.
Example 4: gays bad. Answer **true null**.
Example 5: hello. Answer **null null**.
Example 6: gays cool and heterosexuals are bad. Answer **false true**.
Example 7: gays bad and heterosexuals are cool. Answer **true false**.
Example 8: gays cool and heterosexuals are cool. Answer **false false**.
Example 9: gays bad and heterosexuals are bad. Answer **true true**.
Provide a concise response solely based on the given text and the provided criteria. Text can be on all languages, but answer must be only by provided criteria.
Text:'gays cool and heteresexuals bad'
`,{done:(ress) =>{res.status(200).json({ response: ress.completion });}})
    // res.status(403).json({message:"Not for this"})
  }
}
