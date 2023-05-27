import { getSymbolsData } from './api-consumer.js'
import { XMLHttpRequest } from 'xmlhttprequest'

export const createDB = async () => {
    const symbols = await getSymbolsData()
    
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest()
        
        xhr.open('PUT', 'http://localhost:1818/createDB')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(symbols)

        xhr.onload = () => resolve(xhr.response)
        xhr.onerror = () => reject(xhr.status)
    })
}

export const updateDB = async () => {
    const symbols = await getSymbolsData()

    return new Promise((resolve, reject) => {
        
        const xhr = new XMLHttpRequest()
        
        xhr.open('PUT', 'http://localhost:1818/updateDB')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(symbols)

        xhr.onload = () => resolve(xhr.response)
        xhr.onerror = () => reject(xhr.status)
    })
}