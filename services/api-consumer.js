import { XMLHttpRequest } from 'xmlhttprequest'

const API_URL = 'https://api.binance.com/api/v3'

// Realiza la conexión con la API.
async function request(method, endpoint) {
    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {

        xhr.open(method, `${API_URL}${endpoint}`)
        xhr.send()

        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.response)
    })
}

export function getSymbolsData() {
    return request('GET', '/ticker/24hr?type=MINI')
}