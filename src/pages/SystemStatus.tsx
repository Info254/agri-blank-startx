
import React from 'react';
import Header from '@/components/Header';
import SystemStatus from '@/components/admin/SystemStatus';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SystemStatusPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <SystemStatus />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default SystemStatusPage;
