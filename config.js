import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(`${process.env.NODE_ENV}.env`)
})

const config = {
    back: {
        ddbbUri: process.env.MONGODB_URI,
        hostname: process.env.HOST,
        port: process.env.PORT
    }
}

export default config