
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MyTradesTabProps {
  isLoading: boolean;
  searchTerm: string;
}

const MyTradesTab: React.FC<MyTradesTabProps> = ({ isLoading, searchTerm }) => {
  const [trades] = useState<any[]>([
    { id: 1, commodity: 'Maize', quantity: 500, price: 45, seller: 'John Kamau', buyer: 'Nairobi Mills', date: '2023-11-20', status: 'completed' },
    { id: 2, commodity: 'Coffee', quantity: 200, price: 350, seller: 'Mary Wanjiku', buyer: 'Kenya Coffee Exporters', date: '2023-11-22', status: 'pending' },
    { id: 3, commodity: 'Tea', quantity: 300, price: 280, seller: 'Sarah Muthoni', buyer: 'Global Tea Traders', date: '2023-11-25', status: 'completed' },
    { id: 4, commodity: 'Beans', quantity: 400, price: 110, seller: 'John Kamau', buyer: 'Local Market Vendors', date: '2023-11-28', status: 'pending' },
  ]);

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = searchTerm === '' || 
      trade.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No trades found. Complete an order to see your trade history.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commodity</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price (KES)</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTrades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell className="font-medium">{trade.commodity}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>{trade.seller}</TableCell>
              <TableCell>{trade.buyer}</TableCell>
              <TableCell>{trade.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trade.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {trade.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyTradesTab;
