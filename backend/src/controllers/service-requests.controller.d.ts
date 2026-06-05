import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
export declare const createServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createDraftServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const submitDraftServiceRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getServiceRequests: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateServiceRequestStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=service-requests.controller.d.ts.map