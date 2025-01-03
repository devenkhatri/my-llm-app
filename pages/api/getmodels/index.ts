import axios from "axios";
import { Console } from "console";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

// const fs = require("fs");
// const output = fs.createWriteStream('./stdout.log');
// const errorOutput = fs.createWriteStream('./stderr.log');
// // custom simple logger
// const logger = new Console (output, errorOutput);
// // use it like console
// const count = 5;
// logger.log('count: %d', count);

export default async function POST(req: Request): Promise<Response> {
  var models = '';
  try {
    const token = process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN;
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        // Authorization: `Bearer ${token}` // Add authorization header from environment variable
      }
    });
    // console.log("response", response)

    if (response.statusText != "OK") {
      throw new Error(`Error: ${response.status}`);
    }
    models = response.data;
    // console.log("****** All Models", models);
  } catch (error: any) {
    console.error('Error:', error.message); // Handle errors
  }

  return new Response(JSON.stringify({ models }), {
    headers: { 'Content-Type': 'application/json' },
  });
}