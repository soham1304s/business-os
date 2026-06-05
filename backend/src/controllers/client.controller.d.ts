import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getClientProjects: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getClientInvoices: (req: AuthRequest, res: Response) => Promise<void>;
export declare const payInvoice: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePassword: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=client.controller.d.ts.map