import { Router } from 'express'
import { addFavorite, getUserSubscriptions } from '../controllers/db-controller.js'

const router = Router()

router.post('/', getUserSubscriptions)
router.put('/', addFavorite)

export default router