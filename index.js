// index.js - Main entry point
require('dotenv').config();
const { connectDB } = require('./db');
const { writeData, writeBulkData, upsertData } = require('./dataWriter');

const main = async () => {
  // Connect to database
  await connectDB();

  // Example: Write a single record
  const singleData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'NASDAQ',
    instr: 'Stock',
  };

  try {
    await writeData(singleData);
  } catch (error) {
    console.error('Failed to write single record');
  }

  // Example: Write multiple records
  const bulkData = [
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      market: 'NASDAQ',
      instr: 'Stock',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      market: 'NASDAQ',
      instr: 'Stock',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      market: 'NASDAQ',
      instr: 'Stock',
    },
  ];

  try {
    await writeBulkData(bulkData);
  } catch (error) {
    console.error('Failed to write bulk records');
  }

  // Example: Upsert (update or insert)
  try {
    await upsertData(
      { symbol: 'AAPL' }, // Query
      {
        symbol: 'AAPL',
        name: 'Apple Inc. (Updated)',
        market: 'NASDAQ',
        instr: 'Stock',
      }
    );
  } catch (error) {
    console.error('Failed to upsert record');
  }

  // Close connection (optional - useful for scripts)
  // await mongoose.connection.close();
};

main();
