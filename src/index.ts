// src/index.ts
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { Symbol } from './models/Symbol.js';

dotenv.config();

async function main() {
  try {
    await connectDB();

    // Your application logic here
    console.log('Application is running');

    // Example: Create a stock symbol
    const apple = new Symbol({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      market: 'NASDAQ',
      instr: 'Stock',
    });

    await apple.save();
    console.log('✅ Saved:', apple.symbol);

    // Example: Find all symbols
    const symbols = await Symbol.find();
    console.log('📊 Total symbols:', symbols.length);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
