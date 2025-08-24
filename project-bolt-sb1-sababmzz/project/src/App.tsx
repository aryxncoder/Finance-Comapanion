import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import BudgetTracker from './components/BudgetTracker';
import SavingsGoals from './components/SavingsGoals';
import AIChat from './components/AIChat';
import Navigation from './components/Navigation';
import { TrendingUp } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'budgets':
        return <BudgetTracker />;
      case 'goals':
        return <SavingsGoals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">FinanceAI</h1>
                  <p className="text-sm text-gray-600">Your AI-Powered Financial Companion</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back!</p>
                <p className="font-semibold text-gray-900">Track • Budget • Achieve</p>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>

        {/* AI Chat */}
        <AIChat />
      </div>
    </Provider>
  );
}

export default App;