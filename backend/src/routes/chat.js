import { Router } from 'express'
import { sendMessage } from '../controllers/chat.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.post('/', sendMessage)

export default router
