import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Breadcrumb from '../components/common/Breadcrumb';
import './ShoppingList.css';

const ShoppingList = () => {
  const { shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, togglePurchased } = useGrocery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'pcs',
    estimatedPrice: '',
    notes: '',
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        estimatedPrice: item.estimatedPrice || '',
        notes: item.notes || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        quantity: '',
        unit: 'pcs',
        estimatedPrice: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    const itemData = {
      ...formData,
      quantity: Number(formData.quantity),
      estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : 0,
    };

    try {
      if (editingItem) {
        const itemId = editingItem._id || editingItem.id;
        await updateShoppingItem(itemId, itemData);
      } else {
        await addShoppingItem(itemData);
      }
      handleCloseModal();
    } catch (err) {
      alert('Failed to save item: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      deleteShoppingItem(id);
    }
  };

  const pendingItems = shoppingList.filter(item => !item.purchased);
  const purchasedItems = shoppingList.filter(item => item.purchased);
  const totalEstimated = shoppingList.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  return (
    <div className="fade-in">
      <Breadcrumb />
      
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Shopping List</h1>
          <p className="page-subtitle">Plan your next grocery shopping trip</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          icon="➕"
          variant="primary"
        >
          Add Item
        </Button>
      </div>

      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Total Items</p>
            <p className="stat-value">{shoppingList.length}</p>
          </div>
          <div className="stat-icon stat-icon-blue">🛒</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{pendingItems.length}</p>
          </div>
          <div className="stat-icon stat-icon-yellow">⏳</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Purchased</p>
            <p className="stat-value">{purchasedItems.length}</p>
          </div>
          <div className="stat-icon stat-icon-green">✅</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Est. Total</p>
            <p className="stat-value">₹{totalEstimated.toFixed(2)}</p>
          </div>
          <div className="stat-icon stat-icon-purple">💰</div>
        </div>
      </div>

      {pendingItems.length > 0 && (
        <Card title={`Pending Items (${pendingItems.length})`} className="mb-6">
          <div className="shopping-list-grid">
            {pendingItems.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="shopping-item">
                  <input
                    type="checkbox"
                    className="shopping-checkbox"
                    checked={Boolean(item.purchased)}
                    onChange={() => togglePurchased(itemId)}
                  />
                  <div className="shopping-item-content">
                    <div className="shopping-item-name">{item.name}</div>
                    <div className="shopping-item-details">
                      <span>📦 {item.quantity} {item.unit}</span>
                      {item.estimatedPrice > 0 && <span>💵 ₹{item.estimatedPrice.toFixed(2)}</span>}
                      {item.notes && <span>📝 {item.notes}</span>}
                    </div>
                  </div>
                  <div className="shopping-item-actions">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                      ✏️
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(itemId)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {purchasedItems.length > 0 && (
        <Card title={`Purchased Items (${purchasedItems.length})`}>
          <div className="shopping-list-grid">
            {purchasedItems.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div key={itemId} className="shopping-item purchased">
                  <input
                    type="checkbox"
                    className="shopping-checkbox"
                    checked={Boolean(item.purchased)}
                    onChange={() => togglePurchased(itemId)}
                  />
                  <div className="shopping-item-content">
                    <div className="shopping-item-name">{item.name}</div>
                    <div className="shopping-item-details">
                      <span>📦 {item.quantity} {item.unit}</span>
                      {item.estimatedPrice > 0 && <span>💵 ₹{item.estimatedPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="shopping-item-actions">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(itemId)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {shoppingList.length === 0 && (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <p className="empty-state-text">Your shopping list is empty. Add items to get started!</p>
            <Button variant="primary" onClick={() => handleOpenModal()} className="mt-4">
              Add First Item
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Shopping Item' : 'Add Shopping Item'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingItem ? '✓ Update Item' : '➕ Add Item'}
            </Button>
          </>
        }
      >
        <div className="shopping-form">
          <div className="form-group">
            <Input
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Fresh Apples, Whole Wheat Bread"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Input
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="form-group">
              <Input
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, kg, L"
              />
            </div>
          </div>

          <div className="form-group">
            <Input
              label="Estimated Price (₹)"
              type="number"
              step="0.01"
              value={formData.estimatedPrice}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
              placeholder="0.00"
            />
            <p className="form-hint">💡 Optional: Helps you estimate your total shopping cost</p>
          </div>

          <div className="form-group">
            <Input
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Brand preference, specific variety, etc."
            />
            <p className="form-hint">📝 Optional: Add any special instructions</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingList;
