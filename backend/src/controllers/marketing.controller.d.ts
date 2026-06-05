import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getCampaigns: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createCampaign: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMarketingStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const seedMarketingData: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=marketing.controller.d.ts.map