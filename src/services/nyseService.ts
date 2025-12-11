import fetch from 'node-fetch';
import { ISymbolData } from '../interfaces/symbol.js';
import {
  INYSEFilterRequest,
  INYSESearchRequest,
  INYSESymbolRequest,
  INYSESymbolResponse,
} from '../interfaces/nyse.js';
import {
  ModifiedPathsSnapshot,
  Document,
  Model,
  Types,
  ClientSession,
  DocumentSetOptions,
  QueryOptions,
  MergeType,
  UpdateQuery,
  AnyObject,
  PopulateOptions,
  Query,
  SaveOptions,
  ToObjectOptions,
  UpdateWithAggregationPipeline,
  pathsToSkip,
  Error,
} from 'mongoose';

/**
 * NYSE API Service
 * Provides methods to interact with NYSE public API endpoints
 */
export class NYSEService {
  private readonly instruments = ['REIT', 'EQUITY'];
  private readonly baseUrl = 'https://www.nyse.com/api';
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  };

  async loopInstruments(): Promise<void> {
    for (const instr of this.instruments) {
      console.log(`Processing instrument: ${instr}`);

      this.getFilteredQuotes({ instrumentType: instr })
        .then((data: INYSESymbolResponse[]) => {
          console.log(`Data for ${instr}:`, data);
          this.processStockData(instr, data);
        })
        .catch((error) => {
          console.error(`Error fetching data for ${instr}:`, error);
        });
    }
  }

  private async processStockData(
    instr: string,
    data: INYSESymbolResponse[]
  ): Promise<void> {
    // data processing logic here
    console.log('Processing stock data:', data);

    const newData: ISymbolData[] = [];
    for (const item of data) {
      newData.push({
        market: 'NYSE',
        instr: instr,
        symbol: item.normalizedTicker,
        name: item.instrumentName,
      });
    }
  }

  /**
   * Fetches a filtered list of quotes from NYSE
   *
   * @param options - Filter options for the query
   * @returns Promise with NYSE quote data
   *
   * @example
   * ```typescript
   * const quotes = await nyseService.getFilteredQuotes({
   *   instrumentType: 'EQUITY',
   *   pageNumber: 1,
   *   sortColumn: 'NORMALIZED_TICKER',
   *   sortOrder: 'ASC',
   *   maxResultsPerPage: 50
   * });
   * ```
   */
  async getFilteredQuotes(
    options: Partial<INYSEFilterRequest> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/quotes/filter`;

    const payload: INYSEFilterRequest = {
      instrumentType: options.instrumentType || 'EQUITY',
      pageNumber: options.pageNumber || 1,
      sortColumn: options.sortColumn || 'NORMALIZED_TICKER',
      sortOrder: options.sortOrder || 'ASC',
      maxResultsPerPage: options.maxResultsPerPage || 10,
      filterToken: options.filterToken || '',
    };

    try {
      console.log(
        `Fetching filtered quotes from NYSE (page ${payload.pageNumber})...`
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const data: INYSESymbolResponse[] =
        (await response.json()) as INYSESymbolResponse[];
      console.log(`✅ Successfully fetched ${data.length || 0} quotes`);
      return data;
    } catch (error) {
      console.error('Error fetching filtered quotes:', error);
      throw error;
    }
  }

  /**
   * Utility method to add delay between requests
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export const nyseService = new NYSEService();
