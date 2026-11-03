import React, { useState } from 'react';
import {
  PieChart,
  DollarSign,
  TrendingDown,
  Sparkles,
  Plus,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Product, ExpenseRecord } from '../types/grocery';

interface BudgetTrackerProps {
  monthlyBudget: number;
  onUpdateBudget: (budget: number) => void;
  expenses: ExpenseRecord[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  products: Product[];
  onLoadSuggestedBundle: (items: { productId: string; quantity: number }[]) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  monthlyBudget,
  onUpdateBudget,
  expenses,
  onAddExpense,
  products,
  onLoadSuggestedBundle
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

  // New expense form state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expStore, setExpStore] = useState('Sharma Kirana Store');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Staples');

  // Budget Suggestion Tool State
  const [targetBudgetFilter, setTargetBudgetFilter] = useState<number>(1500);
  const [customTargetInput, setCustomTargetInput] = useState('1500');

  // Calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = monthlyBudget - totalSpent;
  const percentUsed = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  // Days left in November (assumed 30 days)
  const currentDay = 3;
  const daysRemaining = 27;
  const dailyAllowance = Math.max(0, Math.round(remainingBudget / daysRemaining));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
      setIsEditingBudget(false);
    }
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expAmount);
    if (expTitle.trim() && !isNaN(amt) && amt > 0) {
      onAddExpense({
        date: new Date().toISOString().split('T')[0],
        title: expTitle.trim(),
        storeName: expStore,
        amount: amt,
        category: expCategory
      });
      setExpTitle('');
      setExpAmount('');
      setIsAddingExpense(false);
    }
  };

  // Generate Budget-Friendly Grocery Bundle for a specific target budget
  const generateBundleForBudget = (target: number) => {
    // Priority order of essentials
    const priorityProductIds = [
      'prod-rice-5kg',
      'prod-atta-5kg',
      'prod-oil-1l',
      'prod-milk-1l',
      'prod-toordal-1kg',
      'prod-sugar-1kg',
      'prod-onion-1kg',
      'prod-potato-1kg',
      'prod-tea-500g',
      'prod-butter-500g'
    ];

    let currentCost = 0;
    const selected: { productId: string; quantity: number; product: Product; minPrice: number }[] = [];

    priorityProductIds.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) {
        // find lowest price
        const prices = Object.values(prod.prices).map((p) => p.price);
        const minP = Math.min(...prices);
        if (currentCost + minP <= target) {
          selected.push({ productId: prod.id, quantity: 1, product: prod, minPrice: minP });
          currentCost += minP;
        }
      }
    });

    return { selected, totalCost: currentCost };
  };

  const budgetBundle = generateBundleForBudget(targetBudgetFilter);

  return (
    <div className="space-y-8">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Budget Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Monthly Budget</span>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-emerald-700 font-semibold hover:underline"
            >
              {isEditingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="mt-2 flex items-center gap-2">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full px-2.5 py-1 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                min="500"
                step="100"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              ₹{monthlyBudget.toLocaleString()}
            </div>
          )}
          <div className="text-[11px] text-slate-400 mt-1">Set for November 2026</div>
        </div>

        {/* Current Spending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Total Spent So Far</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            ₹{totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{percentUsed}% of monthly limit</span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className={`p-5 rounded-2xl border shadow-2xs ${
          remainingBudget < 500 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-500">Remaining Budget</div>
          <div className={`text-2xl font-extrabold mt-1 tabular-nums ${
            remainingBudget < 500 ? 'text-rose-700' : 'text-emerald-700'
          }`}>
            ₹{remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {remainingBudget > 0 ? 'On healthy track' : 'Budget exceeded!'}
          </div>
        </div>

        {/* Daily Allowance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Safe Daily Allowance</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            ₹{dailyAllowance} <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{daysRemaining} days remaining</div>
        </div>
      </div>

      {/* Visual Budget Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-600">Monthly Grocery Expense Progress</span>
          <span className="text-slate-900 font-bold tabular-nums">
            ₹{totalSpent} / ₹{monthlyBudget} ({percentUsed}%)
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 85 ? 'bg-rose-500' : percentUsed > 65 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {percentUsed > 85 && (
          <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Alert: You have consumed over 85% of your grocery budget for this month.</span>
          </div>
        )}
      </div>

      {/* Feature 4: Budget-Friendly Shopping Suggestions (Flagship Section 6.4) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Budget-Friendly Shopping Suggestions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Specify your target spend, and our algorithm auto-selects the optimal nutritious essentials pack within your budget from the cheapest stores!
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[1000, 1500, 2000, 2500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setTargetBudgetFilter(amt);
                  setCustomTargetInput(amt.toString());
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap transition-colors ${
                  targetBudgetFilter === amt
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion Summary Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800">
              Curated {budgetBundle.selected.length}-Item Essential Pantry
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Fitted Total: <span className="text-emerald-700 tabular-nums">₹{budgetBundle.totalCost}</span>{' '}
              <span className="text-xs font-normal text-slate-500">
                (Under your ₹{targetBudgetFilter} limit · ₹{targetBudgetFilter - budgetBundle.totalCost} buffer)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onLoadSuggestedBundle(
                budgetBundle.selected.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity
                }))
              );
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Load These {budgetBundle.selected.length} Items into Smart Basket</span>
          </button>
        </div>

        {/* Suggested Items Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {budgetBundle.selected.map((item) => (
            <div
              key={item.productId}
              className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.product.quantityUnit}</div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Best:</span>
                <span className="font-extrabold text-emerald-700 tabular-nums">₹{item.minPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense History Table & Manual Log Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-base">Grocery Expense History</h3>
          </div>

          <button
            onClick={() => setIsAddingExpense(!isAddingExpense)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Receipt / Bill</span>
          </button>
        </div>

        {/* Adding expense drawer form */}
        {isAddingExpense && (
          <form onSubmit={handleSaveExpense} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="font-semibold text-slate-800 text-xs">Record a Grocery Purchase</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Description (e.g. Milk & Bread, Rice sack)"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Store Name"
                value={expStore}
                onChange={(e) => setExpStore(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
                min="1"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                Add to Tracker
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-100">
          {expenses.map((exp) => (
            <div key={exp.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900">{exp.title}</div>
                <div className="text-slate-500 mt-0.5">
                  {exp.storeName} · {exp.category} · {exp.date}
                </div>
              </div>
              <div className="font-bold text-slate-900 tabular-nums text-sm">
                ₹{exp.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
