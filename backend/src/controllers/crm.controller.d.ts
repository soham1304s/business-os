import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getDeals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateDealStage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createDeal: (req: AuthRequest, res: Response) => Promise<void>;
export declare const seedDeals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDealDetails: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createDealTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTaskStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=crm.controller.d.ts.map