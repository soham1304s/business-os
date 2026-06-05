import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getDashboardMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSystemActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllSystemActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUsersList: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map