// Node 18+ or `npm install node-fetch` for older versions
import fetch from 'node-fetch'; // omit this line on Node 18+

const url = 'https://www.nyse.com/api/quotes/filter';

async function getQuote() {
  // The NYSE endpoint requires a POST with a filter array:
  const body = [
    {
      instrumentType: 'EQUITY',
      // whatever symbol you want to look up
      symbolTicker: 'IBM',
    },
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
}

getQuote().catch(console.error);
