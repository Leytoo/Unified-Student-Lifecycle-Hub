export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  REGISTRAR = 'REGISTRAR',
  ADMIN = 'ADMIN'
}

export const ROLE_LABELS: Record<UserRole, { title: string; badge: string; color: string }> = {
  [UserRole.STUDENT]: { title: 'Student Viewer', badge: 'FERPA Restricted', color: 'bg-emerald-100 text-emerald-800' },
  [UserRole.FACULTY]: { title: 'Faculty Instructor', badge: 'Grade Entry Authorized', color: 'bg-blue-100 text-blue-800' },
  [UserRole.REGISTRAR]: { title: 'Registrar & DPO', badge: 'Full Governance Admin', color: 'bg-purple-100 text-purple-800' },
  [UserRole.ADMIN]: { title: 'System Administrator', badge: 'Superuser', color: 'bg-amber-100 text-amber-800' }
};
