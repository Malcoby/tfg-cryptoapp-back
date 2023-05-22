
/*
* https://api.binance.com
* https://api1.binance.com
* https://api2.binance.com
* https://api3.binance.com
* https://api4.binance.com
*/

/*
* GET /api/v3/aggTrades
* GET /api/v3/avgPrice
* GET /api/v3/depth
* GET /api/v3/exchangeInfo
* GET /api/v3/klines
* GET /api/v3/ping
* GET /api/v3/ticker
* GET /api/v3/ticker/24hr
* GET /api/v3/ticker/bookTicker
* GET /api/v3/ticker/price
* GET /api/v3/time
* GET /api/v3/trades
* GET /api/v3/uiKlines
*/



import { XMLHttpRequest } from 'xmlhttprequest'

const API_URL = 'https://api.binance.com/api/v3'

// Realiza la conexión con la API.
async function consumeApiBinance (option) {
    const petition_http = new XMLHttpRequest()

    return new Promise((resolve, reject) => {

        petition_http.open('GET', `${API_URL}${option}`)
        petition_http.send(null)
        petition_http.onreadystatechange = () => {

            if (petition_http.readyState == 4 && petition_http.status == 200) {

                resolve(petition_http.responseText)
            } else if (petition_http.readyState == 4) {

                reject(petition_http.status)
            }
        }
    })
}

export function getSymbolsData() {

    return consumeApiBinance('/ticker/24hr')
}