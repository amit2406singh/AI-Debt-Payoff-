import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  TrendingUp, 
  ChevronRight, 
  Coins, 
  DollarSign, 
  Calculator, 
  Award,
  AlertTriangle
} from 'lucide-react';

export default function AiAdvisor({ debts, budget, settings, aiAdvice, onRefresh, isRefreshing, marketData }) {
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I am your AuraFinance Advisor. I've examined your liability sheet and budget outline. Let's design a plan. Ask me anything about strategies (Snowball vs Avalanche), tax optimization, side hustles, or how Twelve Data's live index returns compare to your debt APRs!" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMsg = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...chatMessages, userMsg],
          financialData: { debts, budget, settings }
        })
      });

      if (!response.ok) throw new Error('Chat gateway error');
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [
        ...prev, 
        { role: 'assistant', content: '⚠️ Connection lost. Unable to route messages to Groq Llama. Make sure your backend API endpoints are online.' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const highestDebtApr = debts.length > 0 ? Math.max(...debts.map(d => d.interestRate)) : 0;
  const spyPrice = marketData?.spy?.price || '545.20';
  const spyChange = marketData?.spy?.percentChange || '+0.11';
  const bndPrice = marketData?.bnd?.price || '73.45';
  const bndChange = marketData?.bnd?.percentChange || '-0.20';

  return (
    <div className="dashboard-grid" style={{ marginTop: '0' }}>
      
      {/* Left Column: Interactive Chat Interface */}
      <div className="glass-card" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', height: '600px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles className="neon-text-purple" size={18} />
            <h3 style={{ fontSize: '1.1rem' }}>AuraAI Consulting Terminal</h3>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }} 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Loader2 size={12} className="spin" /> : 'Refetch Profile Advice'}
          </button>
        </div>

        {/* Message Logs */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-purple) 0%, #6d28d9 100%)' : 'rgba(255,255,255,0.03)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                padding: '0.85rem 1.1rem',
                borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: 'var(--text-main)'
              }}
            >
              {msg.content}
            </div>
          ))}
          {isSending && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '0.85rem 1.1rem', borderRadius: '16px 16px 16px 2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader2 size={16} className="spin" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Groq LLM is thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <input 
            type="text" 
            placeholder="Ask about interest compounding, investment comparison, tax optimization..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }} disabled={isSending}>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Right Column: Twelve Data Quotes & Advisory Panels */}
      <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '600px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        
        {/* Twelve Data Quotes & Comparative Analysis */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Twelve Data Benchmarks</h4>
            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Live Quotes</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>S&P 500 Index (SPY)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.25rem' }}>${spyPrice}</div>
              <div style={{ fontSize: '0.75rem', color: spyChange.startsWith('-') ? 'var(--accent-pink)' : 'var(--accent-green)', fontWeight: 600 }}>
                {spyChange}%
              </div>
            </div>
            
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>US Aggregate Bond (BND)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.25rem' }}>${bndPrice}</div>
              <div style={{ fontSize: '0.75rem', color: bndChange.startsWith('-') ? 'var(--accent-pink)' : 'var(--accent-green)', fontWeight: 600 }}>
                {bndChange}%
              </div>
            </div>
          </div>

          {/* Core financial advice comparison */}
          {highestDebtApr > 10 ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', gap: '0.5rem' }}>
              <AlertTriangle style={{ color: '#ef4444', flexShrink: 0 }} size={16} />
              <p style={{ lineHeight: '1.4', color: 'var(--text-muted)' }}>
                Your highest debt APR (<strong>{highestDebtApr}%</strong>) severely outperforms the historical market rate of SPY (<strong>~10%</strong>). 
                Paying off this debt yields a guaranteed, tax-free return of <strong>{highestDebtApr}%</strong>. Avoid investing until high APRs are cleared!
              </p>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--accent-green)', flexShrink: 0 }} size={16} />
              <p style={{ lineHeight: '1.4', color: 'var(--text-muted)' }}>
                Your debt rates are under 10%. You may reasonably divide surplus cash flow between low-APR debt amortization and building a portfolio using index assets like SPY/BND.
              </p>
            </div>
          )}
        </div>

        {/* Structured recommendations */}
        {aiAdvice && (
          <>
            {/* Income Growth Recommendations */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>
                Income Growth Strategy
              </h4>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiAdvice.incomeGrowthRecommendations?.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            </div>

            {/* Expense Reduction Ideas */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--accent-pink)' }}>
                Expense Optimization
              </h4>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiAdvice.expenseReductionIdeas?.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            </div>

            {/* Tax Strategies */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--accent-purple)' }}>
                Tax Shield Optimization
              </h4>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiAdvice.taxStrategies?.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            </div>

            {/* Motivational milestones */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--accent-orange)' }}>
                Payoff Roadmap Milestones
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {aiAdvice.motivationalMilestones?.map((milestone, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronRight size={14} className="neon-text-purple" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}
