/**
 * Interface for NYSE quote filter request
 */
export interface INYSEFilterRequest {
  instrumentType: string;
  pageNumber: number;
  sortColumn: string;
  sortOrder: 'ASC' | 'DESC';
  maxResultsPerPage: number;
  filterToken: string;
}

/**
 * Interface for NYSE search request
 */
export interface INYSESearchRequest {
  searchTerm: string;
  maxResultsPerPage?: number;
}

/**
 * Interface for individual symbol request
 */
export interface INYSESymbolRequest {
  instrumentType: string;
  symbolTicker: string;
}

/**
 * Interface for individual symbol response
 */
export interface INYSESymbolResponse {
  total: number;
  url: string;
  normalizedTicker: string;
  instrumentName: string;
  symbolExchangeTicker: string;
  exchangeId: string | null;
  instrumentType: string | null;
  symbolTicker: string | null;
  symbolEsignalTicker: string | null;
  micCode: string | null;
}
