// @ts-nocheck
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BidManagement } from '../components/BidManagement';
import { InventoryManagement } from '../components/InventoryManagement';
import { MarketAnalytics } from '../components/MarketAnalytics';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/bids" element={<BidManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/analytics" element={<MarketAnalytics />} />
        {/* Add other existing routes here */}
      </Routes>
    </BrowserRouter>
  );
};
