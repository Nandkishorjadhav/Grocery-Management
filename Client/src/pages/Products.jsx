import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import Breadcrumb from '../components/common/Breadcrumb';
import { Link } from 'react-router-dom';

const Products = () => {
  const { inventory } = useGrocery();

  // Group products by category
  const productsByCategory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <Breadcrumb />
      
      <div className="page-header">
        <h1 className="page-title gradient-text">Products</h1>
      </div>

      {inventory.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <p className="empty-state-text">No products found. Add products from Dashboard!</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Go to Dashboard
            </Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {Object.entries(productsByCategory).map(([category, items]) => (
            <Card key={category} title={`${category} (${items.length})`} hover={true}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                    }}
                    className="product-card"
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 700, 
                        color: '#0f172a',
                        marginBottom: '0.25rem'
                      }}>
                        {item.name}
                      </h3>
                      <span className="badge badge-primary">{item.category}</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <div>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>Qty:</strong> {item.quantity} {item.unit}
                        </div>
                        <div>
                          <strong>Price:</strong> ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>Min:</strong> {item.minStock}
                        </div>
                        {item.expiryDate && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Exp: {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.quantity <= item.minStock && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="badge badge-warning">Low Stock</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
