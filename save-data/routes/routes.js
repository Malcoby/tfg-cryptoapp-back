import { Router } from 'express'
import { getSymbols, saveSymbol, getUsers, saveUser } from '../controllers/db-controller.js'

const router = Router()



router.get('/getSymbols', getSymbols)

router.put('/saveSymbol', saveSymbol)


router.get('/getUsers', getUsers)

router.put('/saveUser', saveUser)



router.get('/', (request, response) => {
    response.send('Hola mundo!')
    response.end()
})

export default router