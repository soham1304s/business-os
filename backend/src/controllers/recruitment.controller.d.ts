import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getJobs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createJob: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCandidates: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPipelineStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const seedRecruitmentData: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=recruitment.controller.d.ts.map