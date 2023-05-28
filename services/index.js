import Symbol from '../mongo-controller/models/symbol.js'

import { filterData, getSymbolAsObject } from '../mongo-controller/utils/data-helper.js'
import { getSymbolsData } from './api-consumer.js'

export const createDB = async () => {
    let symbols = await getSymbolsData()

    console.time('creation')
    Symbol.collection.drop()

    symbols = filterData(symbols)

    const bulk = Symbol.collection.initializeUnorderedBulkOp()
    symbols.forEach(element => {
        const symbol = getSymbolAsObject(element)
        bulk.insert(symbol)
    })

    await bulk.execute()

    console.time('index')
    await Symbol.collection.createIndex({ symbol: 1 })
    console.timeEnd('index')

    console.timeEnd('creation')    
}

export const updateDB = async () => {
    let symbols = await getSymbolsData()
        
    console.time('update')
    symbols = filterData(symbols)

    const bulk = Symbol.collection.initializeUnorderedBulkOp()
    symbols.forEach(element => {
        const symbol = getSymbolAsObject(element)
        bulk.find({ symbol: element.symbol }).updateOne({ $set: symbol })
    })

    await bulk.execute()
    console.timeEnd('update')
}