import React, { useState } from 'react';
import { BookOpen, Star, HelpCircle, ArrowUpRight, ShieldCheck, DollarSign, Wallet } from 'lucide-react';

export default function TipsGuidance() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const educationalContent = [
    {
      title: 'Credit Score Improvement Roadmap',
      icon: <Star size={18} className="neon-text-cyan" />,
      tagLine: 'Your credit score directly dictates the interest rates you qualify for.',
      points: [
        'Pay on Time: Payment history counts for 35% of your FICO score. Never miss a minimum payment deadline.',
        'Optimize Credit Utilization: Keep overall card balances below 30% of total limits (ideally under 10%). This dictates 30% of your score.',
        'Consolidate Wisely: Do not close old credit card accounts. Length of history makes up 15% of your score; closing them reduces credit age.',
        'Limit Inquiries: Avoid opening multiple lines of credit within short periods. Each hard pull causes a small, temporary dip.'
      ]
    },
    {
      title: 'Debt Consolidation Analysis',
      icon: <ShieldCheck size={18} className="neon-text-purple" />,
      tagLine: 'Consolidating multiple high-rate loans into a single lower-rate instrument.',
      points: [
        'Balance Transfer Cards: Transfer credit card balances to a new card offering 0% introductory APR for 12-21 months. Watch out for transfer fees (typically 3-5%).',
        'Unsecured Personal Loans: Pay off credit cards with a single fixed-rate personal loan. This converts variable credit card debt to a predictable monthly payment.',
        'Risk of Re-borrowing: Critical warning: consolidating balance sheets clears credit card limits. Do not use those empty cards for additional spending or you will double your total debt.',
        'Debt-to-Income impact: Improving your debt structure helps lower your debt service ratios, qualifying you for better interest terms.'
      ]
    },
    {
      title: 'Investment Foundations',
      icon: <DollarSign size={18} className="neon-text-green" />,
      tagLine: 'Grow wealth sustainably by letting interest compound in your favor.',
      points: [
        'High-Yield Savings Accounts (HYSA): Earn 4-5% interest on emergency capital instead of the 0.01% offered by traditional banks. Risk-free (FDIC insured).',
        'Index Funds / ETFs: Buying a broad index ETF like Nifty 50 or SPY spreads risk across the largest companies. Average historical returns hover around 10-12% per year.',
        'Asset Allocation: Debt funds or fixed deposits have lower historical volatility and lower returns, acting as safety shields in a portfolio as you age.',
        'Compounding Magic: Investing ₹5,000 a month at an 11% return yields over ₹13.7 Lakhs in 15 years, demonstrating the exponential power of time.'
      ]
    },
    {
      title: 'Tax Reduction Principles (India)',
      icon: <Wallet size={18} className="neon-text-pink" />,
      tagLine: 'Lowering taxable liability leaves more net income to clear debt.',
      points: [
        'Section 80C Deductions: Maximize contributions to PPF, EPF, or ELSS (Equity Linked Savings Schemes) to deduct up to ₹1.5 Lakhs from your taxable income annually.',
        'National Pension System (NPS): Invest up to ₹50,000 yearly under Section 80CCD(1B) for additional tax deductions beyond the Section 80C limit.',
        'Section 80D Health Premium: Claim deductions up to ₹25,000 (or ₹50,000 for senior citizen parents) on health insurance premiums paid for your family.',
        'Home Loan Interest (Section 24b): Deduct up to ₹2 Lakhs of interest paid on a home loan yearly, significantly reducing your taxable salary.'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Intro Header */}
      <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.75rem', borderRadius: '50%' }}>
          <BookOpen className="neon-text-purple" size={24} />
        </div>
        <div>
          <h3>AuraFinance Education Portal</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Build your baseline financial literacy. These strategies provide frameworks for sustainable personal wealth.
          </p>
        </div>
      </div>

      {/* Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {educationalContent.map((section, idx) => {
          const isOpen = activeAccordion === idx;
          return (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem',
                borderLeft: isOpen ? '4px solid var(--accent-purple)' : '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
            >
              {/* Accordion Trigger Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {section.icon}
                  <h4 style={{ fontSize: '1.05rem', color: isOpen ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {section.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                  <ArrowUpRight size={16} />
                </span>
              </div>

              {/* Accordion Expandable Content */}
              {isOpen && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    {section.tagLine}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {section.points.map((point, pIdx) => {
                      const [titlePart, descPart] = point.split(':');
                      return (
                        <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>•</span>
                          <p style={{ color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{titlePart}:</strong> {descPart}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
