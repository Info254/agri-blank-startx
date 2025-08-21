
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LogisticsChallenges: React.FC = () => {
  const logisticsChallenges = [
    {
      title: 'Poor Road Infrastructure',
      description: 'Many agricultural regions have poor quality roads that become impassable during rainy seasons.',
      impact: 'Delays in transportation, increased costs, and reduced access to markets.',
      solution: 'Advocacy for infrastructure improvement, route optimization, and using appropriate vehicles for terrain.',
    },
    {
      title: 'Lack of Cold Chain',
      description: '80% of rural areas lack proper cold storage facilities, resulting in significant post-harvest losses.',
      impact: 'Reduced shelf life, lower quality products, and increased food waste.',
      solution: 'Investment in solar-powered cold storage, refrigerated transport, and preservation techniques.',
    },
    {
      title: 'High Transportation Costs',
      description: 'Transportation costs can account for up to 40% of the total value of agricultural products.',
      impact: 'Reduced farmer profits, higher consumer prices, and limited market participation.',
      solution: 'Consolidation of shipments, cooperative transport models, and efficient route planning.',
    },
    {
      title: 'Limited Logistics Services',
      description: 'Rural areas have few professional logistics service providers with appropriate equipment.',
      impact: 'Farmers rely on informal transporters, reducing reliability and increasing risks.',
      solution: 'Development of rural logistics networks, transport cooperatives, and digital logistics platforms.',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logisticsChallenges.map((challenge, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{challenge.description}</p>
              <p><span className="font-medium">Impact:</span> {challenge.impact}</p>
              <p><span className="font-medium">Potential Solution:</span> {challenge.solution}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 p-4 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-4">Impact on Supply Chain Efficiency</h3>
        <p className="mb-4">
          Logistics challenges significantly reduce the efficiency of agricultural supply chains in Kenya:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Up to 40% of fresh produce is lost due to logistical inefficiencies</li>
          <li>Rural farmers spend 4-6 hours on average to reach the nearest collection center</li>
          <li>Transportation costs account for 30-40% of the final product price</li>
          <li>Only 23% of smallholder farmers have access to reliable transportation services</li>
        </ul>
      </div>
    </>
  );
};

export default LogisticsChallenges;
