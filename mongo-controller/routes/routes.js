import { Router } from 'express'
import { getSymbols } from '../controllers/db-controller.js'

import userRoutes from './users.js'
import subscriptionsRoutes from './subscriptions.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/subscriptions', subscriptionsRoutes)

router.get('/symbols', getSymbols)

export default router