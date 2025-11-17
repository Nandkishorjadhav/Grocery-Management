import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';

const ShoppingList = () => {
  const { shoppingList, categories, addShoppingItem, updateShoppingItem, deleteShoppingItem, togglePurchased } = useGrocery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: '',
    });
    setEditingItem(null);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingItem(item);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateShoppingItem(editingItem.id, formData);
    } else {
      addShoppingItem(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteShoppingItem(id);
    }
  };

  const clearPurchased = () => {
    if (window.confirm('Remove all purchased items from the list?')) {
      const purchasedItems = shoppingList.filter(item => item.purchased);
      purchasedItems.forEach(item => deleteShoppingItem(item.id));
    }
  };

  // Filter items
  const filteredItems = shoppingList.filter(item => {
    if (filterStatus === 'pending') return !item.purchased;
    if (filterStatus === 'purchased') return item.purchased;
    return true;
  });

  const pendingCount = shoppingList.filter(item => !item.purchased).length;
  const purchasedCount = shoppingList.filter(item => item.purchased).length;

  const unitOptions = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'L', label: 'Liter (L)' },
    { value: 'mL', label: 'Milliliter (mL)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={clearPurchased}>
            Clear Purchased
          </Button>
          <Button onClick={() => handleOpenModal()}>
            + Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Items</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{shoppingList.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Purchased</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{purchasedCount}</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            All ({shoppingList.length})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filterStatus === 'purchased' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('purchased')}
          >
            Purchased ({purchasedCount})
          </Button>
        </div>
      </Card>

      {/* Shopping List */}
      <Card>
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                item.purchased
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={() => togglePurchased(item.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h3
                    className={`text-lg font-medium ${
                      item.purchased ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {item.name}
                  </h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {filterStatus === 'all' && 'No items in shopping list. Add your first item!'}
              {filterStatus === 'pending' && 'No pending items. All done!'}
              {filterStatus === 'purchased' && 'No purchased items yet.'}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Item Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <Select
              label="Unit"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={unitOptions}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShoppingList;
