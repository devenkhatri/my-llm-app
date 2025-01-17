import { OpenAI } from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN,
  baseURL: "https://openrouter.ai/api/v1/",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export default async function POST(req: Request): Promise<Response> {
  const { prompt, model } = await req.json();

  const response: any = await openai.chat.completions.create({
    // model: "nousresearch/hermes-3-llama-3.1-405b",
    model: model || "mistralai/mixtral-8x7b-instruct",
    // model: model || "meta-llama/llama-3.3-70b-instruct",
    // model: model || "openai/gpt-4o-2024-11-20",
    // model: model,
    messages: [
      {
        role: "system",
        // content: "You are an AI writing assistant that generates a script based on the provided prompt.",
        content: "You are an AI assistant. Please provide response based on the provided prompt.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  var script = 'No output generated';
  console.log("response", response)

  if(response.error) {
    script = response.error.message;
  } else {
    try {
      script = response.choices[0]?.message?.content!.trim();
    } catch (error: any) {
      script = error.message;
    }
  }

  return new Response(JSON.stringify({ script }), {
    headers: { 'Content-Type': 'application/json' },
  });
}