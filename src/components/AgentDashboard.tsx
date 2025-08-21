import React, { useEffect, useState } from 'react';
import { getAgents, verifyAgent, addAgent, getCityMarketProducts } from '@/services/cityMarketService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ValidatedForm from '@/components/ValidatedForm';
import { toast } from '@/components/ui/use-toast';

interface AgentDashboardProps {
  isAdmin: boolean;
  isAgent: boolean;
  userId: string;
}

const agentFields = [
  { name: 'name', label: 'Agent Name', required: true },
  { name: 'contact', label: 'Contact', required: true },
];

const AgentDashboard: React.FC<AgentDashboardProps> = ({ isAdmin, isAgent, userId }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAgents().then(({ data, error }) => {
      if (error) toast({ title: 'Error loading agents', description: error.message });
      setAgents(data || []);
      setLoading(false);
    });
    if (isAgent) {
      getCityMarketProducts(userId).then(({ data, error }) => {
        if (error) toast({ title: 'Error loading products', description: error.message });
        setProducts(data || []);
      });
    }
  }, [isAgent, userId]);

  const handleVerify = async (agentId: string) => {
    const { error } = await verifyAgent(agentId);
    if (error) {
      toast({ title: 'Error verifying agent', description: error.message });
    } else {
      toast({ title: 'Agent verified', description: 'Agent has been verified.' });
      setAgents((prev) => prev.map(a => a.id === agentId ? { ...a, verified: true } : a));
    }
  };

  const handleAddAgent = async (values: any) => {
    const { data, error } = await addAgent({ ...values, user_id: userId });
    if (error) {
      toast({ title: 'Error adding agent', description: error.message });
    } else {
      toast({ title: 'Agent added', description: 'Agent profile created.' });
      getAgents().then(({ data }) => setAgents(data || []));
    }
    return { data, error };
  };

  if (!isAdmin && !isAgent) return null;

  return (
    <div className="p-4">
      {isAgent && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manage Your Agent Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidatedForm fields={agentFields} onSubmit={handleAddAgent} submitLabel="Save Profile" />
          </CardContent>
        </Card>
      )}
      {isAgent && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div>No products found.</div>
            ) : (
              <ul>
                {products.map((product) => (
                  <li key={product.id}>{product.product_type} - {product.quantity} @ {product.price}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Agents</CardTitle>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div>No agents found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Verified</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id}>
                      <td>{agent.name}</td>
                      <td>{agent.contact}</td>
                      <td>{agent.verified ? 'Yes' : 'No'}</td>
                      <td>
                        {!agent.verified && (
                          <Button size="sm" onClick={() => handleVerify(agent.id)}>
                            Verify
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentDashboard;
