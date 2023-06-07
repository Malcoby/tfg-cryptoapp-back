import { XMLHttpRequest } from 'xmlhttprequest'

const API_URL = 'https://api.binance.com/api/v3'
/**
 * Realiza la conexión con la API de Binance y envía la respuesta en formato json
 * @param {String} method método de la conexión XMLHttpRequest
 * @param {String} endpoint endpoint de la API que devuelve los datos
 * @returns new Promise con los datos de la conexión XMLHttpRequest en formato json
 */
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

/**
 * Obtiene los datos de las ultimas 24h de la API de Binance
 * @returns datos de las ultimas 24h de la API de Binance en formato json
 */
export const getSymbolsData = () => {
    return request('GET', '/ticker/24hr')
}