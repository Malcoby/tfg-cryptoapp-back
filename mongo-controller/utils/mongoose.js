import mongoose from 'mongoose'

export const connect = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('\nMongoDB Connected')
    } catch (error) {
        console.error(error)
    }
}