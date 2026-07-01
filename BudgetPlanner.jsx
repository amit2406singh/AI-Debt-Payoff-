import React, { useState } from 'react';
import { Plus, Trash2, ShieldAlert, Sparkles, TrendingUp, Compass, Edit2, Check, X } from 'lucide-react';

export default function BudgetPlanner({ budget, onSave }) {
  // Income Form States
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');

  // Expense Form States
  const [expCategory, setExpCategory] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expIsEssential, setExpIsEssential] = useState(true);

  // Emergency Fund Month Select Target
  const [targetMonths, setTargetMonths] = useState(3);

  // Loan Borrowing Affordability States
  const [loanApr, setLoanApr] = useState(10);
  const [loanYears, setLoanYears] = useState(5);
  const [savingsAllocation, setSavingsAllocation] = useState(40);

  // Editing states for Income
  const [editingIncomeIdx, setEditingIncomeIdx] = useState(null);
  const [editIncSource, setEditIncSource] = useState('');
  const [editIncAmount, setEditIncAmount] = useState('');

  // Editing states for Expenses
  const [editingExpenseIdx, setEditingExpenseIdx] = useState(null);
  const [editExpCategory, setEditExpCategory] = useState('');
  const [editExpAmount, setEditExpAmount] = useState('');
  const [editExpIsEssential, setEditExpIsEssential] = useState(true);

  // Income handlers
  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!incSource || !incAmount) return;
    const updatedSources = [
      ...budget.incomeSources,
      { source: incSource, amount: parseFloat(incAmount) }
    ];
    onSave({ incomeSources: updatedSources });
    setIncSource('');
    setIncAmount('');
  };

  const handleDeleteIncome = (index) => {
    const updated = budget.incomeSources.filter((_, i) => i !== index);
    onSave({ incomeSources: updated });
  };

  // Expense handlers
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expCategory || !expAmount) return;
    const updatedExpenses = [
      ...budget.expenses,
      { category: expCategory, amount: parseFloat(expAmount), isEssential: expIsEssential }
    ];
    onSave({ expenses: updatedExpenses });
    setExpCategory('');
    setExpAmount('');
    setExpIsEssential(true);
  };

  const handleDeleteExpense = (index) => {
    const updated = budget.expenses.filter((_, i) => i !== index);
    onSave({ expenses: updated });
  };

  // Edit Income handlers
  const startEditingIncome = (idx, item) => {
    setEditingIncomeIdx(idx);
    setEditIncSource(item.source);
    setEditIncAmount(item.amount);
  };

  const handleUpdateIncome = (idx) => {
    const updated = [...budget.incomeSources];
    updated[idx] = { source: editIncSource, amount: parseFloat(editIncAmount) || 0 };
    onSave({ incomeSources: updated });
    setEditingIncomeIdx(null);
  };

  // Edit Expense handlers
  const startEditingExpense = (idx, item) => {
    setEditingExpenseIdx(idx);
    setEditExpCategory(item.category);
    setEditExpAmount(item.amount);
    setEditExpIsEssential(item.isEssential);
  };

  const handleUpdateExpense = (idx) => {
    const updated = [...budget.expenses];
    updated[idx] = { category: editExpCategory, amount: parseFloat(editExpAmount) || 0, isEssential: editExpIsEssential };
    onSave({ expenses: updated });
    setEditingExpenseIdx(null);
  };

  // Math
  const totalIncome = budget.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = budget.expenses.reduce((sum, e) => sum + e.amount, 0);
  const essentialExpenses = budget.expenses.filter(e => e.isEssential).reduce((sum, e) => sum + e.amount, 0);
  const nonEssentialExpenses = budget.expenses.filter(e => !e.isEssential).reduce((sum, e) => sum + e.amount, 0);
  const savingsTarget = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savingsTarget / totalIncome) * 100 : 0;

  // Emergency Fund Targets
  const fundTarget = essentialExpenses * targetMonths;
  const fundProgress = fundTarget > 0 ? (budget.emergencyFundCurrent / fundTarget) * 100 : 0;
  const cappedProgress = Math.min(100, Math.max(0, fundProgress));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
       {/* Budget Summary Metrics */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        <div className="glass-card col-3" style={{ gridColumn: 'span 3' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Revenue</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-green)' }}>
            ₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-card col-3" style={{ gridColumn: 'span 3' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Expenses</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-pink)' }}>
            ₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>Ess: ₹{essentialExpenses}</span>
            <span>|</span>
            <span>Non-Ess: ₹{nonEssentialExpenses}</span>
          </div>
        </div>

        <div className="glass-card col-3" style={{ gridColumn: 'span 3' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Cash Surplus</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: savingsTarget >= 0 ? 'var(--accent-cyan)' : '#ef4444' }}>
            ₹{savingsTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-card col-3" style={{ gridColumn: 'span 3' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Savings Rate</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {savingsRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Main Form/List Grid */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        
        {/* Income Sources Panel */}
        <div className="glass-card" style={{ gridColumn: 'span 6', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.2rem' }}>Income Sources</h3>
          <form onSubmit={handleAddIncome} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="e.g. Salary, Side Hustle" 
              value={incSource} 
              onChange={(e) => setIncSource(e.target.value)} 
              required 
              style={{ flex: 1.5 }}
            />
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={incAmount} 
              onChange={(e) => setIncAmount(e.target.value)} 
              required 
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }}>
              <Plus size={18} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {budget.incomeSources.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No income streams added yet.</p>
            ) : (
              budget.incomeSources.map((item, idx) => {
                const isEditing = editingIncomeIdx === idx;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
                        <input type="text" value={editIncSource} onChange={(e) => setEditIncSource(e.target.value)} style={{ flex: 1.5, padding: '0.4rem' }} />
                        <input type="number" value={editIncAmount} onChange={(e) => setEditIncAmount(e.target.value)} style={{ flex: 1, padding: '0.4rem' }} />
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleUpdateIncome(idx)}><Check size={14} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setEditingIncomeIdx(null)}><X size={14} /></button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.source}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>+₹{item.amount.toLocaleString()}</span>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            onClick={() => startEditingIncome(idx, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
                            onClick={() => handleDeleteIncome(idx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expenses Panel */}
        <div className="glass-card" style={{ gridColumn: 'span 6', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.2rem' }}>Monthly Expenses</h3>
          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="e.g. Rent, Gas, Groceries" 
                value={expCategory} 
                onChange={(e) => setExpCategory(e.target.value)} 
                required 
                style={{ flex: 1.5 }}
              />
              <input 
                type="number" 
                placeholder="Amount (₹)" 
                value={expAmount} 
                onChange={(e) => setExpAmount(e.target.value)} 
                required 
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={expIsEssential} 
                  onChange={(e) => setExpIsEssential(e.target.checked)} 
                  style={{ width: 'auto', transform: 'scale(1.2)' }}
                  id="chk-essential"
                />
                <label htmlFor="chk-essential" style={{ margin: 0, textTransform: 'none', cursor: 'pointer' }}>Essential Cost (Needs vs Wants)</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Add Expense
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
            {budget.expenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No expenses logged.</p>
            ) : (
              budget.expenses.map((item, idx) => {
                const isEditing = editingExpenseIdx === idx;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input type="text" value={editExpCategory} onChange={(e) => setEditExpCategory(e.target.value)} style={{ flex: 1.5, padding: '0.4rem' }} />
                          <input type="number" value={editExpAmount} onChange={(e) => setEditExpAmount(e.target.value)} style={{ flex: 1, padding: '0.4rem' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, textTransform: 'none', fontSize: '0.8rem' }}>
                            <input type="checkbox" checked={editExpIsEssential} onChange={(e) => setEditExpIsEssential(e.target.checked)} style={{ width: 'auto' }} />
                            Essential
                          </label>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleUpdateExpense(idx)}><Check size={14} /></button>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setEditingExpenseIdx(null)}><X size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {item.category}
                            <span className={`badge ${item.isEssential ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '0.55rem' }}>
                              {item.isEssential ? 'Essential' : 'Discretionary'}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-pink)' }}>-₹{item.amount.toLocaleString()}</span>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            onClick={() => startEditingExpense(idx, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
                            onClick={() => handleDeleteExpense(idx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Emergency Fund Planner Panel */}
      <div className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={22} className="neon-text-green" /> Emergency Fund Planner
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            An emergency fund acts as a buffer preventing you from accumulating high-interest debt when unexpected situations arise. 
            Financial planners recommend saving <strong>3 to 6 months</strong> of essential living costs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Target Select */}
            <div>
              <label>Survival Horizon Target</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`btn ${targetMonths === 3 ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                  onClick={() => setTargetMonths(3)}
                >
                  3 Months Cushion
                </button>
                <button 
                  className={`btn ${targetMonths === 6 ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                  onClick={() => setTargetMonths(6)}
                >
                  6 Months Cushion
                </button>
              </div>
            </div>

            {/* Current Fund Balance Input */}
            <div>
              <label>Current Saved Fund Balance (₹)</label>
              <input 
                type="number" 
                value={budget.emergencyFundCurrent || ''} 
                onChange={(e) => onSave({ emergencyFundCurrent: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 1000"
              />
            </div>
          </div>
        </div>

        {/* Target metrics & progress bar display */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <span>Target Goal ({targetMonths} Mo)</span>
            <span>Current Reserves</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{fundTarget.toLocaleString()}</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-green)' }}>
              ₹{(budget.emergencyFundCurrent || 0).toLocaleString()}
            </span>
          </div>

          <label>Funding Level Progress ({Math.round(fundProgress)}%)</label>
          <div style={{ width: '100%', height: '14px', background: 'var(--bg-tertiary)', borderRadius: '7px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
            <div 
              style={{ 
                width: `${cappedProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-green) 100%)', 
                boxShadow: 'var(--shadow-neon-green)',
                borderRadius: '7px',
                transition: 'width 0.8s ease-in-out'
              }}
            ></div>
          </div>

          {fundProgress >= 100 ? (
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Sparkles size={16} /> Fully Funded! Your living cushion is secure.
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Remaining buffer to save: <strong>₹{Math.max(0, fundTarget - budget.emergencyFundCurrent).toLocaleString()}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Loan Borrowing Capacity & Affordability Analyzer */}
      {(() => {
        // Loan Eligibility Math
        const maxEMI = savingsTarget > 0 ? savingsTarget * (savingsAllocation / 100) : 0;
        const monthlyRate = (loanApr / 100) / 12;
        const totalPayments = loanYears * 12;
        
        const affordableLoan = savingsTarget > 0 
          ? (monthlyRate > 0 
            ? maxEMI * (Math.pow(1 + monthlyRate, totalPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))
            : maxEMI * totalPayments)
          : 0;
          
        const totalInterest = savingsTarget > 0 ? (maxEMI * totalPayments) - affordableLoan : 0;

        return (
          <div className="glass-card" style={{ padding: '2rem', marginTop: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              <TrendingUp size={22} className="neon-text-cyan" />
              <h3>Borrowing Capacity & Loan Affordability Analyzer</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Calculate the maximum loan principal you can afford based on your current **Net Cash Surplus (₹{savingsTarget.toLocaleString()})**. 
              It is recommended to allocate no more than 40-50% of your net savings to service a new loan, preserving the rest as a safety cushion.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem' }}>
              {/* Sliders Input Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Allocation slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label style={{ margin: 0 }}>Allocation of Net Savings</label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{savingsAllocation}% (₹{Math.round(maxEMI).toLocaleString()}/mo EMI)</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5" 
                    value={savingsAllocation}
                    onChange={(e) => setSavingsAllocation(parseInt(e.target.value))}
                    style={{ height: '4px', background: 'var(--bg-tertiary)' }}
                  />
                </div>

                {/* APR Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label style={{ margin: 0 }}>Expected Interest Rate (APR)</label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{loanApr}% APR</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="24" 
                    step="0.5" 
                    value={loanApr}
                    onChange={(e) => setLoanApr(parseFloat(e.target.value))}
                    style={{ height: '4px', background: 'var(--bg-tertiary)' }}
                  />
                </div>

                {/* Tenure Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label style={{ margin: 0 }}>Loan Tenure (Years)</label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>{loanYears} Years ({totalPayments} EMIs)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1" 
                    value={loanYears}
                    onChange={(e) => setLoanYears(parseInt(e.target.value))}
                    style={{ height: '4px', background: 'var(--bg-tertiary)' }}
                  />
                </div>
              </div>

              {/* Display Result Column */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px' }}>
                {savingsTarget <= 0 ? (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--accent-pink)' }}>
                    <ShieldAlert size={24} style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                      You currently have no net monthly savings. Please adjust your income or reduce discretionary spending to establish borrowing capacity.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Affordable Loan Principal (Max Capacity)
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--accent-cyan)', textShadow: 'var(--shadow-neon-cyan)', marginBottom: '1rem' }}>
                      ₹{Math.round(affordableLoan).toLocaleString()}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Safe Monthly EMI:</span>
                        <span style={{ fontWeight: 700 }}>₹{Math.round(maxEMI).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Repayment:</span>
                        <span style={{ fontWeight: 700 }}>₹{Math.round(maxEMI * totalPayments).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Interest cost:</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent-pink)' }}>₹{Math.round(totalInterest).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dotted var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.25rem', color: 'var(--text-dark)' }}>
                        <span>Retained monthly buffer:</span>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>₹{Math.round(savingsTarget - maxEMI).toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
