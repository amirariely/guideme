import { Router } from 'express'
import { listActivities, createActivity, getActivity, deleteActivity } from '../controllers/activities.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/',      listActivities)
router.post('/',     createActivity)
router.get('/:id',   getActivity)
router.delete('/:id', deleteActivity)

export default router
