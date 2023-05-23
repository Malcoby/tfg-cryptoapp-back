import { getSymbolsData } from './api-consumer.js'
import { XMLHttpRequest } from 'xmlhttprequest'

export const updateDB = async () => {

    const petition_http = new XMLHttpRequest()
    const symbols = await getSymbolsData()
    return new Promise((resolve, reject) => {

        petition_http.open('PUT', 'http://localhost:1818/saveSymbol')
        petition_http.setRequestHeader('Content-Type', 'application/json')
        petition_http.send(symbols)
        petition_http.onreadystatechange = () => {

            if (petition_http.readyState == 4 && petition_http.status == 200) {

                resolve(petition_http.responseText)
            } else if (petition_http.readyState == 4) {

                reject(petition_http.status)
            }
        }
    })
}