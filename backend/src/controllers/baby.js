import prisma from '../prisma.js'

// Helper: get the baby profile for the current user (or their partner's baby)
async function findBabyForUser(userId) {
  // First check if user has their own baby
  let baby = await prisma.babyProfile.findUnique({ where: { userId } })
  if (baby) return baby

  // Check if user is a linked partner
  const link = await prisma.partnerLink.findFirst({
    where: { partnerUserId: userId, status: 'active' },
  })
  if (link) {
    baby = await prisma.babyProfile.findUnique({ where: { userId: link.primaryUserId } })
  }
  return baby
}

// GET /api/baby
export async function getBaby(req, res, next) {
  try {
    const baby = await findBabyForUser(req.userId)
    if (!baby) {
      return res.json({ baby: null })
    }
    res.json({ baby })
  } catch (err) {
    next(err)
  }
}

// POST /api/baby
export async function createBaby(req, res, next) {
  try {
    const {
      name, dob, isPremature, dueDateIfPremature,
      feedingMethods, sensitivities, soothingPrefs,
      sensitiveToLight, sensitiveToNoise, routinePreference,
      micEnabled, notificationsEnabled,
    } = req.body

    if (!name || !dob) {
      return res.status(400).json({ error: 'Baby name and date of birth are required' })
    }

    // Check if user already has a baby profile
    const existing = await prisma.babyProfile.findUnique({ where: { userId: req.userId } })
    if (existing) {
      return res.status(409).json({ error: 'Baby profile already exists — use PATCH to update' })
    }

    const baby = await prisma.babyProfile.create({
      data: {
        userId: req.userId,
        name,
        dob: new Date(dob),
        isPremature: isPremature || false,
        dueDateIfPremature: dueDateIfPremature ? new Date(dueDateIfPremature) : null,
        feedingMethods: feedingMethods || [],
        sensitivities: sensitivities || [],
        soothingPrefs: soothingPrefs || [],
        sensitiveToLight: sensitiveToLight || false,
        sensitiveToNoise: sensitiveToNoise || false,
        routinePreference: routinePreference || null,
        micEnabled: micEnabled || false,
        notificationsEnabled: notificationsEnabled || false,
      },
    })

    res.status(201).json({ baby })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/baby/:id
export async function updateBaby(req, res, next) {
  try {
    const { id } = req.params

    // Verify ownership
    const existing = await prisma.babyProfile.findUnique({ where: { id } })
    if (!existing || existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this profile' })
    }

    const data = {}
    const allowed = [
      'name', 'isPremature', 'sensitiveToLight', 'sensitiveToNoise',
      'routinePreference', 'micEnabled', 'notificationsEnabled',
    ]
    const arrayFields = ['feedingMethods', 'sensitivities', 'soothingPrefs']
    const dateFields = ['dob', 'dueDateIfPremature']

    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key]
    }
    for (const key of arrayFields) {
      if (req.body[key] !== undefined) data[key] = req.body[key]
    }
    for (const key of dateFields) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key] ? new Date(req.body[key]) : null
      }
    }

    const baby = await prisma.babyProfile.update({
      where: { id },
      data,
    })

    res.json({ baby })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/baby/:id/permissions
export async function updatePermissions(req, res, next) {
  try {
    const { id } = req.params
    const { micEnabled, notificationsEnabled } = req.body

    const existing = await prisma.babyProfile.findUnique({ where: { id } })
    if (!existing || existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const data = {}
    if (micEnabled !== undefined) data.micEnabled = micEnabled
    if (notificationsEnabled !== undefined) data.notificationsEnabled = notificationsEnabled

    const baby = await prisma.babyProfile.update({ where: { id }, data })
    res.json({ baby })
  } catch (err) {
    next(err)
  }
}

export { findBabyForUser }
