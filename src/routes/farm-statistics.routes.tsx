import React from 'react';
import { Route } from 'react-router-dom';
import { FarmStatisticsProvider } from '../features/farm-statistics/context';
import FarmStatisticsDashboard from '../features/farm-statistics/FarmStatisticsDashboard';
import DataCollectionPipeline from '../features/farm-statistics/DataCollectionPipeline';

const FarmStatisticsLayout = ({ children }: { children: React.ReactNode }) => (
  <FarmStatisticsProvider>
    {children}
  </FarmStatisticsProvider>
);

const farmStatisticsRoutes = [
  <Route 
    key="farm-statistics"
    path="/farm-statistics"
    element={
      <FarmStatisticsLayout>
        <FarmStatisticsDashboard />
      </FarmStatisticsLayout>
    }
  />,
  <Route
    key="farm-statistics-data-collection"
    path="/farm-statistics/data-collection"
    element={
      <FarmStatisticsLayout>
        <DataCollectionPipeline />
      </FarmStatisticsLayout>
    }
  />
];

export default farmStatisticsRoutes;
