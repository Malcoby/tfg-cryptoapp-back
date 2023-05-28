import { XMLHttpRequest } from 'xmlhttprequest'

const API_URL = 'https://api.binance.com/api/v3'

// Realiza la conexión con la API.
const request = async (method, endpoint) => {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, `${API_URL}${endpoint}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send()

        xhr.onload = () => resolve(JSON.parse(xhr.responseText))
        xhr.onerror = () => reject(xhr.status)
    })
}

export const getSymbolsData = () => {
    return request('GET', '/ticker/24hr')
}