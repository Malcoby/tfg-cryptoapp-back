import { Router } from 'express'
import { addCoinToWallet, getUserWallet} from '../controllers/db-controller.js'

const router = Router()

router.post('/', getUserWallet)
router.put('/', addCoinToWallet)

export default router