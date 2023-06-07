import Symbol from '../models/symbol.js'
import User from '../models/user.js'
import fs from 'fs'

import { filterData, getSymbolAsObject } from '../utils/data-helper.js'
import { HTTP_STATUS } from '../../constants.js'

export const getSymbols = async (request, response) => {
    const symbols = await Symbol.find({}, { _id: 0 })

    response.json(symbols)
    response.end()
}

export const getPictures = async (request, response) => {
    const { coins } = request.body

    let pictures
    fs.readFile('./statics/assets/icons.json', (err, data) => {
        if (err) throw err
        pictures = data
    })
    coins.forEach(coin => {
        pictures = pictures.filter(picture => picture === coin)
    })

    response.json(pictures)
    response.end()
}

export const createDB = async (request, response) => {

    console.time('creation')
    Symbol.collection.drop()

    let symbols = filterData(request.body)

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
    response.end()
}

export const updateDB = async (request, response) => {

    console.time('update')

    let symbols = filterData(request.body)

    const bulk = Symbol.collection.initializeUnorderedBulkOp()
    symbols.forEach(element => {
        const symbol = getSymbolAsObject(element)
        bulk.find({ symbol: element.symbol }).updateOne({ $set: symbol })
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

    const { provider, name, email, photo, favorites, wallet } = request.body

    const userData = new User({
        provider,
        name,
        email,
        photo,
        favorites,
        wallet
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


export const getUserSubscriptions = async (request, response) => {

    const { email } = request.body
    const user = await User.findOne({ email })

    if (!user) {
        response.statusCode = HTTP_STATUS.NOT_FOUND
        response.end()
        return
    }

    const favorites = user.favorites
    response.contentType('json')
    response.json(favorites)
    response.end()
}

export const addFavorite = async (request, response) => {

    const { email, symbol } = request.body

    const filter = { email: `${email}` }
    const user = await User.findOne(filter)
    response.contentType('json')

    if (!user) {
        response.statusCode = HTTP_STATUS.NOT_FOUND
        response.send({ result: `User doesn't exist`})
        response.end()
        return
    }

    let favorites = user.favorites
    const alreadySubscribed = favorites.includes(symbol)

    if (alreadySubscribed) {
        favorites = favorites.filter(favorite => favorite !== symbol)
    } else {
        favorites.push(symbol)
    }

    const userUpdated = {
        $set: {
            favorites
        }
    }

    await User.updateOne(filter, userUpdated)

    response.end()
}


export const getUserWallet = async (request, response) => {

    const { email } = request.body
    const user = await User.findOne({ email })

    if (!user) {
        response.statusCode = HTTP_STATUS.NOT_FOUND
        response.end()
        return
    }

    const wallet = user.wallet
    response.contentType('json')
    response.json(wallet)
    response.end()
}

export const addCoinToWallet = async (request, response) => {

    const { email, symbol, balance } = request.body

    const filter = { email: `${email}` }
    const user = await User.findOne(filter)
    response.contentType('json')

    if (!user) {
        response.statusCode = HTTP_STATUS.NOT_FOUND
        response.send({ result: `User doesn't exist`})
        response.end()
        return
    }

    let alreadySubscribed
    let wallet = user.wallet
    wallet.forEach(coin => {
        if (coin.coin.includes(symbol)) {
            alreadySubscribed = true
        }
    })

    if (alreadySubscribed) {
        wallet.forEach(coin => {
            if (coin.coin.includes(symbol)) {
                if (coin.balance == 0.0) {
                    wallet = wallet.filter(coin => coin.coin !== symbol)
                }
            }
        })
    } else {
        const coinData = {
            coin: symbol,
            balance: balance
        }
        wallet.push(coinData)
    }

    const walletUpdated = {
        $set: {
            wallet
        }
    }

    await User.updateOne(filter, walletUpdated)

    response.end()
}

export const modifyCoinFromWallet = async (request, response) => {

    const { email, symbol, amount, lastPrice, deposit} = request.body

    const filter = { email: `${email}` }
    const user = await User.findOne(filter)
    response.contentType('json')

    if (!user) {
        response.statusCode = HTTP_STATUS.NOT_FOUND
        response.send({ result: `User doesn't exist`})
        response.end()
        return
    }

    let alreadySubscribed
    let wallet = user.wallet
    wallet.forEach(coin => {
        if (coin.coin.includes(symbol)) {
            alreadySubscribed = true
        }
    })

    if (alreadySubscribed) {
        wallet.forEach(coin => {
            if (coin.coin.includes(symbol)) {
                if (deposit) {
                    coin.balance = ((coin.balance * lastPrice) + amount) / lastPrice
                } else {
                    coin.balance = ((coin.balance * lastPrice) - amount) / lastPrice
                }
            }
        })

        const walletUpdated = {
            $set: {
                wallet
            }
        }

        await User.updateOne(filter, walletUpdated)
    }

    response.end()
}