import { Symbol } from './models/Symbol.js';
import { ISymbol } from './interfaces/symbol.js';
import { FilterQuery, UpdateQuery } from 'mongoose';

// Add this type definition
type SymbolData = {
  symbol: string;
  name: string;
  market: string;
  instr: string;
};

/**
 * Writes a single record to the database
 */
export const writeData = async (data: SymbolData): Promise<ISymbol> => {
  try {
    const symbol = new Symbol(data);
    await symbol.save();
    console.log(`Data saved: ${data.symbol}`);
    return symbol;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error writing data:', errorMessage);
    throw error;
  }
};

// ... rest of your functions remain the same
