import prisma from '../prisma.js'

// POST /api/partner/invite
export async function invitePartner(req, res, next) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Partner email is required' })
    }

    // Can't invite yourself
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (user.email === email) {
      return res.status(400).json({ error: 'You cannot invite yourself' })
    }

    // Check if already invited
    const existing = await prisma.partnerLink.findFirst({
      where: { primaryUserId: req.userId, inviteEmail: email },
    })
    if (existing) {
      return res.status(409).json({ error: 'Partner already invited', link: existing })
    }

    // Check if the invited email already has an account
    const partnerUser = await prisma.user.findUnique({ where: { email } })

    const link = await prisma.partnerLink.create({
      data: {
        primaryUserId: req.userId,
        partnerUserId: partnerUser?.id || null,
        inviteEmail:   email,
        status:        partnerUser ? 'active' : 'pending',
      },
    })

    res.status(201).json({ link })
  } catch (err) {
    next(err)
  }
}

// GET /api/partner
export async function getPartner(req, res, next) {
  try {
    // Check links where user is the primary or the partner
    const link = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { primaryUserId: req.userId, status: 'active' },
          { partnerUserId: req.userId, status: 'active' },
        ],
      },
      include: {
        primaryUser: { select: { id: true, name: true, email: true } },
        partnerUser: { select: { id: true, name: true, email: true } },
      },
    })

    if (!link) {
      return res.json({ partner: null, link: null })
    }

    // Return the other person's info
    const partner = link.primaryUserId === req.userId
      ? link.partnerUser
      : link.primaryUser

    res.json({ partner, link })
  } catch (err) {
    next(err)
  }
}

// GET /api/partner/pending  — list pending invitations (for the current user)
export async function getPendingInvites(req, res, next) {
  try {
    const sent = await prisma.partnerLink.findMany({
      where: { primaryUserId: req.userId },
      orderBy: { createdAt: 'desc' },
    })

    const received = await prisma.partnerLink.findMany({
      where: { partnerUserId: req.userId, status: 'pending' },
      include: {
        primaryUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ sent, received })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/partner/:id/accept
export async function acceptInvite(req, res, next) {
  try {
    const link = await prisma.partnerLink.findUnique({ where: { id: req.params.id } })

    if (!link) {
      return res.status(404).json({ error: 'Invite not found' })
    }
    if (link.partnerUserId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const updated = await prisma.partnerLink.update({
      where: { id: link.id },
      data: { status: 'active' },
    })

    res.json({ link: updated })
  } catch (err) {
    next(err)
  }
}
