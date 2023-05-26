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

    const users = await User.find()
    if (users.length != 0) {

        let updated = false
        users.forEach(userTemp => {
            if (userTemp.email == email) {

                const filter = { _id: `${userTemp._id}` }
                const options = { upsert: true }
                const userUpdated = {
                    $set: {
                        provider: `${provider}`,
                        name: `${name}`,
                        photo: `${photo}`
                    }
                }

                User.updateOne(filter, userUpdated, options)
                updated = true
                console.log(userData)
                response.json(userData)
                response.end()
                //response.json('Symbol updated')
            }
        })

        if (updated == false) {

            await userData.save()
            console.log(userData)
            response.json(userData)
            response.end()
            //response.json('Symbol added')
        }
    } else {

        await userData.save()
        console.log(userData)
        response.json(userData)
        response.end()
        //response.json('Symbol added')
    }
}