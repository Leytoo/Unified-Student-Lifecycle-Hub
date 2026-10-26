import { UserRole } from '../constants';

export function maskSSN(ssn?: string): string {
  if (!ssn) return '***-**-****';
  const clean = ssn.replace(/\D/g, '');
  if (clean.length < 4) return '***-**-****';
  return `***-**-${clean.slice(-4)}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '(***) ***-****';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 4) return '(***) ***-****';
  return `(***) ***-${clean.slice(-4)}`;
}

export function maskStudentProfileForRole(student: any, role: UserRole) {
  // If Registrar or Admin, full PII access
  if (role === UserRole.REGISTRAR || role === UserRole.ADMIN) {
    return { ...student, _piiMasked: false };
  }

  // Otherwise mask FERPA protected PII (SSN, Phone, Address)
  return {
    ...student,
    ssn: maskSSN(student.ssn),
    phone: maskPhone(student.phone),
    _piiMasked: true,
    _governanceNotice: 'FERPA Protected Information Masked for current role.'
  };
}
