import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      title: '🎯 Quick Search',
      description: 'Use the search box in Inventory to quickly find items by name.',
      shortcut: 'Type to search instantly'
    },
    {
      title: '📊 Smart Alerts',
      description: 'Dashboard shows low stock and expiring items automatically to help you plan ahead.',
      shortcut: null
    },
    {
      title: '✅ Shopping List',
      description: 'Check off items as you shop to track your progress. Items show with estimated costs.',
      shortcut: 'Click checkboxes to mark purchased'
    },
    {
      title: '📈 Reports',
      description: 'View detailed analytics about your inventory value and spending patterns.',
      shortcut: null
    },
    {
      title: '🌓 Dark Mode',
      description: 'Toggle between light and dark themes using the moon/sun icon in the navbar.',
      shortcut: 'Click theme toggle'
    },
    {
      title: '📱 Mobile Friendly',
      description: 'Access GroceryHub on any device - it works great on phones and tablets!',
      shortcut: null
    }
  ];

  const shortcuts = [
    { key: 'Ctrl + K', action: 'Quick search (coming soon)' },
    { key: 'Ctrl + N', action: 'Add new item (coming soon)' },
    { key: 'Esc', action: 'Close modals' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-sm"
        aria-label="Help and Tips"
        title="Help & Tips"
      >
        <span className="text-xl">❓</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="💡 Help & Tips"
        size="lg"
        footer={
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Got it!
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.75rem' }}>Quick Tips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tips.map((tip, index) => (
                <div key={index} className="info-card">
                  <div className="info-card-title">{tip.title}</div>
                  <div className="info-card-text">
                    {tip.description}
                    {tip.shortcut && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                        💡 {tip.shortcut}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.75rem' }}>Keyboard Shortcuts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {shortcuts.map((shortcut, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem',
                  background: 'var(--card-bg, #ffffff)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #e5e7eb)'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>{shortcut.action}</span>
                  <kbd>{shortcut.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="tips-banner">
            <span className="tips-banner-icon">💡</span>
            <div className="tips-banner-content">
              <div className="tips-banner-title">Pro Tip</div>
              <div className="tips-banner-text">Set minimum stock levels for items you use frequently. You'll get automatic alerts when it's time to restock!</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HelpButton;
