import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addChatMessage } from '../store/financeSlice';
import { ChatMessage } from '../types';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const AIChat: React.FC = () => {
  const { chatHistory, transactions, budgets, savingsGoals } = useSelector((state: RootState) => state.finance);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Calculate some basic stats for contextual responses
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netWorth = totalIncome - totalExpenses;
    const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;
    
    // Simple keyword-based responses (in a real app, this would use OpenAI API)
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      if (overBudgetCount > 0) {
        return `I notice you're over budget in ${overBudgetCount} categor${overBudgetCount > 1 ? 'ies' : 'y'}. Consider reducing spending in these areas or adjusting your budget limits. Would you like specific suggestions for cutting expenses?`;
      }
      return `Your budgets look healthy! You're staying within limits across all categories. Keep up the good work with your spending discipline.`;
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
      const savingsRate = totalSavingsTarget > 0 ? ((totalSaved / totalSavingsTarget) * 100).toFixed(1) : '0';
      
      return `You're ${savingsRate}% towards your savings goals! Based on your current income of $${totalIncome.toLocaleString()}, I recommend saving at least 20% monthly. Consider setting up automatic transfers to boost your savings rate.`;
    }
    
    if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
      return `Your current income is $${totalIncome.toLocaleString()}. To improve your financial situation, consider: 1) Asking for a raise, 2) Starting a side hustle, 3) Investing in skills that increase your earning potential. What interests you most?`;
    }
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
      if (netWorth > 1000) {
        return `With your positive net worth of $${netWorth.toLocaleString()}, you're in a good position to start investing. Consider low-cost index funds or ETFs as a starting point. Remember to maintain 3-6 months of emergency savings first!`;
      }
      return `Before investing, focus on building an emergency fund and paying off high-interest debt. Once you have a solid foundation, investing in diversified funds can help grow your wealth long-term.`;
    }
    
    if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
      return `I don't see specific debt information in your current data. If you have debts, prioritize paying off high-interest debt first (like credit cards), while making minimum payments on others. The avalanche method can save you money on interest!`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      const emergencyGoal = savingsGoals.find(g => g.category.toLowerCase().includes('emergency'));
      if (emergencyGoal) {
        const progress = ((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100).toFixed(1);
        return `Your emergency fund is ${progress}% complete at $${emergencyGoal.currentAmount.toLocaleString()}. Aim for 3-6 months of expenses. Based on your spending, you're making good progress!`;
      }
      return `Consider creating an emergency fund with 3-6 months of expenses. Based on your current spending patterns, this would be around $${(totalExpenses * 3).toLocaleString()} to $${(totalExpenses * 6).toLocaleString()}.`;
    }
    
    // Default responses
    const defaultResponses = [
      `Based on your financial data, you have a net worth of $${netWorth.toLocaleString()}. ${netWorth > 0 ? "That's positive progress!" : "Let's work on improving this together."} What specific area would you like to focus on?`,
      `I can help you with budgeting, saving strategies, investment advice, and expense optimization. Your current monthly expenses average $${(totalExpenses / Math.max(1, transactions.filter(t => t.type === 'expense').length)).toFixed(0)}. What would you like to explore?`,
      `Looking at your spending patterns, I notice most of your expenses go to ${getMostExpensiveCategory()}. Would you like tips on optimizing this category or discussing other financial goals?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const getMostExpensiveCategory = (): string => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const topCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topCategory ? topCategory[0] : 'various categories';
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    dispatch(addChatMessage(userMessage));

    // Generate AI response
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(message),
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };

    // Simulate typing delay
    setTimeout(() => {
      dispatch(addChatMessage(aiResponse));
    }, 1000);

    setMessage('');
  };

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Financial Advisor</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">
                      Hi! I'm your AI financial advisor. I can help you with budgeting, saving strategies, investment advice, and more. What would you like to know about your finances?
                    </p>
                  </div>
                </div>
              )}
              
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-start space-x-2 ${
                    chat.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    chat.sender === 'user' ? 'bg-blue-600' : 'bg-blue-100'
                  }`}>
                    {chat.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-xs ${
                      chat.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{chat.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your finances..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;