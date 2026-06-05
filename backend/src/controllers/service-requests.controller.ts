import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/db.js';
import { getIO } from '../config/socket.js';

export const createServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;
    const { serviceType, budget, timeline, priority, notes } = req.body;

    if (!userId || !companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Create the Service Request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId,
        companyId,
        serviceType,
        budget: budget ? Number(budget) : null,
        timeline,
        priority: priority || 'NORMAL',
        notes,
        status: 'PENDING'
      }
    });

    // 2. Create the CRM Lead automatically
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { company: true } });
    const leadName = `${user?.firstName || 'Client'} - ${serviceType}`;

    const lead = await prisma.lead.create({
      data: {
        companyId,
        name: leadName,
        companyName: user?.lastName || 'Client Company',
        status: 'NEW_LEAD',
        serviceRequest: { connect: { id: serviceRequest.id } },
        deals: {
          create: {
            title: `${serviceType} Implementation`,
            value: budget ? Number(budget) : 0,
            stage: 'NEW_LEAD'
          }
        }
      }
    });

    // 3. Log Activity
    const activity = await prisma.activityLog.create({
      data: {
        userId,
        action: 'CREATED_REQUEST',
        entityType: 'SERVICE_REQUEST',
        entityId: serviceRequest.id,
        details: `Client ${user?.firstName} requested ${serviceType}.`
      }
    });

    try {
      getIO().emit('new-activity', {
        ...activity,
        user: { firstName: user?.firstName, lastName: user?.lastName }
      });
      getIO().emit('new-request', {
        ...serviceRequest,
        user: { firstName: user?.firstName, lastName: user?.lastName, company: { name: user?.company?.name } }
      });
    } catch (e) {
      console.error('Socket emit error:', e);
    }

    res.status(201).json({ serviceRequest, lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
};

export const createDraftServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;
    const { serviceType, budget, timeline, priority, notes } = req.body;

    if (!userId || !companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId,
        companyId,
        serviceType: serviceType || 'Draft Project',
        budget: budget ? Number(budget) : null,
        timeline,
        priority: priority || 'NORMAL',
        notes,
        status: 'DRAFT'
      }
    });

    res.status(201).json({ serviceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create draft request' });
  }
};

export const submitDraftServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;
    const id = req.params.id as string;
    const { budget, timeline, notes } = req.body;

    if (!userId || !companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingRequest = await prisma.serviceRequest.findUnique({ where: { id } });
    if (!existingRequest || existingRequest.userId !== userId) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        budget: budget ? Number(budget) : existingRequest.budget,
        timeline: timeline || existingRequest.timeline,
        notes: notes || existingRequest.notes,
        status: 'PENDING'
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { company: true } });
    const leadName = `${user?.firstName || 'Client'} - ${serviceRequest.serviceType}`;

    const lead = await prisma.lead.create({
      data: {
        companyId,
        name: leadName,
        companyName: user?.lastName || 'Client Company',
        status: 'NEW_LEAD',
        serviceRequest: { connect: { id: serviceRequest.id } },
        deals: {
          create: {
            title: `${serviceRequest.serviceType} Implementation`,
            value: serviceRequest.budget || 0,
            stage: 'NEW_LEAD'
          }
        }
      }
    });

    const activity = await prisma.activityLog.create({
      data: {
        userId,
        action: 'SUBMITTED_DRAFT',
        entityType: 'SERVICE_REQUEST',
        entityId: serviceRequest.id,
        details: `Client ${user?.firstName} submitted a drafted request for ${serviceRequest.serviceType}.`
      }
    });

    try {
      getIO().emit('new-activity', { ...activity, user: { firstName: user?.firstName, lastName: user?.lastName } });
      getIO().emit('new-request', { ...serviceRequest, user: { firstName: user?.firstName, lastName: user?.lastName, company: { name: user?.company?.name } } });
      getIO().emit('metrics-updated');
    } catch (e) {
      console.error('Socket emit error:', e);
    }

    res.json({ serviceRequest, lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit draft request' });
  }
};

