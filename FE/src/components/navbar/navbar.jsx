import React, { useEffect } from 'react'
import './navbar.css'
import { LogOut, ShoppingBag, Package, LogIn, User, Search, X, ScanBarcode } from 'lucide-react'
import { isAuthenticated, getUserNameFromToken, logout } from '../../utils/auth'
import { adminIsAuthenticated, adminGetUserNameFromToken, adminLogout } from '../../utils/adminAuth'
import { useState } from 'react'
import Login from '../login/login'
import Register from '../register/register'

export default function Navbar() {

  const isLoggedIn = isAuthenticated();

  

  const userName = getUserNameFromToken();
  const [searchString, setSearchString] = useState('');

  const [loginModal, setLoginOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);


  useEffect(()=>{
    if(adminIsAuthenticated() && ["","order","cart","products"].includes(location.href)) {
      location.href = "/admin/home"
    }
  },[])


  return (
    <nav>
      <div className="nav-container">
        <a href="/">
          <div className="logo">
            E Shop
          </div>
        </a>
        {adminIsAuthenticated() ? (
          <div className="nav-actions">
            <button className="nav-btn" onClick={() => { location.href = "/admin/home" }}>
              <ScanBarcode
              />
              Products
            </button>

            <button className="nav-btn" onClick={() => { location.href = "/admin/orders" }}>
              <Package
              />
              Orders
            </button>
            
            <button className="nav-btn"
              onClick={() => { adminLogout() }}
            >

              <LogOut />
              {adminGetUserNameFromToken()}
            </button>



          </div>)

          : (
            <>


              <div className="nav-search">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-input"
                  value={searchString}
                  onChange={e => setSearchString(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      location.href = `/search?query=${encodeURIComponent(searchString)}&page=1`;
                    }
                  }}
                />
                <button className='search-btn'
                  onClick={() => {
                    location.href = `/search?query=${encodeURIComponent(searchString)}&page=1`;
                  }}
                >
                  <Search size={'18px'} />

                </button>
              </div>
              <div className="nav-actions">

                {isLoggedIn ? (
                  <>
                    <button className="nav-btn" onClick={() => { location.href = "/orders" }}>
                      <Package
                      />
                      Orders
                    </button>
                    <button className="nav-btn" onClick={() => { location.href = "/cart" }}>
                      <ShoppingBag
                      />
                      Cart
                    </button>
                    <button className="nav-btn"
                      onClick={() => { logout() }}
                    >

                      <LogOut />
                      {userName}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="nav-btn"
                      onClick={() => setRegisterModal(true)}
                    >

                      Register
                      <User />
                    </button>
                    <button className="nav-btn"
                      onClick={() => setLoginOpen(true)}
                    >
                      Login
                      <LogIn />
                    </button>
                  </>

                )}




              </div>

            </>
          )}

      </div>

      {loginModal && (
        <div className="modal-backdrop" onClick={() => setLoginOpen(false)}>

          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className='modal-header'>

              <div className="modal-close" onClick={() => setLoginOpen(false)}>
                <X size={'20px'} strokeWidth={'3px'} />
              </div>

            </div>
            <div className="modal-body">
              <Login />
            </div>

          </div>
        </div>
      )}

      {registerModal && (
        <div className="modal-backdrop" onClick={() => setRegisterModal(false)}>

          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className='modal-header'>

              <div className="modal-close" onClick={() => setRegisterModal(false)}>
                <X size={'20px'} strokeWidth={'3px'} />
              </div>

            </div>
            <div className="modal-body">
              <Register />
            </div>

          </div>
        </div>
      )}

    </nav>
  )
}
