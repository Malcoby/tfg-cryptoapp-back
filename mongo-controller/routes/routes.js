import { Router } from 'express'
import { getSymbols, getPictures } from '../controllers/db-controller.js'

import userRoutes from './users.js'
import subscriptionsRoutes from './subscriptions.js'
import walletRoutes from './wallet.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/subscriptions', subscriptionsRoutes)
router.use('/wallet', walletRoutes)

router.get('/symbols', getSymbols)
router.get('/pictures', getPictures)

export default router