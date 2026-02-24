import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import ModelInsights from './pages/ModelInsights';
import RiskHistory from './pages/RiskHistory';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<ModelInsights />} />
            <Route path="/history" element={<RiskHistory />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#F9FAFB',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;