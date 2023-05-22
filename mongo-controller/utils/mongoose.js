import mongoose from 'mongoose'

//const URI = process.env.MONGODB_URI
const URI = 'mongodb+srv://tfgcryptoproject:buZVEa9ZzKmGuNT5@cluster-cryptoapp.y6mqvt1.mongodb.net/CryptoApp?retryWrites=true&w=majority'

export const connect = async () => {
    try {

        await mongoose.connect(URI)
        console.log('\nMongoDB Connected')
    } catch (error) {
        console.error(error)
    }
}