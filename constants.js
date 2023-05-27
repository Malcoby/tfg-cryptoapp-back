export const HTTP_STATUS = Object.freeze({
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
})

/**
 * https://api.binance.com/api/v3/exchangeInfo contains
 * info about the rate limits for out connection, in this case:
 * {
 *  "rateLimitType": "REQUEST_WEIGHT",
 *  "interval": "MINUTE",
 *  "intervalNum": 1,
 *  "limit": 1200
 * }
 * /ticker/24hr?type=MINI uses 40 weight
 * so 1200 / 40 => 30 requests / minute
 */
export const DDBB_UPDATE_RATE = 2000