import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants';
import { ForbiddenError } from '../exceptions';
import { db } from '../lib/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    name?: string;
  };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  // Extract role from header or bearer token or default to REGISTRAR for developer ease
  const roleHeader = req.headers['x-user-role'] as string;
  const authHeader = req.headers.authorization;

  let role = UserRole.REGISTRAR;
  if (roleHeader && Object.values(UserRole).includes(roleHeader as UserRole)) {
    role = roleHeader as UserRole;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (Object.values(UserRole).includes(token as UserRole)) {
      role = token as UserRole;
    }
  }

  req.user = {
    id: `USER-${role.toLowerCase()}-01`,
    role,
    name: `Authorized ${role}`
  };

  next();
};

export const requireRole = (allowedRoles: (UserRole | string)[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Log security violation in Audit Trail (Data Governance)
      db.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'ANONYMOUS',
        userRole: userRole || UserRole.STUDENT,
        action: 'GOVERNANCE_ACCESS_DENIED',
        targetId: req.path,
        details: `Access Denied to ${req.method} ${req.path}. Required roles: [${allowedRoles.join(', ')}], current role: ${userRole}`
      });

      return next(new ForbiddenError(`Data Governance Policy Violation: Access Denied. Required roles: [${allowedRoles.join(', ')}].`));
    }

    next();
  };
};
