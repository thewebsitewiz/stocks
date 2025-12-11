import { Symbol } from './models/Symbol.js';
import { ISymbol, ISymbolData } from './interfaces/symbol.js';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Writes a single record to the database
 */
export const writeData = async (data: ISymbolData): Promise<ISymbol> => {
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

// vwrite an array to the database
export const writeDataArray = async (
  dataArray: ISymbolData[]
): Promise<ISymbol[]> => {
  const savedRecords: ISymbol[] = [];
  for (const data of dataArray) {
    try {
      const savedRecord = await writeData(data);
      savedRecords.push(savedRecord);
    } catch (error) {
      console.error(
        `Failed to write record for symbol: ${data.symbol}`,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
  return savedRecords;
};
