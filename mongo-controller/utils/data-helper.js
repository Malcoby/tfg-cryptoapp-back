/**
 * Filter all inactive binance symbols
 * @param { Array<JSON> } symbols Array<JSON> representing symbols data
 */
export const filterData = (symbols) => {
    return symbols.filter(symbol => symbol.quoteVolume != 0)
}

/**
 * Use the useful data of the symbol to create the object
 * used by the database
 * @param { JSON } symbol JSON representing symbol data
 */
export const getSymbolAsObject = (symbol) => {
    const symbolObject = {
        symbol: symbol.symbol,
        priceChangePercent: symbol.priceChangePercent,
        lastPrice: symbol.lastPrice,
        volume: symbol.volume,
        quoteVolume: symbol.quoteVolume
    }

    return symbolObject
}