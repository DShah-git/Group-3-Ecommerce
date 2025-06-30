import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import './product.css'
import './skeleton.css'
import { isAuthenticated, getToken } from '../../utils/auth';
import { adminIsAuthenticated } from '../../utils/adminAuth';
import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminloggedIn, setAdminLoggedIn] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setAdminLoggedIn(adminIsAuthenticated())
    if (id) {
      api.get(`user/products/${id}`)
        .then(res => {
          setProduct(res.data);
          console.log(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch product:', err);
        });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      setLoggedIn(false);
      setError('Please login to add items to cart.');
      return;
    }
    setError('');
    try {
      await api.post('user/cart/add', { product: product, quantity: quantity }, { headers: { 'x-auth': getToken() } });
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  if (!product) return (
    <div className="product-page">
      <div className="product-image-section">
        <div className="skeleton-image" />
      </div>
      <div className="product-details-section">
        <div className="skeleton-title skeleton-bar" />
        <div className="skeleton-category skeleton-bar" />
        <div className="skeleton-description skeleton-bar" />
        <div className="skeleton-description skeleton-bar short" />
        <div className="skeleton-price skeleton-bar" />
        <div className="skeleton-btn skeleton-bar" />
      </div>
    </div>
  );

  return (
    <div className="container">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        &#8592; Back
      </button>

      <div className="product-page">

        <div className="product-image-section">
          <img src={product.images?.[0]} alt={product.name} className="product-main-image" />
        </div>
        <div className="product-details-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-cat">Category: {product.category?.join(', ')}</div>

          <div className="product-description">{product.description}</div>
          <div className="product-price">${product.price}</div>

          <div className="quantity-box">
            <button
              className="quantity-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >-</button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => setQuantity(q => q + 1)}
            >+</button>
          </div>


          {loggedIn && !adminloggedIn ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag />
              Add to Cart
            </button>
          ) : loggedIn && adminloggedIn ? (
            <button className="add-to-cart-btn disabled" disabled>
              You are logged into admin account, log out of admin account to add products to cart.
            </button>
          ) : (
            <button className="add-to-cart-btn disabled" disabled>
              Login to add items to cart
            </button>
          )}
          {error && <div style={{ color: '#b12704', marginBottom: '1rem' }}>{error}</div>}

          {showModal && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 style={{ marginBottom: '1.5rem' }}>Added to Cart!</h2>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <button className="modal-btn" onClick={() => navigate('/cart')}>
                    <ShoppingBag />
                    Go to Cart
                  </button>
                  <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Continue Shopping</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
