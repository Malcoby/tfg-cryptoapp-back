import { connect } from './mongo-controller/utils/mongoose.js'
import routes from './mongo-controller/routes/routes.js'
import { updateDB, createDB } from './services/index.js'
import cors from 'cors'
import express from 'express'

import * as dotenv from 'dotenv'
dotenv.config()

const main = async () => {

    await connect()
    app.listen(1818, () => {
        console.log('\n\n-- Server Running at http://localhost:1818\n')
    })

    createDB()

    setInterval(async () => {
        await updateDB()
    }, 5000 )
}

const app = express()
main()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(routes)