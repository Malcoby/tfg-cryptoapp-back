import { connect } from './save-data/utils/mongoose.js'
import routes from './save-data/routes/routes.js'
import saveSymbols from './api-consumer/controllers/saveSymbols.js'
import cors from 'cors'
import express from 'express'



const main = async () => {
    await connect()
    app.listen(1818, () => {
        console.log('\n-- Server Running at http://localhost:1818')
    })
}



const app = express()
main()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(routes)

// Envía los datos de la api a MongoDB
saveSymbols()