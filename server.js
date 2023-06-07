import express from 'express'
import cors from 'cors'

import config from './config.js'
import routes from './mongo-controller/routes/routes.js'

import { connect } from './mongo-controller/utils/mongoose.js'
import { jsonFilePictures, createDB, updateDB } from './services/index.js'
import { DDBB_UPDATE_RATE } from './constants.js'

const app = express()
const hostname = config.back.hostname
const port = config.back.port

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(routes)

/**
 * Función main del servidor
 */
const main = async () => {
    let alreadyUpdating = false

    await jsonFilePictures()
    await connect()
    createDB()

    app.listen(port, hostname)
    console.info(`\n-- Server running at http://${hostname}:${port}\n`)

    setInterval(async () => {
        if (alreadyUpdating) return

        alreadyUpdating = true
        await updateDB()
        alreadyUpdating = false

    }, DDBB_UPDATE_RATE)
}

main()