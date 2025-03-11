import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: { sender: "user" | "gemini"; text: string }[] } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

   
    const conversationHistory = messages
      .map(msg => `${msg.sender === "user" ? "User" : "Gemini"}: ${msg.text}`)
      .join("\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(conversationHistory);
    const responseText = await result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
