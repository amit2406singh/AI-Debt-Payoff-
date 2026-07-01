import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { calculatePayoffDetails } from '../utils/financialMath';
import { TrendingDown, Zap, ShieldAlert, Award } from 'lucide-react';

export default function PayoffCalculator({ debts, settings, onSaveSettings }) {
  // 1. Calculate payoffs for all 3 strategies for comparison
  const avalanche = calculatePayoffDetails(debts, 'avalanche', settings.extraPayment, settings.customOrder);
  const snowball = calculatePayoffDetails(debts, 'snowball', settings.extraPayment, settings.customOrder);
  const custom = calculatePayoffDetails(debts, 'custom', settings.extraPayment, settings.customOrder);

  // 2. Merge schedules for the Recharts graph
  const maxMonths = Math.max(avalanche.schedule.length, snowball.schedule.length, custom.schedule.length);
  const chartData = [];

  for (let m = 0; m < maxMonths; m++) {
    const label = avalanche.schedule[m]?.monthLabel || snowball.schedule[m]?.monthLabel || custom.schedule[m]?.monthLabel || `Month ${m}`;
    chartData.push({
      name: label,
      avalanche: avalanche.schedule[m] !== undefined ? avalanche.schedule[m].totalRemaining : 0,
      snowball: snowball.schedule[m] !== undefined ? snowball.schedule[m].totalRemaining : 0,
      custom: custom.schedule[m] !== undefined ? custom.schedule[m].totalRemaining : 0
    });
  }

  // 3. Math for comparisons
  const bestStrategy = avalanche.totalInterest <= snowball.totalInterest ? 'Avalanche' : 'Snowball';
  const interestDifference = Math.abs(snowball.totalInterest - avalanche.totalInterest);
  const monthDifference = Math.abs(snowball.monthsToFreedom - avalanche.monthsToFreedom);

  // Determine active display stats based on preferred strategy
  const activeStats = settings.preferredStrategy === 'avalanche' ? avalanche 
    : settings.preferredStrategy === 'snowball' ? snowball 
    : custom;

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color, fontSize: '0.85rem' }}>
              {entry.name === 'avalanche' ? 'Avalanche' : entry.name === 'snowball' ? 'Snowball' : 'Custom'}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Dynamic strategies comparison details */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        
        {/* Strategy comparison cards */}
        <div className="glass-card" style={{ gridColumn: 'span 4', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avalanche Method</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>Optimal APR</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{avalanche.payoffDate}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total Interest: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{avalanche.totalInterest.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Duration: {avalanche.monthsToFreedom} months
          </div>
          <button 
            className={`btn ${settings.preferredStrategy === 'avalanche' ? 'btn-accent' : 'btn-secondary'}`}
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', marginTop: '1rem' }}
            onClick={() => onSaveSettings({ preferredStrategy: 'avalanche' })}
          >
            {settings.preferredStrategy === 'avalanche' ? 'Active Target' : 'Apply Avalanche'}
          </button>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 4', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Snowball Method</span>
            <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>Psych Momentum</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{snowball.payoffDate}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total Interest: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{snowball.totalInterest.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Duration: {snowball.monthsToFreedom} months
          </div>
          <button 
            className={`btn ${settings.preferredStrategy === 'snowball' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', marginTop: '1rem' }}
            onClick={() => onSaveSettings({ preferredStrategy: 'snowball' })}
          >
            {settings.preferredStrategy === 'snowball' ? 'Active Target' : 'Apply Snowball'}
          </button>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 4', borderLeft: '4px solid var(--accent-pink)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Custom Method</span>
            <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>Tailored Priorities</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{custom.payoffDate}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total Interest: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{custom.totalInterest.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Duration: {custom.monthsToFreedom} months
          </div>
          <button 
            className={`btn ${settings.preferredStrategy === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', marginTop: '1rem', background: settings.preferredStrategy === 'custom' ? 'linear-gradient(135deg, var(--accent-pink) 0%, #b5179e 100%)' : 'var(--bg-tertiary)' }}
            onClick={() => onSaveSettings({ preferredStrategy: 'custom' })}
          >
            {settings.preferredStrategy === 'custom' ? 'Active Target' : 'Apply Custom'}
          </button>
        </div>
      </div>

      {/* Main Graph Comparison Panel */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown className="neon-text-purple" size={22} />
            <h3 style={{ fontSize: '1.25rem' }}>Decay Curve Comparison</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
              Avalanche
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-purple)' }}></span>
              Snowball
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-pink)' }}></span>
              Custom
            </span>
          </div>
        </div>

        {debts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No liabilities logged. Add debts to render payoff visualization simulations.
          </div>
        ) : (
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvalanche" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSnowball" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-pink)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent-pink)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dark)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-dark)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="avalanche" 
                  stroke="var(--accent-cyan)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAvalanche)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="snowball" 
                  stroke="var(--accent-purple)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSnowball)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="custom" 
                  stroke="var(--accent-pink)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCustom)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Comparison Highlights Alert Box */}
      {debts.length > 0 && (
        <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(6, 182, 212, 0.04)' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
            <Award className="neon-text-cyan" size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Optimization Strategy Analysis</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              The <strong>{bestStrategy} method</strong> yields the most financial savings for your profile. 
              {interestDifference > 0 ? (
                <span> It saves you <strong>₹{Math.round(interestDifference).toLocaleString()}</strong> in interest expenses and clears your debt <strong>{monthDifference} months</strong> faster compared to the alternative.</span>
              ) : (
                <span> Both standard strategies converge on similar payoff durations due to your balance distribution.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Infinite Growth Warning Panel */}
      {activeStats.isInfinite && (
        <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
            <ShieldAlert style={{ color: '#ef4444' }} size={24} />
          </div>
          <div>
            <h4 style={{ color: '#ef4444', marginBottom: '0.25rem' }}>Negative Amortization Warning</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Your current minimum payment schedule does not cover the accrued monthly interest. Under this projection, your balances will grow indefinitely. 
              Please consider raising your **Extra Monthly Payment** or re-negotiating interest rates.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
