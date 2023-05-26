import { Router } from 'express'
import { getSymbols, createDB, updateSymbols, getUsers, saveUser, addFavorite } from '../controllers/db-controller.js'

const router = Router()

router.get('/getSymbols', getSymbols)

router.put('/updateSymbols', updateSymbols)
router.put('/createDB', createDB)

router.get('/getUsers', getUsers)

router.put('/saveUser', saveUser)


router.put('/addFavorite', addFavorite)

// router.delete('/deleteFavorite', deleteFavorite)

router.get('/', (request, response) => {
    response.send('Hola mundo!')
    response.end()
})

export default router