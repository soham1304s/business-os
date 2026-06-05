import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const getAnnouncements: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllAnnouncements: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=announcement.controller.d.ts.map