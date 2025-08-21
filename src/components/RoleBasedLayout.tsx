

import type { ReactNode } from 'react';
import AgentProductAuctionDashboard from '@/components/AgentProductAuctionDashboard';

interface RoleBasedLayoutProps {
  role: 'admin' | 'agent' | 'user';
  user: { id: string; market_id: string };
  children?: ReactNode;
  admin?: ReactNode;
  agent?: ReactNode;
  userView?: ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ role, user, children, admin, agent, userView }) => {
  return (
    <>
      {children}
      {role === 'admin' && admin}
      {role === 'agent' && (
        <>
          {agent}
          <AgentProductAuctionDashboard agentId={user.id} marketId={user.market_id} />
        </>
      )}
      {role === 'user' && userView}
    </>
  );
};

export default RoleBasedLayout;
