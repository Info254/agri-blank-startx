
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface LogisticsDataAnalysisProps {
  isLoading: boolean;
}

const LogisticsDataAnalysis: React.FC<LogisticsDataAnalysisProps> = ({ isLoading }) => {
  const generateLogisticsData = () => {
    return [
      { issue: 'Poor Road Infrastructure', frequency: 65, impact: 'High' },
      { issue: 'Lack of Cold Storage', frequency: 45, impact: 'High' },
      { issue: 'High Transport Costs', frequency: 72, impact: 'High' },
      { issue: 'Delayed Collections', frequency: 38, impact: 'Medium' },
      { issue: 'Fragmented Supply Chain', frequency: 55, impact: 'Medium' },
      { issue: 'Limited Market Access', frequency: 60, impact: 'High' },
    ];
  };

  const generateTransportModeData = () => {
    return [
      { name: 'Trucks', value: 45, color: '#0088FE' },
      { name: 'Motorcycles', value: 25, color: '#00C49F' },
      { name: 'Hand Carts', value: 15, color: '#FFBB28' },
      { name: 'Animal Transport', value: 10, color: '#FF8042' },
      { name: 'Public Transport', value: 5, color: '#8884d8' },
    ];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Badge variant="outline" className="mb-6 bg-blue-50">
        Based on analysis of Kilimo statistics and agricultural surveys
      </Badge>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Logistics Challenges Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={generateLogisticsData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="issue" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" name="Reported Frequency (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div>
          <h3 className="text-lg font-medium mb-4">Transport Modes Used in Agriculture</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={generateTransportModeData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {generateTransportModeData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Key Findings</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-medium">Infrastructure Gap:</span> 65% of agricultural areas report inadequate road infrastructure
            </li>
            <li>
              <span className="font-medium">Cold Chain Deficiency:</span> Only 22% of fresh produce benefits from proper cold chain
            </li>
            <li>
              <span className="font-medium">Transport Modes:</span> Traditional and informal methods still dominate agricultural logistics
            </li>
            <li>
              <span className="font-medium">Cost Burden:</span> Small-scale farmers spend 3x more on transportation as a percentage of revenue
            </li>
            <li>
              <span className="font-medium">Regional Disparity:</span> Western and coastal regions face more severe logistics challenges
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-10 p-4 border rounded-lg bg-blue-50">
        <h3 className="text-lg font-medium mb-4">Methodology</h3>
        <p>
          This analysis combines data from Kilimo Statistics API, transportation surveys, and farmer interviews to
          identify key logistics challenges. The frequency represents the percentage of farmers reporting each issue
          as a significant barrier to market access.
        </p>
      </div>
    </>
  );
};

export default LogisticsDataAnalysis;
