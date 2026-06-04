import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../config/db.js';
import { getIO } from '../config/socket.js';

export const getDeals = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deals = await prisma.deal.findMany({
      where: {
        lead: {
          companyId
        }
      },
      include: {
        lead: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const formattedDeals = deals.map(deal => {
      let probability = 10;
      switch (deal.stage) {
        case 'NEW_LEAD': probability = 10; break;
        case 'REQUIREMENT_REVIEW': probability = 25; break;
        case 'PROPOSAL_SENT': probability = 50; break;
        case 'PAYMENT_RECEIVED': probability = 75; break;
        case 'IN_PROGRESS': probability = 85; break;
        case 'UNDER_REVIEW': probability = 95; break;
        case 'COMPLETED': probability = 100; break;
        case 'CLOSED': probability = 100; break;
      }

      return {
        id: deal.id,
        title: deal.title,
        company: deal.lead.companyName || deal.lead.name,
        value: deal.value,
        stage: deal.stage.toLowerCase(),
        probability,
        leadId: deal.leadId
      };
    });

    res.json(formattedDeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

export const updateDealStage = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const id = req.params.id as string;
    const { stage } = req.body;

    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const uppercaseStage = stage.toUpperCase();

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { lead: true }
    });

    if (!deal || (deal as any).lead.companyId !== companyId) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { stage: uppercaseStage }
    });

    // Create an Activity Log for the stage change
    if ((deal as any).stage !== uppercaseStage) {
      const activity = await prisma.activityLog.create({
        data: {
          userId: req.user?.id as string,
          action: 'STAGE_CHANGED',
          entityType: 'DEAL',
          entityId: id,
          details: `Stage updated from ${(deal as any).stage} to ${uppercaseStage}`
        }
      });
      try {
        const user = await prisma.user.findUnique({ where: { id: req.user?.id as string }, select: { firstName: true, lastName: true } });
        getIO().emit('new-activity', { ...activity, user });
        getIO().emit('metrics-updated');
      } catch (e) {
        console.error('Socket emit error:', e);
      }
    }

    res.json(updatedDeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update deal stage' });
  }
};

export const createDeal = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const { title, companyName, value, stage } = req.body;

    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const uppercaseStage = (stage || 'NEW_LEAD').toUpperCase();

    // Create a Lead and a Deal simultaneously
    const lead = await prisma.lead.create({
      data: {
        companyId,
        name: companyName, // simplified
        companyName,
        status: uppercaseStage,
        deals: {
          create: {
            title,
            value: Number(value),
            stage: uppercaseStage
          }
        }
      },
      include: {
        deals: true
      }
    });

    const newDeal = lead.deals[0]!;

    let probability = 10;
    switch (newDeal.stage) {
      case 'NEW_LEAD': probability = 10; break;
      case 'REQUIREMENT_REVIEW': probability = 25; break;
      case 'PROPOSAL_SENT': probability = 50; break;
      case 'PAYMENT_RECEIVED': probability = 75; break;
      case 'IN_PROGRESS': probability = 85; break;
      case 'UNDER_REVIEW': probability = 95; break;
      case 'COMPLETED': probability = 100; break;
      case 'CLOSED': probability = 100; break;
    }

    const formattedDeal = {
      id: newDeal.id,
      title: newDeal.title,
      company: lead.companyName || lead.name,
      value: newDeal.value,
      stage: newDeal.stage.toLowerCase(),
      probability
    };

    try {
      getIO().emit('metrics-updated');
    } catch (e) {}

    res.status(201).json(formattedDeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
};

export const seedDeals = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const count = await prisma.lead.count({ where: { companyId } });
    if (count > 0) {
      res.json({ message: 'Already seeded' });
      return;
    }

    const mockData = [
      { name: 'John Doe', companyName: 'Acme Corp', title: 'HR Platform Setup', value: 120000, stage: 'NEW_LEAD' },
      { name: 'Jane Smith', companyName: 'TechNova', title: 'Marketing Campaign', value: 85000, stage: 'REQUIREMENT_REVIEW' },
      { name: 'Bob Johnson', companyName: 'GlobalBank', title: 'AI Chatbot', value: 45000, stage: 'PROPOSAL_SENT' },
      { name: 'Alice Williams', companyName: 'Apex Systems', title: 'CRM Implementation', value: 24000, stage: 'IN_PROGRESS' },
      { name: 'Charlie Brown', companyName: 'Zenith', title: 'Custom Analytics', value: 150000, stage: 'COMPLETED' }
    ];

    for (const item of mockData) {
      await prisma.lead.create({
        data: {
          companyId,
          name: item.name,
          companyName: item.companyName,
          status: item.stage,
          deals: {
            create: {
              title: item.title,
              value: item.value,
              stage: item.stage
            }
          }
        }
      });
    }

    res.json({ message: 'Successfully seeded deals' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed deals' });
  }
};

export const getDealDetails = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        lead: {
          include: {
            tasks: { orderBy: { createdAt: 'desc' } },
            serviceRequest: true
          }
        }
      }
    });

    if (!deal) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const activities = await prisma.activityLog.findMany({
      where: { entityType: 'DEAL', entityId: id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ deal, activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch deal details' });
  }
};

export const createDealTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, dueDate } = req.body;
    
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        leadId: deal.leadId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    // Log activity
    const activity = await prisma.activityLog.create({
      data: {
        userId: req.user?.id as string,
        action: 'TASK_CREATED',
        entityType: 'DEAL',
        entityId: id,
        details: `Task created: ${title}`
      }
    });
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user?.id as string }, select: { firstName: true, lastName: true } });
      getIO().emit('new-activity', { ...activity, user });
    } catch (e) {
      console.error('Socket emit error:', e);
    }

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // 'TODO', 'IN_PROGRESS', 'DONE'
    const userId = req.user?.id;

    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });

    if (task.leadId && userId) {
      const activity = await prisma.activityLog.create({
        data: {
          userId,
          action: 'TASK_UPDATED',
          entityType: 'DEAL',
          entityId: task.leadId,
          details: `Task "${task.title}" marked as ${status}`
        }
      });
      try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true } });
        getIO().emit('new-activity', { ...activity, user });
      } catch (e) {
        console.error('Socket emit error:', e);
      }
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};
