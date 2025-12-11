#!/usr/bin/env node

/**
 * Script to fetch all NASDAQ-listed stocks and format them as JSON
 * Downloads directly from NASDAQ's official server
 * ES6 Module version
 *
 * Usage:
 *   node fetchNASDAQ.js
 *
 * Output:
 *   nasdaq_all_stocks.json - Complete list of all NASDAQ stocks
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Download NASDAQ stocks from official HTTP source
 */
async function downloadNasdaqStocksHTTP() {
  console.log('Downloading NASDAQ stock list from official source...');

  return new Promise((resolve, reject) => {
    const url = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt';

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
          );
          return;
        }

        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const stocks = parseNasdaqData(data);
            console.log(`✓ Found ${stocks.length} NASDAQ-listed stocks`);
            resolve(stocks);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Download NASDAQ stocks using fetch API (alternative method)
 */
async function downloadNasdaqStocksFetch() {
  console.log('Attempting fetch API method...');

  try {
    const url = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.text();
    const stocks = parseNasdaqData(data);

    console.log(`✓ Found ${stocks.length} NASDAQ-listed stocks via fetch`);
    return stocks;
  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`);
  }
}

/**
 * Parse pipe-delimited NASDAQ data
 */
function parseNasdaqData(data) {
  const lines = data.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('Invalid data format');
  }

  // First line is headers, last line is metadata
  const headers = lines[0].split('|').map((h) => h.trim());
  const dataLines = lines.slice(1, -1); // Exclude header and footer

  const symbolIndex = headers.indexOf('Symbol');
  const nameIndex = headers.indexOf('Security Name');

  if (symbolIndex === -1 || nameIndex === -1) {
    throw new Error('Required columns not found');
  }

  const stocks = [];

  for (const line of dataLines) {
    const fields = line.split('|');

    if (fields.length < headers.length) {
      continue; // Skip malformed lines
    }

    const symbol = fields[symbolIndex].trim();
    const name = fields[nameIndex].trim().toUpperCase();

    if (!symbol || !name) {
      continue; // Skip empty entries
    }

    const stock = {
      symbol: symbol,
      name: name,
      url: `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}`,
      instr: 'EQUITY',
      market: 'NASDAQ',
    };

    stocks.push(stock);
  }

  return stocks;
}

/**
 * Save stocks to JSON file
 */
function saveToJSON(stocks, filename = 'nasdaq_all_stocks.json') {
  console.log(`\nSaving ${stocks.length} stocks to ${filename}...`);

  const jsonData = JSON.stringify(stocks, null, 2);

  fs.writeFileSync(filename, jsonData, 'utf8');

  console.log(`✓ Successfully saved to ${filename}`);
  console.log(`\nFile size: ${Buffer.byteLength(jsonData, 'utf8')} bytes`);

  // Show sample
  console.log(`\nFirst 5 stocks:`);
  stocks.slice(0, 5).forEach((stock) => {
    console.log(`  ${stock.symbol}: ${stock.name}`);
  });

  // Show last 3 stocks
  console.log(`\nLast 3 stocks:`);
  stocks.slice(-3).forEach((stock) => {
    console.log(`  ${stock.symbol}: ${stock.name}`);
  });
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('NASDAQ Stock List Downloader (ES6 Module)');
  console.log('='.repeat(60));
  console.log();

  try {
    let stocks;

    // Try fetch API first (available in Node 18+)
    if (typeof fetch !== 'undefined') {
      try {
        stocks = await downloadNasdaqStocksFetch();
      } catch (fetchError) {
        console.log(`Fetch method failed: ${fetchError.message}`);
        console.log('Trying HTTPS method...\n');
        stocks = await downloadNasdaqStocksHTTP();
      }
    } else {
      // Fallback to HTTPS for older Node versions
      stocks = await downloadNasdaqStocksHTTP();
    }

    // Save to JSON
    saveToJSON(stocks);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`SUCCESS: Downloaded ${stocks.length} NASDAQ stocks`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error(`\nERROR: ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('1. Check your internet connection');
    console.error('2. Verify NASDAQ services are accessible:');
    console.error('   https://www.nasdaqtrader.com');
    console.error('3. Make sure you are using Node.js 14+ (18+ recommended)');
    console.error('4. Check if corporate firewall is blocking the connection');
    process.exit(1);
  }
}

// Run the script
main();

// Export functions for use as module
export {
  downloadNasdaqStocksHTTP,
  downloadNasdaqStocksFetch,
  parseNasdaqData,
  saveToJSON,
};
