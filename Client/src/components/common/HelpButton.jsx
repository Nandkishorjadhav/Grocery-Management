import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      title: '🎯 Quick Search',
      description: 'Use the search box in Inventory to quickly find items by name.'
    },
    {
      title: '📊 Smart Alerts',
      description: 'Dashboard shows low stock and expiring items automatically to help you plan ahead.'
    },
    {
      title: '✅ Shopping List',
      description: 'Check off items as you shop to track your progress. Items show with estimated costs.'
    },
    {
      title: '📈 Reports',
      description: 'View detailed analytics about your inventory value and spending patterns.'
    },
    {
      title: '🌓 Dark Mode',
      description: 'Toggle between light and dark themes using the moon/sun icon in the navbar.'
    },
    {
      title: '📱 Mobile Friendly',
      description: 'Access GroceryHub on any device - it works great on phones and tablets!'
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
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Tips</h3>
            <div className="flex flex-col gap-3">
              {tips.map((tip, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold mb-1">{tip.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Keyboard Shortcuts</h3>
            <div className="flex flex-col gap-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-semibold mb-1">Pro Tip</div>
                <div className="text-sm">Set minimum stock levels for items you use frequently. You'll get automatic alerts when it's time to restock!</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HelpButton;
