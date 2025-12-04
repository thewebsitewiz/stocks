import { Symbol } from './models/Symbol';
import { ISymbol } from './interfaces/symbol';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Writes a single record to the database
 *
 * @param data - Symbol data to be saved
 * @returns Promise resolving to the saved symbol document
 * @throws {Error} If validation fails or database operation fails
 *
 * @example
 * ```typescript
 * const symbol = await writeData({
 *   symbol: 'AAPL',
 *   name: 'Apple Inc.',
 *   market: 'NASDAQ',
 *   instr: 'Stock'
 * });
 * ```
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

/**
 * Writes multiple records to the database in a single operation
 * Uses insertMany for better performance with large datasets
 *
 * @param dataArray - Array of symbol data to be saved
 * @returns Promise resolving to array of saved symbol documents
 * @throws {Error} If database operation fails (duplicates are handled gracefully)
 *
 * @example
 * ```typescript
 * const symbols = await writeBulkData([
 *   { symbol: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', instr: 'Stock' },
 *   { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'NASDAQ', instr: 'Stock' }
 * ]);
 * ```
 */
export const writeBulkData = async (
  dataArray: SymbolData[]
): Promise<ISymbol[]> => {
  try {
    // ordered: false allows operation to continue even if some inserts fail
    const result = await Symbol.insertMany(dataArray, { ordered: false });
    console.log(`${result.length} records saved successfully`);
    return result;
  } catch (error: any) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      console.log('Some duplicate records were skipped');
      // Return successfully inserted documents
      return error.insertedDocs || [];
    } else {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error writing bulk data:', errorMessage);
      throw error;
    }
  }
};

/**
 * Updates an existing record or inserts a new one if it doesn't exist (upsert)
 * Useful for synchronizing data from external sources
 *
 * @param query - MongoDB filter query to find the document
 * @param data - Symbol data to update or insert
 * @returns Promise resolving to the updated/inserted symbol document
 * @throws {Error} If validation fails or database operation fails
 *
 * @example
 * ```typescript
 * const symbol = await upsertData(
 *   { symbol: 'AAPL' },
 *   {
 *     symbol: 'AAPL',
 *     name: 'Apple Inc. (Updated)',
 *     market: 'NASDAQ',
 *     instr: 'Stock'
 *   }
 * );
 * ```
 */
export const upsertData = async (
  query: FilterQuery<ISymbol>,
  data: SymbolData
): Promise<ISymbol | null> => {
  try {
    const result = await Symbol.findOneAndUpdate(
      query,
      data as UpdateQuery<ISymbol>,
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return the modified document
        runValidators: true, // Run schema validators on update
      }
    );
    console.log(`Data upserted: ${data.symbol}`);
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error upserting data:', errorMessage);
    throw error;
  }
};

/**
 * Deletes a symbol record from the database
 *
 * @param query - MongoDB filter query to find the document to delete
 * @returns Promise resolving to the deleted document or null if not found
 *
 * @example
 * ```typescript
 * const deleted = await deleteData({ symbol: 'AAPL' });
 * ```
 */
export const deleteData = async (
  query: FilterQuery<ISymbol>
): Promise<ISymbol | null> => {
  try {
    const result = await Symbol.findOneAndDelete(query);
    if (result) {
      console.log(`Data deleted: ${result.symbol}`);
    } else {
      console.log('No matching record found to delete');
    }
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting data:', errorMessage);
    throw error;
  }
};
