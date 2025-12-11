// src/index.ts
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { Symbol } from './models/Symbol.js';

dotenv.config();

async function main() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
