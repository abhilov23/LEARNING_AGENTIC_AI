import { createAgent } from 'langchain';
import "dotenv/config";

import { ChatOpenAI } from "@langchain/openai";

import { MemorySaver } from "@langchain/langgraph";

const model = new ChatOpenAI({
  model: "meta/llama-3.1-70b-instruct",
  apiKey: process.env.NVIDIA_API_KEY,

  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  },
});



// MEMORY
const memory = new MemorySaver();



// AGENT
const agent = createAgent({
  model: model,
  tools: [],
  checkpointer: memory,
});



// FIRST MESSAGE
await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "My favorite language is Rust",
      },
    ],
  },
  {
    configurable: {
      thread_id: "user-1", // this will create differnet conversational sessions
    },
  }
);



// SECOND MESSAGE
const result = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "What is my favorite language?",
      },
    ],
  },
  {
    configurable: {
      thread_id: "user-1", // accessing the session
    },
  }
);

console.log(result.messages.at(-1)?.content);
