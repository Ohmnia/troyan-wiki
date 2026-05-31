import { MemoryClient } from "mem0ai";
 
const client = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY ?? "your-api-key-here",
});
 
// Add a memory
const messages = [
  { role: "user", content: "I'm a vegetarian and allergic to nuts." },
  { role: "assistant", content: "Got it! I'll remember your dietary preferences." },
];
await client.add(messages, { user_id: "user123" });
 
// Search memories
const results = await client.search("What are my dietary restrictions?", {
  user_id: "user123",
});
console.log(results);