import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getEmployees: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createEmployee: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getHrAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const seedHrData: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=hr.controller.d.ts.map