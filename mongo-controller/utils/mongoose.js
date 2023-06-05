import mongoose from 'mongoose'
import config from '../../config.js'

export const connect = async () => {

    try {
        await mongoose.connect(config.back.ddbbUri)
        console.info(`\nMongoDB Connected at ${config.back.ddbbUri}`)

    } catch (error) {

        console.error(error)
    }
}