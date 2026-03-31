import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Task } from "../models";
import { taskTemplates } from "./taskTemplates";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eduschool";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  console.log("Clearing existing tasks...");
  await Task.deleteMany({});

  const tasks: any[] = [];

  const VARIANTS_PER_TEMPLATE = 5;

  for (const template of taskTemplates) {
    for (let variant = 0; variant < VARIANTS_PER_TEMPLATE; variant++) {
      const generated = template.generator(variant);
      tasks.push({
        title: generated.title,
        description: generated.description,
        instruction: generated.instruction,
        topic: template.topic,
        difficulty: template.difficulty,
        expectedBlocks: generated.expectedBlocks,
        expectedHtml: generated.expectedHtml,
        availableTags: template.availableTags,
      });
    }
  }

  console.log(`Generated ${tasks.length} tasks. Inserting...`);
  await Task.insertMany(tasks);
  console.log(`Successfully seeded ${tasks.length} tasks.`);

  const topicCounts: Record<string, number> = {};
  for (const t of tasks) {
    topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1;
  }
  console.log("\nTasks per topic:");
  for (const [topic, count] of Object.entries(topicCounts).sort()) {
    console.log(`  ${topic}: ${count}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
