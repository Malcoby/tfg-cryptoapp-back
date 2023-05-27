import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import config from './config.js'
import routes from './mongo-controller/routes/routes.js'

import { connect } from './mongo-controller/utils/mongoose.js'
import { updateDB, createDB } from './services/index.js'
import { DDBB_UPDATE_RATE } from './constants.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(routes)

const main = async () => {

    let alreadyUpdating = false

    await connect()
    createDB()

    app.listen(config.back.dev.port, config.back.dev.hostname)
    console.info(`\n\n-- Server running at http://${config.back.dev.hostname}:${config.back.dev.port}\n`)
    
    setInterval(async () => {
        if (alreadyUpdating) return

        alreadyUpdating = true
        await updateDB()
        alreadyUpdating = false

    }, DDBB_UPDATE_RATE)
}

main()