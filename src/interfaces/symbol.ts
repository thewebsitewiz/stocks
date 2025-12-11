import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for symbol data input
 * Used when creating or updating symbol records
 */
export interface ISymbol extends Document {
  symbol: string;
  name: string;
  market: string;
  instr: string;
}

export interface ISymbolData {
  symbol: string;
  name: string;
  market: string;
  instr: string;
}
