import { Router } from 'express'
import { getUsers, saveUser } from '../controllers/db-controller.js'

const router = Router()

router.get('/', getUsers)
router.put('/', saveUser)

export default router