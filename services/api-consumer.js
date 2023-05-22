import { XMLHttpRequest } from 'xmlhttprequest'

const API_URL = 'https://api.binance.com/api/v3'

// Realiza la conexión con la API.
async function request(option) {
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

    return request('/ticker/24hr')
}