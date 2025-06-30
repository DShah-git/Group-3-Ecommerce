
import './App.css'
import Navbar from './components/navbar/navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import Product from './pages/product/product.jsx';
import Cart from './pages/cart/cart.jsx';
import Search from './pages/search/search.jsx';
import Orders from './pages/orders/orders.jsx'
import UserProtectedRoute from './pages/UserProtectedRoutes/UserProtectedRoutes.jsx'
import AdminProtectedRoute from './pages/AdminProtectedRoute/AdminProtectedRoutes.jsx'

import Login from './pages/admin/Login/login.jsx';
import AdminHome from './pages/admin/home/home.jsx'
import ViewProduct from './pages/admin/view-product/ViewProduct.jsx';
import UpdateProduct from './pages/admin/update-product/updateProduct.jsx';
import CreateProduct from './pages/admin/create-product/createProduct.jsx';
import AdminOrders from './pages/admin/orders/orders.jsx'

function App() {

  return (
    <>
      <div style={{ width: '80vw', margin: '0 auto' }}>
        <Navbar />
        <div className="app-body">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={
                <UserProtectedRoute>
                  <Cart />
                </UserProtectedRoute>
              }
              />
              <Route path="/search" element={
                <UserProtectedRoute>
                  <Search />
                </UserProtectedRoute>
              } />
              <Route path="/orders" element={
                <UserProtectedRoute>
                  <Orders />
                </UserProtectedRoute>
              } />

              {/* Admin paths */}
              <Route path="/admin" element={<Login />} />
              <Route path="/admin/login" element={<Login />} />

              <Route path="/admin/home" element={
                <AdminProtectedRoute>
                  <AdminHome />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/view-product/:id" element={
                <AdminProtectedRoute>
                  <ViewProduct />
                </AdminProtectedRoute>} />
              <Route path="/admin/edit-product/:id" element={
                <AdminProtectedRoute>
                  <UpdateProduct />
                </AdminProtectedRoute>} />
              <Route path="/admin/create-product" element={
                <AdminProtectedRoute>
                  <CreateProduct />
                </AdminProtectedRoute>} />
              <Route path="/admin/orders" element={
                <AdminProtectedRoute>
                  <AdminOrders />
                </AdminProtectedRoute>}></Route>
            </Routes>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App
