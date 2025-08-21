import React, { useState } from 'react';
import BulkOrderForm from '../components/BulkOrderForm';
import BulkOrderList from '../components/BulkOrderList';
import ProcessingMatchForm from '../components/ProcessingMatchForm';
import ProcessingMatchList from '../components/ProcessingMatchList';
import NegotiationLog from '../components/NegotiationLog';

export default function BulkOrderDashboard({ user }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [negotiationLog, setNegotiationLog] = useState([]);

  return (
    <div className="container mx-auto py-8">
      <BulkOrderForm onCreated={() => window.location.reload()} />
      <BulkOrderList onSelect={order => {
        setSelectedOrder(order);
        setShowMatchForm(true);
      }} />
      {showMatchForm && selectedOrder && (
        <ProcessingMatchForm
          bulkOrderId={selectedOrder.id}
          farmerId={user?.id}
          onCreated={() => window.location.reload()}
        />
      )}
      {selectedOrder && <ProcessingMatchList bulkOrderId={selectedOrder.id} />}
      {negotiationLog && <NegotiationLog log={negotiationLog} />}
    </div>
  );
}
