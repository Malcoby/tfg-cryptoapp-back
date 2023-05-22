import { getSymbolsData } from './api-consumer.js'
import { XMLHttpRequest } from 'xmlhttprequest'

const petition_http = new XMLHttpRequest()

export const updateDB = async () => {

    const symbols = await getSymbolsData()

    console.log('simbolos' + symbols.length)

    petition_http.open('PUT', 'http://localhost:1818/saveSymbol', false)
    petition_http.setRequestHeader('Content-Type', 'application/json')
    petition_http.send(symbols)

    console.log('fin')
    return

    // petition_http.onload = () => {
    //     if (petition_http.readyState == 4 && petition_http.status == 200) {

    //         //const data = petition_http.responseText
    //         //console.log(data)
    //     } else {
    //         console.log(`Error: ${petition_http.status}`)
    //     }
    // }
}