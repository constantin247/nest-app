import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

@Injectable()
export class WSService {
  constructor() { }

  async ChatClient(message: string): Promise<{ message: string, buffer: Buffer }> {
    const response = await this.AIResponse(message);
    const buffer = await this.TextToSpeech(response);
    return {
      message,
      buffer
    };
  }

  private async AIResponse(message: string): Promise<string> {
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o",
      temperature: 0.5,
    });

    const systemTemplate = `
      You are a good listener. Your task is to  respond to the user message with a thoughtful response. 
      The user message is: {user_message} 
      `
    const prompt = ChatPromptTemplate.fromTemplate(systemTemplate);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());


    const response = await chain.invoke({
      user_message: message
    });

    return response;
  };

  private async TextToSpeech(script: string): Promise<Buffer> {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const ttsResponse = await openai.audio.speech.create(
      {
        model: "tts-1",
        voice: "fable",
        input: script,
      }
    );

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    return audioBuffer;
  }


}
