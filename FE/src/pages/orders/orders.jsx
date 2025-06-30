import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './orders.css';
import { getToken } from '../../utils/auth';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('normal'); // 'normal' or 'cancelled'


  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

    async function fetchOrders() {
        setLoading(true);
        try {
            const url = orderType === 'cancelled'
                ? 'user/orders/list/cancelled'
                : 'user/orders/list';
            const res = await api.get(url, { headers: { "x-auth": getToken() } });
            setOrders(res.data.orders || res.data); // handle both array and {orders: []}
        } catch (err) {
            setOrders([]);
        }
        setLoading(false);
    }

  useEffect(() => {
    
    fetchOrders();
  }, [orderType]);


   const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      await api.post(`user/orders/cancel/${orderToCancel._id}`, {}, { headers: { "x-auth": getToken() } });
      setShowConfirm(false);
      setOrderToCancel(null);
     
      fetchOrders();
    } catch (err) {
      setShowConfirm(false);
      setOrderToCancel(null);
    }
  };

  return (
    <div className="orders-page">
      <h2 className="orders-title">Your Orders</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <select
          value={orderType}
          onChange={e => setOrderType(e.target.value)}
          className="orders-dropdown"
        >
          <option value="normal">Normal Orders</option>
          <option value="cancelled">Cancelled Orders</option>
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                    Order Placed <br/>{new Date(order.createdAt).toDateString()}
                </div>
                <div>
                    <span className='order-id'>
                        Order # {order._id}
                    </span>
                   
                    <div className={`order-status ${order.isCancelled ? 'cancelled' : order.isFulfilled ? 'fulfilled' : 'pending'}`}>
                        {order.isCancelled ? 'Cancelled' : order.isFulfilled ? 'Fulfilled' : 'Pending'}
                    </div>
                </div>
                
              </div>
              <div className="order-body">
                    <div className="order-products">
                    {order.products.map(item => (
                    <div className="order-product" key={item.product._id}>
                        <div className="order-product-name">{item.product.name}</div>
                        <div className="order-product-qty">Qty: {item.quantity}</div>
                        <div className="order-product-price">${item.product.price}</div>
                    </div>
                    ))}
                </div>
                <div className="order-total">Total: ${order.total}</div>
                <div className="order-address"> <span style={{color:"green", fontWeight:500}}>{order.paymentStatus.toUpperCase()}</span></div>
                <div className="order-address">
                    <div>
                    <b>Deliver at :</b> {order.address.street_address || order.address.streetAddress || ''}, {order.address.city}, {order.address.province}, {order.address.country} {order.address.postalCode || order.address.postal_code}
                    </div>
                </div>

                <div className="actions">
                    {!order.isCancelled && !order.isFulfilled && (
                        <button
                        className="cancel-order-btn"
                        onClick={() => {
                            setOrderToCancel(order);
                            setShowConfirm(true);
                        }}
                        >
                        Cancel Order
                        </button>
                    )}
                </div>
              </div>
                    

              
            </div>
          ))}
        </div>
      )}


      {showConfirm && (
        <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Are you sure you want to cancel this order?</h3>
            <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',marginTop:'1.5rem'}}>
              <button className="modal-btn secondary" onClick={() => setShowConfirm(false)}>Close</button>
              <button className="modal-btn" onClick={handleCancelOrder}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}