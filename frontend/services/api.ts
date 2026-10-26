const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}, roleToken?: string) {
  const token = roleToken || (typeof window !== 'undefined' ? localStorage.getItem('edugov_role') || 'FACULTY' : 'FACULTY');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('x-user-role', token);

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  }

  return data;
}

// 1. Grade Submission (from shared Gemini conversation)
export async function updateGradeAPI(enrollmentId: string, grade: number, token?: string) {
  return fetchWithAuth('/grades', {
    method: 'POST',
    body: JSON.stringify({ enrollmentId, grade }),
  }, token);
}

export async function getGradesAPI(token?: string) {
  return fetchWithAuth('/grades', { method: 'GET' }, token);
}

// 2. Student 360 & PII Masking
export async function getStudentsAPI(token?: string) {
  return fetchWithAuth('/students', { method: 'GET' }, token);
}

// 3. Data Quality Management (DQM)
export async function getDqmMetricsAPI(token?: string) {
  return fetchWithAuth('/dqm/metrics', { method: 'GET' }, token);
}

export async function remediateDqmAPI(token?: string) {
  return fetchWithAuth('/dqm/remediate', { method: 'POST' }, token);
}

// 4. Governance Policies & Audit Logs
export async function getPoliciesAPI(token?: string) {
  return fetchWithAuth('/governance/policies', { method: 'GET' }, token);
}

export async function getAuditLogsAPI(token?: string) {
  return fetchWithAuth('/governance/audit-logs', { method: 'GET' }, token);
}
