import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output file path (same directory as script)
const outputFile = path.join(__dirname, 'nyse-reit.json');

// API endpoint and payload
const apiUrl = 'https://www.nyse.com/api/quotes/filter';
const payload = {
  instrumentType: 'REIT',
  pageNumber: 1,
  sortColumn: 'NORMALIZED_TICKER',
  sortOrder: 'ASC',
  maxResultsPerPage: 10000,
  filterToken: '',
};

// Fetch data from NYSE API
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  body: JSON.stringify(payload),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((jsonData) => {
    // Check if data is an array, if not wrap it
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    // Transform the data
    const transformedData = dataArray.map((item) => ({
      symbol: item.symbolExchangeTicker,
      name: item.instrumentName,
      url: item.url,
      instr: 'REIT',
      market: 'NYSE',
    }));

    // Write to output file
    fs.writeFile(
      outputFile,
      JSON.stringify(transformedData, null, 2),
      'utf8',
      (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log(`✓ Successfully processed ${transformedData.length} items`);
        console.log(`✓ Output written to: ${outputFile}`);
      }
    );
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
