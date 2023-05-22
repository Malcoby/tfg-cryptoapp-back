import mongoose from 'mongoose'

const symbolSchema = mongoose.Schema({
    symbol: {
        type: String,
        require: true,
    },
    priceChangePercent: {
        type: String,
        require: true
    },
    lastPrice: {
        type: String,
        require: true
    },
    volume: {
        type: String,
        require: true
    },
    quoteVolume: {
        type: String,
        require: true
    }
})

export default mongoose.model('Symbol', symbolSchema)