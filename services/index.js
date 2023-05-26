import { getSymbolsData } from './api-consumer.js'
import { XMLHttpRequest } from 'xmlhttprequest'

export const createDB = async () => {
    const symbols = await getSymbolsData()
    
    return new Promise((resolve, reject) => {

        const petition_http = new XMLHttpRequest()
        
        petition_http.open('PUT', 'http://localhost:1818/createDB')
        petition_http.setRequestHeader('Content-Type', 'application/json')
        petition_http.send(symbols)

        petition_http.onload = () => resolve(petition_http.responseText)
        petition_http.onerror = () => reject(petition_http.status)
    })
}

export const updateDB = async () => {
    const symbols = await getSymbolsData()

    return new Promise((resolve, reject) => {
        
        const petition_http = new XMLHttpRequest()
        
        petition_http.open('PUT', 'http://localhost:1818/updateSymbols')
        petition_http.setRequestHeader('Content-Type', 'application/json')
        petition_http.send(symbols)

        petition_http.onload = () => resolve(petition_http.responseText)
        petition_http.onerror = () => reject(petition_http.status)
    })
}