import { Router } from 'express'
import { invitePartner, getPartner, getPendingInvites, acceptInvite } from '../controllers/partner.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.post('/invite',       invitePartner)
router.get('/',              getPartner)
router.get('/pending',       getPendingInvites)
router.patch('/:id/accept',  acceptInvite)

export default router
