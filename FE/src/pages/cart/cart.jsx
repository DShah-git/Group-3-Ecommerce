import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import './cart.css'
import './skeleton.css'
import { getToken } from '../../utils/auth';
import { Trash, BadgeMinus, PackageOpen } from 'lucide-react'

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [address, setAddress] = useState({
        street_address: '',
        postalCode: '',
        city: '',
        province: '',
        country: ''
    });


    const [payment, setPayment] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await api.get('user/cart', { headers: { 'x-auth': getToken() } });
            setCart(res.data);
            console.log(res.data)
        } catch (err) {
            setCart(null);
        }
        setLoading(false);
    };

    const handleRemoveProduct = async (productId) => {
        if (!cart) return;
        try {
            const res = await api.post('user/cart/update',
                { productId, quantity: 0 },
                {
                    headers:
                        { 'x-auth': getToken() }
                });


            setCart(res.data.cart);
        } catch (err) {
            console.log("Error removing product - ", err)
        }

    };

    const handleChangeQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const res = await api.post(
                'user/cart/update',
                { productId, quantity: newQuantity },
                { headers: { 'x-auth': getToken() } }
            );
            setCart(res.data.cart);
        } catch (err) {
            console.log("Error updating quantity - ", err)
        }

    };

    const handleClearCart = async () => {
        if (!cart) return;
        let lastRes = null;
        try {
            for (const p of cart.products) {
                lastRes = await api.post(
                    'user/cart/update',
                    { productId: p.product._id, quantity: 0 },
                    { headers: { 'x-auth': getToken() } }
                );
            }
            if (lastRes) setCart(lastRes.data.cart);
        } catch (err) {
            setCart(null);
        }
    };


    const placeOrder = async () => {
        if(!cart) return
        
        try{
            let res = await api.post('user/orders/create', {address, payment_details: payment}, {headers:{'x-auth':getToken()}})

            if(res.data.message = "Order created successfully"){
                window.location.href = "/orders"
            }
        }catch(err){
            console.log("Issue placing order - ", err)
        }
    }



    if (loading) return <div className="cart-page"><div className="skeleton-cart" /></div>;

    return (
        <div className="cart-page">
            <div className="cart-left">
                <h2>Your Cart</h2>
                {cart && cart.products.length === 0 && <div>Your cart is empty.</div>}
                {cart && cart.products.map(item => (
                    <div className="cart-item" key={item.product._id}>
                        <div className="cart-item-details">
                            <div className="cart-item-title">{item.product.name}</div>
                            <div className="cart-item-category">{item.product.category.join(', ')}</div>
                            <div className="cart-item-price">${item.product.price}</div>

                           
                        </div>
                        <div className='quantity-container'>
                            <div className="cart-item-qtybox">
                                <button className="qty-btn" onClick={() => handleChangeQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating}>-</button>
                                <span className="qty-value">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => handleChangeQuantity(item.product._id, item.quantity + 1)} disabled={updating}>+</button>
                            </div>
                            <button className="remove-btn" onClick={() => handleRemoveProduct(item.product._id)}>
                                <Trash />
                            </button>
                        </div>

                    </div>
                ))}
            </div>
            <div className="cart-right">
                
                <div className="cart-subtotals-list">
                    <h4>Total break down</h4>
                    {cart && cart.products.map(item => (
                        <div className="cart-subtotal-row" key={item.product._id}>
                        <span className="cart-subtotal-name">{item.product.name}</span>
                        <span className="cart-subtotal-value">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="cart-total-box">
                    <div className="cart-total-label">Total</div>
                    <div className="cart-total-value">${cart.totalPrice}</div>
                </div>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  <BadgeMinus/>  Clear Cart</button>
                <button className="checkout-btn" onClick={() => setShowCheckoutModal(true)}>
                  <PackageOpen/>  
                    Checkout
                </button>
            </div>


            {showCheckoutModal && ( 
                <div className="modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    
                    <div className="checkout-form">
                        <h3 style={{marginBottom:'1.2rem'}}>Enter Shipping Address</h3>
                        <div className="address-form">
                            <input type="text" placeholder="Street address" value={address.street_address} onChange={e => setAddress({...address, street_address: e.target.value})} required className="checkout-input" />
                    
                       
                            <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required className="checkout-input" />
                        
                        <div className="form-group">
                                <input type="text" placeholder="Postal Code" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} required className="checkout-input" />
                                <input type="text" placeholder="Province" value={address.province} onChange={e => setAddress({...address, province: e.target.value})} required className="checkout-input" />
                        </div>
                        
                            
                            <input type="text" placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required className="checkout-input" />
                            
                        </div>
                        <h3 style={{marginBottom:'1.2rem'}}>Enter Payment details</h3>
                        <div className="payment-form">
                            <input type="text" placeholder="Cardholder Name" value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})} required className="checkout-input" />
                            <input type="text" placeholder="Card Number" value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} required className="checkout-input" maxLength={19} />
                            <div className="form-group">
                                <input type="text" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} required className="checkout-input" maxLength={5} />
                                <input type="text" placeholder="CVC" value={payment.cvc} onChange={e => setPayment({...payment, cvc: e.target.value})} required className="checkout-input" maxLength={4} />
                            </div>
                        </div>
                        <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',marginTop:'1.5rem'}}>
                                <button type="button" className="modal-btn secondary" onClick={() => setShowCheckoutModal(false)}>Close</button>
                                <button type="button" className="modal-btn" onClick={() => {placeOrder()}}>Place Order</button>
                        </div>
                    </div>
                </div>
                </div>
            )}        


        </div>
    );

}