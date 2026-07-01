import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ArrowUp, ArrowDown, Settings, DollarSign } from 'lucide-react';

export default function DebtManager({ debts, onAdd, onUpdate, onDelete, settings, onSaveSettings }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [category, setCategory] = useState('credit_card');
  const [dueDate, setDueDate] = useState('1');

  // Edit States
  const [editName, setEditName] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editInterestRate, setEditInterestRate] = useState('');
  const [editMinimumPayment, setEditMinimumPayment] = useState('');
  const [editCategory, setEditCategory] = useState('credit_card');
  const [editDueDate, setEditDueDate] = useState('1');

  const categories = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !balance || !interestRate || !minimumPayment) return;

    onAdd({
      name,
      balance: parseFloat(balance),
      interestRate: parseFloat(interestRate),
      minimumPayment: parseFloat(minimumPayment),
      category,
      dueDate: parseInt(dueDate) || 1
    });

    // Reset Form
    setName('');
    setBalance('');
    setInterestRate('');
    setMinimumPayment('');
    setCategory('credit_card');
    setDueDate('1');
    setIsAdding(false);
  };

  const startEditing = (d) => {
    setEditingId(d._id || d.id);
    setEditName(d.name);
    setEditBalance(d.balance);
    setEditInterestRate(d.interestRate);
    setEditMinimumPayment(d.minimumPayment);
    setEditCategory(d.category);
    setEditDueDate(d.dueDate || '1');
  };

  const handleUpdateSubmit = (id) => {
    onUpdate(id, {
      name: editName,
      balance: parseFloat(editBalance),
      interestRate: parseFloat(editInterestRate),
      minimumPayment: parseFloat(editMinimumPayment),
      category: editCategory,
      dueDate: parseInt(editDueDate) || 1
    });
    setEditingId(null);
  };

  // Move priority up or down for the Custom strategy
  const movePriority = (index, direction) => {
    const list = debts.map(d => d._id || d.id);
    // If settings customOrder has missing items, fill it
    const completeList = [...list];
    const order = settings.customOrder && settings.customOrder.length > 0 
      ? [...settings.customOrder] 
      : completeList;

    // ensure all current debt IDs are in order array
    completeList.forEach(id => {
      if (!order.includes(id)) order.push(id);
    });

    const targetIdx = order.indexOf(debts[index]._id || debts[index].id);
    if (targetIdx === -1) return;

    const swapIdx = direction === 'up' ? targetIdx - 1 : targetIdx + 1;
    if (swapIdx < 0 || swapIdx >= order.length) return;

    // Swap elements
    const temp = order[targetIdx];
    order[targetIdx] = order[swapIdx];
    order[swapIdx] = temp;

    onSaveSettings({ customOrder: order });
  };

  // Sorted debts list matching custom order preference
  const getSortedDebtsForList = () => {
    if (!settings.customOrder || settings.customOrder.length === 0) return debts;
    const sorted = [...debts].sort((a, b) => {
      const idxA = settings.customOrder.indexOf(a._id || a.id);
      const idxB = settings.customOrder.indexOf(b._id || b.id);
      const orderA = idxA === -1 ? 999 : idxA;
      const orderB = idxB === -1 ? 999 : idxB;
      return orderA - orderB;
    });
    return sorted;
  };

  const sortedDebts = getSortedDebtsForList();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Strategy settings header */}
      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
            <Settings size={20} className="neon-text-cyan" />
          </div>
          <div>
            <h3>Payoff Settings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure strategy rules and accelerators</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
          {/* Strategy Select */}
          <div style={{ minWidth: '200px' }}>
            <label>Preferred Method</label>
            <select 
              value={settings.preferredStrategy} 
              onChange={(e) => onSaveSettings({ preferredStrategy: e.target.value })}
            >
              <option value="avalanche">Avalanche (Highest APR First)</option>
              <option value="snowball">Snowball (Lowest Balance First)</option>
              <option value="custom">Custom Sort Priorities</option>
            </select>
          </div>

          {/* Extra Payment Slider */}
          <div style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Extra Monthly Payment</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                ₹{settings.extraPayment}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="25"
                value={settings.extraPayment || 0} 
                onChange={(e) => onSaveSettings({ extraPayment: parseFloat(e.target.value) })}
                style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Content Grid */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        
        {/* Debts Table/List */}
        <div className="glass-card" style={{ gridColumn: 'span 8', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Liabilities Profile</h3>
            {!isAdding && (
              <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                <Plus size={16} /> Add Liability
              </button>
            )}
          </div>

          {sortedDebts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No debts registered yet. Click "Add Liability" to begin tracking.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedDebts.map((d, index) => {
                const isEditing = editingId === (d._id || d.id);
                return (
                  <div 
                    key={d._id || d.id} 
                    className="glass-card" 
                    style={{ 
                      padding: '1rem', 
                      background: isEditing ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255,255,255,0.01)',
                      borderLeft: settings.preferredStrategy === 'custom' ? '3px solid var(--accent-cyan)' : '1px solid var(--glass-border)'
                    }}
                  >
                    {isEditing ? (
                      /* Editing Mode Form Row */
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem', alignItems: 'end' }}>
                        <div style={{ gridColumn: 'span 3' }}>
                          <label>Name</label>
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label>Balance (₹)</label>
                          <input type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label>APR (%)</label>
                          <input type="number" step="0.1" value={editInterestRate} onChange={(e) => setEditInterestRate(e.target.value)} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label>Min Pay (₹)</label>
                          <input type="number" value={editMinimumPayment} onChange={(e) => setEditMinimumPayment(e.target.value)} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label>Category</label>
                          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                        </div>
                        <div style={{ gridColumn: 'span 1', display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-primary" style={{ padding: '0.5rem' }} onClick={() => handleUpdateSubmit(d._id || d.id)}>
                            <Check size={16} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setEditingId(null)}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode Row */
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        
                        {/* Custom order control buttons */}
                        {settings.preferredStrategy === 'custom' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <button 
                              disabled={index === 0} 
                              onClick={() => movePriority(index, 'up')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: index === 0 ? 'var(--text-dark)' : 'var(--text-muted)' }}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              disabled={index === sortedDebts.length - 1} 
                              onClick={() => movePriority(index, 'down')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: index === sortedDebts.length - 1 ? 'var(--text-dark)' : 'var(--text-muted)' }}
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        )}

                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{d.name}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                              {d.category.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: Day {d.dueDate || 1}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', textAlign: 'right', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining Balance</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                              ₹{parseFloat(d.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interest Rate</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{d.interestRate}% APR</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min Monthly</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{d.minimumPayment}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => startEditing(d)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => onDelete(d._id || d.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Liability Sidebar Form */}
        <div className="glass-card" style={{ gridColumn: 'span 4', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.2rem' }}>New Liability Form</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Debt Name</label>
              <input 
                type="text" 
                placeholder="e.g. Chase Sapphire Prime" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label>Current Outstanding Balance (₹)</label>
              <input 
                type="number" 
                placeholder="5000" 
                value={balance} 
                onChange={(e) => setBalance(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>APR (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="24.9" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label>Min Payment (₹)</label>
                <input 
                  type="number" 
                  placeholder="150" 
                  value={minimumPayment} 
                  onChange={(e) => setMinimumPayment(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
              <div>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Due Date</label>
                <input 
                  type="number" 
                  min="1" 
                  max="31" 
                  placeholder="1"
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Add to Payoff Schedule
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
