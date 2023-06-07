import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    provider: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true
    },
    favorites: {
        type: Array
    },
    Wallet: {
        type: Array
    }
})

export default mongoose.model('User', userSchema)