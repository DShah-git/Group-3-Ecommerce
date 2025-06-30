import React, { useEffect, useState } from 'react'
import './orders.css'
import api from '../../../utils/api'
import { adminGetToken } from '../../../utils/adminAuth'

import { Truck } from 'lucide-react'


export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('pending');


    const [showConfirm, setShowConfirm] = useState(false);
    const [fulfillOrderId, setFulfillOrderId] = useState(null);

    async function fetchOrders() {
        setLoading(true);
        try {
            const res = await api.get(`admin/orders/all-orders?page=${page}&filter=${status}`, {
                headers: { 'x-auth': adminGetToken() }
            });
            setOrders(res.data.orders || []);
            setPageCount(res.data.pageCount || 1);
        } catch (err) {
            setOrders([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, [page, status]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    async function markFulfilled() {
        try {
            await api.post(`admin/orders/fulfill/${fulfillOrderId}`, {}, {
                headers: { 'x-auth': adminGetToken() }
            });
            setShowConfirm(false);
            setFulfillOrderId(null);
            fetchOrders();
        } catch (err) {
            alert('Failed to fulfill order');
        }
    }

    return (
        <div className="admin-orders-container">
            {
                status == "pending" && ( <h2>Pending Orders - (Page {page})</h2> )
            }
            {
                status == "cancelled" && ( <>
                    <h2>Cancelled Orders - (Page {page}) </h2>
                    <h3>No need to fulfill these orders</h3>
                </> )
            }
            {
                status == "fulfilled" && ( <h2>Fulfilled Orders - (Page {page})</h2> )
            }
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 500, marginRight: 8 }}>Status:</label>
                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="orders-dropdown">
                    <option value="pending">Pending</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <>
                    <div className="orders-list">
                        {orders.map(order => (
                            <div className="order-card" key={order._id}>
                                <div className="order-header">
                                    <div>
                                        Order Placed <br />{new Date(order.createdAt).toDateString()}
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
                                    <div className="order-address"> <span style={{ color: "green", fontWeight: 500 }}>{order.paymentStatus.toUpperCase()}</span></div>
                                    <div className="order-address">
                                        <div>
                                            <b>Deliver at :</b> {order.address.street_address || order.address.streetAddress || ''}, {order.address.city}, {order.address.province}, {order.address.country} {order.address.postalCode || order.address.postal_code}
                                        </div>
                                    </div>

                                    <div className="actions">
                                        {!order.isCancelled && !order.isFulfilled && (
                                            <button
                                                className="fulfill-btn"
                                                onClick={() => {
                                                    setFulfillOrderId(order._id);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                <Truck />
                                                Mark as Fulfilled
                                            </button>
                                        )}
                                    </div>
                                </div>



                            </div>
                        ))}
                    </div>
                    {showConfirm && (
                        <div className="modal-overlay">
                            <div className="modal-dialog">
                                <div style={{ marginBottom: '1rem', fontWeight: 500 }}>
                                    Are you sure you want to mark this order as fulfilled?
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button
                                        className="admin-btn"
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setFulfillOrderId(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="admin-btn edit-btn"
                                        onClick={ ()=>{
                                            markFulfilled();
                                        } }
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="pagination-controls" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                        >Prev</button>
                        <span style={{ alignSelf: 'center' }}>Page {page} of {pageCount}</span>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= pageCount}
                        >Next</button>
                    </div>
                </>
            )}
        </div>
    )
}
