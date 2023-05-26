import { Router } from 'express'
import { getSymbols, saveSymbol, getUsers, saveUser, addFavorite } from '../controllers/db-controller.js'

const router = Router()



router.get('/getSymbols', getSymbols)

router.put('/saveSymbol', saveSymbol)


router.get('/getUsers', getUsers)

router.put('/saveUser', saveUser)


router.put('/addFavorite', addFavorite)

// router.delete('/deleteFavorite', deleteFavorite)



router.get('/', (request, response) => {
    response.send('Hola mundo!')
    response.end()
})

export default router