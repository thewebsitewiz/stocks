import mongoose, { Schema } from 'mongoose';
import { ISymbol } from '../interfaces/symbol.js';

const symbolSchema = new Schema<ISymbol>(
  {
    symbol: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    market: { type: String, required: true, uppercase: true },
    instr: { type: String, required: true },
  },
  { timestamps: true }
);

symbolSchema.index({ symbol: 1, market: 1 }, { unique: true });

export const Symbol = mongoose.model<ISymbol>('Symbol', symbolSchema);
