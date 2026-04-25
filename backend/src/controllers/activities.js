import prisma from '../prisma.js'
import { findBabyForUser } from './baby.js'

// GET /api/activities?limit=20&offset=0
export async function listActivities(req, res, next) {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100)
    const offset = parseInt(req.query.offset) || 0

    const baby = await findBabyForUser(req.userId)
    if (!baby) {
      return res.json({ activities: [], total: 0 })
    }

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { babyId: baby.id },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where: { babyId: baby.id } }),
    ])

    res.json({ activities, total })
  } catch (err) {
    next(err)
  }
}

// POST /api/activities
export async function createActivity(req, res, next) {
  try {
    const { type, icon, label, detail, notes, timestamp } = req.body

    if (!type || !label) {
      return res.status(400).json({ error: 'Type and label are required' })
    }

    const baby = await findBabyForUser(req.userId)
    if (!baby) {
      return res.status(400).json({ error: 'Create a baby profile first' })
    }

    const activity = await prisma.activityLog.create({
      data: {
        babyId: baby.id,
        type,
        icon:   icon || '📝',
        label,
        detail: detail || '',
        notes:  notes || null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    })

    res.status(201).json({ activity })
  } catch (err) {
    next(err)
  }
}

// GET /api/activities/:id
export async function getActivity(req, res, next) {
  try {
    const activity = await prisma.activityLog.findUnique({
      where: { id: req.params.id },
    })
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' })
    }

    // Verify the user owns this activity's baby profile
    const baby = await findBabyForUser(req.userId)
    if (!baby || baby.id !== activity.babyId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    res.json({ activity })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/activities/:id
export async function deleteActivity(req, res, next) {
  try {
    const activity = await prisma.activityLog.findUnique({
      where: { id: req.params.id },
    })
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' })
    }

    const baby = await findBabyForUser(req.userId)
    if (!baby || baby.id !== activity.babyId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await prisma.activityLog.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