export const getServiceRequests = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const type = req.query.type as string;
    const limit = req.query.limit as string;

    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = (await prisma.user.findUnique({
      where: { id: req.user?.id as string },
      include: { role: true }
    })) as any;

    const whereClause: any = {};
    if (user?.role?.name !== 'ADMIN' && user?.role?.name !== 'SUPER_ADMIN') {
      whereClause.companyId = companyId;
    }
    
    if (type) {
      if (type.includes(',')) {
        whereClause.serviceType = { in: type.split(',') };
      } else {
        whereClause.serviceType = type;
      }
    }
    
    // Hide drafts from general admin feed
    whereClause.status = { not: 'DRAFT' };

    const requests = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, company: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      ...(limit !== 'all' && { take: 50 })
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
};

export const updateServiceRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { status } = req.body;

    if (!companyId || !userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = (await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    })) as any;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        lead: {
          include: { deals: true }
        }
      }
    });

    const isAdmin = user?.role?.name === 'ADMIN' || user?.role?.name === 'SUPER_ADMIN';

    if (!serviceRequest || (!isAdmin && serviceRequest.companyId !== companyId)) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }

    // Update ServiceRequest
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: { status },
      include: { user: { select: { firstName: true, lastName: true, company: { select: { name: true } } } } }
    });

    // If there is a linked Deal, update its stage based on the new status
    if (serviceRequest.lead && serviceRequest.lead.deals.length > 0) {
      const deal = serviceRequest.lead.deals[0];
      if (deal) {
        let newDealStage = deal.stage;
        
        if (status === 'IN_PROGRESS') newDealStage = 'IN_PROGRESS';
        if (status === 'REJECTED') newDealStage = 'LOST';
        if (status === 'COMPLETED') newDealStage = 'WON';

        if (newDealStage !== deal.stage) {
          await prisma.deal.update({
            where: { id: deal.id },
            data: { stage: newDealStage }
          });
        }
      }
    }

    // Auto-create a Job Requisition if it's a Recruitment request being accepted
    if (serviceRequest.serviceType === 'Recruitment' && (status === 'IN_PROGRESS' || status === 'COMPLETED')) {
      // We check if a job was already created to prevent duplicates (rudimentary check via title)
      const existingJob = await prisma.job.findFirst({
        where: { companyId, description: { contains: id } }
      });
      
      if (!existingJob) {
        await prisma.job.create({
          data: {
            companyId,
            title: `Requested Role: ${serviceRequest.priority} Priority`,
            description: `${serviceRequest.notes || 'No description provided.'}\n\nLinked to Request: ${id}`,
            department: 'Requested',
            location: 'TBD',
            type: 'FULL_TIME',
            status: 'OPEN'
          }
        });
      }
    }

    // Auto-create a Campaign if it's a Marketing request being accepted
    if (serviceRequest.serviceType === 'Marketing' && (status === 'IN_PROGRESS' || status === 'COMPLETED')) {
      const existingCampaign = await prisma.campaign.findFirst({
        where: { companyId, name: { contains: id } }
      });
      
      if (!existingCampaign) {
        await prisma.campaign.create({
          data: {
            companyId,
            name: `Requested Campaign: ${serviceRequest.priority} Priority - ${id.slice(-6)}`,
            type: 'SOCIAL',
            budget: serviceRequest.budget || 0,
            status: 'ACTIVE',
            startDate: new Date()
          }
        });
      }
    }

    // Log the activity
    const admin = user;
    const activity = await prisma.activityLog.create({
      data: {
        userId,
        action: `REQUEST_${status}`,
        entityType: 'SERVICE_REQUEST',
        entityId: serviceRequest.id,
        details: `Admin ${admin?.firstName} marked request ${id.slice(-6)} as ${status.replace('_', ' ')}.`
      }
    });

    try {
      getIO().emit('new-activity', {
        ...activity,
        user: { firstName: admin?.firstName, lastName: admin?.lastName }
      });
      getIO().emit('update-request', updatedRequest);
      getIO().emit('metrics-updated');
    } catch (e) {}

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update service request status' });
  }
};
