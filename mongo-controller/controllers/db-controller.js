import Symbol from '../models/symbol.js'
import User from '../models/user.js'

export const getSymbols = async (request, response) => {

    let attempts = 0
    let symbols = null

    while (!symbols && attempts++ < 3) {

        try {
            symbols = await Symbol.find()
        } catch {
            setTimeout(() => {}, 100)
        }
    }

    response.json(symbols)
    response.end()
}

export const saveSymbol = async (request, response) => {

    console.time()

    Symbol.collection.drop()

    //console.log(request.body)
    const symbols = request.body
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

    console.timeEnd()
    response.end()
}

export const getUsers = async (request, response) => {

    const users = await User.find()
    response.json(users)
}

export const saveUser = async (request, response) => {

    const { provider, name, email, photo } = request.body

    const userData = new User({
        provider,
        name,
        email,
        photo
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

    const { email, favorite } = request.body

    const filter = { email: `${email}` }
    const user = await User.find(filter)
    if (user.length != 0) {
        console.log(user)
        console.log(user.favorites)
        let userFavorites = user.favorites
        let exist = false
        if (userFavorites != undefined) {

            userFavorites.forEach(element => {
                if (element === favorite) {
                    exist = true
                }
            })
        }
        if (!exist) {

            let longitud = 0
            if (userFavorites != undefined) {

                longitud = userFavorites.length
                console.log(longitud)
                userFavorites[longitud] = favorite
            } else {
                console.log(userFavorites)
                console.log(longitud)
                userFavorites = [ favorite ]
            }
            //userFavorites.add(favorite)
        }
        console.log(userFavorites)

        const options = { upsert: true }
        const userUpdated = {
            $set: {
                favorites: `${userFavorites}`
            }
        }

        await User.updateOne(filter, userUpdated, options)
        console.log(user)
        console.log('Favorite added')
        response.json(user)
        response.end()
    }
}