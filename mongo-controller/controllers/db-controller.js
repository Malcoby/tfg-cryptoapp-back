import mongoose from 'mongoose'
import Symbol from '../models/symbol.js'
import User from '../models/user.js'

let ids = null

export const getSymbols = async (request, response) => {
    const symbols = await Symbol.find()

    response.json(symbols)
    response.end()
}

export const createDB = async (request, response) => {

    console.time()
    Symbol.collection.drop()

    let symbols = request.body
    symbols = symbols.filter(symbol => symbol.quoteVolume != 0)

    const bulk = Symbol.collection.initializeUnorderedBulkOp()
    symbols.forEach(element => {

        const { symbol, priceChangePercent, lastPrice, volume, quoteVolume } = element

        const symbolData = {
            symbol,
            priceChangePercent,
            lastPrice,
            volume,
            quoteVolume
        }
        
        bulk.insert(symbolData)
    })
    await bulk.execute()

    const options = {
        priceChangePercent: 0,
        lastPrice: 0,
        volume: 0,
        quoteVolume: 0
    }

    ids = await Symbol.find(null, options)
    ids = ids.map(newSymbol => {

        const symbol = newSymbol.symbol
        const _id = newSymbol._id

        return { symbol, _id }
    })

    console.timeEnd()
    response.end()
}

export const updateSymbols = async (request, response) => {

    console.time('update')

    let symbols = request.body
    symbols = symbols.filter(symbol => symbol.quoteVolume != 0)

    const bulk = Symbol.collection.initializeUnorderedBulkOp()
    symbols.forEach(element => {

        const { symbol, priceChangePercent, lastPrice, volume, quoteVolume } = element
        
        const symbolData = {
            symbol,
            priceChangePercent,
            lastPrice,
            volume,
            quoteVolume
        }
        
        let _id = ids.find(idElement => idElement.symbol === element.symbol)._id

        bulk.find({ _id }).replaceOne(symbolData)
    })

    await bulk.execute()
    console.timeEnd('update')

    response.end()
}

export const getUsers = async (request, response) => {

    const users = await User.find()
    response.json(users)
}

export const saveUser = async (request, response) => {

    const { provider, name, email, photo, favorites } = request.body

    const userData = new User({
        provider,
        name,
        email,
        photo,
        favorites
    })

    const filter = { email: `${email}` }
    const user = await User.find(filter)
    if (user.length != 0) {

        const options = { upsert: true }
        const userUpdated = {
            $set: {
                provider: `${provider}`,
                name: `${name}`,
                photo: `${photo}`
            }
        }

        await User.updateOne(filter, userUpdated, options)
        console.log(userData)
        console.log('Symbol updated')
        response.json(userData)
        response.end()
    } else {

        await userData.save()
        console.log(userData)
        console.log('Symbol added')
        response.json(userData)
        response.end()
    }
}

export const addFavorite = async (request, response) => {

    const { email, symbol } = request.body

    const filter = { email: `${email}` }
    const user = await User.findOne(filter)

    if (user) {
        let userFavorites = user.favorites
        const alreadyExists = userFavorites.includes(symbol)

        if (!alreadyExists) {
            userFavorites.push(symbol)
            //userFavorites = [...userFavorites, symbol]

            const userUpdated = {
                $set: {
                    favorites: userFavorites
                }
            }

            await User.updateOne(filter, userUpdated)
            response.send(`${symbol} added`)
        }
        
        response.end()
    }
}