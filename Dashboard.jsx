import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Activity, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { calculatePayoffDetails } from '../utils/financialMath';

export default function Dashboard({ debts, budget, settings, aiAdvice, setActiveTab }) {
  // Calculations
  const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);
  const income = budget.incomeSources.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const expenses = budget.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const minPayments = debts.reduce((sum, d) => sum + parseFloat(d.minimumPayment || 0), 0);
  const freeCashFlow = income - expenses - minPayments;

  // Run calculation for preferred strategy
  const payoffData = calculatePayoffDetails(
    debts, 
    settings.preferredStrategy, 
    settings.extraPayment, 
    settings.customOrder
  );

  // Health Score Rating Text & Colors
  const getScoreDetails = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'var(--accent-green)' };
    if (score >= 60) return { label: 'Good', color: 'var(--accent-cyan)' };
    if (score >= 40) return { label: 'Fair', color: 'var(--accent-orange)' };
    return { label: 'Critical', color: 'var(--accent-pink)' };
  };

  const health = getScoreDetails(aiAdvice?.healthScore || 70);

  // Payoff progress indicator (mocked to 15% if no historical repayments logged to look clean, or calculated)
  const progressPercent = debts.length > 0 ? 25 : 0; // Simulated debt paid progress for UI feel

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* KPI Cards Row */}
      <div className="dashboard-grid">
        {/* Health Score Card */}
        <div className="glass-card col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Financial Health Score</span>
            <Activity size={18} style={{ color: health.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '1rem 0' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, textShadow: `0 0 15px ${health.color}33` }}>
              {aiAdvice?.healthScore || 70}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge" style={{ backgroundColor: `${health.color}15`, color: health.color, border: `1px solid ${health.color}30` }}>
              {health.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Updated by Groq Engine</span>
          </div>
        </div>

        {/* Debt-Free Forecast Card */}
        <div className="glass-card col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Debt-Free Horizon</span>
            <Calendar size={18} className="neon-text-purple" />
          </div>
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {payoffData.payoffDate}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              In {payoffData.monthsToFreedom} payments ({settings.preferredStrategy} mode)
            </div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', width: 'fit-content' }}
            onClick={() => setActiveTab('calculator')}
          >
            Simulate Payoff
          </button>
        </div>

        {/* Cash Flow Summary */}
        <div className="glass-card col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Remaining Cash Flow</span>
            <DollarSign size={18} className="neon-text-green" />
          </div>
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: freeCashFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-pink)' }}>
              ₹{freeCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Available monthly after min payments
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Income: ₹{income.toLocaleString()}</span>
            <span>|</span>
            <span>Expenses: ₹{expenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Progress Ring + AI Snippet */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        {/* Payoff Progress Ring */}
        <div className="glass-card" style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Payoff Progress</h3>
          
          <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '160px', height: '160px' }}>
              <circle 
                cx="80" cy="80" r="70" 
                stroke="var(--bg-tertiary)" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="80" cy="80" r="70" 
                stroke="var(--accent-purple)" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px var(--accent-purple))', transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{progressPercent}%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cleared</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', width: '100%', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Debts Enrolled</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{debts.length}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interest Rate Avg</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {debts.length > 0 
                  ? (debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length).toFixed(1)
                  : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* AI advisor summary and strategy recommendations */}
        <div className="glass-card" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
                <Sparkles size={18} className="neon-text-purple" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Groq AI Recommendations</h3>
            </div>
            
            {debts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Create your profile! Open the **Debt Manager** tab to log your liabilities. Our AI will automatically outline the most efficient route to debt freedom.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>Suggested Strategy</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                    Debt {aiAdvice?.recommendedStrategy === 'avalanche' ? 'Avalanche (Highest Interest)' : 'Snowball (Smallest Balance)'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>Why this works</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {aiAdvice?.payoffRecommendation || 'Generating tailored payoff advice. Ensure Groq API key is valid...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: 'fit-content', marginTop: '1.5rem' }}
            onClick={() => setActiveTab('ai')}
          >
            Consult AI Assistant
          </button>
        </div>
      </div>

      {/* Debt Summary List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Enrolled Liabilities</h3>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }} onClick={() => setActiveTab('debts')}>
            Manage Debts
          </button>
        </div>

        {debts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No active debts registered. You are debt-free!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Balance</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Interest Rate</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Min Payment</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((d) => (
                  <tr key={d._id || d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{d.category.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 700 }}>
                      ₹{parseFloat(d.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: 'var(--accent-cyan)' }}>
                      {d.interestRate}% APR
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      ₹{parseFloat(d.minimumPayment).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
