import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'EduGov Hub | Unified Student Lifecycle Management',
  description: 'Enterprise Data Management System enforcing Data Governance (FERPA), RBAC, and Data Quality Management (DQM) across university systems.',
  keywords: 'data governance, FERPA, DQM, enterprise data management, university, RBAC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <div className="flex h-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
              <Navbar />
              <main className="flex-1 px-6 py-6 max-w-[1400px] w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
