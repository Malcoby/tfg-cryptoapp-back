import Symbol from '../models/symbol.js'
import User from '../models/user.js'
import fs from 'fs'

import { HTTP_STATUS } from '../../constants.js'

/**
 * Obtiene todos los símbolos de la DB y los envía como respuesta en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 */
export const getSymbols = async (request, response) => {
    const symbols = await Symbol.find({}, { _id: 0 })

    response.json(symbols)
    response.end()
}

/**
 * Obtiene todos los iconos de las criptomonedas, en base64, de un archivo json y los envía como respuesta en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 */
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

/**
 * Obtiene todos los usuarios de la DB y los envía como respuesta en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 */
export const getUsers = async (request, response) => {

    const users = await User.find()
    response.json(users)
}

/**
 * Guarda un nuevo usuario en la DB y, si existe, lo actualiza. Envía como respuesta los datos del usuario en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 */
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

/**
 * Obtiene los favoritos del usuario y los envía como respuesta en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 * @returns null
 */
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

/**
 * Añade favoritos al usuario y, si existen, los borra de la DB
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 * @returns null
 */
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

/**
 * Obtiene la billetera del usuario y la envía como respuesta en formato json
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 * @returns null
 */
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

/**
 * Añade criptomonedas a la billetera del usuario y, si existen y su balance es 0.0, las borra de la DB
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 * @returns null
 */
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

/**
 * Modifica el balance de la DB de una criptomonedas existente en la billetera del usuario
 * @param {Request} request objeto que representa la petición al servidor
 * @param {Response} response objeto que representa la respuesta del servidor
 * @returns null
 */
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