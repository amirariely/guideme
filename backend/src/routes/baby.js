import { Router } from 'express'
import { getBaby, createBaby, updateBaby, updatePermissions } from '../controllers/baby.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/',               getBaby)
router.post('/',              createBaby)
router.patch('/:id',          updateBaby)
router.patch('/:id/permissions', updatePermissions)

export default router
