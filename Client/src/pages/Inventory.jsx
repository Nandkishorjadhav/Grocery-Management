import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';

const Inventory = () => {
  const { inventory, categories, addInventoryItem, updateInventoryItem, deleteInventoryItem, addCategory } = useGrocery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'pcs',
    price: '',
    minStock: '',
    expiryDate: '',
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        minStock: item.minStock,
        expiryDate: item.expiryDate,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: 'pcs',
        price: '',
        minStock: '',
        expiryDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: 'pcs',
      price: '',
      minStock: '',
      expiryDate: '',
    });
  };

  const handleSubmit = () => {
    const itemData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      minStock: Number(formData.minStock),
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
    } else {
      addInventoryItem(itemData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
    }
  };

  const getStatus = (item) => {
    const lowStock = item.quantity <= item.minStock;
    const daysUntilExpiry = item.expiryDate ? 
      Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const expiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;
    return { lowStock, expiringSoon };
  };

  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || item.category === filterCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'expiryDate') return new Date(a.expiryDate) - new Date(b.expiryDate);
      return 0;
    });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Inventory Management</h1>
          <p className="page-subtitle">Manage your grocery items and track stock levels</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          icon="➕"
          variant="primary"
        >
          Add Item
        </Button>
      </div>

      <Card className="filter-card">
        <div className="filter-grid">
          <Input
            label="Search Items"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            icon="🔍"
          />
          <Select
            label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
            icon="📂"
          />
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'quantity', label: 'Quantity' },
              { value: 'price', label: 'Price' },
              { value: 'expiryDate', label: 'Expiry Date' },
            ]}
            icon="🔄"
          />
        </div>
      </Card>

      <Card title={`Inventory Items (${filteredInventory.length})`} hover={false}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-item-name">{item.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {item.category}
                      </span>
                    </td>
                    <td>
                      {item.quantity} {item.unit}
                    </td>
                    <td>
                      ${item.price.toFixed(2)}
                    </td>
                    <td>
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {getStatus(item).lowStock && (
                        <span className="badge badge-warning">
                          Low Stock
                        </span>
                      )}
                      {getStatus(item).expiringSoon && (
                        <span className="badge badge-danger">
                          Expiring Soon
                        </span>
                      )}
                      {!getStatus(item).lowStock && !getStatus(item).expiringSoon && (
                        <span className="badge badge-success">
                          Good
                        </span>
                      )}
                    </td>
                    <td className="table-actions">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                        ✏️ Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>
        {filteredInventory.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p className="empty-state-text">No items found. Add your first inventory item!</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="filter-grid">
            <Input
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.map(cat => ({ value: cat, label: cat }))}
              required
            />
          </div>

          <div className="filter-grid">
            <Input
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              required
            />
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={[
                { value: 'pcs', label: 'Pieces' },
                { value: 'kg', label: 'Kilograms' },
                { value: 'g', label: 'Grams' },
                { value: 'l', label: 'Liters' },
                { value: 'ml', label: 'Milliliters' },
              ]}
            />
          </div>

          <div className="filter-grid">
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
            />
            <Input
              label="Minimum Stock Level"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <Input
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
