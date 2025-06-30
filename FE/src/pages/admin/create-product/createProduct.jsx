import React, { useState } from 'react'
import './createProduct.css'
import api from '../../../utils/api'
import { adminGetToken } from '../../../utils/adminAuth'
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        images: [form.image],
        description: form.description,
        price: Number(form.price),
        category: form.category.split(',').map(c => c.trim()),
        stock: Number(form.stock)
      };
      await api.post('admin/product/create', payload, {
        headers: { 'x-auth': adminGetToken() }
      });
      navigate('/admin/home');
    } catch (err) {
      setError('Failed to create product');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Create Product</h2>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Image URL:
          <input name="image" value={form.image} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input name="price" className="half" type="number" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Category (comma separated):
          <input name="category"  className="half" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Stock:
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </label>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button className="admin-btn edit-btn" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}