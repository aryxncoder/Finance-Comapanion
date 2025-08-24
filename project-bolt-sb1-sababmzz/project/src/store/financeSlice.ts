import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FinanceState, Transaction, Budget, SavingsGoal, ChatMessage } from '../types';

const initialState: FinanceState = {
  transactions: [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2025-01-01',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      category: 'Rent',
      description: 'Monthly rent payment',
      date: '2025-01-02',
    },
    {
      id: '3',
      type: 'expense',
      amount: 450,
      category: 'Groceries',
      description: 'Weekly grocery shopping',
      date: '2025-01-03',
    },
    {
      id: '4',
      type: 'expense',
      amount: 120,
      category: 'Utilities',
      description: 'Electricity bill',
      date: '2025-01-04',
    },
    {
      id: '5',
      type: 'expense',
      amount: 80,
      category: 'Entertainment',
      description: 'Movie night',
      date: '2025-01-05',
    },
  ],
  budgets: [
    {
      id: '1',
      category: 'Groceries',
      limit: 600,
      spent: 450,
      period: 'monthly',
    },
    {
      id: '2',
      category: 'Entertainment',
      limit: 300,
      spent: 80,
      period: 'monthly',
    },
    {
      id: '3',
      category: 'Utilities',
      limit: 200,
      spent: 120,
      period: 'monthly',
    },
  ],
  savingsGoals: [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2025-12-31',
      category: 'Emergency',
    },
    {
      id: '2',
      title: 'Vacation to Europe',
      targetAmount: 3500,
      currentAmount: 1200,
      deadline: '2025-08-15',
      category: 'Travel',
    },
  ],
  chatHistory: [],
  loading: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      
      // Update budget spending if it's an expense
      if (action.payload.type === 'expense') {
        const budget = state.budgets.find(b => b.category === action.payload.category);
        if (budget) {
          budget.spent += action.payload.amount;
        }
      }
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<{ id: string; updates: Partial<Budget> }>) => {
      const budget = state.budgets.find(b => b.id === action.payload.id);
      if (budget) {
        Object.assign(budget, action.payload.updates);
      }
    },
    addSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      state.savingsGoals.push(action.payload);
    },
    updateSavingsGoal: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.savingsGoals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount += action.payload.amount;
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addTransaction,
  addBudget,
  updateBudget,
  addSavingsGoal,
  updateSavingsGoal,
  addChatMessage,
  setLoading,
} = financeSlice.actions;

export default financeSlice.reducer;