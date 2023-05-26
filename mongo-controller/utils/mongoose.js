import mongoose from 'mongoose'

export const connect = async () => {

    try {
        await mongoose.connect(URI)
        console.log('\nMongoDB Connected')
    } catch (error) {
        console.error(error)
    }
}