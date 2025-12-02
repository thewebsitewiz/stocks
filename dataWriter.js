// dataWriter.js - Data writing operations
const { Symbol } = require('./db');

// Write a single record
const writeData = async (data) => {
  try {
    const symbol = new Symbol(data);
    await symbol.save();
    console.log(`Data saved: ${data.symbol}`);
    return symbol;
  } catch (error) {
    console.error('Error writing data:', error.message);
    throw error;
  }
};

// Write multiple records
const writeBulkData = async (dataArray) => {
  try {
    const result = await Symbol.insertMany(dataArray, { ordered: false });
    console.log(`${result.length} records saved successfully`);
    return result;
  } catch (error) {
    if (error.code === 11000) {
      console.log('Some duplicate records were skipped');
    } else {
      console.error('Error writing bulk data:', error.message);
    }
    throw error;
  }
};

// Update or insert (upsert) a record
const upsertData = async (query, data) => {
  try {
    const result = await Symbol.findOneAndUpdate(query, data, {
      upsert: true,
      new: true,
      runValidators: true,
    });
    console.log(`Data upserted: ${data.symbol}`);
    return result;
  } catch (error) {
    console.error('Error upserting data:', error.message);
    throw error;
  }
};

module.exports = { writeData, writeBulkData, upsertData };

// ============================================
