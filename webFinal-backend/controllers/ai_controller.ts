import { Request, Response } from "express";
import OpenAI from "openai";

export class AiController {
  getAiDescription = async (req: Request, res: Response) => {
    try {
      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: process.env.CHAT_GPT_KEY,
      });

      const completion = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `Provide only a JSON array with three NBA news posts. Each post must have "title", "content". Do not include any explanation, only return raw JSON.`,
          },
        ],
      });

      completion.then((result) => {
        if (result.choices[0].message.content !== null) {
          let content = result.choices[0].message.content;

          // Remove markdown code block formatting if present
          content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");

          try {
            const parsedJson = JSON.parse(content);
            res.status(200).json(parsedJson);
          } catch (error: any) {
            res.status(500).json({ error: "Failed to parse JSON response", details: error.message });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing AI request", error });
    }
  };
}

const aiController = new AiController();

export default aiController;
