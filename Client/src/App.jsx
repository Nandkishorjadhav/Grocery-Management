import React, { useEffect, useState } from 'react'
import './App.css'

const SAMPLE = [
  { id: 1, name: 'Apples', qty: 5, unit: 'kg' },
  { id: 2, name: 'Bread', qty: 2, unit: 'pcs' },
]

function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('grocery_items')
      return raw ? JSON.parse(raw) : SAMPLE
    } catch (e) {
      return SAMPLE
    }
  })

  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('grocery_items', JSON.stringify(items))
    } catch (e) {}
  }, [items])

  const resetForm = () => {
    setName('')
    setQty('')
    setUnit('')
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, name: name.trim(), qty: qty || it.qty, unit: unit || it.unit } : it))
      )
    } else {
      const id = Date.now()
      setItems((prev) => [{ id, name: name.trim(), qty: qty || 1, unit: unit || 'pcs' }, ...prev])
    }

    resetForm()
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const startEdit = (id) => {
    const it = items.find((x) => x.id === id)
    if (!it) return
    setName(it.name)
    setQty(String(it.qty))
    setUnit(it.unit)
    setEditingId(id)
  }

  const increase = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Number(it.qty) + 1 } : it)))

  const decrease = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Number(it.qty) - 1) } : it)))

  const clearAll = () => setItems([])

  const visible = items.filter((it) => it.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Grocery Management</h1>
        <p className="subtitle">Add, edit and track grocery items. Data is stored in localStorage.</p>
      </header>

      <main>
        <section className="controls">
          <form className="grocery-form" onSubmit={handleSubmit}>
            <input aria-label="item-name" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
            <input aria-label="item-qty" placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
            <input aria-label="item-unit" placeholder="Unit (e.g. pcs, kg)" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <div className="form-actions">
              <button type="submit" className="btn primary">{editingId ? 'Update' : 'Add'}</button>
              {editingId && (
                <button type="button" className="btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="search-row">
            <input placeholder="Search items..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <button className="btn danger" onClick={clearAll} type="button">
              Clear All
            </button>
          </div>
        </section>

        <section className="list-section">
          {visible.length === 0 ? (
            <p className="empty">No items — add your first grocery item.</p>
          ) : (
            <ul className="grocery-list">
              {visible.map((it) => (
                <li className="grocery-item" key={it.id}>
                  <div className="item-info">
                    <div className="item-name">{it.name}</div>
                    <div className="item-meta">{it.qty} {it.unit}</div>
                  </div>
                  <div className="item-controls">
                    <button className="btn" onClick={() => increase(it.id)}>+</button>
                    <button className="btn" onClick={() => decrease(it.id)}>-</button>
                    <button className="btn" onClick={() => startEdit(it.id)}>Edit</button>
                    <button className="btn danger" onClick={() => removeItem(it.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer ">
        <small>Grocery list saved in localStorage • Simple demo</small>
      </footer>
    </div>
  )
}

export default App
