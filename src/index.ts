// src/index.ts
import dotenv from 'dotenv';
import Database from './database';
import { Symbol } from './models/Symbol';
dotenv.config();

async function main() {
  try {
    await Database.connect();

    // Your application logic here
    console.log('Application is running');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

/* async function main() {
  try {
    // Connect to database
    await db.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/stocks'
    );

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

    // Cleanup
    await db.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
} */

main();
